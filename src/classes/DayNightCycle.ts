// DayNightCycle.ts
import { ref, type Ref } from 'vue';

type Phase = 'day' | 'night';

export class DayNightCycle {
  readonly phase: Ref<Phase> = ref('day');
  readonly timeRemaining: Ref<string> = ref('15:00');
  readonly isRunning: Ref<boolean> = ref(false);
  readonly progress: Ref<number> = ref(0);
  readonly backgroundPosition = ref(0);

  private interval = 15 * 60 * 1000;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.resume();
  }

  start(startPhase: Phase = 'day') {
    const now = startPhase === 'day' ? Date.now() : (Date.now() - (15 * 60 * 1000));
    localStorage.setItem('cycleStartTime', now.toString());
    localStorage.setItem('cycleStartPhase', 'day'); // janky I know, but we are setting the start time to 15 minutes ago.
    this.isRunning.value = true;
    this.tick();
    this.setTimer();
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    localStorage.removeItem('cycleStartTime');
    localStorage.removeItem('cycleStartPhase');
    this.isRunning.value = false;
  }

  private resume() {
    const hasValidState =
      localStorage.getItem('cycleStartTime') &&
      localStorage.getItem('cycleStartPhase');

    if (hasValidState) {
      this.isRunning.value = true;
      this.tick();
      this.setTimer();
    } else {
      this.isRunning.value = false;
    }
  }

  private setTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => this.tick(), 1000);
  }

  private tick() {
      const elapsed = this.getElapsed();
      this.phase.value = this.getCurrentPhase(elapsed);
      this.timeRemaining.value = this.formatTime(this.getTimeRemaining(elapsed));
      
      const totalCycleLength = this.interval * 2; // full day+night = 30 mins
      const cycleProgress = (elapsed % totalCycleLength) / totalCycleLength;
      this.backgroundPosition.value = cycleProgress * 200;
      
      this.progress.value = Math.floor(cycleProgress * 100);
    }

  private getStartTime(): number {
    return parseInt(localStorage.getItem('cycleStartTime') || '0');
  }

  private getStartPhase(): Phase {
    return (localStorage.getItem('cycleStartPhase') as Phase) || 'day';
  }

  private getElapsed(): number {
    return Date.now() - this.getStartTime();
  }

  private getCurrentPhase(elapsed: number): Phase {
    const cycleCount = Math.floor(elapsed / this.interval);
    const startPhase = this.getStartPhase();
    return (cycleCount % 2 === 0) ? startPhase : (startPhase === 'day' ? 'night' : 'day');
  }

  private getTimeRemaining(elapsed: number): number {
    return this.interval - (elapsed % this.interval);
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}

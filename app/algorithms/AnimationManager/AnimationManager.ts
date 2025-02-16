class AnimationManager {
  private timeouts: number[] = [];

  addTimeout(timeoutId: number) {
    this.timeouts.push(timeoutId);
  }

  clearAllTimeouts() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
  }
}

export const animationManager = new AnimationManager();

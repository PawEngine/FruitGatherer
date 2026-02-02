export class AudioManager {
  private muted: boolean = false;
  private globalVolume: number = 0.5;
  private soundEffects: { [key: string]: HTMLAudioElement };

  constructor() {
    this.soundEffects = {
      collect_apple: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'),
      collect_banana: new Audio('https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3'),
      collect_orange: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3')
    };

    // Preload
    (Object.values(this.soundEffects) as HTMLAudioElement[]).forEach(s => {
      s.load();
    });
    this.updateVolumes();
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public setGlobalVolume(volume: number) {
    this.globalVolume = volume;
    this.updateVolumes();
  }

  private updateVolumes() {
    (Object.values(this.soundEffects) as HTMLAudioElement[]).forEach(s => {
      s.volume = this.globalVolume;
    });
  }

  public playBGM() {}
  public stopBGM() {}

  public playSFX(name: string) {
    if (this.muted) return;
    const sfx = this.soundEffects[name];
    if (sfx) {
      // Clone to allow overlapping sounds
      const playSfx = sfx.cloneNode() as HTMLAudioElement;
      playSfx.volume = this.globalVolume;
      playSfx.play().catch(() => {});
    }
  }
}

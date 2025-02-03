// Sound effects using the Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private gainNode: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3; // Set default volume
    } catch (error) {
      console.warn('Web Audio API not supported');
    }
  }

  async init() {
    if (!this.audioContext) return;

    const sounds = {
      place: [
        // Simple "pop" sound
        [0, 0.1, 0.2, 0],  // Time points
        [0, 0.5, 0.1, 0],  // Values
      ],
      invalid: [
        // Error buzz
        [0, 0.1, 0.2],
        [0, 0.3, 0],
      ],
      win: [
        // Victory chime
        [0, 0.1, 0.2, 0.3, 0.4],
        [0, 0.5, 0.3, 0.6, 0],
      ],
    };

    for (const [name, [timePoints, values]] of Object.entries(sounds)) {
      const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
      const channel = buffer.getChannelData(0);
      
      // Create the waveform
      for (let i = 0; i < buffer.length; i++) {
        const t = i / buffer.sampleRate;
        let amplitude = 0;
        
        // Linear interpolation between points
        for (let j = 0; j < timePoints.length - 1; j++) {
          if (t >= timePoints[j] && t <= timePoints[j + 1]) {
            const progress = (t - timePoints[j]) / (timePoints[j + 1] - timePoints[j]);
            amplitude = values[j] + progress * (values[j + 1] - values[j]);
            break;
          }
        }
        
        channel[i] = amplitude * Math.sin(440 * 2 * Math.PI * t);
      }
      
      this.sounds[name] = buffer;
    }
  }

  play(sound: 'place' | 'invalid' | 'win') {
    if (!this.audioContext || !this.enabled || !this.sounds[sound]) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[sound];
    source.connect(this.gainNode!);
    source.start();
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundEffects = new SoundEffects(); 
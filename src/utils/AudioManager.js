import { EventEmitter } from './EventEmitter.js';

export class AudioManager extends EventEmitter {
  constructor() {
    super();
    this.audioContext = null;
    this.audioElements = new Map();
    this.masterVolume = 1.0;
    this.isMuted = false;
    
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioContext = new AudioContext();
    }
  }

  loadAudio(id, path) {
    const audio = new Audio(path);
    audio.id = id;
    this.audioElements.set(id, audio);
    return audio;
  }

  playAudio(id) {
    const audio = this.audioElements.get(id);
    if (audio && !this.isMuted) {
      audio.volume = this.masterVolume;
      audio.play().catch(e => console.error('Audio play failed:', e));
    }
  }

  stopAudio(id) {
    const audio = this.audioElements.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach(audio => {
      audio.volume = this.masterVolume;
    });
  }

  mute() {
    this.isMuted = true;
  }

  unmute() {
    this.isMuted = false;
  }

  dispose() {
    this.audioElements.forEach(audio => {
      audio.pause();
    });
    this.audioElements.clear();
  }
}

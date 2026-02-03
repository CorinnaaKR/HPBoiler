export class PostProcessing {
  constructor(renderer) {
    this.renderer = renderer;
    this.effects = new Map();
  }

  addEffect(name, effect) {
    this.effects.set(name, effect);
  }

  removeEffect(name) {
    this.effects.delete(name);
  }

  getEffect(name) {
    return this.effects.get(name);
  }

  update(deltaTime) {
    this.effects.forEach(effect => {
      if (effect.update) {
        effect.update(deltaTime);
      }
    });
  }

  dispose() {
    this.effects.forEach(effect => {
      if (effect.dispose) {
        effect.dispose();
      }
    });
    this.effects.clear();
  }
}

import { EventEmitter } from '../utils/EventEmitter.js';

export class HUD extends EventEmitter {
  constructor() {
    super();
    this.element = null;
    this.components = new Map();
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'hud';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `;
    document.body.appendChild(this.element);
  }

  addComponent(id, element) {
    this.components.set(id, element);
    this.element.appendChild(element);
  }

  removeComponent(id) {
    const component = this.components.get(id);
    if (component) {
      component.remove();
      this.components.delete(id);
    }
  }

  updateComponent(id, data) {
    const component = this.components.get(id);
    if (component) {
      this.emit('componentUpdate', { id, component, data });
    }
  }

  dispose() {
    if (this.element) {
      this.element.remove();
    }
    this.components.clear();
  }
}

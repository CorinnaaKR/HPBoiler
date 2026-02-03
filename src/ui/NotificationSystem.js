import { EventEmitter } from '../utils/EventEmitter.js';

export class NotificationSystem extends EventEmitter {
  constructor() {
    super();
    this.notifications = [];
    this.element = null;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.id = 'notifications-container';
    this.element.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 300;
      pointer-events: none;
    `;
    document.body.appendChild(this.element);
  }

  notify(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      padding: 15px 25px;
      margin-bottom: 10px;
      background: rgba(10, 14, 39, 0.95);
      border-left: 4px solid ${this.getColorForType(type)};
      border-radius: 4px;
      color: #f1f2f6;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      animation: slideIn 0.3s ease forwards;
      backdrop-filter: blur(10px);
      pointer-events: auto;
    `;
    
    this.element.appendChild(notification);
    
    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  }

  getColorForType(type) {
    const colors = {
      'success': '#2ed573',
      'warning': '#ffa502',
      'error': '#ff4757',
      'info': '#5352ed'
    };
    return colors[type] || colors['info'];
  }

  dispose() {
    if (this.element) {
      this.element.remove();
    }
    this.notifications = [];
  }
}

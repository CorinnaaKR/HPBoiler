export class CameraToggleButton {
  constructor(onToggle) {
    this.button = document.createElement('button');
    this.button.innerText = 'Switch Camera View';
    this.button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 200;
      padding: 10px 18px;
      font-size: 14px;
      background: #222a;
      color: #fff;
      border: 2px solid #5352ed;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      transition: background 0.2s;
    `;
    this.button.addEventListener('mouseenter', () => {
      this.button.style.background = '#5352ed';
    });
    this.button.addEventListener('mouseleave', () => {
      this.button.style.background = '#222a';
    });
    this.button.addEventListener('click', onToggle);
    document.body.appendChild(this.button);
  }
  hide() { this.button.style.display = 'none'; }
  show() { this.button.style.display = 'block'; }
  dispose() { this.button.remove(); }
}

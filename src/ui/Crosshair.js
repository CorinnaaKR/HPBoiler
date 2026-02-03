export class Crosshair {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'crosshair-container';
    this.container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      transform: translate(-50%, -50%);
      z-index: 100;
      pointer-events: none;
    `;
    
    this.container.innerHTML = `
      <svg width="30" height="30" viewBox="0 0 30 30" style="filter: drop-shadow(0 0 2px rgba(0,0,0,0.8)); display: block;">
        <-D Horizontal line left -->
        <line x1="5" y1="15" x2="10" y2="15" stroke="#2ed573" stroke-width="1.5"/>
        <-D Horizontal line right -->
        <line x1="20" y1="15" x2="25" y2="15" stroke="#2ed573" stroke-width="1.5"/>
        <-D Vertical line top -->
        <line x1="15" y1="5" x2="15" y2="10" stroke="#2ed573" stroke-width="1.5"/>
        <-D Vertical line bottom -->
        <line x1="15" y1="20" x2="15" y2="25" stroke="#2ed573" stroke-width="1.5"/>
        <-D Center dot -->
        <circle cx="15" cy="15" r="1.5" fill="#2ed573"/>
      </svg>
    `;
    
    document.body.appendChild(this.container);
  }

  dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

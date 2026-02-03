export class DecisionPanel {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'decision-panel';
    this.element.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: rgba(10, 14, 39, 0.98);
      border: 3px solid #ff4757;
      border-radius: 8px;
      padding: 40px;
      max-width: 600px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(20px);
      z-index: 200;
      color: #f1f2f6;
      font-family: 'JetBrains Mono', monospace;
    `;
    document.body.appendChild(this.element);
  }

  show(decision) {
    this.element.innerHTML = `
      <h2 style="font-size: 24px; margin-bottom: 20px; color: #ff4757;">${decision.title}</h2>
      <p style="margin-bottom: 25px; font-size: 14px;">${decision.description}</p>
      <div id="decision-options"></div>
    `;
    
    const optionsContainer = this.element.querySelector('#decision-options');
    decision.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.textContent = option.text;
      button.style.cssText = `
        display: block;
        width: 100%;
        padding: 18px 24px;
        background: rgba(83, 82, 237, 0.2);
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        text-align: left;
        color: #f1f2f6;
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: 15px;
      `;
      
      button.addEventListener('mouseover', () => {
        button.style.borderColor = '#ff4757';
        button.style.background = 'rgba(255, 71, 87, 0.2)';
        button.style.transform = 'translateX(5px)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.borderColor = 'transparent';
        button.style.background = 'rgba(83, 82, 237, 0.2)';
        button.style.transform = 'translateX(0)';
      });
      
      button.addEventListener('click', () => {
        this.onOptionSelected(index, option);
      });
      
      optionsContainer.appendChild(button);
    });
    
    this.isVisible = true;
    this.element.style.opacity = '1';
    this.element.style.transform = 'translate(-50%, -50%) scale(1)';
    this.element.style.pointerEvents = 'auto';
  }

  hide() {
    this.isVisible = false;
    this.element.style.opacity = '0';
    this.element.style.transform = 'translate(-50%, -50%) scale(0.8)';
    this.element.style.pointerEvents = 'none';
  }

  onOptionSelected(index, option) {
    this.hide();
    // Emit event or callback here
  }

  dispose() {
    if (this.element) {
      this.element.remove();
    }
  }
}

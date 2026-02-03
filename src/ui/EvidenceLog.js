export class EvidenceLog {
  constructor() {
    this.element = null;
    this.evidence = [];
    this.isOpen = false;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'evidence-log';
    this.element.innerHTML = `
      <h2 style="color: #ff4757; margin-bottom: 20px;">Evidence Log</h2>
      <div id="evidence-items"></div>
    `;
    this.element.style.cssText = `
      position: absolute;
      top: 80px;
      right: 20px;
      width: 320px;
      max-height: 60vh;
      background: rgba(10, 14, 39, 0.95);
      border: 2px solid #5352ed;
      border-radius: 4px;
      padding: 20px;
      overflow-y: auto;
      backdrop-filter: blur(15px);
      pointer-events: auto;
      transform: translateX(400px);
      transition: transform 0.4s ease;
      z-index: 200;
      color: #f1f2f6;
      font-family: 'JetBrains Mono', monospace;
    `;
    document.body.appendChild(this.element);
  }

  addEvidence(clue) {
    this.evidence.push(clue);
    this.render();
  }

  removeEvidence(clueId) {
    this.evidence = this.evidence.filter(e => e.id !== clueId);
    this.render();
  }

  render() {
    const itemsContainer = this.element.querySelector('#evidence-items');
    itemsContainer.innerHTML = '';
    
    this.evidence.forEach(clue => {
      const item = document.createElement('div');
      item.className = 'evidence-item';
      item.innerHTML = `
        <h3 style="font-size: 14px; margin-bottom: 6px; color: #ff4757;">${clue.name}</h3>
        <p style="font-size: 12px; line-height: 1.5; opacity: 0.9;">${clue.description}</p>
      `;
      item.style.cssText = `
        padding: 15px;
        margin-bottom: 12px;
        background: rgba(83, 82, 237, 0.1);
        border-left: 3px solid #ff4757;
        border-radius: 2px;
      `;
      itemsContainer.appendChild(item);
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.element.style.transform = this.isOpen ? 'translateX(0)' : 'translateX(400px)';
  }

  open() {
    this.isOpen = true;
    this.element.style.transform = 'translateX(0)';
  }

  close() {
    this.isOpen = false;
    this.element.style.transform = 'translateX(400px)';
  }

  dispose() {
    if (this.element) {
      this.element.remove();
    }
    this.evidence = [];
  }
}

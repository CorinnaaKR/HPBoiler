export class InputManager {
  constructor() {
    this.keys = {};
    this.mousePos = { x: 0, y: 0 };
    this.isMouseDown = false;
    
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    document.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });

    document.addEventListener('mousedown', () => {
      this.isMouseDown = true;
    });

    document.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
  }

  isKeyPressed(code) {
    return this.keys[code] === true;
  }

  update() {
    // Update input state each frame
  }

  dispose() {
    this.keys = {};
  }
}

import * as THREE from 'three';

export class ThirdPersonCamera {
  constructor(target, options = {}) {
    this.target = target; // THREE.Object3D (usually the player)
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      options.aspect || window.innerWidth / window.innerHeight,
      options.near || 0.1,
      options.far || 1000
    );
    this.distance = options.distance || 4.5;
    this.height = options.height || 2.0;
    this.minDistance = options.minDistance || 2.0;
    this.maxDistance = options.maxDistance || 8.0;
    this.orbitAngle = options.orbitAngle || 0; // radians
    this.orbitSpeed = options.orbitSpeed || 1.5; // radians/sec
    this.zoomSpeed = options.zoomSpeed || 1.0;
    this.targetOffset = options.targetOffset || new THREE.Vector3(0, 1.6, 0);
    this.enabled = false;
    this._initListeners();
  }

  _initListeners() {
    window.addEventListener('wheel', (e) => {
      if (!this.enabled) return;
      this.distance = THREE.MathUtils.clamp(
        this.distance + e.deltaY * 0.01 * this.zoomSpeed,
        this.minDistance,
        this.maxDistance
      );
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled || !this._orbiting) return;
      this.orbitAngle -= e.movementX * 0.01 * this.orbitSpeed;
    });
    window.addEventListener('mousedown', (e) => {
      if (!this.enabled) return;
      if (e.button === 2) this._orbiting = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (!this.enabled) return;
      if (e.button === 2) this._orbiting = false;
    });
  }

  enable() { this.enabled = true; }
  disable() { this.enabled = false; }

  update() {
    if (!this.enabled || !this.target) return;
    // Calculate camera position
    const offset = new THREE.Vector3(
      Math.sin(this.orbitAngle) * this.distance,
      this.height,
      Math.cos(this.orbitAngle) * this.distance
    );
    const targetPos = this.target.position.clone().add(this.targetOffset);
    this.camera.position.copy(targetPos.clone().add(offset));
    this.camera.lookAt(targetPos);
  }
}

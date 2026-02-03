import * as THREE from 'three';

export class Character {
  constructor(options = {}) {
    this.name = options.name || 'Character';
    this.position = options.position || new THREE.Vector3(0, 0, 0);
    this.model = null;
    this.animations = [];
    this.currentAnimation = null;
    this.isInteractable = true;
    this.dialogue = options.dialogue || [];
    
    this.createMesh();
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(0.5, 1.8, 0.4);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      roughness: 0.8
    });
    this.model = new THREE.Mesh(geometry, material);
    this.model.position.copy(this.position);
    this.model.castShadow = true;
    this.model.receiveShadow = true;
  }

  interact() {
    if (this.isInteractable) {
      return this.dialogue[0] || 'Hello.';
    }
  }

  playAnimation(animationName) {
    this.currentAnimation = animationName;
  }

  update(deltaTime) {
    if (this.model) {
      // Update animations here
    }
  }

  getMesh() {
    return this.model;
  }

  dispose() {
    if (this.model) {
      this.model.geometry.dispose();
      this.model.material.dispose();
    }
  }
}

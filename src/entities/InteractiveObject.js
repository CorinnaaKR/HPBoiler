import * as THREE from 'three';

export class InteractiveObject {
  constructor(options = {}) {
    this.id = options.id || Math.random().toString(36);
    this.position = options.position || new THREE.Vector3(0, 0, 0);
    this.clueData = options.clueData || {};
    this.isInteractable = true;
    this.hasBeenInteracted = false;
    
    this.mesh = null;
    this.createMesh(options.geometry || new THREE.BoxGeometry(0.3, 0.3, 0.3));
  }

  createMesh(geometry) {
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      roughness: 0.6,
      metalness: 0.4,
      emissive: 0xff6b6b,
      emissiveIntensity: 0.3
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  interact() {
    if (this.isInteractable && !this.hasBeenInteracted) {
      this.hasBeenInteracted = true;
      return this.clueData;
    }
    return null;
  }

  highlight() {
    if (this.mesh && this.mesh.material) {
      this.mesh.material.emissiveIntensity = 0.6;
    }
  }

  unhighlight() {
    if (this.mesh && this.mesh.material) {
      this.mesh.material.emissiveIntensity = 0.3;
    }
  }

  update(deltaTime) {
    if (this.mesh) {
      this.mesh.rotation.y += deltaTime * 0.5;
    }
  }

  getMesh() {
    return this.mesh;
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
  }
}

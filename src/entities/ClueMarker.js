import * as THREE from 'three';

export class ClueMarker {
  constructor(options = {}) {
    this.position = options.position || new THREE.Vector3(0, 0, 0);
    this.clueId = options.clueId || 'unknown';
    this.isDiscovered = false;
    this.mesh = null;
    
    this.createMesh();
  }

  createMesh() {
    const geometry = new THREE.SphereGeometry(0.15, 16, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0x2ed573,
      emissive: 0x2ed573,
      emissiveIntensity: 0.8,
      roughness: 0.4
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
  }

  discover() {
    this.isDiscovered = true;
    if (this.mesh && this.mesh.material) {
      this.mesh.material.color.set(0xffa502);
      this.mesh.material.emissive.set(0xffa502);
    }
  }

  update(deltaTime) {
    if (this.mesh) {
      this.mesh.position.y += Math.sin(Date.now() * 0.001) * 0.01;
      this.mesh.rotation.x += deltaTime * 0.5;
      this.mesh.rotation.y += deltaTime * 0.7;
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

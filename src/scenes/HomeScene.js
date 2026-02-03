import * as THREE from 'three';
import { Lighting } from '../core/Lighting.js';
import { InteractiveObject } from '../entities/InteractiveObject.js';
import { ClueMarker } from '../entities/ClueMarker.js';
import { Character } from '../entities/Character.js';

export class HomeScene extends THREE.Scene {
  constructor() {
    super();
    this.background = new THREE.Color(0x1a1a2e);
    
    this.spawnPoint = new THREE.Vector3(0, 1.6, 5);
    this.interactiveObjects = [];
    this.clueMarkers = [];
    this.characters = [];
    this.collisionMeshes = []; // Track meshes for collision detection
    this.loaded = false;
    
    this.setupEnvironment();
  }

  setupEnvironment() {
    // Lighting
    this.lighting = new Lighting(this);
    
    // Simple floor plane
    const floorGeometry = new THREE.PlaneGeometry(30, 30);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a6a,
      roughness: 0.8,
      metalness: 0.0
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.add(floor);
    this.collisionMeshes.push(floor); // Add to collision meshes
    
    // Simple debug cube to test rendering
    const testGeometry = new THREE.BoxGeometry(1, 1, 1);
    const testMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      roughness: 0.4,
      metalness: 0.6
    });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    testCube.position.set(0, 1, 0);
    testCube.castShadow = true;
    this.add(testCube);
    
    this.createWalls();
  }

  createWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a5a7a,
      roughness: 0.9,
      metalness: 0.0
    });
    
    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(30, 3, 0.2),
      wallMaterial
    );
    backWall.position.set(0, 1.5, -15);
    backWall.receiveShadow = true;
    this.add(backWall);
    this.collisionMeshes.push(backWall);
    
    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, 30),
      wallMaterial
    );
    leftWall.position.set(-15, 1.5, 0);
    leftWall.receiveShadow = true;
    this.add(leftWall);
    this.collisionMeshes.push(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3, 30),
      wallMaterial
    );
    rightWall.position.set(15, 1.5, 0);
    rightWall.receiveShadow = true;
    this.add(rightWall);
    this.collisionMeshes.push(rightWall);
  }

  async load() {
    if (this.loaded) return;
    
    this.createInteractiveObjects();
    this.createClueMarkers();
    this.createCharacters();
    
    this.loaded = true;
    console.log('HomeScene loaded successfully');
  }

  createInteractiveObjects() {
    const phone = new InteractiveObject({
      id: 'phone_messages',
      position: new THREE.Vector3(-3, 0.75, 0),
      clueData: {
        id: 'phone_messages',
        name: 'Mobile Phone',
        description: 'Contains threatening messages',
        category: 'digital_evidence',
        importance: 'critical',
        relatedCharacter: 'victim'
      }
    });
    
    this.interactiveObjects.push(phone);
    this.add(phone.getMesh());
    
    const documents = new InteractiveObject({
      id: 'medical_docs',
      position: new THREE.Vector3(2, 1.2, -3),
      clueData: {
        id: 'medical_docs',
        name: 'Medical Documents',
        description: 'Hospital records showing repeated injuries',
        category: 'medical_evidence',
        importance: 'critical',
        relatedCharacter: 'victim'
      }
    });
    
    this.interactiveObjects.push(documents);
    this.add(documents.getMesh());
  }

  createClueMarkers() {
    const marker1 = new ClueMarker({
      position: new THREE.Vector3(-3, 0.75, 0),
      clueId: 'phone_messages'
    });
    
    this.clueMarkers.push(marker1);
    this.add(marker1.getMesh());
  }

  createCharacters() {
    const victim = new Character({
      name: 'Victim',
      position: new THREE.Vector3(3, 0, -2),
      dialogue: ['Please... help me.', 'I don\'t know what to do.']
    });
    
    this.characters.push(victim);
    this.add(victim.getMesh());
  }

  update(deltaTime) {
    this.interactiveObjects.forEach(obj => obj.update(deltaTime));
    this.clueMarkers.forEach(marker => marker.update(deltaTime));
    this.characters.forEach(char => char.update(deltaTime));
  }

  getCollisionMeshes() {
    /**
     * Returns array of meshes for collision detection
     * @returns {THREE.Mesh[]} Array of collision meshes (floor, walls)
     */
    return this.collisionMeshes;
  }

  dispose() {
    this.interactiveObjects.forEach(obj => obj.dispose());
    this.clueMarkers.forEach(marker => marker.dispose());
    this.characters.forEach(char => char.dispose());
    this.lighting.dispose();
    
    this.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
}

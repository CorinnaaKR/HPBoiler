import * as THREE from 'three';
import { Renderer } from './core/Renderer.js';
import { Camera } from './core/Camera.js';
import { SceneManager } from './scenes/SceneManager.js';
import { InputManager } from './core/InputManager.js';
import { AudioManager } from './utils/AudioManager.js';
import { EvidenceSystem } from './gameplay/EvidenceSystem.js';
import { DialogueSystem } from './gameplay/DialogueSystem.js';
import { DecisionTree } from './gameplay/DecisionTree.js';
import { ProgressTracker } from './gameplay/ProgressTracker.js';
import { FeedbackSystem } from './gameplay/FeedbackSystem.js';
import { HUD } from './ui/HUD.js';
import { EvidenceLog } from './ui/EvidenceLog.js';
import { DecisionPanel } from './ui/DecisionPanel.js';
import { NotificationSystem } from './ui/NotificationSystem.js';
import { Crosshair } from './ui/Crosshair.js';
import { ThirdPersonCamera } from './core/ThirdPersonCamera.js';
import { CameraToggleButton } from './ui/CameraToggleButton.js';
import './styles/main.css';

class SafeguardingSimulation {
  constructor() {
    this.renderer = new Renderer();
    this.camera = new Camera(this.renderer.domElement);
    this.sceneManager = new SceneManager(this.camera); // <-- Moved up before init()
    this.thirdPersonCamera = null;
    this.isThirdPerson = false;
    this.cameraToggleButton = new CameraToggleButton(() => this.toggleCameraView());
    // Game systems
    this.evidenceSystem = new EvidenceSystem();
    this.dialogueSystem = new DialogueSystem();
    this.decisionTree = new DecisionTree();
    this.progressTracker = new ProgressTracker();
    this.feedbackSystem = new FeedbackSystem();
    // UI systems
    this.hud = new HUD();
    this.evidenceLog = new EvidenceLog();
    this.decisionPanel = new DecisionPanel();
    this.notificationSystem = new NotificationSystem();
    this.crosshair = new Crosshair();
    this.clock = new THREE.Clock();
    this.isRunning = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.init();
  }

  init() {
    try {
      document.body.appendChild(this.renderer.domElement);
      console.log('Renderer attached to DOM');
      
      this.sceneManager.loadScene('home').then(() => {
        console.log('Scene loaded successfully');
      }).catch(err => {
        console.error('Failed to load scene:', err);
      });
      
      window.addEventListener('resize', () => this.onResize());
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
      window.addEventListener('click', () => this.onMouseClick());
      window.addEventListener('keydown', (e) => this.onKeyDown(e));
      
      this.isRunning = true;
      this.animate();
      
      this.notificationSystem.notify('Welcome to Safeguarding Simulation', 'info', 5000);
      console.log('SafeguardingSimulation initialized');
    } catch (error) {
      console.error('Initialization failed:', error);
      this.notificationSystem.notify('Error initializing app: ' + error.message, 'error');
    }
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onMouseClick() {
    if (!this.sceneManager.currentScene) return;
    
    this.raycaster.setFromCamera(this.mouse, this.camera.camera);
    
    const interactiveObjects = this.sceneManager.currentScene.interactiveObjects;
    const meshes = interactiveObjects.map(obj => obj.getMesh());
    
    const intersects = this.raycaster.intersectObjects(meshes);
    
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const clickedObject = interactiveObjects.find(obj => obj.getMesh() === clickedMesh);
      
      if (clickedObject) {
        const clueData = clickedObject.interact();
        if (clueData) {
          this.evidenceSystem.discoverClue(clueData);
          this.evidenceLog.addEvidence(clueData);
          this.notificationSystem.notify(`Found: ${clueData.name}`, 'success');
        }
      }
    }
  }

  onKeyDown(event) {
    if (event.key === 'e' || event.key === 'E') {
      this.evidenceLog.toggle();
    }
    if (event.key === 'Escape') {
      this.evidenceLog.close();
      this.decisionPanel.hide();
    }
  }

  toggleCameraView() {
    if (!this.thirdPersonCamera) {
      // Try to find a player or fallback to camera
      const player = this.sceneManager.currentScene?.player || this.camera.camera;
      this.thirdPersonCamera = new ThirdPersonCamera(player);
    }
    this.isThirdPerson = !this.isThirdPerson;
    if (this.isThirdPerson) {
      this.thirdPersonCamera.enable();
      this.camera.controls.enabled = false;
      this.cameraToggleButton.button.innerText = 'Switch to First Person';
    } else {
      this.thirdPersonCamera.disable();
      this.camera.controls.enabled = true;
      this.cameraToggleButton.button.innerText = 'Switch to Third Person';
    }
  }

  animate() {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    this.sceneManager.update(deltaTime);
    if (this.isThirdPerson && this.thirdPersonCamera) {
      this.thirdPersonCamera.update();
      this.renderer.render(this.sceneManager.currentScene, this.thirdPersonCamera.camera);
    } else {
      this.camera.update(deltaTime);
      this.renderer.render(this.sceneManager.currentScene, this.camera.camera);
    }
    this.inputManager.update();
    this.feedbackSystem.processFeedbackQueue();
  }

  onResize() {
    this.camera.onResize();
    this.renderer.onResize();
  }

  dispose() {
    this.isRunning = false;
    this.sceneManager.dispose();
    this.renderer.dispose();
    this.audioManager.dispose();
    this.hud.dispose();
    this.evidenceLog.dispose();
    this.decisionPanel.dispose();
    this.notificationSystem.dispose();
    this.crosshair.dispose();
    this.cameraToggleButton.dispose();
    window.removeEventListener('resize', this.onResize);
  }
}

// Initialize application
const app = new SafeguardingSimulation();
window.app = app;

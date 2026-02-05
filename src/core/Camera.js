import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export class Camera {
  constructor(canvas) {
    // Create perspective camera with standard FPS settings
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV
      window.innerWidth / window.innerHeight,
      0.1, // near
      1000 // far
    );
    
    // Set eye-level height (1.6 units from ground)
    this.camera.position.set(0, 1.6, 5);
    
    // Store canvas reference
    this.canvas = canvas;
    
    // Initialize pointer lock controls for first-person view
    this.controls = new PointerLockControls(this.camera, this.canvas || document.body);
    
    // Movement properties
    this.velocity = new THREE.Vector3(); // current velocity (units/sec)
    this.direction = new THREE.Vector3(); // input direction
    this.moveSpeed = 6.0; // units per second (faster for more responsive movement)
    this.sprintMultiplier = 1.5;
    this.velocityDamping = 10.0; // higher = snappier, but still smooth
    // Scroll (mouse wheel) movement accumulator
    this.scrollAccumulator = 0;
    this.scrollDecay = 6.0;
    
    // Physics properties
    this.gravity = -9.81; // gravity acceleration
    this.verticalVelocity = 0;
    this.isGrounded = false;
    this.groundCheckDistance = 0.1; // small distance below feet to check for ground
    this.capsuleRadius = 0.3; // collision radius around player
    this.collisionMeshes = []; // meshes to collide with
    
    // Input state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false
    };
    
    // Raycasting for collision detection
    this.raycaster = new THREE.Raycaster();
    this.raycasterDown = new THREE.Raycaster();
    
    this.setupControls();
    this.setupUI();
    
    console.log('Camera initialized at position:', this.camera.position);
  }

  setupControls() {
    // Click on canvas to request pointer lock
    if (this.canvas) {
      console.log('Canvas element found, setting up controls');
      
      // Make canvas focusable and hide cursor
      this.canvas.tabIndex = 1;
      this.canvas.style.cursor = 'none';
      this.canvas.style.outline = 'none';
      
      this.canvas.addEventListener('click', (e) => {
        e.preventDefault();
        this.canvas.focus();
        const lockTarget = this.canvas || document.body;
        const isLocked = document.pointerLockElement === lockTarget || document.mozPointerLockElement === lockTarget;
        if (isLocked) {
          console.log('Canvas clicked: unlocking pointer');
          if (document.exitPointerLock) {
            document.exitPointerLock();
          } else if (document.mozExitPointerLock) {
            document.mozExitPointerLock();
          } else if (document.webkitExitPointerLock) {
            document.webkitExitPointerLock();
          }
        } else {
          console.log('Canvas clicked: requesting pointer lock');
          this.requestLock();
        }
      });
      
      // Wheel scroll on canvas to move forward/back
      this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
      
      // Auto-focus on initialization
      this.canvas.focus();
    } else {
      console.warn('No canvas element provided to Camera');
    }
    
    // Keyboard input for movement
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    
    // Allow ESC to unlock pointer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.unlock();
      }
    });

    // Pointer lock change handling (ensure controls respond to lock state)
    document.addEventListener('pointerlockchange', () => this.onPointerLockChange());
    document.addEventListener('mozpointerlockchange', () => this.onPointerLockChange());
    
    console.log('Camera controls setup complete');
  }

  onWheel(e) {
    // Prevent page from scrolling
    e.preventDefault();
    // Negative deltaY means wheel up -> move forward
    const delta = -e.deltaY;
    // Scale and accumulate; tuned multiplier for comfortable speed
    this.scrollAccumulator += delta * 0.01;
    // Clamp to reasonable range
    this.scrollAccumulator = Math.max(Math.min(this.scrollAccumulator, 6), -6);
  }

  onPointerLockChange() {
    const lockTarget = this.canvas || document.body;
    const locked = document.pointerLockElement === lockTarget || document.mozPointerLockElement === lockTarget;
    if (locked) {
      try {
        this.controls.lock();
      } catch (err) {
        // PointerLockControls.lock may be a no-op if already locked
      }
      // Stop any current movement immediately when locking
      this.velocity.set(0, 0, 0);
      this.direction.set(0, 0, 0);
      this.keys.forward = this.keys.backward = this.keys.left = this.keys.right = false;
      console.log('Pointer locked - mouse look active; movement paused');
    } else {
      try {
        this.controls.unlock();
      } catch (err) {
        // ignore
      }
      console.log('Pointer unlocked - mouse look disabled');
    }
    this.updateLockUI();
  }

  requestLock() {
    const element = this.canvas || document.body;
    
    console.log('Requesting pointer lock on:', element.tagName, element === this.canvas ? 'canvas' : 'body');
    console.log('Canvas focused:', element === document.activeElement);
    
    // Get the appropriate requestPointerLock method with fallbacks
    let lockMethod = element.requestPointerLock;
    if (!lockMethod) lockMethod = element.mozRequestPointerLock;
    if (!lockMethod) lockMethod = element.webkitRequestPointerLock;
    
    if (lockMethod) {
      console.log('Calling pointer lock...');
      try {
        lockMethod.call(element);
        console.log('Pointer lock request sent');
      } catch (err) {
        console.error('Error requesting pointer lock:', err);
      }
    } else {
      console.warn('Pointer lock not supported in this browser');
    }
  }

  setupUI() {
    // Create lock indicator UI
    this.lockIndicator = document.createElement('div');
    this.lockIndicator.id = 'pointer-lock-indicator';
    this.lockIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 12px 20px;
      background: rgba(10, 14, 39, 0.8);
      border: 2px solid #5352ed;
      border-radius: 4px;
      color: #f1f2f6;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      z-index: 150;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      max-width: 300px;
      line-height: 1.6;
    `;
    document.body.appendChild(this.lockIndicator);
    
    // Create control hints panel
    this.controlsHint = document.createElement('div');
    this.controlsHint.id = 'controls-hint';
    this.controlsHint.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      padding: 16px 20px;
      background: rgba(10, 14, 39, 0.85);
      border: 2px solid #48dbfb;
      border-radius: 4px;
      color: #f1f2f6;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      z-index: 150;
      backdrop-filter: blur(10px);
      max-width: 280px;
      line-height: 1.8;
    `;
    document.body.appendChild(this.controlsHint);
    
    this.updateLockUI();
  }

  updateLockUI() {
    const lockTarget = this.canvas || document.body;
    const isLocked = document.pointerLockElement === lockTarget || 
                     document.mozPointerLockElement === lockTarget;
    
    if (isLocked) {
      this.lockIndicator.innerHTML = `
        <div style="color: #2ed573; font-weight: bold;">🔒 POINTER LOCKED</div>
        <div style="color: #48dbfb; font-size: 10px; margin-top: 4px;">Mouse look: Move mouse to turn</div>
        <div style="color: #48dbfb; font-size: 10px;">Movement: WASD or Arrow Keys</div>
        <div style="color: #ffa502; font-size: 10px; margin-top: 4px;">Press ESC to unlock</div>
      `;
      this.lockIndicator.style.borderColor = '#2ed573';
      console.log('UI Updated: Pointer is locked');
    } else {
      this.lockIndicator.innerHTML = `
        <div style="color: #5352ed; font-weight: bold;">🔓 POINTER UNLOCKED</div>
        <div style="color: #f1f2f6; font-size: 10px; margin-top: 4px;">Click anywhere to lock pointer</div>
        <div style="color: #f1f2f6; font-size: 10px;">and enable mouse look</div>
      `;
      this.lockIndicator.style.borderColor = '#5352ed';
      console.log('UI Updated: Pointer is unlocked');
    }
    
    // Update controls hint
    if (this.controlsHint) {
      this.controlsHint.innerHTML = `
        <div style="color: #48dbfb; font-weight: bold;">⌨️ CONTROLS</div>
        <div style="margin-top: 8px;">
          <div style="color: #2ed573;">Movement</div>
          <div style="margin-left: 8px; font-size: 10px; color: #f1f2f6;">W/A/S/D or Arrow Keys</div>
          <div style="color: #2ed573; margin-top: 6px;">Sprint</div>
          <div style="margin-left: 8px; font-size: 10px; color: #f1f2f6;">Hold Shift + Movement</div>
          <div style="color: #2ed573; margin-top: 6px;">Look Around</div>
          <div style="margin-left: 8px; font-size: 10px; color: #f1f2f6;">Move Mouse (when locked)</div>
          <div style="color: #2ed573; margin-top: 6px;">Evidence Log</div>
          <div style="margin-left: 8px; font-size: 10px; color: #f1f2f6;">Press E</div>
        </div>
      `;
    }
  }

  onKeyDown(event) {
    // Forward movement
    if (event.code === 'KeyW' || event.code === 'ArrowUp') {
      this.keys.forward = true;
      event.preventDefault();
    }
    // Backward movement
    else if (event.code === 'KeyS' || event.code === 'ArrowDown') {
      this.keys.backward = true;
      event.preventDefault();
    }
    // Left strafe
    else if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
      this.keys.left = true;
      event.preventDefault();
    }
    // Right strafe
    else if (event.code === 'KeyD' || event.code === 'ArrowRight') {
      this.keys.right = true;
      event.preventDefault();
    }
    // Sprint
    else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.keys.sprint = true;
      event.preventDefault();
    }
    // Jump (Space)
    else if (event.code === 'Space') {
      this.keys.jump = true;
      event.preventDefault();
    }
  }

  onKeyUp(event) {
    // Forward movement
    if (event.code === 'KeyW' || event.code === 'ArrowUp') {
      this.keys.forward = false;
    }
    // Backward movement
    else if (event.code === 'KeyS' || event.code === 'ArrowDown') {
      this.keys.backward = false;
    }
    // Left strafe
    else if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
      this.keys.left = false;
    }
    // Right strafe
    else if (event.code === 'KeyD' || event.code === 'ArrowRight') {
      this.keys.right = false;
    }
    // Sprint
    else if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.keys.sprint = false;
    }
    // Jump
    else if (event.code === 'Space') {
      this.keys.jump = false;
    }
  }

  setCollisionMeshes(meshes) {
    /**
     * Register collision meshes for the camera to collide against
     * @param {THREE.Mesh[]} meshes - Array of Three.js meshes to use for collision
     */
    this.collisionMeshes = Array.isArray(meshes) ? meshes : [meshes];
    console.log('Collision meshes registered:', this.collisionMeshes.length);
    this.collisionMeshes.forEach((mesh, i) => {
      console.log(`  Mesh ${i}:`, mesh.position, mesh.geometry.type);
    });
  }

  checkGroundCollision() {
    /**
     * Raycast downward to check if player is on ground
     * @returns {boolean} True if grounded
     */
    if (this.collisionMeshes.length === 0) return true; // Default to grounded if no meshes
    
    // Cast ray downward from camera position
    const downDirection = new THREE.Vector3(0, -1, 0);
    this.raycasterDown.set(this.camera.position, downDirection);
    
    const intersects = this.raycasterDown.intersectObjects(this.collisionMeshes, true);
    
    // Check if we hit ground within ground check distance
    if (intersects.length > 0) {
      const distance = intersects[0].distance;
      const isOnGround = distance <= this.groundCheckDistance;
      if (isOnGround) {
        console.log('Ground detected at distance:', distance);
      }
      return isOnGround;
    }
    
    return false;
  }

  checkWallCollision(movement) {
    /**
     * Check for wall collisions before moving
     * Uses raycasting in movement direction
     * @param {THREE.Vector3} movement - Proposed movement vector
     * @returns {THREE.Vector3} Adjusted movement vector (collides with walls)
     */
    if (this.collisionMeshes.length === 0) return movement; // No collision if no meshes
    
    const adjustedMovement = movement.clone();
    const checkDistance = this.capsuleRadius * 2; // Larger buffer
    
    // Check collision in movement direction
    const movementLength = movement.length();
    
    if (movementLength > 0.001) {
      const movementDirection = movement.clone().normalize();
      this.raycaster.set(this.camera.position, movementDirection);
      const intersects = this.raycaster.intersectObjects(this.collisionMeshes, true);
      
      // If collision detected very close, reduce movement significantly
      if (intersects.length > 0 && intersects[0].distance < checkDistance) {
        const hitDistance = intersects[0].distance;
        if (hitDistance < this.capsuleRadius) {
          // Very close collision - block entirely
          adjustedMovement.multiplyScalar(0);
          console.log('Wall collision detected at:', hitDistance);
        } else {
          // Somewhat close - reduce movement
          const factor = hitDistance / checkDistance;
          adjustedMovement.multiplyScalar(Math.max(0, factor * 0.5));
        }
      }
    }
    
    return adjustedMovement;
  }

  applyGravity(deltaTime) {
    /**
     * Simple ground constraint - keep camera at eye level
     * Full gravity physics disabled for now
     */
    // Always keep camera at eye height on ground
    const eyeHeight = 1.6;
    this.camera.position.y = eyeHeight;
    this.verticalVelocity = 0;
  }

  update(deltaTime) {
    // Check if pointer is locked (mouse look active)
    const isLocked = document.pointerLockElement === document.body || 
                     document.mozPointerLockElement === document.body;

    // Apply gravity (keeps camera at eye level); movement will be allowed
    // whether or not pointer is locked. Mouse look is only active when locked.
    this.applyGravity(deltaTime);

    // Desired speed (units/sec) based on sprint
    const speed = this.keys.sprint ? this.moveSpeed * this.sprintMultiplier : this.moveSpeed;

    // Input direction components
    const forwardInput = Number(this.keys.forward) - Number(this.keys.backward);
    const rightInput = Number(this.keys.right) - Number(this.keys.left);

    // World-space forward and right vectors
    const forwardVector = new THREE.Vector3();
    const rightVector = new THREE.Vector3();
    this.camera.getWorldDirection(forwardVector);
    forwardVector.y = 0;
    forwardVector.normalize();
    rightVector.setFromMatrixColumn(this.camera.matrix, 0);
    rightVector.y = 0;
    rightVector.normalize();

    // Desired velocity in world space (units/sec)
    const desiredVelocity = new THREE.Vector3();
    desiredVelocity.addScaledVector(forwardVector, forwardInput * speed);
    desiredVelocity.addScaledVector(rightVector, rightInput * speed);

    // Smoothly approach desired velocity
    const t = 1 - Math.exp(-this.velocityDamping * deltaTime); // damping factor
    this.velocity.lerp(desiredVelocity, t);

    // Apply movement (velocity is units/sec so multiply by deltaTime)
    const displacement = this.velocity.clone().multiplyScalar(deltaTime);
    this.camera.position.add(displacement);

    // Apply scroll wheel movement (smoothed)
    if (Math.abs(this.scrollAccumulator) > 0.0001) {
      const scrollMove = forwardVector.clone().multiplyScalar(this.scrollAccumulator * deltaTime);
      this.camera.position.add(scrollMove);
      // decay the accumulator toward zero
      const decayT = 1 - Math.exp(-this.scrollDecay * deltaTime);
      this.scrollAccumulator = THREE.MathUtils.lerp(this.scrollAccumulator, 0, decayT);
    }
    // Only update lock UI if pointer lock state changed (handled by onPointerLockChange)
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  // Allow external code to unlock
  unlock() {
    document.exitPointerLock = 
      document.exitPointerLock || 
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;
    
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  // Dispose resources
  dispose() {
    if (this.lockIndicator) {
      this.lockIndicator.remove();
    }
    if (this.controlsHint) {
      this.controlsHint.remove();
    }
  }
}

import { EventEmitter } from '../utils/EventEmitter.js';

export class DialogueSystem extends EventEmitter {
  constructor() {
    super();
    this.currentDialogue = null;
    this.dialogueHistory = [];
    this.isDialogueActive = false;
  }

  startDialogue(dialogueId, character) {
    this.currentDialogue = {
      id: dialogueId,
      character: character,
      startTime: Date.now()
    };
    this.isDialogueActive = true;
    this.emit('dialogueStart', dialogueId);
  }

  endDialogue() {
    if (this.currentDialogue) {
      this.dialogueHistory.push(this.currentDialogue);
    }
    this.currentDialogue = null;
    this.isDialogueActive = false;
    this.emit('dialogueEnd');
  }

  getCurrentDialogue() {
    return this.currentDialogue;
  }

  getDialogueHistory() {
    return this.dialogueHistory;
  }

  reset() {
    this.currentDialogue = null;
    this.dialogueHistory = [];
    this.isDialogueActive = false;
  }
}

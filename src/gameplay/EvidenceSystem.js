import { EventEmitter } from '../utils/EventEmitter.js';

export class EvidenceSystem extends EventEmitter {
  constructor() {
    super();
    this.evidence = [];
    this.maxEvidence = 15;
    this.discoveredClues = new Set();
  }

  discoverClue(clue) {
    if (this.discoveredClues.has(clue.id)) {
      return false;
    }
    
    this.discoveredClues.add(clue.id);
    this.evidence.push({
      id: clue.id,
      name: clue.name,
      description: clue.description,
      category: clue.category,
      timestamp: Date.now(),
      importance: clue.importance,
      relatedCharacter: clue.relatedCharacter
    });
    
    this.emit('clueDiscovered', clue);
    
    if (this.evidence.length >= this.maxEvidence) {
      this.emit('allCluesFound');
    }
    
    return true;
  }

  getEvidenceByCategory(category) {
    return this.evidence.filter(e => e.category === category);
  }

  getCompletionPercentage() {
    return (this.evidence.length / this.maxEvidence) * 100;
  }

  getCriticalEvidence() {
    return this.evidence.filter(e => e.importance === 'critical');
  }

  generateReport() {
    return {
      totalClues: this.evidence.length,
      criticalClues: this.getCriticalEvidence().length,
      categories: this.getCategorySummary(),
      completionRate: this.getCompletionPercentage()
    };
  }

  getCategorySummary() {
    const summary = {};
    this.evidence.forEach(e => {
      summary[e.category] = (summary[e.category] || 0) + 1;
    });
    return summary;
  }

  reset() {
    this.evidence = [];
    this.discoveredClues.clear();
    this.emit('reset');
  }
}

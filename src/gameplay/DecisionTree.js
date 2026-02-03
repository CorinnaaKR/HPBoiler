import { EventEmitter } from '../utils/EventEmitter.js';

export class DecisionTree extends EventEmitter {
  constructor() {
    super();
    this.currentNode = null;
    this.decisionHistory = [];
  }

  loadScenario(scenarioData) {
    this.currentNode = scenarioData.rootNode;
    this.decisionHistory = [];
  }

  makeDecision(decisionId) {
    if (!this.currentNode || !this.currentNode.decisions) {
      return null;
    }

    const decision = this.currentNode.decisions.find(d => d.id === decisionId);
    
    if (decision) {
      this.decisionHistory.push({
        nodeId: this.currentNode.id,
        decisionId: decisionId,
        timestamp: Date.now(),
        outcome: decision.outcome
      });

      if (decision.nextNodeId) {
        this.currentNode = this.getNode(decision.nextNodeId);
      }

      this.emit('decisionMade', { decision, nextNode: this.currentNode });
      return decision;
    }

    return null;
  }

  getCurrentNode() {
    return this.currentNode;
  }

  getDecisionHistory() {
    return this.decisionHistory;
  }

  getNode(nodeId) {
    // This would normally fetch from a data source
    return { id: nodeId };
  }

  reset() {
    this.currentNode = null;
    this.decisionHistory = [];
  }
}

export class ProgressTracker {
  constructor() {
    this.scenarios = [];
    this.currentScenario = null;
    this.completedScenarios = new Set();
    this.totalScore = 0;
  }

  startScenario(scenarioId, scenarioData) {
    this.currentScenario = {
      id: scenarioId,
      data: scenarioData,
      startTime: Date.now(),
      evidence: [],
      decisions: [],
      score: 0
    };
  }

  addEvidence(clueId) {
    if (this.currentScenario) {
      this.currentScenario.evidence.push(clueId);
    }
  }

  recordDecision(decisionId, outcome) {
    if (this.currentScenario) {
      this.currentScenario.decisions.push({
        id: decisionId,
        outcome: outcome,
        timestamp: Date.now()
      });
    }
  }

  completeScenario(finalScore) {
    if (this.currentScenario) {
      this.currentScenario.score = finalScore;
      this.currentScenario.endTime = Date.now();
      this.completedScenarios.add(this.currentScenario.id);
      this.totalScore += finalScore;
      this.scenarios.push(this.currentScenario);
      const completed = this.currentScenario;
      this.currentScenario = null;
      return completed;
    }
  }

  getProgress() {
    return {
      completedCount: this.completedScenarios.size,
      totalScore: this.totalScore,
      currentScenario: this.currentScenario
    };
  }

  getStats() {
    return {
      completedScenarios: this.scenarios.length,
      averageScore: this.scenarios.length > 0 ? this.totalScore / this.scenarios.length : 0,
      totalScore: this.totalScore
    };
  }
}

import { EventEmitter } from '../utils/EventEmitter.js';

export class FeedbackSystem extends EventEmitter {
  constructor() {
    super();
    this.feedbackQueue = [];
    this.isDisplaying = false;
  }

  queueFeedback(feedback) {
    this.feedbackQueue.push({
      message: feedback.message,
      type: feedback.type || 'info',
      duration: feedback.duration || 3000,
      timestamp: Date.now()
    });
  }

  displayFeedback(feedback) {
    this.isDisplaying = true;
    this.emit('feedbackDisplay', feedback);
    
    setTimeout(() => {
      this.isDisplaying = false;
      if (this.feedbackQueue.length > 0) {
        this.displayFeedback(this.feedbackQueue.shift());
      }
    }, feedback.duration);
  }

  processFeedbackQueue() {
    if (!this.isDisplaying && this.feedbackQueue.length > 0) {
      this.displayFeedback(this.feedbackQueue.shift());
    }
  }

  getDecisionFeedback(decision) {
    return {
      message: `Decision: ${decision.id}`,
      type: decision.outcome,
      duration: 5000
    };
  }

  getScenarioFeedback(scenarioResults) {
    return {
      message: `Scenario complete: ${scenarioResults.score} points`,
      type: 'success',
      duration: 5000
    };
  }

  reset() {
    this.feedbackQueue = [];
    this.isDisplaying = false;
  }
}

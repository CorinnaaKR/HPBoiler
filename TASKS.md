# Safeguarding Simulation - Development Tasks

## Vision & Educational Goals

- **Purpose:** Teach children and adults to recognize safeguarding, abuse, and age-appropriate risks through immersive, memorable gameplay.
- **Learning by Doing:** Players investigate, make choices, and learn subconsciously by recognizing patterns in realistic scenarios.
- **Phased Approach:**
  - **Phase 1:** Lower Primary (sensitive, age-appropriate)
  - **Phase 2:** Upper Primary
  - **Phase 3:** Secondary
  - **Phase 4:** Business/Adult (more realistic/gritty)
- **Scenario System:** Multiple scenarios, each with a different safeguarding focus. For prototype: anti-radicalisation (child-friendly, non-traumatic).
- **SMART Targets:** Each scenario/phase has clear, measurable learning objectives.
- **Hazard Perception Gameplay:** Inspired by driving theory tests—players spot cues, make decisions, and receive feedback.
- **Sensitivity:** Child phases avoid trauma, focus on awareness and empowerment. Adult phases can address more serious content.

---

## 🎯 Feature 1: Interactive 3D Environment

### Feature Description
Navigate through scenes using first-person or third-person perspective

### Tasks

#### 1.1 First-Person Camera System
- [x] Implement pointer lock controls for first-person view
- [x] Set eye-level camera position (1.6 units from ground)
- [x] Enable mouse look (horizontal and vertical rotation)
- [x] Add click-to-lock mechanism for pointer lock
- [x] Implement ESC key to unlock pointer

#### 1.2 First-Person Movement
- [x] Implement WASD movement controls
- [x] Add arrow key support as alternative
- [x] Implement sprint functionality (Shift key)
- [x] Add collision detection to prevent walking through walls
- [x] Implement gravity and footstep detection

#### 1.3 Third-Person Perspective (Optional)
- [ ] Implement camera orbit around player character
- [ ] Add zoom in/out controls
- [ ] Create smooth camera transitions between perspectives
- [ ] Implement toggle key to switch perspectives

#### 1.4 Scene Navigation
- [ ] Create smooth scene transitions
- [ ] Implement loading screens between scenes
- [ ] Add doorways/portals for scene transitions
- [ ] Preserve player progress when switching scenes

#### 1.5 Environment Immersion
- [ ] Add ambient background sounds
- [ ] Implement dynamic lighting based on time of day
- [ ] Create atmospheric particles (dust, fog effects)
- [ ] Add environmental storytelling details

---

## 🎯 Feature 2: Evidence Collection System

### Feature Description
Discover and document clues scattered throughout the environment

### Tasks

#### 2.1 Interactive Object System
- [ ] Create base InteractiveObject class
- [ ] Implement visual indicators (glowing highlights) on interactive objects
- [ ] Add hover detection and feedback
- [ ] Implement click-to-interact mechanism
- [ ] Add distance-based interaction (can only interact when close)

#### 2.2 Clue Discovery
- [ ] Create visual clue markers (glowing spheres, icons)
- [ ] Implement clue discovery event system
- [ ] Add notification when clue is discovered
- [ ] Track discovered vs undiscovered clues
- [ ] Prevent duplicate clue discoveries

#### 2.3 Evidence Documentation
- [ ] Create evidence data structure (name, description, category, importance)
- [ ] Implement evidence log storage system
- [ ] Add evidence categorization (digital, medical, physical, etc.)
- [ ] Implement importance levels (critical, important, contextual)
- [ ] Add timestamp tracking for evidence discovery

#### 2.4 Evidence Log UI
- [ ] Create evidence log panel/drawer
- [ ] Display collected evidence in organized list
- [ ] Implement search/filter functionality
- [ ] Add evidence preview/zoom feature
- [ ] Create printable evidence report

#### 2.5 Advanced Evidence Features
- [ ] Implement photo documentation (take in-game screenshots)
- [ ] Add note-taking system for evidence annotations
- [ ] Create evidence relationship mapping
- [ ] Implement evidence analysis hints
- [ ] Add evidence counter with progress bar

---

## 🎯 Feature 3: Decision-Making Mechanics

### Feature Description
Make critical choices that affect the outcome for at-risk characters

### Tasks

#### 3.1 Decision Tree System
- [ ] Create decision tree data structure
- [ ] Implement branching narrative logic
- [ ] Create decision node system with multiple choices
- [ ] Implement outcome tracking
- [ ] Add decision history logging

#### 3.2 Decision Presentation UI
- [ ] Create decision panel component
- [ ] Display decision context/question clearly
- [ ] Show available options with descriptions
- [ ] Implement hover effects on options
- [ ] Add confirmation before committing to decision

#### 3.3 Decision Consequences
- [ ] Implement immediate consequences visualization
- [ ] Create consequence feedback messages
- [ ] Track good vs poor decisions
- [ ] Implement branching narrative paths based on decisions
- [ ] Add consequence scoring system

#### 3.4 Time-Pressured Decisions
- [ ] Implement decision timer for critical moments
- [ ] Add visual countdown timer
- [ ] Create timeout consequences
- [ ] Implement tension/urgency indicators
- [ ] Add difficulty modifiers based on time pressure

#### 3.5 Decision Quality Feedback
- [ ] Create decision outcome descriptions
- [ ] Implement best/good/poor/bad decision classifications
- [ ] Add immediate feedback messages
- [ ] Track decision accuracy vs safeguarding standards
- [ ] Create decision comparison with expert recommendations

---

## 🎯 Feature 4: Realistic Scenarios

### Feature Description
Multiple safeguarding situations (child safety, domestic violence, elder abuse, workplace harassment, anti-radicalisation, etc.)

### Tasks

#### 4.0 Scenario/Phase System
- [ ] Implement phase selection (age group)
- [ ] Store and load age-appropriate content per phase
- [ ] Implement scenario selection menu
- [ ] Store scenario metadata (focus, difficulty, SMART targets)
- [ ] Display learning objectives at scenario start/end

#### 4.1 Anti-Radicalisation Scenario (Prototype)
- [ ] Design scenario with clues, dialogue, and choices focused on anti-radicalisation
- [ ] Ensure all content is sensitive and non-traumatic for children
- [ ] Define SMART learning objectives for this scenario
- [ ] Implement hazard perception-style interactive moments
- [ ] Provide immediate, constructive feedback for player actions

#### 4.2 Domestic Violence Scenario
- [ ] Create HomeScene with domestic environment
- [ ] Add victim character model/representation
- [ ] Implement domestic abuse clues (bruises, broken objects, threatening messages)
- [ ] Create relevant decision points
- [ ] Add appropriate NPCs (victim, witnesses, abuser)
- [ ] Implement scenario-specific audio/music

#### 4.3 Child Safety Scenario
- [ ] Create SchoolScene with school environment
- [ ] Add child character models
- [ ] Implement child abuse indicators (signs of neglect, behavioral changes)
- [ ] Create relevant decision points
- [ ] Add school staff NPCs
- [ ] Implement age-appropriate content warnings

#### 4.4 Workplace Harassment Scenario
- [ ] Create WorkplaceScene with office environment
- [ ] Add employee character models
- [ ] Implement harassment clues (inappropriate communications, witness statements)
- [ ] Create relevant decision points
- [ ] Add HR and manager NPCs
- [ ] Implement professional context elements

#### 4.5 Elder Abuse Scenario
- [ ] Create CareHomeScene with care facility environment
- [ ] Add elderly character models
- [ ] Implement elder abuse indicators (financial exploitation, neglect, physical abuse)
- [ ] Create relevant decision points
- [ ] Add caregiver and family NPCs
- [ ] Implement accessibility considerations

#### 4.6 Scenario Data Structure
- [ ] Create scenarios.json with all scenario definitions
- [ ] Define clue locations and properties per scenario
- [ ] Define decision trees per scenario
- [ ] Create scenario metadata (difficulty, learning objectives)
- [ ] Implement scenario progression system

#### 4.7 Scenario Selection & Management
- [ ] Create scenario selection menu
- [ ] Implement difficulty progression
- [ ] Add scenario briefing/tutorial
- [ ] Track scenario completion status
- [ ] Implement scenario replay functionality

---

## 🎯 Feature 5: Progress Tracking

### Feature Description
Visual feedback on investigation completion and decision quality

### Tasks

#### 5.1 Investigation Progress
- [ ] Create evidence counter display
- [ ] Implement progress bar (X clues out of Y total)
- [ ] Add percentage completion indicator
- [ ] Display clues found by category
- [ ] Show critical clues vs optional clues

#### 5.2 Decision Quality Tracking
- [ ] Create decision quality score system
- [ ] Track decisions vs expert recommendations
- [ ] Implement decision accuracy percentage
- [ ] Display decision impact visualization
- [ ] Create decision timeline view

#### 5.3 Scenario Completion Tracking
- [ ] Track investigation completion status
- [ ] Record scenario completion time
- [ ] Store final score/rating
- [ ] Create performance summary
- [ ] Implement achievements/badges system

#### 5.4 HUD Elements
- [ ] Create heads-up display framework
- [ ] Add evidence counter widget
- [ ] Implement objective tracker
- [ ] Add compass/navigation helper
- [ ] Create notification system

#### 5.5 Visual Feedback
- [ ] Add progress update notifications
- [ ] Implement milestone announcements
- [ ] Create visual effects for clue discovery
- [ ] Add audio cues for important events
- [ ] Implement tutorial tooltips

#### 5.6 Player Statistics
- [ ] Create stats dashboard
- [ ] Track total clues found
- [ ] Record decision accuracy
- [ ] Store scenario completion records
- [ ] Implement learning progress metrics

---

## 🎯 Feature 6: Educational Feedback

### Feature Description
Learn from choices with immediate and end-of-scenario debriefs

### Tasks

#### 6.1 Immediate Decision Feedback
- [ ] Create feedback message system
- [ ] Display decision outcome explanation
- [ ] Show why decision was good/bad
- [ ] Reference safeguarding guidelines
- [ ] Provide alternative action suggestions

#### 6.2 End-of-Scenario Debrief
- [ ] Create debrief scene/panel
- [ ] Display final investigation score
- [ ] Show evidence analysis results
- [ ] Review all decisions made
- [ ] Display decision vs expert recommendations

#### 6.3 Learning Resources
- [ ] Create learning resource links
- [ ] Add safeguarding guideline references
- [ ] Implement glossary of terms
- [ ] Create best practice explanations
- [ ] Add references to external resources

#### 6.4 Feedback System Implementation
- [ ] Create FeedbackSystem class
- [ ] Implement feedback queue/display system
- [ ] Add different feedback types (info, warning, success, error)
- [ ] Create persistent feedback log
- [ ] Implement feedback animation system

#### 6.5 Educational Content
- [ ] Create scenario-specific educational materials
- [ ] Write feedback for each decision outcome
- [ ] Document expert recommendations
- [ ] Create reference guides for each scenario
- [ ] Implement case study explanations

#### 6.6 Progress Reflection
- [ ] Create progress review tool
- [ ] Show learning achievements
- [ ] Display improvement areas
- [ ] Create competency self-assessment
- [ ] Implement reflection prompts

---

## 📊 Implementation Priority Levels

### Phase 1 (MVP - Core Functionality)
- [x] Interactive 3D Environment (first-person movement)
- [x] Evidence Collection System (basic clue discovery)
- [ ] Decision-Making Mechanics (basic choices)
- [ ] **Anti-Radicalisation Scenario (prototype, lower primary)**
- [ ] Progress Tracking (basic counter)
- [ ] Educational Feedback (basic messages)

### Phase 2 (Enhanced Features)
- [ ] Phase/scenario selection system
- [ ] Upper primary/secondary/adult content
- [ ] Additional scenarios (domestic violence, child safety, workplace, elder abuse)
- [ ] Advanced evidence features (photo, notes)
- [ ] Time-pressured decisions
- [ ] Detailed progress dashboard
- [ ] End-of-scenario debrief

### Phase 3 (Polish & Optimization)
- [ ] All scenario variations
- [ ] Advanced AI for NPCs
- [ ] Multiplayer/collaborative features
- [ ] Analytics dashboard
- [ ] Accessibility improvements
- [ ] Performance optimization

---

## 🎮 Feature Dependencies

```
Interactive 3D Environment
├── Evidence Collection System
│   └── Progress Tracking
│       └── Educational Feedback
│           └── Realistic Scenarios
└── Decision-Making Mechanics
    └── Educational Feedback
        └── Realistic Scenarios
```

---

## 📋 Checklist Summary

| Feature | Tasks | Completed | % Done |
|---------|-------|-----------|--------|
| Interactive 3D Environment | 5 | 1 | 20% |
| Evidence Collection System | 5 | 0 | 0% |
| Decision-Making Mechanics | 5 | 0 | 0% |
| Realistic Scenarios | 6 | 0 | 0% |
| Progress Tracking | 6 | 0 | 0% |
| Educational Feedback | 6 | 0 | 0% |
| **TOTAL** | **33** | **1** | **3%** |

---

## 🚀 Quick Start Tasks

1. **Get scene rendering** ✅ (Already done)
2. **Add basic collision detection** - Prevent walking through walls
3. **Implement scene-specific clues** - Add 5-10 clues to HomeScene
4. **Create basic decision points** - Add 3-5 decision moments
5. **Add progress counter** - Show evidence collected
6. **Create debrief screen** - Show results when scenario ends

---

## 📝 Notes

- All content for children must be age-appropriate, non-traumatic, and empowering
- Adult/business phases can address more serious and realistic safeguarding issues
- Each scenario must have clear SMART learning objectives
- User/player feedback and accessibility are core priorities
- Safeguarding guidelines should be reviewed with domain experts

---

**Last Updated**: February 3, 2026
**Project Status**: Early Development (MVP Phase)
**Next Review**: After Phase 1 completion

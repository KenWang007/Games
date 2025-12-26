# ZhiwuVSJiangshi Constitution

## Core Principles

### I. Code Quality First
All code must be readable, maintainable, and follow established patterns. Self-documenting code with clear naming conventions takes priority over clever solutions. Functions should be small, focused, and do one thing well. Magic numbers and strings must be extracted to named constants. Code duplication is eliminated through thoughtful abstraction—but only when the pattern is proven across three or more instances.

### II. Test-Driven Development (NON-NEGOTIABLE)
Every feature begins with tests. The Red-Green-Refactor cycle is strictly enforced:
1. Write failing tests that define expected behavior
2. Implement minimum code to pass tests
3. Refactor while keeping tests green

Unit test coverage must exceed 80% for game logic. Integration tests required for all system boundaries (save/load, input handling, rendering pipeline). Performance regression tests mandatory for frame-critical code paths.

### III. User Experience Consistency
The player experience is paramount. All UI elements follow a unified design language with consistent spacing, typography, and color palette. Animations must be smooth (minimum 60fps target) with graceful degradation on lower-end hardware. Input responsiveness is critical—player actions must register within 16ms. Loading states, error messages, and feedback must be clear and non-intrusive.

### IV. Performance Requirements
Frame budget: 16.67ms per frame (60fps target). Memory allocation during gameplay loops is minimized—prefer object pooling for frequently spawned entities. Asset loading is asynchronous and progressive. Performance profiling required before merging any gameplay-affecting code. Documented performance budgets per system:
- Rendering: ≤8ms
- Game logic: ≤4ms  
- Audio: ≤2ms
- Input/UI: ≤2ms

### V. Simplicity & YAGNI
Start with the simplest solution that works. Features are not added until explicitly needed. Premature optimization is avoided—profile first, optimize second. Abstractions are introduced only when complexity is proven necessary. Every line of code must justify its existence.

## Technical Standards

### Code Organization
- Clear separation between game logic, rendering, and input handling
- Entity-component patterns for game objects where appropriate
- State machines for complex behaviors (AI, animations, game flow)
- Event-driven communication between decoupled systems

### Asset Management
- All assets versioned and tracked
- Consistent naming conventions: `category_name_variant.ext`
- Sprite atlases for related graphics to minimize draw calls
- Audio normalized and compressed appropriately

### Error Handling
- Graceful degradation over hard crashes
- All exceptions logged with context
- Player-facing errors are friendly and actionable
- Debug builds include verbose error information

## Quality Gates

### Pre-Commit
- All tests pass locally
- No linter warnings or errors
- Code formatted according to project standards
- No hardcoded values in gameplay code

### Pre-Merge
- Code review by at least one team member
- All CI tests pass
- Performance benchmarks within budget
- Documentation updated for public APIs

### Pre-Release
- Full regression test suite passes
- Playtest session completed without critical bugs
- Performance validated on minimum spec hardware
- Save/load compatibility verified

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Written proposal with rationale
2. Team discussion and consensus
3. Migration plan for existing code if applicable
4. Version bump and changelog entry

All code reviews must verify constitutional compliance. Deviations require explicit documentation and justification in the PR description.

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24

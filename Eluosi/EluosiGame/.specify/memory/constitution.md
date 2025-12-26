# Eluosi Game Constitution

## Core Principles

### I. Code Quality First

All code must meet professional standards before merging:
- **Single Responsibility**: Each module, class, and function has one clear purpose
- **Meaningful Names**: Variables, functions, and types use descriptive, intention-revealing names
- **No Magic Numbers**: All constants are named and documented
- **DRY Compliance**: Logic is not duplicated; shared behavior is extracted into reusable components
- **Clean Interfaces**: Public APIs are minimal, intuitive, and well-documented
- **Error Handling**: All errors are handled explicitly; no silent failures or swallowed exceptions

### II. Testing Standards (NON-NEGOTIABLE)

Testing is mandatory and follows strict coverage requirements:
- **TDD Required**: Write tests first, watch them fail, then implement
- **Coverage Minimums**: 
  - Core game logic: 90%+ coverage
  - UI components: 80%+ coverage
  - Utility functions: 95%+ coverage
- **Test Types Required**:
  - Unit tests for all business logic
  - Integration tests for component interactions
  - Snapshot tests for UI consistency
  - Performance tests for critical paths
- **Test Quality**: Tests must be readable, maintainable, and test behavior (not implementation)
- **No Skipped Tests**: All tests must pass; disabled tests require documented justification with fix timeline

### III. User Experience Consistency

The game must deliver a cohesive, polished experience:
- **Visual Consistency**: Use a defined design system with consistent colors, typography, spacing, and animations
- **Responsive Feedback**: All user actions receive immediate visual/audio feedback (< 100ms)
- **Accessibility**: Support screen readers, keyboard navigation, and configurable controls
- **Error States**: All error conditions have user-friendly messages and recovery paths
- **Loading States**: Show progress indicators for any operation > 200ms
- **Animation Standards**: 
  - Use 60fps animations
  - Consistent easing curves across all transitions
  - Respect user's reduced-motion preferences
- **Sound Design**: Audio cues are consistent, non-jarring, and respect mute settings

### IV. Performance Requirements

The game must meet these performance targets:
- **Frame Rate**: Maintain 60fps during gameplay; never drop below 30fps
- **Load Time**: Initial load < 3 seconds; scene transitions < 500ms
- **Memory**: Stay under 200MB RAM usage during normal gameplay
- **Battery**: Minimize CPU/GPU usage during idle states
- **Input Latency**: User input to visual response < 16ms (one frame)
- **Asset Optimization**:
  - Images: Use appropriate formats (WebP/AVIF for web, compressed PNGs for native)
  - Audio: Use compressed formats; lazy-load non-critical sounds
  - Code: Bundle size < 500KB gzipped for web builds

### V. Simplicity & Maintainability

Prefer simple solutions over clever ones:
- **YAGNI**: Don't build features until they're needed
- **Minimal Dependencies**: Each external dependency requires justification
- **Clear Architecture**: Follow established patterns; document deviations
- **Readable Over Clever**: Code should be obvious to future maintainers
- **Incremental Complexity**: Start simple; add complexity only when proven necessary

## Technical Standards

### Code Style
- Consistent formatting enforced by automated tools (Prettier, SwiftFormat, etc.)
- Linting errors are build failures; no warnings in production code
- Documentation required for all public APIs
- Comments explain "why", not "what"

### Version Control
- Atomic commits with descriptive messages
- Feature branches; no direct commits to main
- All changes require code review
- Squash merges to maintain clean history

### Security
- No secrets in code or version control
- Input validation at all boundaries
- Secure random number generation for game mechanics
- Regular dependency audits

## Quality Gates

Before any feature is considered complete:

| Gate | Requirement |
|------|-------------|
| Tests Pass | 100% of tests pass |
| Coverage Met | Meets minimum coverage thresholds |
| Lint Clean | Zero linting errors or warnings |
| Performance Verified | Meets all performance targets |
| Accessibility Checked | Passes automated a11y audits |
| Code Reviewed | Approved by at least one reviewer |
| Documentation Updated | All public APIs documented |

## Governance

This constitution supersedes all other development practices:
- All code reviews must verify compliance with these principles
- Violations require explicit justification and team approval
- Amendments require documented rationale and migration plan
- Performance and quality metrics are tracked and reviewed weekly

**Version**: 1.0.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-22

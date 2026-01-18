---
description: A workflow with approved planning, feature-branch development following strict TS standards, full testing, and clean commits before pushing changes.
---

# Development Workflow

## Prerequisites

- Ensure `pnpm install` has been run
- Ensure all packages are linked correctly in the workspace

## Steps

1. **Understand the Task**
   - Read `mission.md` to understand the project goals.
   - Review related code in the `packages/` directory.
   - Identify affected packages/components.

2. **Plan the Implementation**
   - Break down the task into specific, actionable items.
   - Identify dependencies and potential risks.
   - Present the plan to the user for approval.

3. **Wait for Approval**
   - User must explicitly approve the plan.
   - Revise if changes are requested.

4. **Implement Changes**
   - Follow coding standards in `.context/coding_style.md`.
   - Use TypeScript with strict typing.
   - Maintain logic parity with `react-notion-x` if applicable.

5. **Add Tests (if needed)**
   - Add unit tests for new functionality in the respective package.
   - Place tests as `*.test.ts` or `*.spec.ts` files.
     // turbo
   - Run: `pnpm test`

6. **Pre-flight Checks**
   // turbo
   - Run: `pnpm test:typecheck`
     // turbo
   - Run: `pnpm test:lint`
     // turbo
   - Run: `pnpm test:format`
     // turbo
   - Run: `pnpm build`

7. **Commit Changes**
   - Use conventional commit format (e.g., `feat(vue-notion): add code block support`).
   - Push to repository.

## Verification Commands

```bash
# Type checking
pnpm test:typecheck

# Linting
pnpm test:lint

# Formatting
pnpm test:format

# Testing
pnpm test

# Build
pnpm build
```

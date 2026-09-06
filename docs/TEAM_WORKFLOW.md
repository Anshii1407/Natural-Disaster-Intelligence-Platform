# Team Workflow & Git Branching Strategy

## Collaboration Principles for 3-Member Team
To ensure consistent progress without merge conflicts or code overwrites:

1. **Main Branch Protection:**
   - The primary branch (`main` or `master`) always contains deployable, verified code.
   - No direct commits are made to the primary branch.

2. **Branch Naming Standard:**
   - Features: `feature/<module-name>-<short-description>`
     - e.g., `feature/ai-model-training`, `feature/gis-map-setup`, `feature/citizen-report-form`
   - Bug fixes: `bugfix/<issue-description>`
   - Documentation: `docs/<topic>`

3. **Pull Request Protocol:**
   - Complete work on your local feature branch.
   - Ensure linting, builds, and health checks pass locally before opening a PR.
   - Request review from at least one teammate before merging.
   - Use "Squash and Merge" or standard merge to keep commit history clean.

4. **Environment Variables & Secrets Safety:**
   - **NEVER** commit `.env` files.
   - When introducing new configuration keys, add them with placeholder values to `.env.example`.
   - Teammates must copy `.env.example` to their local `.env` and fill in personal development credentials.

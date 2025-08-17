# Deployment Checklist: Pre-Deployment Commands (User Guide)

## STEP 0

_Updates the docs (including this one) to make sure it is fully up to date before proceeding. Ensure all commits are staged and pushed before proceeding._

**When to run:** Every single time.

1. Run the prompt in `deployment-checklist-update` in `claude-prompts/docs-gen` within a new chat in the Claude project.

---

## STEP 1 (OPTIONAL)

## **script-gen**

_One-time script generation when adding new functionality_

**When to run:** After adding new features, components, or API endpoints

**Files to Update:**
**_*Note: If files do not exist in the repo, generate a new one and explicitly tell the user where to manually add the file (file path)*_**

1. `python validate_backend.py` - Update backend validation script
2. `npm run check:design` - Update design compliance checker
3. `./test_error_handling.sh` - Update error handling tests
4. `npm run validate:frontend` - Update frontend validation tests
5. `test-backend` - Update backend workflow tests
6. `test-frontend` - Update frontend workflow tests

**Zsh Profile:** `zsh-script-gen`

---

## STEP 2 (MANDATORY)

## **validation-run**

_Pre-deployment validation on entire codebase_

**When to run:** Before every deployment or major commit

**Files to Update:**
**_*Note: If files do not exist in the repo, generate a new one and explicitly tell the user where to manually add the file (file path)*_**

1. `lint-backend` - Python linting (black, flake8)
2. `lint-frontend` - React/JS linting (eslint, prettier)
3. `lint-design` - Design system compliance check
4. `test-backend` - Backend functionality tests
5. `test-frontend` - Frontend workflow tests
6. `npm run validate:frontend` - Complete frontend validation
7. `python validate_backend.py` - Complete backend validation

**Zsh Profile:** `zsh-validation-run`

---

## STEP 3 (MANDATORY)

1. Ensure you are at the root folder
2. Run the following: `cd /docs; chmod +x run-profiles.zsh; zsh run-profiles.zsh`

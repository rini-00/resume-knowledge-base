### `zsh-script-gen` — generate one-time scripts & supporting files for new functionality

```zsh
# Runs the exact items under "script-gen" in docs/deployment-checklist.md, in order.
# For runnable files: executes them via the correct interpreter.
# For config/dependency files: verifies they exist and are non-empty (no auto-generation).
zsh-script-gen() {
  set -u
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  cd "${repo_root}" || return 1

  # helpers (local to this profile)
  _find_one() { find "${repo_root}" -path "${repo_root}/.git" -prune -o -type f -name "$1" -print -quit; }
  _run_py()   { local p; p="$(_find_one "$1")"; [[ -n "$p" ]] && { echo "python $p"; python "$p"; } || echo "MISSING: $1"; }
  _run_node() { local p; p="$(_find_one "$1")"; [[ -n "$p" ]] && { echo "node $p"; node "$p"; }   || echo "MISSING: $1"; }
  _run_sh()   { local p; p="$(_find_one "$1")"; [[ -n "$p" ]] && { echo "bash  $p"; bash "$p"; }  || echo "MISSING: $1"; }
  _check()    { local p; p="$(_find_one "$1")"; [[ -n "$p" && -s "$p" ]] && echo "OK: $1" || echo "MISSING/EMPTY: $1"; }

  # ---- exact order (nothing more, nothing less) ----
  _run_py   "test_api_endpoint.py"
  _run_py   "test_git_operations.py"
  _run_py   "test_error_scenarios.py"
  _run_py   "test_data_processing.py"
  _run_py   "test_stage_transitions.py"
  _run_py   "test_user_interactions.py"
  _run_py   "test_responsive_design.py"
  _run_py   "validate_backend.py"
  _run_node "check_design_compliance.js"
  _run_sh   "test_error_handling.sh"
  _run_node "validate_frontend.js"

  _check    "requirements-test.txt"
  _check    ".eslintrc.js"
  _check    ".prettierrc"
  _check    ".flake8"
  _check    ".mypy.ini"
  _check    "pyproject.toml"
}
```

---

### `zsh-validation-run` — run recurring validation/lint/tests for the whole codebase

```zsh
# Runs the exact items under "validation-run" in docs/deployment-checklist.md, in order.
# For named tools: tries to execute a matching file in the repo (by exact name) or a command in PATH.
zsh-validation-run() {
  set -u
  local repo_root
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
  cd "${repo_root}" || return 1

  # helpers
  _find_one() { find "${repo_root}" -path "${repo_root}/.git" -prune -o -type f -name "$1" -print -quit; }
  _run_exec_label() { # prefers repo file with exact name and +x; else tries PATH command
    local label="$1" p
    p="$(_find_one "${label}")"
    if [[ -n "$p" && -x "$p" ]]; then
      echo "$p"
      "$p"
    else
      if command -v ${=label} >/dev/null 2>&1; then
        echo "${label}"
        ${=label}
      else
        echo "MISSING/NOT EXECUTABLE: ${label}"
      fi
    fi
  }
  _run_py_filearg() { # "python validate_backend.py" (resolve file path anywhere in repo)
    local pyfile="validate_backend.py" p
    p="$(_find_one "${pyfile}")"
    if [[ -n "$p" ]]; then
      echo "python ${p}"
      python "${p}"
    else
      echo "MISSING: ${pyfile}"
    fi
  }
  _run_npm() { echo "$*"; npm "$@"; }
  _run_dot_slash() { # "./test_error_handling.sh" from repo root, else try by filename
    local rel="./test_error_handling.sh" base="test_error_handling.sh" p
    if [[ -x "${rel}" ]]; then
      echo "${rel}"
      "${rel}"
    else
      p="$(_find_one "${base}")"
      if [[ -n "$p" ]]; then
        echo "bash ${p}"
        bash "${p}"
      else
        echo "MISSING: ${rel}"
      fi
    fi
  }
  _check() { local p; p="$(_find_one "$1")"; [[ -n "$p" && -s "$p" ]] && echo "OK: $1" || echo "MISSING/EMPTY: $1"; }

  # ---- exact order (nothing more, nothing less) ----
  _run_exec_label "lint-backend"
  _run_exec_label "lint-frontend"
  _run_exec_label "lint-design"
  _run_exec_label "test-backend"
  _run_exec_label "test-frontend"
  _run_npm run validate:frontend
  _run_py_filearg
  _run_npm run check:design
  _run_dot_slash
  _check "requirements-dev.txt"
  _check ".eslintignore"
}
```

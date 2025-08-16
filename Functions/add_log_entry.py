import json
import os
import re
import subprocess
from datetime import datetime
from pathlib import Path

def add_log_entry(date, title, description, tags, impact_level, visibility, resume_bullet):
    """Create a JSON log entry and commit it to the main branch.

    Parameters
    ----------
    date : str
        Date in ISO format (YYYY-MM-DD).
    title : str
        Title of the log entry.
    description : str
        Detailed description of the log entry.
    tags : list[str]
        List of tags for the entry.
    impact_level : str
        Impact level classification.
    visibility : list[str]
        Visibility audience list.
    resume_bullet : str
        Resume-ready bullet point.

    Returns
    -------
    str
        Success message if the entry was committed, otherwise an error message.
    """
    try:
        dt = datetime.fromisoformat(date)
        slug = re.sub(r"[^a-zA-Z0-9]+", "_", title.strip().lower()).strip("_")
        filename = f"{dt:%m-%d}_{slug}.json"
        path = Path("logs") / f"{dt:%Y}" / filename
        path.parent.mkdir(parents=True, exist_ok=True)

        entry = {
            "date": dt.strftime("%Y-%m-%d"),
            "title": title,
            "description": description,
            "tags": tags,
            "impact_level": impact_level,
            "visibility": visibility,
            "resume_bullet": resume_bullet,
        }

        with path.open("w", encoding="utf-8") as f:
            json.dump(entry, f, indent=2)
            f.write("\n")

        subprocess.run(["git", "config", "--global", "user.name", "Rini Krishnan"], check=True)
        subprocess.run(["git", "config", "--global", "user.email", "rini.krishnan@outlook.com"], check=True)
        subprocess.run(["git", "checkout", "main"], check=True, capture_output=True)
        subprocess.run(["git", "add", str(path)], check=True, capture_output=True)

        commit_msg = f"Add log entry: {title}"
        commit_result = subprocess.run(["git", "commit", "-m", commit_msg], capture_output=True)

        if commit_result.returncode != 0:
            return f"No changes to commit: {commit_result.stderr.decode().strip()}"

        github_token = "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"

        repo_url = f"https://{github_token}@github.com/rinikrishnan_kyndryl/resume-knowledge-base.git"

        # Ensure the repository has an ``origin`` remote before attempting to
        # set its URL.  In some environments the repository may be cloned
        # without any remotes, causing ``git remote set-url`` to fail with exit
        # status 2.  By checking the current remotes we can add ``origin`` when
        # it's missing and avoid the error encountered by the API.
        remotes = subprocess.run(["git", "remote"], capture_output=True, text=True, check=True)
        if "origin" in remotes.stdout.split():
            subprocess.run(["git", "remote", "set-url", "origin", repo_url], check=True, capture_output=True)
        else:
            subprocess.run(["git", "remote", "add", "origin", repo_url], check=True, capture_output=True)

        push_result = subprocess.run(["git", "push", "origin", "main"], capture_output=True)
        if push_result.returncode != 0:
            return f"Git push failed: {push_result.stderr.decode().strip()}"

        return f"Log entry written to {path} and committed to main branch."

    except Exception as exc:
        return f"Failed to write log entry: {exc}"

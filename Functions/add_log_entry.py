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
        # Generate file path and content
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

        # Write file
        with path.open("w", encoding="utf-8") as f:
            json.dump(entry, f, indent=2)
            f.write("\n")

        # Git config (ensure this only runs in Render, not locally if you want different identity)
        subprocess.run(["git", "config", "--global", "user.name", "Rini Krishnan"], check=True)
        subprocess.run(["git", "config", "--global", "user.email", "rini.krishnan@outlook.com"], check=True)

        # Stage file
        subprocess.run(["git", "checkout", "main"], check=True, capture_output=True)
        subprocess.run(["git", "add", str(path)], check=True, capture_output=True)

        # Skip commit if no diff
        diff_status = subprocess.run(["git", "diff", "--cached", "--quiet"])
        if diff_status.returncode != 0:
            commit_msg = f"Add log entry: {title}"
            subprocess.run(["git", "commit", "-m", commit_msg], check=True, capture_output=True)
        else:
            return f"No changes to commit. Log entry {path} is identical to existing file."

        # Set remote using GitHub token
        github_token = os.environ["GITHUB_TOKEN"]
        subprocess.run(
            [
                "git",
                "remote",
                "set-url",
                "origin",
                f"https://{github_token}@github.com/rinikrishnan_kyndryl/resume-knowledge-base.git",
            ],
            check=True,
            capture_output=True,
        )

        # Push to main
        subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)

        return f"Log entry written to {path} and committed to main branch."

    except Exception as exc:
        return f"Failed to write log entry: {exc}"

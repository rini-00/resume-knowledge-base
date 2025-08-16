import json
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
        subprocess.run(["git", "commit", "-m", commit_msg], check=True, capture_output=True)
        subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
        return f"Log entry written to {path} and committed to main branch."
    except Exception as exc:  # broad exception to capture subprocess errors too
        return f"Failed to write log entry: {exc}"

import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from Functions.add_log_entry import add_log_entry


if __name__ == "__main__":
    result = add_log_entry(
        date="2025-08-18",
        title="Codex Logging Tool Operational",
        description="Built and successfully tested a Codex function to log resume-worthy achievements to GitHub automatically.",
        tags=["Codex", "Automation", "Resume Tracker"],
        impact_level="Strategic",
        visibility=["Self", "Agent Workflows"],
        resume_bullet="Built and validated an automated Codex-based pipeline to log resume entries in JSON format to GitHub with zero manual steps.",
    )
    print(result)

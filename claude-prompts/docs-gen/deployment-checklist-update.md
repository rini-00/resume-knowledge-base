# Pre-Deployment Checklist Docs Update

## **STEP 0.**

Review every file in `claude-prompts` EXCEPT THIS ONE (`deployment-checklist-update.md`), and update each file that requires an update based on the scope of any code changes including new or updated files and functionality impacting any of these areas. Ensure every new file generated has the exact same name as the original (if existing).

## **1. Update deployment-checklist.md**

### **Task: Create a Simple, Succinct, Straight-to-the-Point Ordered Set of Files to Update or Create**

The goal is to update the existing `deployment-checklist.md` file with a succinct, ordered set of files that need to be created or updated pre-deployment. The file should be categorized into the two below sections. The `script-gen` section (1.1) only needs to be run when the rules in the `when to create` section are met. On the other hand, the `validation-run` section should be run every time, independent of whether `script-gen` (1.1) is skipped.

Ensure every new file generated has the exact same name as the original (if existing).

1.1. **script-gen**:

- **Description**: Prompts to generate actual scripts for new tests and utilities that need to be created for net-new functionality.
- **When to run**: Run one-time when adding new functionality. This section should be scoped specifically to the new functionality only and any potentially updated functionality. Do not update anything else in the checklist.
- Provide the following for this section, keeping verbosity minimal: basic description, when to run, and an ordered list of files to be created.
- **Outputs**:
  - A short bulleted list of files that will be created or updated in the entirety of this repository as part of this section (e.g., test scripts, utility scripts, documentation). These should include each and every file name explicitly listed within any of the files that sit in the `claude-prompts/tests-utils-create-update` folder.
  - Generate each of these files as part of this task, ensuring they are complete and ready for use. Use context from the rest of the codebase to ensure consistency, correctness and completeness.
- **Zsh Profile Command**:
  - A reference to the updated Zsh-profile command, to which these files will eventually be added, which will run all test/ util files for this section in one go.

---

1.2. **validation-run**:

- **Description**: Pre-deployment prompt-based checks that must be run every time the codebase is updated (not scoped to just new functionality). This is executed holistically on all files in the repository, included within project files.
- **When to run**: Run every time the codebase is updated.
- Provide the following for this section, keeping verbosity minimal: basic description, when to run, and an ordered list of files to be ran.
- **Outputs**:
  - A short bulleted list of files that must be ran in the entirety of this repository as part of this section (e.g., test scripts, utility scripts, documentation). These should include each and every file name explicitly listed within any of the files that sit in the following folders that sit in the parent `claude-prompts` folder: `code-compliance` and `pre-deployment-linting`.
  - Generate each of these files as part of this task, ensuring they are complete and ready for use. Use context from the rest of the codebase to ensure consistency, correctness and completeness.
- **Zsh Profile Command**:
  - A reference to the updated Zsh-profile command, to which these files will eventually be added, which will run all test/ util files for this section in one go.

---

## **2. Update zsh-profiles.md**

### **Task: Update and Generate Updated Zsh Profiles**

For context, a Zsh profile is a shell function defined within a Zsh configuration file, such as ~/.zshrc or ~/.zprofile. These profiles allow users to group and execute a series of commands with a single command, facilitating automation of tasks like environment setup, script execution, or workflow validation.

For detailed guidance on creating and formatting Zsh profiles, you can refer to the official Zsh manual: [Zsh Functions]('https://zsh.sourceforge.io/Doc/Release/Functions.html').

Ensure every new file generated has the exact same name as the original (if existing).

The goal is to update both of the below sections in the existing `zsh-profiles.md` file. Each section is a single zsh profile in a code block with a brief description of each:

2.1. **Update the Existing `zsh-script-gen` Zsh Profile**:

- The first step is to **update the existing `zsh-script-gen` Zsh profile** to include running all the files listed under the **`script-gen`** section in **`docs/deployment-checklist.md`**.
- This profile will need to run all the files listed in the `script-gen` section of the `docs/deployment-checklist.md` file, in sequential order, to generate scripts for tests, utilities, and other tasks related to the new functionality being added.

  2.2. **Update the Existing `zsh-validation-run` Zsh Profile**:

- The second step is to **update the existing `zsh-validation-run` Zsh profile** to include rrunning all the files listed under the **`validation-run`** section in **`docs/deployment-checklist.md`**.
- This profile will need to run all the files listed in the `validation-run` section of the `docs/deployment-checklist.md` file, in sequential order,for pre-deployment validation of the entire codebase, running checks on all relevant files.

---

## **3. Generate `run-profiles.zsh` Script**

### **Task: Check if `run-profiles.zsh` is Empty and Generate Script if Empty**

3.1. **Check if `run-profiles.zsh` is empty**:

- The first step is to check if the `run-profiles.zsh` file in `docs/` is empty.

  3.2. **If the file is empty, generate a **Zsh script** to be manually pasted into the `run-profiles.zsh` file.**
  **Note**: If `run-profiles.zsh` is **not empty**, no further action should be taken.

- The script must:
  - **Execute both profiles sequentially**: Run the `zsh-script-gen` profile followed by the `zsh-validation-run` profile.
  - **Check for errors**: The script will check the log files for any errors encountered during the execution of the profiles.
  - **Print a cumulative table of errors**: If errors are found, display them in a table format.
  - **Print a success message**: If no errors are encountered, print a simple message stating: _"All unit tests and validations have completed successfully. We are ready for UAT and/or deployment."_

    3.3. If the `run-profiles.zsh` file was **empty** and a new one was generated as an artifact, explicitly instruct the user to **manually paste the generated Zsh script** into the `run-profiles.zsh` file, located in the `docs/` folder.

# {Title} (3-5 words)

<!--
This template defines the structure for validation agent instruction files.
Each file serves as an instruction set for a microagent that generates ONLY
a manifest of files requiring creation/updates within a specific functional
or technical category (backend, frontend, error handling, etc.).

The microagent's sole purpose is to generate file manifests - no code generation
or file creation is performed.
-->

## **Context Summary**

<!--
The Context Summary establishes the purpose and scope of this validation agent.
It should clearly define what this agent validates/tests and what outputs are expected.
Keep objective statements focused and specific to avoid scope creep.

This section must contain:
- Objective of this set of validations (tests/checks)
- Required outputs
-->

### **Objective**

{Clear statement of what this microagent validates/tests - specific functional
or technical category}

### **Required Outputs**

- {Specific deliverable 1}
- {Specific deliverable 2}
- Manifest of files requiring creation/updates

---

## **Evaluation Scope**

**Scope Type:** {Codebase | Capability}

<!--
Evaluation Scope determines the breadth of analysis with two options:

"Codebase": All files in the codebase will require this validation
- Use when validation applies universally across the entire repository
- Skip the Capabilities and Workflows sections when this is selected

"Capability": Check/validation is only scoped to evaluation of a subset of
codebase that supports a specific capability or requirement
- Use when validation targets specific application capabilities
- Complete the Capabilities and Workflows sections when this is selected
-->

---

## **Capabilities**

_(Only if Evaluation Scope = Capability)_

<!--
List the specific capabilities/requirements that are supported by the sections
of the codebase that will be evaluated within the scope of this validation.

Examples of capabilities include:
- Log achievements or progress in a central knowledge base
- Submit progress or achievements via a simple interface
- Format achievements or progress in a standardized way
- Document one-off achievements unrelated to projects
- Update progress on specific initiatives/projects
- Summarize and frame achievements on closed initiatives
- Evaluate achievements for resume inclusion

Each capability represents a discrete function the application provides to users.
-->

- {Capability 1} - {Brief description}
- {Capability 2} - {Brief description}
- {Capability N} - {Brief description}

---

## **Workflows**

_(Only if Evaluation Scope = Capability)_

<!--
This section contains a list of application workflows that support any of the
capabilities listed in the Capabilities section.

Workflows represent the step-by-step processes that implement capabilities.
Each workflow should be categorized under its supporting capability and include:
- Workflow name
- Workflow summary
- Workflow steps

Example mapping:
Workflow: "Scope and send user updates to the backend"
Supported Capability: "Log achievements or progress in a central knowledge base"

Group workflows under their supporting capability to show clear relationships
between application processes and the capabilities they enable.
-->

### **{Capability Name}**

#### **{Workflow Name 1}**

- **Summary:** {Brief workflow description}
- **Steps:**
  1. {Step 1}
  2. {Step 2}
  3. {Step N}

#### **{Workflow Name 2}**

- **Summary:** {Brief workflow description}
- **Steps:**
  1. {Step 1}
  2. {Step 2}
  3. {Step N}

### **{Capability Name 2}**

#### **{Workflow Name 3}**

- **Summary:** {Brief workflow description}
- **Steps:**
  1. {Step 1}
  2. {Step 2}
  3. {Step N}

---

## **Instructions**

> **Template Reference:**
> [validation-agent-template.md](./templates/validation-agent-template.md)

<!--
Instructions provide step-by-step guidance for the validation agent based on
what has been discussed and is already included in existing files.

Each step should be clear and concise with explicit sections in the document
or repository to refer to. The ultimate goal is to ensure that the agent
understands how best to use the information at its disposal to infer, reason
and generate the required content.

Each complex step should have explicit acceptance and/or exit criteria to
provide clear guidance on when to proceed or stop analysis.

The markdown template file reference helps agents understand document layout
and information architecture.
-->

### **Execution Steps**

#### **Step 1: Repository Analysis**

- **Action:** {Specific action to take}
- **Focus Areas:** {Specific sections/directories to examine}
- **Acceptance Criteria:**
  - {Criteria 1}
  - {Criteria 2}

#### **Step 2: Capability Assessment**

_(Only if Evaluation Scope = Capability)_

- **Action:** {Specific action to take}
- **Focus Areas:** {Specific workflows to evaluate}
- **Acceptance Criteria:**
  - {Criteria 1}
  - {Criteria 2}

#### **Step 3: Gap Analysis**

- **Action:** {Specific action to take}
- **Focus Areas:** {What to analyze for gaps}
- **Exit Criteria:**
  - {When to stop analysis}
  - {Minimum requirements for proceeding}

#### **Step 4: Manifest Generation**

- **Action:** Generate file manifest using structure defined in Validation/Test
  File Manifest section
- **Requirements:**
  - Follow exact attribute structure specified in manifest section
  - Include only files ABSOLUTELY NECESSARY for new functionality
  - Provide detailed scope breakdown for all new/updated files
  - Capture all required attributes as detailed in file manifest requirements
    below
- **Validation:** Ensure manifest completeness per template requirements

---

## **Validation/Test File Manifest**

<!--
This section contains the actual output that agents generate.
The manifest categorizes validation files into Existing (no updates needed)
and New/Updated (requires creation or modification).

EVALUATION SCOPE STRUCTURE:
Files to be evaluated are grouped by workflow. For each workflow that functionally
or operationally needs evaluation within this scope, list the full file paths of
codebase files that support any workflow steps and specifically need evaluation.

CONTEXT FOR TESTS AND TEST CASES:
This manifest captures validation files which include tests and test cases. Each
validation file may contain multiple test cases that validate specific functionality.
When documenting scope breakdown, include both test files and individual test cases
that need to be created or updated.
-->

### **Existing**

<!--
Document validation/test files that currently exist and adequately cover their
intended scope without requiring updates. These files contain tests and test cases
that continue to function properly for their designated validation purpose.

REQUIRED ATTRIBUTES FOR EXISTING FILES:
- Filename, file path, purpose (basic description)
- Evaluation scope (files to be evaluated, grouped by workflow supported):
  - Workflows: workflows that functionally or operationally need to be evaluated to any extent, within the scope of this evaluation
  - Impacted files: full file path of the files in the codebase that support any workflow steps listed in the Workflow section for this workflow - that specifically need to be evaluated in the scope of this evaluation
-->

#### **File: {filename}.{ext}**

- **File Path:** `{/full/file/path}`
- **Purpose:** {Basic description of current validation coverage}
- **Evaluation Scope:**
  - **Workflow:** {Workflow-Name-1}
    - **Impacted Files:**
      - `{/full/path/impacted-file1.ext}`
      - `{/full/path/impacted-file2.ext}`
  - **Workflow:** {Workflow-Name-2}
    - **Impacted Files:**
      - `{/full/path/impacted-file3.ext}`
      - `{/full/path/impacted-file4.ext}`

---

### **New/Updated**

<!--
Document validation/test files that either don't exist (New File) or exist but
require modification (Updated File) to adequately validate new functionality or
address gaps in current validation coverage.

Include both test files and specific test cases in scope breakdown.
Only include files that are ABSOLUTELY NECESSARY for proper validation.

REQUIRED ATTRIBUTES FOR NEW/UPDATED FILES:
- Type designation (New File | Updated File)
- Filename, file path, purpose (summary of additions only)
- Detailed scope breakdown (bulleted list of specific additions)
- Evaluation scope (files to be evaluated, grouped by workflow supported):
  - Workflows: workflows that functionally or operationally need to be evaluated to any extent, within the scope of this evaluation
  - Impacted files: full file path of the files in the codebase that support any workflow steps listed in the Workflow section for this workflow - that specifically need to be evaluated in the scope of this evaluation
-->

#### **New File**

##### **File: {filename}.{ext}**

- **File Path:** `{/full/file/path}`
- **Purpose:** {Summary of validation scope - only what is being added/created}
- **Detailed Scope Breakdown:**
  - **Test Case:** {Specific validation/test 1}
  - **Test Case:** {Specific validation/test 2}
  - **Test Case:** {Specific validation/test 3}
- **Evaluation Scope:**
  - **Workflow:** {Workflow-Name-1}
    - **Impacted Files:**
      - `{/full/path/impacted-file1.ext}`
      - `{/full/path/impacted-file2.ext}`
  - **Workflow:** {Workflow-Name-2}
    - **Impacted Files:**
      - `{/full/path/impacted-file3.ext}`

#### **Updated Files**

##### **File: {filename}.{ext}**

- **File Path:** `{/full/file/path}`
- **Purpose:** {Summary of validation scope - only what is being added/created}
- **Detailed Scope Breakdown:**
  - **Test Case:** {Specific validation/test 1}
  - **Test Case:** {Specific validation/test 2}
- **Evaluation Scope:**
  - **Workflow:** {Workflow-Name-1}
    - **Impacted Files:**
      - `{/full/path/impacted-file1.ext}`
      - `{/full/path/impacted-file2.ext}`

---

**Note:** This microagent generates ONLY the file manifest. No actual code
generation or file creation.

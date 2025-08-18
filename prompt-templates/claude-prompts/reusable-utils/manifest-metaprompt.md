## ASKS

1. Generate a markdown template that will be used to prompt agents complete the
   below requirements. I need you to draft the markdown template to capture
   actual formatting, syntax, etc. for the "Validation Manifest" files (files
   that provide all the info necessary to create all test/ linting/ compliance
   validation scripts) that will be created as an output of the below. This file
   template should contain comments with every piece of contextual or
   explanatory info provided below. Do this very thoroughly ensuring no info
   provided below is uncaptured.

2. After you structure the file template, I need you to draft the prompt
   template that will prompt the agent to create these validation files USING
   the file template you created earlier as an linked attachment.

   **_ Note: Remember that this prompt should tell the agent how to create these
   files -- so the instruction should be super simple messaging to review
   template, compile info, populate template, validate checklist to ensure all
   content was populated. They will just be creating a file that tells them how
   to generate the manifest. Not the actual manifest. These are the middle
   managers. You tell them (manifest creation agents) how to tell their teams
   (test creation agents) what to do and how _**

---

## REQUIREMENTS & SUPPORTING CONTEXT:

Each file should have the following sections and subsections and each should be
as detailed as necessary without being meaninglessly verbose/ redundant:

- Context Summary
  - objective of this set of validations (tests/ checks)
  - required outputs
- Evaluation Scope
  - "Codebase" - if all files in codebase will require this validation
  - "Capability" - if check/ validation is only scoped to evaluation a subset of
    codebase that supports a specific capability or requirement
- Capabilities (only if Evaluation Scope = Capability)
  - list of capabilities/ requirements that are supported by the sections of the
    codebase that will be evaluated within the scope of this validation (ie. log
    achievements or progress in a central knowledge base; submit progress or
    achievements via a simple interface, format achievements or progress in a
    standardized way, document one-off achievements unrelated to projects,
    update progress on specific initiatives/ projects, summarize and frame
    achievements on closed initiatives, evaluate achievements for resume
    inclusion)
- Workflows (only if Evaluation Scope = Capability) - this should have a list of
  application workflows that support any of the capabilities listed in the
  Capabilities section (ie. workflow- scope and send user updates to the
  backend; supported capability- log achievements or progress in a central
  knowledge base) with the following attributes captured for each workflow:
  - Capability (categorize workflows by capability)
    - workflow name
    - workflow summary
    - workflow steps
- Instructions
  - based on what we've already discussed thus far and is already included in
    the file
  - markdown template file (filepath with hyperlink) for the agent to refer to,
    in order to understand document layout and info architecture of the doc
  - each step should be clear and concise with explicit sections in the document
    or repository to refer to
    - the ultimate goal here is to ensure that the agent understands how best to
      use the information at its disposal to infer, reason and generate the
      required content
  - each complex step should have explicit acceptance and/ or exit criteria
- Validation/ Test File Manifest
  - Existing
  - New / Updated

For the file manifest, the following attributes must be captured for each
section (include this in the instructions as needed to ensure execution is
precise):

- Existing (these are files that exist that do not require any updates, but
  currently test/ validate to sufficient extent to meet its purpose )
  - filename
  - file path
  - purpose (basic description)
  - evaluation scope (files to be evaluated, grouped by workflow supported):
    - workflows (workflows that functionally or operationally need be evaluated
      to any extent, within the scope of this evaluation)
      - impacted files (full file path of the files in the codebase that support
        any workflow steps listed in the Workflow section for this workflow -
        that specifically need to be evaluated in the scope of this evaluation)
- New / Updated
  - New File or File Update
  - filename
  - file path
  - purpose (summary of scope - of only what is being added/ created)
    - detailed scope breakdown (bulleted list - of only what is being added/
      created)
    - evaluation scope (files to be evaluated, grouped by workflow supported):
      - workflows (workflows that functionally or operationally need be
        evaluated to any extent, within the scope of this evaluation)
        - impacted files (full file path of the files in the codebase that
          support any workflow steps listed in the Workflow section for this
          workflow - that specifically need to be evaluated in the scope of this
          evaluation)

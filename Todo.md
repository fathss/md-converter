# List of things To Do (duh)

## [TD-1] Editor and customization Focused (Done)

### Change the app to mainly focused on editor and custom templates of docx

#### Requirements:

1. Remove file item logic
2. Remove item selector logic (fully focus on one file at a time)
3. Make a top toolbar on both the editor and preview section

#### Implementation (UI mockup):

- Editor: top toolbar with `Save`, `Clear`, `Copy` buttons.
- Preview: top toolbar with `View`, `Settings`, `Export` and tab-switcher replaced by toolbar buttons.
- File selection removed from UI; editor focuses on a single active document.
- These are UI changes only (no functionality implemented yet).

## [TD-2] Mermaid convertion (Done)

### Make mermaid code lines convertion works

#### Requirements:

1. Install mermaid-filter library ✓
2. Use that library ✓
3. Add --extra-args to pypandoc.convert ✓

#### Implementation:

- Installed mermaid-filter via npm
- Updated pypandoc.convert_text to include `['--standalone', '--filter', 'mermaid-filter']` in extra_args
- Mermaid diagrams in markdown now convert to docx format

## [TD-3] Editor and Preview toolbars (Done)

### Add a functional toolbar

#### Complementing:

#[TD-1]

#### Requirements:

1. Add clear and copy toolbar on editor
2. Change the tab version into a toolbar in preview section
3. Add setting, view, and export toolbar on preview

Implementation (UI mockup):

- Editor toolbar: `Clear` (clears editor), `Copy` (copies markdown), `Rename` (opens docx settings).
- Preview toolbar: `Raw / Rendered` toggle, `Settings` (docx + export), `Export` (triggers conversion/download).
- Toolbars are top-aligned for both sections and styled consistently.
- These are mockups only to show layout and behavior flow.

## [TD-4] Docx settings

### Add a functionality to docx settings

#### Complementing:

#[TD-3]

#### Requirements:

1. Add file rename options
2. Add two docx templates
3. Add footer and ToC options

## [TD-5] Scroll syncing (Done)

### Make the scrolling from editor syned with preview and vice versa

#### Requirements:

1. Not sure yet

# FINAL TODOs BEFORE INITIAL RELEASE

## [TD-6] Actually implement the setting (Done)

### Make the settings actually implemented :v

#### Requirements:

1. Create the 2 templates
2. Add Footer and ToC options implementations

## [TD-7] Add debounce (Done)

### Add a debounce so that the frontend is not fried by a constant convertion

#### Requirements:

1. Only add a debounce if characters exceeeds 20000

# Video Mixer UI Analysis and Improvement Prototype

The Video Mixer app source is not in this repo. This analysis works from the full-app screenshot at `images/video-mixer-screenshot.jpg`. The prototype at `prototype/video-mixer-ui.html` is a working, dependency-free mock of the improved layout. Open it in any browser. The layout engine is written to port directly into the real app.

## Current UI: what works

- Clear three-column mental model. Deck A, mix controls, Deck B.
- Strong color coding. Cyan for A, pink for B, purple for global controls.
- Everything on one screen. No modals, no tabs. Good for live use.
- Consistent monospace aesthetic. Reads as a pro tool.

## Current UI: issues found

1. **Fixed panel sizes.** Deck previews and the center column cannot be resized. Browsing-heavy prep work and performance work need different layouts, but the app forces one.
2. **Mix preview is the smallest thing on screen.** It is the program output, the single most important monitor while mixing. It gets roughly 200px.
3. **The A/B crossfader is nearly invisible.** It sits in the top strip as a thin unlabeled slider. On a DJ-style tool this should be the most prominent control.
4. **Transitions are dense text links.** Small hit targets, cramped rows, hard to tap accurately mid-set in a dark venue.
5. **No on-air indication.** Nothing tells you which deck is currently live in the output.
6. **Ambiguous values.** Duration shows a raw "2" with no units. Autopilot is a button with no visible on/off state.
7. **Small time readouts.** 1:23 / 4:07 is tiny. Hard to read from a booth.
8. **No file thumbnails.** File names alone make it slow to pick visuals live.
9. **Low-contrast labels.** Several labels sit near 3:1 against the background. Fine in a studio, hard in daylight or on a projector-lit stage.

## What the prototype implements

### Adjustable previews (the main request)

- **Draggable column dividers.** Two vertical splitters resize Deck A, center, and Deck B against each other. Minimum widths prevent crushing a panel.
- **Draggable preview heights.** A handle under each deck monitor and under the mix preview resizes that preview vertically (90 to 560 px).
- **Focus mode.** The button in each deck header gives that deck about 60 percent of the width and a taller monitor. Click again to restore.
- **Double-click any divider to reset it.** A Reset Layout button in the top bar resets everything.
- **Persistence.** All sizes save to localStorage under one key (`vm-layout-v1`) and restore on launch.
- **Keyboard.** `[` and `]` shrink or grow both deck previews.

### Other improvements demonstrated

- Prominent gradient crossfader in the center column, labeled A and B.
- ON AIR badges on each deck header, driven by crossfader position.
- Transitions as a grid of chunky buttons grouped by category, with a clear selected state.
- Duration readout with units (2.0s). Autopilot toggle shows ON or OFF with a green live state.
- Larger, shadowed time readouts overlaid on the deck monitors.
- Thumbnail placeholders in the file browser, with a colored edge marking the loaded file.
- Dismissible one-time hint banner explaining the new resizing.

## Porting notes

- The layout engine is the first `<script>` block, about 120 lines, zero dependencies. It only needs the same data attributes (`data-split`, `data-panel`, `data-deck`) on the real DOM.
- Columns use CSS Grid `fr` weights, so resizing stays proportional when the window resizes. Preview heights are pixel values with clamps.
- Pointer Events are used for dragging, so it works with mouse and touch in Electron, WKWebView, and the web build.
- For the native Mac build, swap localStorage for whatever settings store the app already uses. Everything reads and writes through the `load`/`save` functions.
- Suggested defaults ship in one `DEFAULTS` object. Tune there.

## Not covered here (needs the real codebase)

- Real video rendering in resized previews (canvas or video element scaling).
- Transition hover previews.
- Actual file thumbnail generation.
- Output window behavior when the mix preview is resized.

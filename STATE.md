# Agent State

## Add debounce
Add a debounce so that the frontend is not fried by a constant convertion

## Conventions
- Only add a debounce if characters exceeeds 20000
- Make the debounce time of 300ms, 500ms, and 800ms (for characters > 20000, > 40000, > 60000)

## Status: Completed

## Completed
- Preview rendering now debounces large markdown documents instead of re-rendering on every keystroke.
- Frontend build completed successfully after the debounce update.
- The debounce timing now lives in the parent content flow, so PreviewSection no longer updates state inside an effect.

## In Progess
- N/A

## Blocked / Failed Attempts
N/A

## Open Questions
N/A

## Do not touch
N/A
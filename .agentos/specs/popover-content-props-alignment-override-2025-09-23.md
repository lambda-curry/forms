File path: .agentos/specs/popover-content-props-alignment-override-2025-09-23.md

# AI Spec — Popover Content Props: Alignment Override

## Summary
Enable pass-through props to Radix PopoverPrimitive.Content in our Popover wrapper so consumers can override the default align="start" (e.g., to align="end"). This supports UI layouts where a trigger (like a Select) sits on the right edge of a container (e.g., a Card) and the popover content should align to the right for better fit and visual balance.

## Scope & Non-Goals
- In scope:
  - Expose a typed prop on the Popover component to forward props to Radix PopoverPrimitive.Content (e.g., `contentProps?: PopoverContentProps`).
  - Maintain current default behavior (align defaults to "start").
  - Allow alignment overrides via the pass-through (e.g., `align="end"`).
  - Add Storybook documentation and example demonstrating a Select on the right side of a Card using `align="end"`, with guidance on when to use it.
  - Add an interaction test (Storybook play test) that asserts the alignment override is applied.
- Out of scope:
  - Changing global defaults or repositioning strategy.
  - Broader refactors of Select/Popover internals or styling.
  - Changes to other Radix primitives (e.g., DropdownMenu, Tooltip) beyond documenting potential alignment needs.

## Acceptance Criteria
- [ ] Popover component exposes a pass-through for PopoverPrimitive.Content props (e.g., `contentProps`) and forwards them correctly to the underlying Content element.
- [ ] When `align` is provided via pass-through (e.g., `align="end"`), it overrides the default; when omitted, behavior remains unchanged (defaults to `"start"`).
- [ ] Types are accurate and exported as needed (no breaking changes for existing consumers).
- [ ] Storybook example in apps/docs shows a Card with a Select trigger aligned on the right; the popover uses `align="end"`. The story includes a short note on when to use right-alignment (e.g., when close to a container's right edge).
- [ ] Storybook play test verifies the alignment override is applied (e.g., via data attribute or stable class/prop inspection) and that basic keyboard interaction remains functional.
- [ ] Repository gates pass: `yarn lint`, `yarn build`, `yarn test`.

## Open Questions
- Should the pass-through be named `contentProps` (forwarding all valid Popover.Content props) or should we surface a smaller, explicit subset (e.g., only `align`, `side`, etc.)?
  - I think we should just have an explicit subset of props
- Which components need to expose this immediately: the Popover wrapper only, or also higher-level components that use a popover-like surface (e.g., Select) if they don't directly use PopoverPrimitive?
  - just the select component needs this right now
- Story placement: prefer a new story under "Popover/Alignment" or under the Select stories ("Select/Alignment")? Align with existing docs taxonomy.
  - we can keep under the select stories
- Do we also want to allow other commonly needed props (`side`, `sideOffset`) in the same change for consistency?
  - add as minimal as we think would be helpful, but document what they are used for

## Review & Acceptance Checklist
- [ ] Requirements are unambiguous and testable
- [ ] No unresolved `[NEEDS CLARIFICATION]`
- [ ] Acceptance criteria are practical and observable
- [ ] Risks and tradeoffs considered (API surface vs. simplicity)
- [ ] Spec file path follows naming convention (`.agentos/specs/<feature-name>-<YYYY-MM-DD>.md`)
- [ ] Stakeholders signed off

---
name: cinematic-product-experience
version: 1.0.0
description: Design, build, and verify cinematic, original, interactive websites and product experiences with purposeful motion, compelling visual assets, disciplined pacing, accessible fallbacks, and production-grade engineering.
triggers:
  - cinematic skill
  - cinematic design
  - premium interactive website
  - GOAT portfolio
  - immersive product experience
---

# Cinematic Product Experience — Reusable Design Skill

## Mission
Create a coherent **experience**, not a collection of fashionable UI effects. Each project should feel art-directed, immersive, technically robust, and recognisably its own. Adapt the visual metaphor to the product: a transforming synthetic human works for an AI-engineering portfolio; it is not a default motif to paste onto every shop or dashboard.

## Approved design reference
The approved reference is SinKu's **Human → Machine** AI portfolio, specifically the dramatic dark humanoid-to-endoskeleton direction and central project composition. Its signature is a continuous scroll story: a humanoid appears at the beginning; project narratives move in the foreground; outer layers progressively detach to reveal machinery; the mechanical form is fully revealed by the final project. Between projects, intentional **near-black, content-free interludes** expose the background artwork. Take inspiration from the experiential quality of Active Theory, not its proprietary assets or source code.

## Non-negotiable creative principles
1. **Visual anchor first.** Decide what singular original object, environment, or idea represents the product. Prototype it to high quality before building UI around it. Avoid generic procedural primitives masquerading as hero art.
2. **Narrative before movement.** Define beginning, middle, and end. Every transition should communicate a meaningful state change, not spin because spinning is possible.
3. **Central content, immersive background.** Show one primary project/story/card at a time near the visual centre. Keep text succinct, legible, and away from critical facial/details regions. Use dark translucent treatment only when needed for contrast.
4. **Pacing is a feature.** Alternate content chapters with generous, intentional empty space. Hide foreground content during the interludes so users can appreciate the scene. Empty space is not a loading screen, giant dark card, or missing content.
5. **Continuous scroll mapping.** Derive state from normalized document scroll, using a single source of truth. Animate hero evolution, project activation, chapter markers, and atmospheric elements from the same progression. Scrolling backward must reverse the transformation reliably.
6. **Visual fidelity and originality.** Use coherent anatomy, lighting, camera angle, and materials across transformation states; align corresponding features. Do not pretend cross-fading unrelated images constitutes true model morphing. Label such prototypes honestly. Use original or properly licensed assets.
7. **Restraint.** Near-black, editorial typography, carefully chosen amber/cool highlights, sophisticated contrast, fine lines, subdued particulate atmosphere; no gratuitous neon or bloom. Fewer great details beat hundreds of noisy effects.
8. **Human control.** Wheel/touch/keyboard, deep links, clear focus states, reversibility, optional motion, no hijacked scroll or unexplained auto-motion.

## Production workflow

### 1. Discovery and narrative design
Gather the audience, purpose, projects/products, intended emotional response, devices, performance budget, asset constraints, and legal/brand restrictions. Define 3–6 distinct experience stages and the measurable interaction events at each stage. For a portfolio, distinguish real delivered projects from concept projects; never invent performance statistics, demos, or credentials.

### 2. Art direction / asset gate
Provide a reference board, 1–3 original visual concepts, and a full-resolution hero. Check silhouettes, facial/anatomical consistency, material details, camera, and compositing. For staged transformations, use a shared character/model or registered frames with identical camera, aspect, perspective, and lighting. Reject inconsistent faces, anatomies, or cheap-looking robot meshes *before* implementing scroll.

### 3. Interaction storyboard
Map scroll `progress ∈ [0,1]` onto chapter boundaries and asset states. Specify what appears on entry, what disappears between chapters, when the background transitions, and the ending. Produce an annotated stage sequence including reverse scroll. Don't tie the evolution to arbitrary timer durations.

### 4. Build the vertical slice
Implement **one hero + two chapters + one black interlude** first. Verify in a real browser at desktop and mobile sizes. Only then generalise to the rest. Use semantic HTML, deterministic state handling, layer separation (`scene → artwork → atmosphere → foreground → navigation`), and small independently understandable functions/components.

### 5. Scroll & spacing architecture
- Use real document sections for scroll travel; keep cinematic background fixed or sticky according to layout.
- Content chapters must have intentional dwell time, with the primary project centred.
- Between them, include roughly **0.7–1.2 viewport heights of empty interlude**, adjusted to the artwork and device. Foreground panels must disappear and become unfocusable during the pause; the background remains visible.
- Map progress to aligned image sequences, layered masks, bone/material properties, or (for full 3D) a rigged model and animation mixer. Scrub deterministically rather than replaying time-based animation on every scroll event.
- Navigate directly to chapter anchors without broken intermediate states. Honor `prefers-reduced-motion`: show stable snapshots and instant transitions instead of forced parallax/particle effects.

### 6. Technical quality gates
- Self-contained demo when specifically requested; production deployments may use optimized separately cached assets.
- Avoid excessive GPU memory, per-frame allocations, forced reflows, large uncompressed images, and unbounded animation when the tab is hidden. Cap device pixel ratio and pause expensive effects when appropriate.
- Set explicit image dimensions, responsive `object-fit`, loading strategy, and graceful fallback for WebGL or image failures.
- Keep contrast readable, keyboard navigation usable, accessible headings/landmarks meaningful, dialog focus managed, and hidden panels noninteractive.
- Do not claim photoreal, rigged 3D, tested cross-browser, or an exact replica unless actually true and verified.
- Make text/content editable from structured data rather than hardcoded throughout rendering logic.

### 7. Acceptance tests — must be visibly checked
- Desktop: beginning, each chapter centre, **middle of every blank interlude**, final end state.
- Mobile: portrait and landscape, long titles, clipping, touch scrolling, and no horizontal overflow.
- Wheel both directions, keyboard and direct section navigation, refresh mid-scroll, rapid-scroll edge cases.
- Confirm the background remains vivid while the project panel is absent during every interlude.
- Check stage transitions align anatomically, project labels match content, buttons work, and the robot is fully mechanical at the end.
- Accessibility: reduced motion, keyboard focus, dialogs, meaningful navigation, no focusable hidden controls.
- Performance: check loading, scrolling smoothness, memory, and reasonable responsiveness on lower-power devices.
- Report verified tests and caveats; never invent test outcomes.

## Delivery contract
Deliver a functioning, inspectable artifact or implementation, plus a concise summary of changes, exact preview/download links when available, test results, known limitations, and next build decisions. Keep all claims matched to evidence. Review actual screenshots at multiple scroll positions before declaring the experience complete.

## Quick invocation
**“Apply Cinematic Product Experience skill to [project]. Preserve the single-hero narrative, central readable content, meaningful scroll-linked evolution, and black breathing spaces. Adapt art direction to the product. Prototype, test desktop/mobile/reverse scroll/accessibility, and deliver the runnable result.”**

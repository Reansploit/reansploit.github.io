# Design notes

Reading this as: personal landing page for a high school student aiming at university, editorial dark-typographic language inspired by tomdekoning.work, dial ENERGY 3 / RHYTHM 3 / MOTION 3. This revision records what is actually implemented in the code, not the earlier version of the reference it took inspiration from.

## What came from the reference, and what did not

Taken as inspiration: the dark field, oversized name wordmark, hairline rules, small meta labels, and letting sections change shape instead of repeating one card grid.

Taken forward in this revision: the reference's work-first experience becomes an accessible project reel, using the portfolio's existing photos rather than autoplay video or invented case studies. The reel has visible next and previous controls, a selectable project index, image alt text only for the current image, and arrow-key support.

Left out on purpose: the reference's custom cursor, image-sequence canvas, and Spline 3D object. They would add weight, duplicate existing motion, or make the site less predictable on touch and keyboard. The typefaces, palette, section order, and the path rail are this project's own.

A custom cursor and 3D objects were left out; the reference's momentum smooth-scroll was kept instead, because it is the single motion that changes how the whole page feels. Lenis (`lenis`) gives the page a buttery, momentum-based scroll on desktop wheel only — touch devices keep their native scroll so pull-to-refresh and browser chrome stay intact. It is wired into GSAP's ticker, so every ScrollTrigger parallax reads the same smoothed value and stays in step with the reader. Anchors are routed through it too, so in-page jumps glide, and focus follows the jump for keyboard readers. It is disabled entirely under `prefers-reduced-motion`.

## Tokens

| Token | Value | Why |
|---|---|---|
| ink | `#0C0E12` | The page is a personal portfolio, not a document, so the dark field is the chosen identity. It is not a "tech default" and there is no light theme to break. |
| bone | `#EAE4D8` | Warm off-white instead of pure white, closer to printed paper. 15.26:1 on ink. |
| bone-dim | `#A8A49A` | Secondary text at 7.76:1 on ink, so labels never sit at the edge of legibility. |
| marigold | `#D89A3C` | The one accent. It marks the next step (the target university, the rail, the active link), not every element. 7.92:1 on ink. |
| line | `#2A2E35` | Hairline separators. Decorative only, never the only boundary of a control. |
| ink-raised | `#12151B` | Used once, as the flat surface of the Info band, because that section should read as a quieter plate between the hero and the statement; it is a colour shift, not a shadow. |

No gradients, glow, glass, or shadow. `ink-raised` is used once, as the flat surface of the Info band, because that section should read as a quieter plate between the hero and the statement; it is a colour shift, not a shadow.

## Typography

- **Instrument Serif** carries the name, section headings, the italic accent word, and the Info values. A high-contrast serif gives the page a personal, printed voice and separates it from the reference's Playfair.
- **Archivo** carries body copy, labels, and navigation. It has a sturdier, slightly condensed rhythm than Inter and stays readable at 11 px with tracking.

Meta labels are 11 px, uppercase, 0.16em tracking, with tabular numerals so times and counts line up. They recede so the display type stays the focal point. Info values are set in Instrument Serif at 27 to 34 px because the facts are the section's actual content: they get the display voice while their labels stay meta.

## Layout

The page has six distinct compositions, not one repeated template: split hero with the name bottom-right and a portrait, label plus data rows, a full-width statement, a full-bleed photo band, a label plus vertical rail, and a giant Work heading over a project reel. On wide screens that reel becomes a pinned horizontal track, which is why the page turns instead of only descending. That is the RHYTHM 3 decision.

The current pass tightened the composition: the hero portrait bleeds to the right edge of the viewport so the first screen has an asymmetric, printed-page feel instead of a centred figure; the statement is set in the display serif at a larger measure; Info sits on the raised ink surface as one quieter band between the hero and the statement; and the sections carry small marigold numerals (01 to 05) in their labels, which gives the page an index without adding copy. Display sizes moved up roughly one step across the page, so the name, the statement, the path entries, and the Work heading carry more of the screen.

Borders are rationed so the page does not read as a stack of slabs: a hairline closes Info, Work, and the footer, while the statement, the photo band, and the path breathe without one. The band's caption sits on the photo as a small ink plate on sm+ screens, which keeps the credit readable over the image without adding a row under it; on phones it stays a separate line so it never covers the photo.

The hero portrait is the second focal point of the first screen on desktop: about half the viewport height on tall screens, anchored to the right edge, stepping down on shorter ones and disappearing on short desktop windows so the name keeps the fold. On a phone, the portrait becomes the first focal point after the metadata, followed by the statement and large name. This gives the small screen a visual opening rather than a long empty field. The Work reel gives one image the stage at a time, while the project index keeps every project available without turning the section into a generic card grid. On a phone, the image, project name, controls, and index stack in that reading order; the navigation changes to a labelled menu instead of squeezing four links into the header.

The path rail is the identity motif. It ties the two real content stops together and repeats as the one-pixel rule system. Its nodes are circles because they mark a position on a line, not because pill shapes are a style.

Radii are zero everywhere except those path markers.

## Motion

- **Anime.js** handles time-based entrances: the hero meta, the hero statement word by word, the name letter by letter, the hero hairline drawing itself, the CTA, the statement and footer headings word by word, the Info rows. They establish reading order.
- **GSAP** also runs one timed entrance on desktop: the hero portrait wipes open from its bottom edge while the photo settles from a slight scale. Mobile shows the portrait directly so the first screen has an immediate visual anchor. It sits on GSAP rather than Anime.js because clip-path interpolation is CSSPlugin's job; Anime.js keeps the text entrances.
- **GSAP + ScrollTrigger** handles scroll-position motion: the rail fills as the reader moves down the path, each path node snaps active as the line reaches it and releases when the reader scrolls back above it, the hero name drifts up slightly as the hero leaves, the portrait answers it with a small downward drift, and the photo band drifts a few percent inside its clip box. ScrollTrigger is used because the rail must reverse when the reader scrolls back up.
- Hover motion: nav links and the hero CTA draw their underline from the left, the active project is highlighted in the reel index, and each About row reveals its own photo at the cursor. Selecting a project crossfades its image and settles its scale, which confirms a deliberate change of work without an autoplay loop. The active reel panel also grows slightly (scale 1.06) while it holds the stage, so the turn of the track always lands on one clear focal image.
- The Work section stops being a column on wide screens: it pins to the viewport and further scrolling moves the project track sideways, so the page turns instead of only descending. The panels lean a little with scroll velocity so the turn feels physical. Inside the pinned Path, each stop heading rises (fadeUp) the moment the rail reaches a new node, marking the turn of the page in the text column too. Narrow screens and reduced motion keep a plain vertical stack.
- Neighbouring sections do not share one entrance: rows stagger, Work rows slide, headings rise, so the page never repeats a single transition.
- Six smaller interactions carry the page's personality. Each photo develops like a darkroom print: it starts almost black and soft, then resolves to its full tone over about 1.7 s the first time it scrolls into view, and only the first time. The section counters (`01/03` in Work, `01/04` in Path) roll their digits vertically on change, the old glyph leaving through the top of a fixed mask while the new one drops in from below, and both counters sit in `aria-live` regions with a spoken label so the change is announced. A hovered photo raises a viewfinder, marigold corner brackets and a thin centre crosshair fading in like a camera frame. The **Target** badge scrambles its letters on hover and resolves back to the word, and hovering the hero name knocks its letters slightly out of line and settles them back into the baseline, as if the type had just been pressed into the page. The footer counts the seconds until 2028 in Asia/Jakarta and ticks every second, so the deadline reads as a clock rather than a phrase.
- The viewfinder crosshair and the hero letter settle are fine-pointer flourishes: on touch devices they stay still, so a tap does not leave the name juddering or a photo with a stuck camera frame. Photos still develop on touch; only the hover-only ones are skipped.
- The page is one continuous take: each shot (hero, Info, statement, photo band, footer) settles into frame as it reaches the centre of the viewport, then drifts up as the next shot arrives, and every shot sways left and back together across the whole page so the scroll reads as a single camera rather than a stack of cuts. Translates only, so section boxes never resize and neighbouring text never collides. Path and Work are pinned acts with their own motion, so they stay out of the camera.
- The left margin carries a page tour: a hairline rail with one node per stop (Opening, About, Statement, Photo, Path, Work, Contact) and a marigold dot that rides the page's scroll progress. A stop lights up once its section top reaches the header, its label appears, and the change is announced to screen readers; the dot is driven by a plain scroll listener rather than ScrollTrigger, so it keeps tracking even as the Work pin-spacer grows the document. Nodes sit at each section's arrival point — the pin-spacer top for the pinned Path and Work — so the rail keeps true proportions down the page.
- No element is animated by both libraries at once, and nothing loops without the marquee's pause control.
- `prefers-reduced-motion: reduce` skips both libraries, the marquee, the underline transitions, and the thumbnail swell. The rail stays fully drawn, the nodes stay active, and everything stays visible. Photos appear already developed, the counters swap without rolling, and the hover-only flourishes stay still.
- The footer marquee has a pause control because it moves for longer than five seconds.

## Content

Everything is demo content and is labelled as demo: the name is `yourname.page`, facts are in brackets, and the footer says to replace them. The target university is marked **Target**, never presented as an enrolment.

## Photos

The nine photos are placeholders from Lorem Picsum (free licence), stored locally in `public/images/` so nothing loads from a third party at runtime. All are real photographs, not generated ones, and every slot is labelled in its caption or alt text so nobody mistakes them for the student's own work.

They are toned with one shared filter, grayscale with a light sepia warmth, slightly darker and a touch more contrast, so photographs sit inside the ink/bone palette instead of fighting it. The active reel image stays full size because it is the section's focal point. The slots are chosen where a photo has a job: a portrait next to the hero statement, one wide image as a breath between the statement and the path, one image per project in the reel, and one small photo per About fact (Now, Focus, Next, Based in, Off-screen) that appears at the cursor when that row is hovered. The footer's local time is live, taken from the Asia/Jakarta zone, because a site about "before 2028" should show how close that is. The footer also carries a colophon with the update date, typefaces, and stack. Work panels carry a role, a one-line summary, an outcome, tools, and links, so the reel reads as a record rather than a gallery.

Each About row reveals its photo at the cursor on fine pointers; on touch and under reduced motion the same photo sits inline under the row instead, so the information is never pointer-only. A print stylesheet forces every reveal visible and strips the fixed chrome, so a paper copy still reads top to bottom.

## Asset note

The favicon is a typographic placeholder derived from the placeholder name, not a final logo.

## Dials

- **ENERGY 3**: oversized name, hairline rules, marigold accent, asymmetric compositions — says hello hard.
- **RHYTHM 3**: six distinct section compositions, no repeated card grid — sections change visibly from each other.
- **MOTION 3**: scroll-position parallax on rail/band/portrait/name, word-by-word and letter-by-letter entrances, crossfade reel changes, darkroom development, flip counters, viewfinder, scramble, letter settle, countdown, and a single continuous take — each shot settles into frame as it reaches the viewport centre, drifts out as the next shot arrives, and all shots sway together so the scroll reads as one camera rather than a stack of cuts — choreographed motion, not hover states only.

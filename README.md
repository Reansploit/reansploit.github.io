# personal-site

A personal landing page built with React, Tailwind CSS, Anime.js, and GSAP.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Edit the content

Everything lives in `src/data/site.js`. Replace the bracketed placeholders with real details:

- `hero.name`, `hero.suffix`, `hero.location`, and `hero.statement`
- `info.rows` for the current school, focus, target university, and location
- `statement.body` for the longer explanation
- `path.nodes` for the school and the target university
- `work.items` for real projects, or leave the array empty to show the empty state
- `footer.rows` for real contact details

## Replace the photos

The photos are placeholders from [Lorem Picsum](https://picsum.photos), copied into `public/images/` and toned to match the palette (grayscale with a light sepia warmth, slightly darker). Swap them for your own:

1. Drop your photos into `public/images/` (keep the file names, or update the paths).
2. Update the `alt` texts in `src/data/site.js` so they describe the real photo.
3. Keep the `width`/`height` values in sync with the real file sizes; they prevent layout shift.

Photo slots:

- `hero.portrait`: a portrait photo of you (4:5)
- `band.src`: one wide photo between the statement and the path (20:9)
- `work.items[].image`: one photo per project (8:5)

The page is in English. To switch languages, translate the values in `site.js` and update `lang` in `index.html`.

The sample timeline assumes Grade XI in 2026 and a 2028 university intake. Change the years in `info.rows`, `path.nodes`, and `footer.title` if the real dates differ.

## Notes

- The university is labelled as a target, not as a current enrolment.
- The footer marquee has a pause button. Reduced motion turns it off.
- Design decisions and the reason for each token are in `DESIGN.md`.

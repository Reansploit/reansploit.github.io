export const site = {
  nav: [
    { label: 'Info', href: '#info' },
    { label: 'Path', href: '#path' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    name: '[yourname]',
    suffix: '.page',
    location: 'Based in [City], Indonesia',
    kicker: 'Personal site / 2026',
    hi: 'Hi there',
    statement:
      'High school student in [city], building toward [major] and a place at [university].',
    cta: { label: 'See the path', href: '#path' },
    portrait: 'images/photo-hero.jpg',
    portraitAlt: 'Placeholder portrait. Replace it with your own photo in src/data/site.js.',
    portraitCaption: '[A photo of you]',
  },

  band: {
    src: 'images/photo-band.jpg',
    alt: 'Placeholder photo. Replace it with your own image in src/data/site.js.',
    caption: '[A photo of your city, your desk, or the way to school]',
    credit: 'Placeholder photo / picsum.photos',
  },

  info: {
    label: 'About',
    rows: [
      {
        label: 'Now',
        value: 'Grade XI, [Nama SMA]',
        image: 'images/photo-info-now.jpg',
        imageAlt: 'A photo of your desk or classroom right now.',
      },
      {
        label: 'Focus',
        value: '[Major], with an interest in [interest]',
        image: 'images/photo-info-focus.jpg',
        imageAlt: 'A photo of what you are focusing on.',
      },
      {
        label: 'Next',
        value: '[Dream university], target 2028',
        image: 'images/photo-info-next.jpg',
        imageAlt: 'A photo of the road or place you are heading to.',
      },
      {
        label: 'Based in',
        value: '[City], Indonesia (GMT+7)',
        image: 'images/photo-info-city.jpg',
        imageAlt: 'A photo of your city.',
      },
      {
        label: 'Off-screen',
        value: '[One thing you do when you are not studying]',
        image: 'images/photo-info-now.jpg',
        imageAlt: 'A photo of what you do off-screen.',
      },
    ],
  },

  statement: {
    lead: 'Still in school.',
    accent: 'Already',
    tail: 'building toward [major].',
    label: 'Because',
    body: 'I am in grade XI at [Nama SMA], and most of what I know comes from [where you learned it]. I am aiming for [program] at [university] because [reason]. This page is where I keep the work that gets me there, before the applications open.',
  },

  path: {
    label: 'Path',
    title: 'Four stops. One direction.',
    nodes: [
      {
        status: 'Done',
        years: '2015 to 2021',
        title: '[Nama SD]',
        meta: 'Elementary school, [city]',
        note: 'Finished in [year]. [One thing that stuck from those years].',
        image: 'images/photo-path-sd.jpg',
        imageAlt: 'A photo from your elementary school years.',
      },
      {
        status: 'Done',
        years: '2021 to 2024',
        title: '[Nama SMP]',
        meta: 'Junior high, [city]',
        note: 'Finished in [year]. [What you started there that you still do].',
        image: 'images/photo-path-smp.jpg',
        imageAlt: 'A photo from your junior high years.',
      },
      {
        status: 'Now',
        years: '2024 to 2027',
        title: '[Nama SMA]',
        meta: 'Grade XI, [track or major]',
        note: 'Coursework in [subjects]. Right now I am [what you are working on].',
        image: 'images/photo-path-sma.jpg',
        imageAlt: 'A photo of your school life now.',
      },
      {
        status: 'Target',
        years: '2028',
        title: '[Dream university]',
        meta: '[Program]',
        note: 'Target intake 2028. [Why this program, in one line].',
        image: 'images/photo-path-uni.jpg',
        imageAlt: 'A photo of the place you are aiming for.',
      },
    ],
  },

  work: {
    note: 'Selected projects, newest first.',
    items: [
      {
        title: '[School project]',
        type: '[Web, class project]',
        role: '[What you built and your part]',
        year: '2026',
        summary: '[One line about what the project does.]',
        outcome: '[One concrete result, if you have one.]',
        tools: '[Tools used]',
        links: [],
        image: 'images/photo-work-1.jpg',
        imageAlt: 'Placeholder photo for [School project].',
      },
      {
        title: '[Personal project]',
        type: '[Experiment]',
        role: '[What you built and your part]',
        year: '2025',
        summary: '[One line about what the project does.]',
        outcome: '[One concrete result, if you have one.]',
        tools: '[Tools used]',
        links: [],
        image: 'images/photo-work-2.jpg',
        imageAlt: 'Placeholder photo for [Personal project].',
      },
      {
        title: '[Competition entry]',
        type: '[Team project]',
        role: '[What you built and your part]',
        year: '2025',
        summary: '[One line about what the project does.]',
        outcome: '[One concrete result, if you have one.]',
        tools: '[Tools used]',
        links: [],
        image: 'images/photo-work-3.jpg',
        imageAlt: 'Placeholder photo for [Competition entry].',
      },
    ],
  },

  footer: {
    label: 'Contact',
    title: 'Say hello before 2028.',
    rows: [
      { label: 'Email', value: '[your email]', href: 'mailto:[your email]' },
      { label: 'Instagram', value: '[@yourhandle]', href: 'https://instagram.com/[@yourhandle]' },
      { label: 'GitHub', value: '[@yourhandle]', href: 'https://github.com/[@yourhandle]' },
    ],
    clock: { zone: 'Asia/Jakarta', label: 'GMT+7' },
    countdown: { target: '2028-01-01T00:00:00+07:00' },
    colophon: {
      updated: '2026-11-18',
      typefaces: 'Instrument Serif and Archivo Variable',
      stack: 'React 19, Vite, Tailwind CSS, GSAP with ScrollTrigger, Lenis, Anime.js',
      photos: 'Personal photography; placeholder photos from picsum.photos until replaced.',
    },
    backToTop: 'Back to top',
  },
}

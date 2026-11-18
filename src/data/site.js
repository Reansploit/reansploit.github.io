export const site = {
  nav: [
    { label: 'Info', href: '#info' },
    { label: 'Path', href: '#path' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    name: 'Reandro',
    suffix: '.io',
    location: 'From Tuban, eastern java Indonesia',
    kicker: 'Gabut Page',
    hi: 'who is this?',
    statement:
      'High school student in Wonosalam Boarding School, i made this website cause of gabut btw😝.',
    cta: { label: 'See the path', href: '#path' },
    portrait: 'images/photo-hero.png',
    portraitAlt: 'hi.',
    portraitCaption: "it's me",
  },

  band: {
    src: 'images/preview.webp',
    alt: 'WBS behind view.',
    caption: 'WBS moment',
    credit: 'Shot 2024',
  },

  info: {
    label: 'About',
    rows: [
      {
        label: 'Now',
        value: 'Grade XI, Wonosalam Boarding School (SMA)',
        image: 'images/photo-info-now.png',
        imageAlt: 'Asatidz',
      },
      {
        label: 'Focus',
        value: 'Thalabul Ilmi',
        image: 'images/tb.jpg',
        imageAlt: 'just Study',
      },
      {
        label: 'Next',
        value: 'The Islamic University of Madinah, Bismillah 2029',
        image: 'images/photo-info-next.jpg',
        imageAlt: 'this is where i want to go!',
      },
      {
        label: 'Based in',
        value: 'Tuban, Indonesia (GMT+7)',
        image: 'images/tuban.jpeg',
        imageAlt: 'My City',
      },
      {
        label: 'Off-screen',
        value: 'me when gabut',
        image: 'images/gabut.jpg',
        imageAlt: "don't look",
      },
    ],
  },

  statement: {
    lead: 'Still in school.',
    accent: 'Already',
    tail: 'stay here for some reason',
    label: 'Because',
    body: 'you know lah~',
  },

  path: {
    label: 'Path',
    title: 'Four stops. One direction.',
    nodes: [
      {
        status: 'Done',
        years: '2016 to 2022',
        title: 'MI Hidayatun Najah',
        meta: 'Elementary school, Tuban',
        note: 'Finished in 2022. I thought that i had just been born yesterday.',
        image: 'images/photo-path-sd.jpg',
        imageAlt: 'This my elementary school.',
      },
      {
        status: 'Done',
        years: '2022 to 2024',
        title: 'Wonosalam Boarding School (SMP)',
        meta: 'Junior high School, Jombang',
        note: 'Finished in 2024. I thought that i had just joined elementary school yesterday?',
        image: 'images/wbs-smp.jpg',
        imageAlt: 'A photo from your junior high years.',
      },
      {
        status: 'Now',
        years: '2024 to 2028',
        title: 'Wonosalam Boarding School',
        meta: 'Grade XI, HIMMAH (OSIS of WBS) member',
        note: 'Active in Developer Division for a year. Right now I am updating all digital systems here.',
        image: 'images/wbs.jpg',
        imageAlt: 'A photo of your school life now.',
      },
      {
        status: 'Target',
        years: '2028',
        title: 'Islamic University of Madinah',
        meta: 'College of Computer Science',
        note: 'Target intake 2028. To get Dunia and Akhirat.',
        image: 'images/uim.jpg',
        imageAlt: 'A photo of the place you are aiming for.',
      },
    ],
  },

  work: {
    note: 'Selected projects, newest first.',
    items: [
      {
        title: 'Developer Division',
        type: 'Some applications like:',
        role: 'Elibrary management,elibrary viewer,KARUBA (electricity management),LUNAR AI (Local Unified Network Agentic Remote),etc.',
        year: '2026',
        summary: 'Lunar AI is the biggest project i ever made',
        outcome: '',
        tools: 'Python & typescript',
        links: [],
        image: 'images/coding.jpeg',
        imageAlt: 'Illustration.',
      },
      {
        title: 'Personal project',
        type: 'Gabut',
        role: 'for example i made this web because i was gabut',
        year: '2026',
        summary: 'none',
        outcome: 'try better with desktop',
        tools: 'React + framer motion',
        links: [],
        image: 'images/photo-work-2.jpg',
        imageAlt: 'Illustration.',
      },
      {
        title: 'Yearly Project',
        type: 'Team project',
        role: 'Building LUNAR AI and i signed as Backend Developer',
        year: '2026',
        summary: 'This is our biggest project',
        outcome: 'updated to v7.9.1',
        tools: 'Python,Local AI,html',
        links: [],
        image: 'images/ai.jpg',
        imageAlt: 'Illustration.',
      },
    ],
  },

  footer: {
    label: 'Contact',
    title: 'Say hello before 2029.',
    rows: [
      { label: 'Email', value: 'Reansploit@gmail.com', href: 'mailto:Reansploit@gmail.com' },
      { label: 'Instagram', value: 'Forcore1_rean', href: 'https://instagram.com/forcore1_rean' },
      { label: 'GitHub', value: 'Reansploit', href: 'https://github.com/Reansploit' },
    ],
    clock: { zone: 'Asia/Jakarta', label: 'GMT+7' },
    countdown: { target: '2029-01-01T00:00:00+07:00' },
    colophon: {
      updated: '2026-11-18',
      typefaces: 'Instrument Serif and Archivo Variable',
      stack: 'React 19, Vite, Tailwind CSS, GSAP with ScrollTrigger, Lenis, Anime.js',
      photos: 'Personal photography; placeholder photos from picsum.photos until replaced.',
    },
    backToTop: 'Back to top',
  },
}

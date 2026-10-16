/**
 * English (British spelling) UI dictionary.
 * This object is the source of truth for the Dictionary type — every other
 * locale must provide exactly the same keys (enforced by TypeScript).
 * Interpolation tokens use {curly} names and are filled by `format()`.
 */
export const en = {
  meta: {
    siteName: 'BlackMint Interactive',
    titleTemplate: '%s — BlackMint Interactive',
    defaultTitle: 'BlackMint Interactive — Independent game studio',
    defaultDescription:
      'BlackMint Interactive is a small independent game studio making atmospheric, handmade worlds for curious players. Small team. Big worlds.',
    ogImageAlt:
      'BlackMint Interactive logo over a moonlit, hand-drawn landscape with the words “Small team. Big worlds.”',
    pages: {
      games: {
        title: 'Games',
        description:
          'The worlds taking shape at BlackMint Interactive. Project pages, platforms and status are published only once they are confirmed.',
      },
      about: {
        title: 'Studio',
        description:
          'Who BlackMint Interactive is, how the studio works, and why it keeps the team small and the worlds big.',
      },
      journal: {
        title: 'Journal',
        description:
          'Development notes, experiments and behind-the-scenes writing from the BlackMint Interactive desk.',
      },
      contact: {
        title: 'Contact',
        description:
          'Get in touch with BlackMint Interactive about collaborations, press, playtesting or anything else on your mind.',
      },
      privacy: {
        title: 'Privacy policy',
        description: 'How BlackMint Interactive handles personal data on this website.',
      },
      terms: {
        title: 'Terms of use',
        description: 'The terms that govern the use of the BlackMint Interactive website.',
      },
      cookies: {
        title: 'Cookie policy',
        description:
          'Which cookies the BlackMint Interactive website uses, why, and how to change your choices.',
      },
      notFound: {
        title: 'Page not found',
        description: 'This page could not be found.',
      },
    },
  },

  a11y: {
    skipToContent: 'Skip to content',
    primaryNav: 'Primary',
    footerNav: 'Footer',
    legalNav: 'Legal',
    breadcrumb: 'Breadcrumb',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuDialog: 'Site menu',
    homeLink: 'BlackMint Interactive — home',
    opensNewTab: '(opens in a new tab)',
    languageSwitcher: 'Choose language',
    currentLanguage: 'current language',
    scrollProgress: 'Reading progress',
    placeholderArt: 'Placeholder artwork',
  },

  nav: {
    home: 'Home',
    games: 'Games',
    about: 'Studio',
    journal: 'Journal',
    contact: 'Contact',
    menu: 'Menu',
    close: 'Close',
    language: 'Language',
  },

  common: {
    toBeConfirmed: 'To be confirmed',
    placeholder: 'Placeholder',
    conceptPlaceholder: 'Concept placeholder',
    sampleEntry: 'Sample entry',
    readMore: 'Read more',
    backToTop: 'Back to top',
    loading: 'Loading…',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    minutesRead: '{n} min read',
    imageCount: 'Image {n} of {total}',
  },

  home: {
    hero: {
      eyebrow: 'Independent game studio',
      titleLineOne: 'Small team.',
      titleLineTwo: 'Big worlds.',
      annotation: 'Indie games for curious people.',
      body: 'BlackMint Interactive makes handmade, atmospheric games — rough around the edges on purpose, built by a small crew that would rather finish something strange than ship something safe.',
      primaryCta: 'Explore the games',
      secondaryCta: 'Meet the studio',
      scroll: 'Scroll',
    },
    ticker: [
      'Small team',
      'Big worlds',
      'Indie games for curious people',
      'Games make life more interesting',
      'Better worlds?',
    ],
    statement: {
      label: 'Studio statement',
      text: 'We build games the way we fill sketchbooks: by hand, a little crooked, always chasing the page that surprises us. No committee-made worlds. No endless roadmaps. Just a small team, stubborn ideas and places worth getting lost in.',
      principles: [
        {
          title: 'Small on purpose',
          body: 'A small team means every decision has a face. Fewer meetings, more making, and nobody hiding behind a process.',
        },
        {
          title: 'Worlds before features',
          body: 'We start with a place and a feeling, then look for the mechanics that let you live there — not the other way round.',
        },
        {
          title: 'Rough edges welcome',
          body: 'Sketch lines, grain and imperfect shapes are part of our language. Polish matters. Sterility doesn’t.',
        },
      ],
    },
    games: {
      label: 'In the workshop',
      title: 'Worlds we are sketching',
      intro:
        'These concept placeholders show how projects will appear on this site. They are not announced games: real titles, platforms and dates will replace them once confirmed.',
      viewAll: 'All projects',
      viewProject: 'View project',
      previewHint: 'Hover a title to preview its world',
    },
    studio: {
      label: 'The studio',
      quote: 'Games make life more interesting.',
      body: 'BlackMint started with a notebook, a controller and a question scribbled on the cover: better worlds? Everything we make is an attempt at an answer — small, personal games with their own weather, their own silence and their own sense of humour.',
      cta: 'About the studio',
      imageAlt:
        'A dark notebook beside a game controller marked with the BlackMint emblem; “Better worlds?” is handwritten on the cover.',
      secondaryImageAlt:
        'A dim studio desk lit by green light, a monitor showing the BlackMint emblem and the words “Games make life more interesting” on the wall.',
    },
    journal: {
      label: 'Dev journal',
      title: 'Notes from the desk',
      intro: 'Development logs, experiments and the occasional crooked sketch.',
      cta: 'Read the journal',
    },
    final: {
      title: 'Better worlds?',
      body: 'We think so. Follow along as they take shape — or tell us what you would build.',
      ctaGames: 'See the projects',
      ctaContact: 'Get in touch',
      channelsPending: 'Official studio channels will be listed here once they are live.',
      follow: 'Follow the studio',
    },
  },

  games: {
    label: 'Projects',
    heading: 'Worlds in the workshop',
    intro:
      'Every BlackMint project starts as a sketch of a place. When a project is ready to be shown, it gets its own page here with confirmed details only.',
    placeholderNotice:
      'The projects below are illustrative concept placeholders used to demonstrate this page. None of them is an announced game.',
    genre: 'Genre',
    platforms: 'Platforms',
    status: 'Status',
    statuses: {
      concept: 'Concept placeholder',
      prototype: 'Prototype',
      inDevelopment: 'In development',
      released: 'Released',
    },
    detail: {
      overview: 'Overview',
      world: 'The world',
      gameplay: 'How it plays',
      gallery: 'Gallery',
      details: 'Project details',
      links: 'Links',
      noLinks: 'No store or press pages yet.',
      back: 'All projects',
      placeholderNotice:
        '“{title}” is an illustrative concept used to demonstrate the project template. It is not an announced game, and no gameplay, platform or release information has been confirmed. The text below describes a concept direction only.',
      ctaTitle: 'Curious about this world?',
      ctaBody: 'Press, collaboration and playtest enquiries go through the contact page.',
      ctaButton: 'Contact the studio',
      more: 'Other worlds',
      openImage: 'Open image {n} in a larger view',
      galleryDialog: '{title} — gallery',
    },
    empty: 'No projects are listed yet. Check back soon.',
  },

  about: {
    label: 'The studio',
    heading: 'A small studio with a sketchbook habit',
    intro:
      'BlackMint Interactive is an independent game studio. We make atmospheric, handmade games for people who like to wander, wonder and poke at the edges of a world.',
    whoTitle: 'Who we are',
    whoBody: [
      'We are a deliberately small team. That is not a phase we are trying to grow out of; it is how we like to work. Small teams can follow a strange idea further, change direction in an afternoon and keep a world coherent from the first sketch to the last line of code.',
      'Our identity comes from the same place as our games: ink, grain, imperfect lettering and a single stubborn colour. Mint on black. A leaf that is also a controller. A crown scribbled in the margin.',
    ],
    teamPending: 'Team profiles will appear here when the team is ready to introduce itself.',
    factsTitle: 'Studio facts',
    facts: {
      founded: 'Founded',
      based: 'Based in',
      team: 'Team size',
    },
    approachTitle: 'How we work',
    approach: [
      {
        step: 'Sketch',
        body: 'Every project begins on paper — a place, a mood, a question. If it doesn’t survive the sketchbook, it doesn’t get a build.',
      },
      {
        step: 'Prototype',
        body: 'We build the smallest playable version of the feeling and throw away anything that doesn’t serve it.',
      },
      {
        step: 'Playtest',
        body: 'Curious people play it early. We watch, listen and resist the urge to explain.',
      },
      {
        step: 'Refine',
        body: 'Then we sand it — carefully, so the rough edges that matter stay rough.',
      },
    ],
    beliefsTitle: 'What we care about',
    beliefs: [
      {
        title: 'Atmosphere is a mechanic',
        body: 'Light, sound and silence do as much work as any system. We design them together.',
      },
      {
        title: 'Curiosity over compulsion',
        body: 'We want players to keep going because they wonder what is over the hill, not because a timer told them to.',
      },
      {
        title: 'Finish things',
        body: 'A small, finished, honest game beats a huge one that never leaves the drawing board.',
      },
    ],
    gallery: {
      setupAlt:
        'A studio desk at night: a monitor with the BlackMint emblem, sketches pinned to the wall and a plant catching the green light.',
      notebookAlt:
        'A black notebook with hand-drawn sketches of the BlackMint emblem and the words “Better worlds?”, next to a controller.',
      hoodieAlt: 'A black hoodie with the mint BlackMint emblem embroidered on the chest.',
      caption: 'From the moodboard: the studio, the sketchbook, the merch.',
    },
    cta: {
      title: 'Want to make something strange together?',
      body: 'We are always happy to hear from other small teams, artists, musicians and curious people.',
      button: 'Contact the studio',
    },
  },

  journal: {
    label: 'Dev journal',
    heading: 'Notes from the desk',
    intro:
      'Development updates, experiments, process notes and behind-the-scenes sketches from the studio.',
    sampleNotice:
      'These entries are illustrative samples that demonstrate the journal template. They will be replaced with real development updates before launch.',
    readEntry: 'Read entry',
    published: 'Published',
    updated: 'Updated',
    back: 'All entries',
    more: 'Keep reading',
    empty: 'Nothing here yet. The first entry is being written.',
    entrySampleNotice:
      'This is a sample entry written to demonstrate the article template. It is not a real studio announcement.',
    tags: {
      process: 'Process',
      design: 'Design',
      studio: 'Studio',
      art: 'Art',
    },
  },

  contact: {
    label: 'Contact',
    heading: 'Let’s talk worlds.',
    intro:
      'Collaborations, press, playtesting, a question about our work, or just a strange idea you think we would like — send it over.',
    direct: 'Prefer email? Write to {email}.',
    notConnectedTitle: 'This form is not connected yet',
    notConnectedBody:
      'The contact form has not been connected to a studio mailbox, so messages cannot be delivered at the moment. Please check back after launch.',
    form: {
      legend: 'Your message',
      name: 'Name',
      email: 'Email',
      topic: 'Topic',
      topics: {
        general: 'General enquiry',
        collaboration: 'Collaboration',
        press: 'Press & media',
        playtesting: 'Playtesting',
        other: 'Something else',
      },
      message: 'Message',
      messageHint: 'At least {min} characters.',
      acknowledgement:
        'I understand that my details will be used only to reply to this message, as described in the',
      privacyLink: 'Privacy policy',
      required: 'required',
      submit: 'Send message',
      sending: 'Sending…',
      honeypot: 'Leave this field empty',
      errorSummary: 'Please fix the following before sending:',
    },
    validation: {
      nameRequired: 'Please enter your name.',
      nameTooLong: 'Please keep your name under {max} characters.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address, like name@example.com.',
      topicInvalid: 'Please choose a topic.',
      messageRequired: 'Please write a message.',
      messageTooShort: 'Your message is a little short — please write at least {min} characters.',
      messageTooLong: 'Please keep your message under {max} characters.',
      acknowledgementRequired: 'Please confirm you have read how your details are used.',
    },
    status: {
      successTitle: 'Message sent.',
      successBody: 'Thank you — your message is on its way to the studio.',
      sendAnother: 'Send another message',
      error: 'Something went wrong and your message was not sent. Please try again in a moment.',
      notConfigured:
        'Your message was not sent: the contact form is not connected to a mailbox yet.',
      rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
      invalid: 'Some fields need attention. Please review the form.',
    },
  },

  consent: {
    banner: {
      title: 'Cookies, honestly.',
      body: 'We only use what the site needs to work. With your OK we will also remember your language. No analytics or marketing trackers are active today — if that ever changes, they stay off unless you switch them on.',
      acceptAll: 'Accept all',
      rejectAll: 'Reject optional',
      customize: 'Customise',
      policy: 'Cookie policy',
      label: 'Cookie consent',
    },
    preferences: {
      title: 'Cookie preferences',
      intro:
        'Choose which optional cookies we may use. You can change your mind at any time from “Cookie settings” in the footer. Strictly necessary cookies are always active because the site cannot work without them.',
      alwaysOn: 'Always on',
      on: 'On',
      off: 'Off',
      save: 'Save choices',
      acceptAll: 'Accept all',
      rejectAll: 'Reject optional',
      saved: 'Your cookie choices have been saved.',
      policy: 'Read the cookie policy',
      privacy: 'Privacy policy',
      categories: {
        necessary: {
          title: 'Strictly necessary',
          body: 'Make the site work and remember the cookie choices you make here. They cannot be switched off.',
        },
        preferences: {
          title: 'Preferences',
          body: 'Remember choices such as your preferred language, so you land on the right edition next time.',
        },
        analytics: {
          title: 'Analytics',
          body: 'Would help us understand how the site is used. No analytics tool is installed today; this setting has no effect until one is added and listed in the cookie policy.',
        },
        marketing: {
          title: 'Marketing',
          body: 'Would allow advertising or social media tools. None are installed today; this setting has no effect until one is added and listed in the cookie policy.',
        },
      },
    },
    settings: 'Cookie settings',
  },

  legal: {
    lastUpdated: 'Last updated',
    draftTitle: 'Draft document',
    draftNotice:
      'This document is a working template. It must be completed and reviewed by a qualified legal professional before launch. Highlighted fields in brackets are placeholders for information that has not been confirmed yet.',
    contents: 'On this page',
    openFullPage: 'Open the full page',
    related: 'Related documents',
  },

  footer: {
    tagline: 'Small team. Big worlds.',
    explore: 'Explore',
    legal: 'Legal',
    contact: 'Contact',
    contactForm: 'Use the contact form',
    language: 'Language',
    follow: 'Follow',
    rights: '© {year} BlackMint Interactive.',
    note: 'Indie games for curious people.',
  },

  notFound: {
    code: '404',
    title: 'Lost in the fog.',
    body: 'This page wandered off the map. It may have moved, or it never existed in the first place.',
    home: 'Back to the start',
    games: 'Explore the games',
  },

  error: {
    title: 'Something broke.',
    body: 'An unexpected error stopped this page from loading. You can try again, or head back to the start.',
    retry: 'Try again',
    home: 'Back to the start',
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;

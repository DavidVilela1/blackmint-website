import type { Locale } from '@/i18n/config';

/**
 * GAME CONTENT
 * ─────────────
 * All three entries below are ILLUSTRATIVE CONCEPT PLACEHOLDERS
 * (`isPlaceholder: true`). They exist to demonstrate the project templates and
 * are clearly labelled as such in the UI. They are excluded from the sitemap,
 * rendered with `noindex`, and described as placeholders in llms.txt.
 *
 * To publish a real game: duplicate an entry, set `isPlaceholder: false`, fill
 * in only confirmed information (leave `platforms`/`genre` as null when not
 * confirmed) and replace the artwork in /public/images/games/<slug>/.
 */

export type Localized<T> = Record<Locale, T>;

export type GameStatus = 'concept' | 'prototype' | 'inDevelopment' | 'released';

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  alt: Localized<string>;
}

export interface GameLink {
  label: Localized<string>;
  href: string;
}

export interface Game {
  slug: string;
  title: string;
  isPlaceholder: boolean;
  /** Visual theme of the detail page. */
  tone: 'night' | 'paper';
  tagline: Localized<string>;
  summary: Localized<string>;
  overview: Localized<string[]>;
  world: Localized<string[]>;
  gameplay: Localized<string[]>;
  /** null = not confirmed → rendered as "To be confirmed". */
  genre: Localized<string> | null;
  /** null = not confirmed. Use official platform names only. */
  platforms: string[] | null;
  status: GameStatus | null;
  cover: ImageAsset;
  hero: ImageAsset;
  gallery: ImageAsset[];
  /** Official store / press links only. */
  links: GameLink[];
}

const cover = (slug: string, alt: Localized<string>): ImageAsset => ({
  src: `/images/games/${slug}/cover.jpg`,
  width: 1200,
  height: 950,
  alt,
});
const wide = (slug: string, file: string, alt: Localized<string>): ImageAsset => ({
  src: `/images/games/${slug}/${file}.jpg`,
  width: 1600,
  height: 900,
  alt,
});

export const games: Game[] = [
  {
    slug: 'hollow-moon',
    title: 'Hollow Moon',
    isPlaceholder: true,
    tone: 'night',
    tagline: {
      en: 'A lone wanderer, an oversized moon and a castle that should not be there.',
      'pt-pt': 'Um viajante solitário, uma lua enorme e um castelo que não devia estar ali.',
    },
    summary: {
      en: 'Concept placeholder for an atmospheric exploration piece built around the BlackMint key art: one traveller, one impossible castle, a lot of fog.',
      'pt-pt':
        'Conceito provisório para uma peça de exploração atmosférica construída a partir da key art da BlackMint: um viajante, um castelo impossível e muito nevoeiro.',
    },
    overview: {
      en: [
        'Hollow Moon is a working title used to demonstrate how a BlackMint project page is structured. It takes its mood directly from the studio’s key art — a small figure on a cliff edge, a moon that fills half the sky and a castle silhouetted against it.',
        'Nothing about this project has been announced. Treat everything on this page as a concept sketch.',
      ],
      'pt-pt': [
        'Hollow Moon é um título provisório usado para demonstrar a estrutura de uma página de projeto da BlackMint. Vai buscar o ambiente diretamente à key art do estúdio — uma pequena figura à beira de uma falésia, uma lua que ocupa metade do céu e um castelo recortado contra ela.',
        'Nada sobre este projeto foi anunciado. Considere tudo o que está nesta página como um esboço de conceito.',
      ],
    },
    world: {
      en: [
        'Concept direction: a valley that only exists while the moon is full. Paths appear in the moonlight and fade in the dark, and the castle on the ridge seems a little closer every night.',
      ],
      'pt-pt': [
        'Direção de conceito: um vale que só existe enquanto a lua está cheia. Os caminhos aparecem ao luar e desvanecem-se no escuro, e o castelo na cumeada parece um pouco mais perto a cada noite.',
      ],
    },
    gameplay: {
      en: [
        'Concept direction only — no mechanics have been confirmed. The sketch imagines slow, wordless exploration where light is the main tool: where you point the lantern decides what the valley lets you see.',
      ],
      'pt-pt': [
        'Apenas direção de conceito — nenhuma mecânica foi confirmada. O esboço imagina uma exploração lenta e sem palavras, em que a luz é a principal ferramenta: para onde aponta a lanterna decide aquilo que o vale lhe deixa ver.',
      ],
    },
    genre: {
      en: 'Atmospheric exploration (concept)',
      'pt-pt': 'Exploração atmosférica (conceito)',
    },
    platforms: null,
    status: 'concept',
    cover: cover('hollow-moon', {
      en: 'Ink-style key art: a hooded traveller with a backpack stands on a cliff before a huge pale moon and a ruined castle.',
      'pt-pt':
        'Key art em estilo tinta: um viajante encapuzado com mochila, numa falésia, diante de uma lua enorme e pálida e de um castelo em ruínas.',
    }),
    hero: wide('hollow-moon', 'hero', {
      en: 'Wide crop of the key art: the traveller on the cliff looks towards a castle under a full moon.',
      'pt-pt':
        'Recorte panorâmico da key art: o viajante na falésia olha para um castelo sob a lua cheia.',
    }),
    gallery: [
      wide('hollow-moon', 'gallery-01', {
        en: 'Placeholder artwork: misty mountain ridges and a castle with a single green window beneath a full moon.',
        'pt-pt':
          'Ilustração provisória: cumeadas enevoadas e um castelo com uma única janela verde sob a lua cheia.',
      }),
      wide('hollow-moon', 'gallery-02', {
        en: 'Placeholder artwork: a small traveller crosses a dark ridge under a pale moon.',
        'pt-pt':
          'Ilustração provisória: um pequeno viajante atravessa uma cumeada escura sob uma lua pálida.',
      }),
      wide('hollow-moon', 'gallery-03', {
        en: 'Detail of the key art: the ruined castle and rocky slopes in heavy ink texture.',
        'pt-pt':
          'Pormenor da key art: o castelo em ruínas e as encostas rochosas com textura de tinta carregada.',
      }),
    ],
    links: [],
  },
  {
    slug: 'mint-static',
    title: 'Mint Static',
    isPlaceholder: true,
    tone: 'night',
    tagline: {
      en: 'A radio mast on an empty plain keeps broadcasting a signal nobody remembers sending.',
      'pt-pt':
        'Uma antena numa planície vazia continua a transmitir um sinal que ninguém se lembra de enviar.',
    },
    summary: {
      en: 'Concept placeholder for a quiet mystery about listening: a lonely transmitter, a cabin with one lit window and a frequency that answers back.',
      'pt-pt':
        'Conceito provisório para um mistério tranquilo sobre escutar: um transmissor solitário, uma cabana com uma janela acesa e uma frequência que responde.',
    },
    overview: {
      en: [
        'Mint Static is a placeholder used to show a second visual direction on the project template: wide plains, low cloud and a single mint-green signal cutting through the grey.',
        'It is not an announced game. Title, genre and every detail on this page are illustrative.',
      ],
      'pt-pt': [
        'Mint Static é um marcador provisório usado para mostrar uma segunda direção visual no modelo de projeto: planícies largas, nuvens baixas e um único sinal verde-menta a atravessar o cinzento.',
        'Não é um jogo anunciado. O título, o género e todos os detalhes desta página são ilustrativos.',
      ],
    },
    world: {
      en: [
        'Concept direction: a flat, windswept landscape where the only landmarks are a lattice mast and a small cabin. At night the mast hums, and the static sounds almost like words.',
      ],
      'pt-pt': [
        'Direção de conceito: uma paisagem plana e varrida pelo vento, onde os únicos pontos de referência são uma antena treliçada e uma pequena cabana. À noite, a antena zumbe e a estática soa quase a palavras.',
      ],
    },
    gameplay: {
      en: [
        'Concept direction only — no mechanics have been confirmed. The sketch explores tuning rather than fighting: turning dials, following interference and piecing a story together from fragments.',
      ],
      'pt-pt': [
        'Apenas direção de conceito — nenhuma mecânica foi confirmada. O esboço explora a sintonização em vez do combate: rodar botões, seguir interferências e reconstruir uma história a partir de fragmentos.',
      ],
    },
    genre: { en: 'Narrative mystery (concept)', 'pt-pt': 'Mistério narrativo (conceito)' },
    platforms: null,
    status: 'concept',
    cover: cover('mint-static', {
      en: 'Placeholder artwork: a lattice radio mast on a dark plain emits mint-green signal arcs; a cabin with a lit window sits nearby.',
      'pt-pt':
        'Ilustração provisória: uma antena treliçada numa planície escura emite arcos de sinal verde-menta; perto, uma cabana com uma janela acesa.',
    }),
    hero: wide('mint-static', 'hero', {
      en: 'Placeholder artwork: low clouds over a plain, a radio mast broadcasting mint-green arcs.',
      'pt-pt':
        'Ilustração provisória: nuvens baixas sobre uma planície e uma antena a emitir arcos verde-menta.',
    }),
    gallery: [
      wide('mint-static', 'gallery-01', {
        en: 'Placeholder artwork: the mast and cabin at dusk under heavy cloud.',
        'pt-pt': 'Ilustração provisória: a antena e a cabana ao anoitecer, sob nuvens carregadas.',
      }),
      wide('mint-static', 'gallery-02', {
        en: 'Placeholder artwork: tall grass in the foreground, the mast glowing in the distance.',
        'pt-pt':
          'Ilustração provisória: erva alta em primeiro plano e a antena a brilhar ao longe.',
      }),
      wide('mint-static', 'gallery-03', {
        en: 'Placeholder artwork: a broken signal arc above the plain at night.',
        'pt-pt': 'Ilustração provisória: um arco de sinal interrompido sobre a planície, à noite.',
      }),
    ],
    links: [],
  },
  {
    slug: 'paper-kingdom',
    title: 'Paper Kingdom',
    isPlaceholder: true,
    tone: 'paper',
    tagline: {
      en: 'A kingdom folded out of paper, ink and stubbornness, where any hill can be redrawn.',
      'pt-pt':
        'Um reino dobrado em papel, tinta e teimosia, onde qualquer colina pode ser redesenhada.',
    },
    summary: {
      en: 'Concept placeholder for a light-toned, hand-drawn world: layered paper hills, an ink village and a scribbled crown hanging in the sky.',
      'pt-pt':
        'Conceito provisório para um mundo claro e desenhado à mão: colinas de papel em camadas, uma aldeia a tinta e uma coroa rabiscada pendurada no céu.',
    },
    overview: {
      en: [
        'Paper Kingdom is a placeholder that demonstrates the light “paper” variant of the project template — the same brand language, inverted: warm off-white, charcoal ink and a single mint mark.',
        'It is not an announced game. Everything here is a concept sketch.',
      ],
      'pt-pt': [
        'Paper Kingdom é um marcador provisório que demonstra a variante clara «papel» do modelo de projeto — a mesma linguagem da marca, invertida: branco-sujo quente, tinta carvão e uma única marca menta.',
        'Não é um jogo anunciado. Tudo aqui é um esboço de conceito.',
      ],
    },
    world: {
      en: [
        'Concept direction: a tiny kingdom drawn across layers of torn paper. The crown in the sky belongs to nobody yet, and every village has an opinion about who should have it.',
      ],
      'pt-pt': [
        'Direção de conceito: um reino minúsculo desenhado sobre camadas de papel rasgado. A coroa no céu ainda não pertence a ninguém e cada aldeia tem uma opinião sobre quem a deve ter.',
      ],
    },
    gameplay: {
      en: [
        'Concept direction only — no mechanics have been confirmed. The sketch plays with drawing as an action: erasing a path, inking a bridge, folding a hill out of the way.',
      ],
      'pt-pt': [
        'Apenas direção de conceito — nenhuma mecânica foi confirmada. O esboço brinca com o desenho como ação: apagar um caminho, desenhar uma ponte a tinta, dobrar uma colina para a tirar do caminho.',
      ],
    },
    genre: {
      en: 'Hand-drawn puzzle adventure (concept)',
      'pt-pt': 'Aventura de puzzles desenhada à mão (conceito)',
    },
    platforms: null,
    status: 'concept',
    cover: cover('paper-kingdom', {
      en: 'Placeholder artwork: layered paper hills in grey tones with small ink houses and a mint-green hand-drawn crown in a pale sky.',
      'pt-pt':
        'Ilustração provisória: colinas de papel em camadas cinzentas, pequenas casas a tinta e uma coroa verde-menta desenhada à mão num céu claro.',
    }),
    hero: wide('paper-kingdom', 'hero', {
      en: 'Placeholder artwork: a panorama of torn-paper hills under a scribbled mint crown.',
      'pt-pt':
        'Ilustração provisória: um panorama de colinas de papel rasgado sob uma coroa menta rabiscada.',
    }),
    gallery: [
      wide('paper-kingdom', 'gallery-01', {
        en: 'Placeholder artwork: a village of small ink houses along a paper ridge.',
        'pt-pt':
          'Ilustração provisória: uma aldeia de pequenas casas a tinta ao longo de uma cumeada de papel.',
      }),
      wide('paper-kingdom', 'gallery-02', {
        en: 'Placeholder artwork: the crown floats above overlapping hills.',
        'pt-pt': 'Ilustração provisória: a coroa flutua sobre colinas sobrepostas.',
      }),
      wide('paper-kingdom', 'gallery-03', {
        en: 'Placeholder artwork: pale layered hills fading into a paper sky.',
        'pt-pt': 'Ilustração provisória: colinas claras em camadas a desvanecer num céu de papel.',
      }),
    ],
    links: [],
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

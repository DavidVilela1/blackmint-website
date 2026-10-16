import type { ImageAsset, Localized } from './games';

/**
 * JOURNAL CONTENT
 * ───────────────
 * The entries below are ILLUSTRATIVE SAMPLES (`isSample: true`) written to
 * demonstrate the journal templates. They are clearly labelled in the UI,
 * excluded from the sitemap and rendered with `noindex` until replaced.
 *
 * Their dates are placeholders. Replace each entry with a real development
 * update (or delete it) before launch.
 */

export type JournalTag = 'process' | 'design' | 'studio' | 'art';

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; image: ImageAsset; caption?: Localized<string> };

export interface Article {
  slug: string;
  isSample: boolean;
  title: Localized<string>;
  excerpt: Localized<string>;
  tag: JournalTag;
  /** ISO date (yyyy-mm-dd). */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  cover: ImageAsset;
  body: Localized<Block[]>;
}

const img = (src: string, width: number, height: number, alt: Localized<string>): ImageAsset => ({
  src,
  width,
  height,
  alt,
});

const setup = img('/images/studio/studio-setup.jpg', 920, 440, {
  en: 'A dim studio desk lit by green light, a monitor showing the BlackMint emblem.',
  'pt-pt':
    'Uma secretária de estúdio na penumbra, iluminada por luz verde, com um monitor a mostrar o emblema da BlackMint.',
});
const notebook = img('/images/studio/desk-notebook.jpg', 920, 418, {
  en: 'A black notebook with sketches of the BlackMint emblem and “Better worlds?” written on it, next to a controller.',
  'pt-pt':
    'Um caderno preto com esboços do emblema da BlackMint e «Better worlds?» escrito, ao lado de um comando.',
});
const hoodie = img('/images/studio/hoodie.jpg', 744, 866, {
  en: 'A black hoodie with the mint BlackMint emblem embroidered on the chest.',
  'pt-pt': 'Uma camisola com capuz preta com o emblema da BlackMint bordado a menta.',
});
const keyArt = img('/images/studio/key-art-moodboard.jpg', 828, 874, {
  en: 'BlackMint key art: the logo above an ink-style scene of a traveller, a huge moon and a castle.',
  'pt-pt':
    'Key art da BlackMint: o logótipo sobre uma cena em estilo tinta com um viajante, uma lua enorme e um castelo.',
});

export const articles: Article[] = [
  {
    slug: 'small-team-big-worlds',
    isSample: true,
    tag: 'studio',
    publishedAt: '2026-09-24',
    readingMinutes: 4,
    cover: setup,
    title: {
      en: 'Small team, big worlds: why we stay small on purpose',
      'pt-pt': 'Equipa pequena, mundos grandes: porque ficamos pequenos de propósito',
    },
    excerpt: {
      en: 'Our slogan is not modesty and it is not a growth plan. It is a design constraint — and the most useful one we have.',
      'pt-pt':
        'O nosso slogan não é modéstia nem um plano de crescimento. É uma restrição de design — e a mais útil que temos.',
    },
    body: {
      en: [
        {
          type: 'p',
          text: 'People read “small team, big worlds” as a joke about ambition. It is closer to a rule. Every world we sketch has to be something a handful of people can hold in their heads at once — every path, every sound, every corner where the light does something odd.',
        },
        { type: 'h2', text: 'Big is a feeling, not a size' },
        {
          type: 'p',
          text: 'A world feels big when it suggests more than it shows. Fog, distance and silence do a lot of that work for free. A moon that fills half the sky makes a valley feel enormous, even if you can cross it in ten minutes.',
        },
        {
          type: 'quote',
          text: 'We would rather build one valley that feels endless than a continent that feels empty.',
        },
        { type: 'h2', text: 'What staying small changes' },
        {
          type: 'list',
          items: [
            'Decisions are made by the people doing the work.',
            'Ideas can be tested the same afternoon they are sketched.',
            'The art, the code and the sound grow up together instead of being stitched together at the end.',
          ],
        },
        {
          type: 'p',
          text: 'This entry is a sample written to demonstrate the journal template. A real studio update will replace it.',
        },
      ],
      'pt-pt': [
        {
          type: 'p',
          text: 'Muitas pessoas leem «equipa pequena, mundos grandes» como uma piada sobre ambição. Está mais perto de ser uma regra. Cada mundo que esboçamos tem de ser algo que um punhado de pessoas consiga ter na cabeça ao mesmo tempo — cada caminho, cada som, cada canto onde a luz faz algo estranho.',
        },
        { type: 'h2', text: 'Grande é uma sensação, não um tamanho' },
        {
          type: 'p',
          text: 'Um mundo parece grande quando sugere mais do que mostra. O nevoeiro, a distância e o silêncio fazem grande parte desse trabalho de graça. Uma lua que ocupa metade do céu faz um vale parecer enorme, mesmo que se atravesse em dez minutos.',
        },
        {
          type: 'quote',
          text: 'Preferimos construir um vale que parece infinito a um continente que parece vazio.',
        },
        { type: 'h2', text: 'O que muda por sermos pequenos' },
        {
          type: 'list',
          items: [
            'As decisões são tomadas por quem faz o trabalho.',
            'As ideias podem ser testadas na mesma tarde em que são esboçadas.',
            'A arte, o código e o som crescem juntos, em vez de serem cosidos no fim.',
          ],
        },
        {
          type: 'p',
          text: 'Esta entrada é um exemplo escrito para demonstrar o modelo do diário. Será substituída por uma atualização real do estúdio.',
        },
      ],
    },
  },
  {
    slug: 'from-sketchbook-to-prototype',
    isSample: true,
    tag: 'process',
    publishedAt: '2026-09-10',
    readingMinutes: 5,
    cover: notebook,
    title: {
      en: 'From sketchbook to prototype: how an idea earns a build',
      'pt-pt': 'Do caderno ao protótipo: como uma ideia ganha direito a uma versão jogável',
    },
    excerpt: {
      en: 'Most of our ideas die in the notebook, and that is the point. A look at the filter every project has to pass.',
      'pt-pt':
        'A maioria das nossas ideias morre no caderno, e é essa a intenção. Um olhar sobre o filtro por que cada projeto tem de passar.',
    },
    body: {
      en: [
        {
          type: 'p',
          text: 'There is a black notebook on the desk with “better worlds?” scrawled on the cover. Almost everything starts there: a place, a mood, a half-sentence. Most of it never leaves the page.',
        },
        { type: 'h2', text: 'Three questions before any code' },
        {
          type: 'list',
          items: [
            'Can we describe the place in one sentence?',
            'Is there one feeling we want the player to carry home?',
            'Would we still want to make it if nobody else ever saw it?',
          ],
        },
        {
          type: 'p',
          text: 'If an idea survives those, it gets the smallest playable version we can build — often a single room, a single light, a single sound.',
        },
        {
          type: 'image',
          image: notebook,
          caption: {
            en: 'The sketchbook, the controller and the question on the cover.',
            'pt-pt': 'O caderno, o comando e a pergunta na capa.',
          },
        },
        { type: 'h2', text: 'Kill your darlings early' },
        {
          type: 'p',
          text: 'A prototype is not a promise. It is a cheap way to find out whether a feeling survives contact with a controller. When it does not, we close the notebook and start a new page.',
        },
        {
          type: 'p',
          text: 'This entry is a sample written to demonstrate the journal template. A real studio update will replace it.',
        },
      ],
      'pt-pt': [
        {
          type: 'p',
          text: 'Há um caderno preto em cima da secretária com «better worlds?» rabiscado na capa. Quase tudo começa ali: um lugar, um ambiente, meia frase. A maior parte nunca sai da página.',
        },
        { type: 'h2', text: 'Três perguntas antes de qualquer código' },
        {
          type: 'list',
          items: [
            'Conseguimos descrever o lugar numa só frase?',
            'Há uma sensação que queremos que o jogador leve para casa?',
            'Continuaríamos a querer fazê-lo se mais ninguém o visse?',
          ],
        },
        {
          type: 'p',
          text: 'Se uma ideia sobrevive a estas perguntas, ganha a versão jogável mais pequena que conseguimos construir — muitas vezes uma única sala, uma única luz, um único som.',
        },
        {
          type: 'image',
          image: notebook,
          caption: {
            en: 'The sketchbook, the controller and the question on the cover.',
            'pt-pt': 'O caderno, o comando e a pergunta na capa.',
          },
        },
        { type: 'h2', text: 'Desistir cedo do que amamos' },
        {
          type: 'p',
          text: 'Um protótipo não é uma promessa. É uma forma barata de descobrir se uma sensação sobrevive ao contacto com um comando. Quando não sobrevive, fechamos o caderno e começamos uma página nova.',
        },
        {
          type: 'p',
          text: 'Esta entrada é um exemplo escrito para demonstrar o modelo do diário. Será substituída por uma atualização real do estúdio.',
        },
      ],
    },
  },
  {
    slug: 'designing-with-grain',
    isSample: true,
    tag: 'art',
    publishedAt: '2026-08-27',
    readingMinutes: 4,
    cover: hoodie,
    title: {
      en: 'Designing with grain: the rough edges of the BlackMint identity',
      'pt-pt': 'Desenhar com grão: as arestas por limar da identidade BlackMint',
    },
    excerpt: {
      en: 'Mint on black, a leaf that is also a controller, and lettering that refuses to sit still. Notes on the visual language.',
      'pt-pt':
        'Menta sobre preto, uma folha que também é um comando e letras que se recusam a ficar quietas. Notas sobre a linguagem visual.',
    },
    body: {
      en: [
        {
          type: 'p',
          text: 'The BlackMint emblem is a leaf drawn with a dry brush. Look again and it is a controller: a d-pad on one side, four buttons on the other, a stem that cracks like lightning into the ground.',
        },
        { type: 'h2', text: 'One colour, used sparingly' },
        {
          type: 'p',
          text: 'Mint is the only accent we allow ourselves. Everything else lives in a narrow band between obsidian black and warm, slightly dirty off-white. When mint appears, it should feel like a light switched on in a dark room.',
        },
        {
          type: 'image',
          image: keyArt,
          caption: {
            en: 'Key art from the brand moodboard.',
            'pt-pt': 'Key art do moodboard da marca.',
          },
        },
        { type: 'h2', text: 'Imperfection is the system' },
        {
          type: 'list',
          items: [
            'Lettering is hand-drawn and never perfectly aligned.',
            'Textures carry grain, scratches and dust.',
            'Doodles — a crown, a star, an X, a controller — live in the margins.',
          ],
        },
        {
          type: 'p',
          text: 'This entry is a sample written to demonstrate the journal template. A real studio update will replace it.',
        },
      ],
      'pt-pt': [
        {
          type: 'p',
          text: 'O emblema da BlackMint é uma folha desenhada com pincel seco. Olhe outra vez e é um comando: uma cruz direcional de um lado, quatro botões do outro e um caule que racha como um relâmpago até ao chão.',
        },
        { type: 'h2', text: 'Uma só cor, usada com parcimónia' },
        {
          type: 'p',
          text: 'A menta é o único destaque que nos permitimos. Tudo o resto vive numa faixa estreita entre o preto obsidiana e um branco-sujo quente. Quando a menta aparece, deve parecer uma luz acesa num quarto escuro.',
        },
        {
          type: 'image',
          image: keyArt,
          caption: {
            en: 'Key art from the brand moodboard.',
            'pt-pt': 'Key art do moodboard da marca.',
          },
        },
        { type: 'h2', text: 'A imperfeição é o sistema' },
        {
          type: 'list',
          items: [
            'As letras são desenhadas à mão e nunca estão perfeitamente alinhadas.',
            'As texturas têm grão, riscos e pó.',
            'Os rabiscos — uma coroa, uma estrela, um X, um comando — vivem nas margens.',
          ],
        },
        {
          type: 'p',
          text: 'Esta entrada é um exemplo escrito para demonstrar o modelo do diário. Será substituída por uma atualização real do estúdio.',
        },
      ],
    },
  },
];

export const sortedArticles = (): Article[] =>
  [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

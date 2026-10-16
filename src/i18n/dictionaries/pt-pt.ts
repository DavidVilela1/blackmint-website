import type { Dictionary } from './en';

/**
 * Dicionário em português europeu (PT-PT).
 * Usa sempre a norma europeia: equipa, ecrã, registo, contacto, utilizador…
 * O tipo `Dictionary` garante que nenhuma chave fica por traduzir.
 */
export const ptPt: Dictionary = {
  meta: {
    siteName: 'BlackMint Interactive',
    titleTemplate: '%s — BlackMint Interactive',
    defaultTitle: 'BlackMint Interactive — Estúdio independente de videojogos',
    defaultDescription:
      'A BlackMint Interactive é um pequeno estúdio independente que cria mundos atmosféricos e feitos à mão para jogadores curiosos. Equipa pequena. Mundos grandes.',
    ogImageAlt:
      'Logótipo da BlackMint Interactive sobre uma paisagem desenhada à mão, iluminada pela lua, com as palavras «Equipa pequena. Mundos grandes.»',
    pages: {
      games: {
        title: 'Jogos',
        description:
          'Os mundos que estão a ganhar forma na BlackMint Interactive. Páginas de projeto, plataformas e estado só são publicados depois de confirmados.',
      },
      about: {
        title: 'Estúdio',
        description:
          'Quem é a BlackMint Interactive, como trabalha o estúdio e porque mantemos a equipa pequena e os mundos grandes.',
      },
      journal: {
        title: 'Diário',
        description:
          'Notas de desenvolvimento, experiências e bastidores escritos a partir da secretária da BlackMint Interactive.',
      },
      contact: {
        title: 'Contacto',
        description:
          'Fale com a BlackMint Interactive sobre colaborações, imprensa, testes de jogo ou qualquer outra ideia.',
      },
      privacy: {
        title: 'Política de privacidade',
        description: 'Como a BlackMint Interactive trata os dados pessoais neste website.',
      },
      terms: {
        title: 'Termos de utilização',
        description: 'Os termos que regem a utilização do website da BlackMint Interactive.',
      },
      cookies: {
        title: 'Política de cookies',
        description:
          'Que cookies utiliza o website da BlackMint Interactive, para quê e como alterar as suas escolhas.',
      },
      notFound: {
        title: 'Página não encontrada',
        description: 'Não foi possível encontrar esta página.',
      },
    },
  },

  a11y: {
    skipToContent: 'Saltar para o conteúdo',
    primaryNav: 'Principal',
    footerNav: 'Rodapé',
    legalNav: 'Informação legal',
    breadcrumb: 'Percurso de navegação',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    menuDialog: 'Menu do site',
    homeLink: 'BlackMint Interactive — página inicial',
    opensNewTab: '(abre num novo separador)',
    languageSwitcher: 'Escolher idioma',
    currentLanguage: 'idioma atual',
    scrollProgress: 'Progresso de leitura',
    placeholderArt: 'Ilustração provisória',
  },

  nav: {
    home: 'Início',
    games: 'Jogos',
    about: 'Estúdio',
    journal: 'Diário',
    contact: 'Contacto',
    menu: 'Menu',
    close: 'Fechar',
    language: 'Idioma',
  },

  common: {
    toBeConfirmed: 'A confirmar',
    placeholder: 'Provisório',
    conceptPlaceholder: 'Conceito provisório',
    sampleEntry: 'Entrada de exemplo',
    readMore: 'Ler mais',
    backToTop: 'Voltar ao topo',
    loading: 'A carregar…',
    close: 'Fechar',
    previous: 'Anterior',
    next: 'Seguinte',
    minutesRead: '{n} min de leitura',
    imageCount: 'Imagem {n} de {total}',
  },

  home: {
    hero: {
      eyebrow: 'Estúdio independente de videojogos',
      titleLineOne: 'Equipa pequena.',
      titleLineTwo: 'Mundos grandes.',
      annotation: 'Jogos indie para pessoas curiosas.',
      body: 'A BlackMint Interactive faz jogos atmosféricos e feitos à mão — com arestas por limar de propósito, criados por uma equipa pequena que prefere terminar algo estranho a lançar algo seguro.',
      primaryCta: 'Explorar os jogos',
      secondaryCta: 'Conhecer o estúdio',
      scroll: 'Deslizar',
    },
    ticker: [
      'Equipa pequena',
      'Mundos grandes',
      'Jogos indie para pessoas curiosas',
      'Os jogos tornam a vida mais interessante',
      'Mundos melhores?',
    ],
    statement: {
      label: 'Declaração do estúdio',
      text: 'Fazemos jogos como quem enche um caderno de esboços: à mão, um pouco tortos, sempre à procura da página que nos surpreende. Nada de mundos feitos por comissão. Nada de planos intermináveis. Só uma equipa pequena, ideias teimosas e lugares onde vale a pena perdermo-nos.',
      principles: [
        {
          title: 'Pequenos de propósito',
          body: 'Numa equipa pequena, cada decisão tem um rosto. Menos reuniões, mais trabalho feito e ninguém escondido atrás de um processo.',
        },
        {
          title: 'Mundos antes de funcionalidades',
          body: 'Começamos por um lugar e uma sensação e só depois procuramos as mecânicas que nos deixam viver lá — nunca ao contrário.',
        },
        {
          title: 'Arestas por limar',
          body: 'Traços de esboço, grão e formas imperfeitas fazem parte da nossa linguagem. O acabamento importa. A esterilidade, não.',
        },
      ],
    },
    games: {
      label: 'Na oficina',
      title: 'Mundos em esboço',
      intro:
        'Estes conceitos provisórios mostram como os projetos vão aparecer neste site. Não são jogos anunciados: títulos, plataformas e datas reais vão substituí-los quando forem confirmados.',
      viewAll: 'Todos os projetos',
      viewProject: 'Ver projeto',
      previewHint: 'Passe o cursor por um título para espreitar o mundo',
    },
    studio: {
      label: 'O estúdio',
      quote: 'Os jogos tornam a vida mais interessante.',
      body: 'A BlackMint começou com um caderno, um comando e uma pergunta rabiscada na capa: mundos melhores? Tudo o que fazemos é uma tentativa de resposta — jogos pequenos e pessoais, com o seu próprio clima, o seu próprio silêncio e o seu próprio sentido de humor.',
      cta: 'Sobre o estúdio',
      imageAlt:
        'Um caderno escuro ao lado de um comando com o emblema da BlackMint; na capa está escrito à mão «Better worlds?».',
      secondaryImageAlt:
        'Uma secretária de estúdio na penumbra, iluminada por luz verde, com um monitor a mostrar o emblema da BlackMint e a frase «Games make life more interesting» na parede.',
    },
    journal: {
      label: 'Diário de desenvolvimento',
      title: 'Notas da secretária',
      intro: 'Registos de desenvolvimento, experiências e um ou outro esboço torto.',
      cta: 'Ler o diário',
    },
    final: {
      title: 'Mundos melhores?',
      body: 'Achamos que sim. Acompanhe-os enquanto ganham forma — ou conte-nos o que construiria.',
      ctaGames: 'Ver os projetos',
      ctaContact: 'Entrar em contacto',
      channelsPending: 'Os canais oficiais do estúdio vão aparecer aqui quando estiverem ativos.',
      follow: 'Seguir o estúdio',
    },
  },

  games: {
    label: 'Projetos',
    heading: 'Mundos na oficina',
    intro:
      'Cada projeto da BlackMint começa como o esboço de um lugar. Quando um projeto estiver pronto para ser mostrado, terá aqui a sua própria página, apenas com informação confirmada.',
    placeholderNotice:
      'Os projetos abaixo são conceitos ilustrativos provisórios, usados para demonstrar esta página. Nenhum deles é um jogo anunciado.',
    genre: 'Género',
    platforms: 'Plataformas',
    status: 'Estado',
    statuses: {
      concept: 'Conceito provisório',
      prototype: 'Protótipo',
      inDevelopment: 'Em desenvolvimento',
      released: 'Lançado',
    },
    detail: {
      overview: 'Visão geral',
      world: 'O mundo',
      gameplay: 'Como se joga',
      gallery: 'Galeria',
      details: 'Detalhes do projeto',
      links: 'Ligações',
      noLinks: 'Ainda não há páginas de loja nem de imprensa.',
      back: 'Todos os projetos',
      placeholderNotice:
        '«{title}» é um conceito ilustrativo usado para demonstrar o modelo de página de projeto. Não é um jogo anunciado e não foi confirmada qualquer informação sobre jogabilidade, plataformas ou lançamento. O texto abaixo descreve apenas uma direção de conceito.',
      ctaTitle: 'Tem curiosidade sobre este mundo?',
      ctaBody: 'Pedidos de imprensa, colaboração e testes de jogo seguem pela página de contacto.',
      ctaButton: 'Contactar o estúdio',
      more: 'Outros mundos',
      openImage: 'Abrir a imagem {n} em tamanho maior',
      galleryDialog: '{title} — galeria',
    },
    empty: 'Ainda não há projetos listados. Volte em breve.',
  },

  about: {
    label: 'O estúdio',
    heading: 'Um pequeno estúdio com o vício do caderno de esboços',
    intro:
      'A BlackMint Interactive é um estúdio independente de videojogos. Fazemos jogos atmosféricos e feitos à mão para quem gosta de deambular, de se interrogar e de explorar os limites de um mundo.',
    whoTitle: 'Quem somos',
    whoBody: [
      'Somos uma equipa pequena de propósito. Não é uma fase de que estejamos a tentar sair; é a forma como gostamos de trabalhar. Uma equipa pequena consegue seguir uma ideia estranha até mais longe, mudar de direção numa tarde e manter um mundo coerente desde o primeiro esboço até à última linha de código.',
      'A nossa identidade vem do mesmo sítio que os nossos jogos: tinta, grão, letras imperfeitas e uma única cor teimosa. Menta sobre preto. Uma folha que também é um comando. Uma coroa rabiscada na margem.',
    ],
    teamPending:
      'Os perfis da equipa vão aparecer aqui quando a equipa estiver pronta para se apresentar.',
    factsTitle: 'O estúdio em factos',
    facts: {
      founded: 'Fundação',
      based: 'Sede',
      team: 'Dimensão da equipa',
    },
    approachTitle: 'Como trabalhamos',
    approach: [
      {
        step: 'Esboçar',
        body: 'Cada projeto começa no papel — um lugar, um ambiente, uma pergunta. Se não sobreviver ao caderno, não chega a ter uma versão jogável.',
      },
      {
        step: 'Prototipar',
        body: 'Construímos a versão jogável mais pequena possível dessa sensação e deitamos fora tudo o que não a serve.',
      },
      {
        step: 'Testar',
        body: 'Pessoas curiosas jogam cedo. Nós observamos, ouvimos e resistimos à vontade de explicar.',
      },
      {
        step: 'Afinar',
        body: 'Depois lixamos — com cuidado, para que as arestas que importam continuem por limar.',
      },
    ],
    beliefsTitle: 'Aquilo que nos importa',
    beliefs: [
      {
        title: 'A atmosfera é uma mecânica',
        body: 'A luz, o som e o silêncio trabalham tanto como qualquer sistema. Desenhamo-los em conjunto.',
      },
      {
        title: 'Curiosidade, não compulsão',
        body: 'Queremos que se continue a jogar por curiosidade sobre o que está para lá da colina, não porque um temporizador assim o manda.',
      },
      {
        title: 'Terminar o que se começa',
        body: 'Um jogo pequeno, terminado e honesto vale mais do que um enorme que nunca sai do papel.',
      },
    ],
    gallery: {
      setupAlt:
        'Uma secretária de estúdio à noite: um monitor com o emblema da BlackMint, esboços afixados na parede e uma planta a apanhar a luz verde.',
      notebookAlt:
        'Um caderno preto com esboços à mão do emblema da BlackMint e as palavras «Better worlds?», ao lado de um comando.',
      hoodieAlt:
        'Uma camisola com capuz preta com o emblema da BlackMint bordado a menta no peito.',
      caption: 'Do moodboard: o estúdio, o caderno, o merchandising.',
    },
    cta: {
      title: 'Quer fazer connosco algo estranho?',
      body: 'Gostamos sempre de ouvir outras equipas pequenas, artistas, músicos e pessoas curiosas.',
      button: 'Contactar o estúdio',
    },
  },

  journal: {
    label: 'Diário de desenvolvimento',
    heading: 'Notas da secretária',
    intro:
      'Atualizações de desenvolvimento, experiências, notas de processo e esboços dos bastidores do estúdio.',
    sampleNotice:
      'Estas entradas são exemplos ilustrativos que demonstram o modelo do diário. Vão ser substituídas por atualizações reais de desenvolvimento antes do lançamento.',
    readEntry: 'Ler entrada',
    published: 'Publicado',
    updated: 'Atualizado',
    back: 'Todas as entradas',
    more: 'Continuar a ler',
    empty: 'Ainda não há nada aqui. A primeira entrada está a ser escrita.',
    entrySampleNotice:
      'Esta é uma entrada de exemplo, escrita para demonstrar o modelo de artigo. Não é um anúncio real do estúdio.',
    tags: {
      process: 'Processo',
      design: 'Design',
      studio: 'Estúdio',
      art: 'Arte',
    },
  },

  contact: {
    label: 'Contacto',
    heading: 'Vamos falar de mundos.',
    intro:
      'Colaborações, imprensa, testes de jogo, uma pergunta sobre o nosso trabalho ou só uma ideia estranha de que achamos que vamos gostar — envie.',
    direct: 'Prefere email? Escreva para {email}.',
    notConnectedTitle: 'Este formulário ainda não está ligado',
    notConnectedBody:
      'O formulário de contacto ainda não foi ligado a uma caixa de correio do estúdio, por isso, de momento, as mensagens não podem ser entregues. Volte a tentar depois do lançamento.',
    form: {
      legend: 'A sua mensagem',
      name: 'Nome',
      email: 'Email',
      topic: 'Assunto',
      topics: {
        general: 'Pedido geral',
        collaboration: 'Colaboração',
        press: 'Imprensa e media',
        playtesting: 'Testes de jogo',
        other: 'Outro assunto',
      },
      message: 'Mensagem',
      messageHint: 'Pelo menos {min} caracteres.',
      acknowledgement:
        'Compreendo que os meus dados serão usados apenas para responder a esta mensagem, conforme descrito na',
      privacyLink: 'Política de privacidade',
      required: 'obrigatório',
      submit: 'Enviar mensagem',
      sending: 'A enviar…',
      honeypot: 'Deixe este campo em branco',
      errorSummary: 'Corrija o seguinte antes de enviar:',
    },
    validation: {
      nameRequired: 'Indique o seu nome.',
      nameTooLong: 'O nome deve ter menos de {max} caracteres.',
      emailRequired: 'Indique o seu endereço de email.',
      emailInvalid: 'Indique um endereço de email válido, por exemplo nome@exemplo.pt.',
      topicInvalid: 'Escolha um assunto.',
      messageRequired: 'Escreva uma mensagem.',
      messageTooShort: 'A mensagem está um pouco curta — escreva pelo menos {min} caracteres.',
      messageTooLong: 'A mensagem deve ter menos de {max} caracteres.',
      acknowledgementRequired: 'Confirme que leu como os seus dados são utilizados.',
    },
    status: {
      successTitle: 'Mensagem enviada.',
      successBody: 'Obrigado — a sua mensagem já está a caminho do estúdio.',
      sendAnother: 'Enviar outra mensagem',
      error: 'Ocorreu um erro e a mensagem não foi enviada. Volte a tentar daqui a pouco.',
      notConfigured:
        'A mensagem não foi enviada: o formulário de contacto ainda não está ligado a uma caixa de correio.',
      rateLimited: 'Demasiadas tentativas. Aguarde alguns minutos e volte a tentar.',
      invalid: 'Há campos que precisam de atenção. Reveja o formulário.',
    },
  },

  consent: {
    banner: {
      title: 'Cookies, com franqueza.',
      body: 'Usamos apenas o que o site precisa para funcionar. Com a sua autorização, também nos lembramos do seu idioma. Hoje não há ferramentas de análise nem de marketing ativas — se isso mudar, ficam desligadas a menos que as ative.',
      acceptAll: 'Aceitar tudo',
      rejectAll: 'Rejeitar opcionais',
      customize: 'Personalizar',
      policy: 'Política de cookies',
      label: 'Consentimento de cookies',
    },
    preferences: {
      title: 'Preferências de cookies',
      intro:
        'Escolha que cookies opcionais podemos usar. Pode mudar de ideias a qualquer momento em «Definições de cookies», no rodapé. Os cookies estritamente necessários estão sempre ativos porque o site não funciona sem eles.',
      alwaysOn: 'Sempre ativos',
      on: 'Ativado',
      off: 'Desativado',
      save: 'Guardar escolhas',
      acceptAll: 'Aceitar tudo',
      rejectAll: 'Rejeitar opcionais',
      saved: 'As suas escolhas de cookies foram guardadas.',
      policy: 'Ler a política de cookies',
      privacy: 'Política de privacidade',
      categories: {
        necessary: {
          title: 'Estritamente necessários',
          body: 'Fazem o site funcionar e guardam as escolhas de cookies que fizer aqui. Não podem ser desativados.',
        },
        preferences: {
          title: 'Preferências',
          body: 'Guardam escolhas como o idioma preferido, para que da próxima vez chegue à edição certa.',
        },
        analytics: {
          title: 'Análise',
          body: 'Ajudariam a perceber como o site é utilizado. Hoje não está instalada nenhuma ferramenta de análise; esta opção não tem efeito até uma ser adicionada e indicada na política de cookies.',
        },
        marketing: {
          title: 'Marketing',
          body: 'Permitiriam ferramentas de publicidade ou de redes sociais. Hoje não está instalada nenhuma; esta opção não tem efeito até uma ser adicionada e indicada na política de cookies.',
        },
      },
    },
    settings: 'Definições de cookies',
  },

  legal: {
    lastUpdated: 'Última atualização',
    draftTitle: 'Documento em rascunho',
    draftNotice:
      'Este documento é um modelo de trabalho. Tem de ser completado e revisto por um profissional jurídico qualificado antes do lançamento. Os campos destacados entre parênteses retos são marcadores para informação que ainda não foi confirmada.',
    contents: 'Nesta página',
    openFullPage: 'Abrir a página completa',
    related: 'Documentos relacionados',
  },

  footer: {
    tagline: 'Equipa pequena. Mundos grandes.',
    explore: 'Explorar',
    legal: 'Informação legal',
    contact: 'Contacto',
    contactForm: 'Usar o formulário de contacto',
    language: 'Idioma',
    follow: 'Seguir',
    rights: '© {year} BlackMint Interactive.',
    note: 'Jogos indie para pessoas curiosas.',
  },

  notFound: {
    code: '404',
    title: 'Perdido no nevoeiro.',
    body: 'Esta página saiu do mapa. Pode ter mudado de sítio ou talvez nunca tenha existido.',
    home: 'Voltar ao início',
    games: 'Explorar os jogos',
  },

  error: {
    title: 'Algo correu mal.',
    body: 'Um erro inesperado impediu esta página de carregar. Pode tentar de novo ou voltar ao início.',
    retry: 'Tentar de novo',
    home: 'Voltar ao início',
  },
};

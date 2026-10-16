import type { LegalLocaleContent } from './types';

/**
 * RASCUNHOS JURÍDICOS EM PORTUGUÊS EUROPEU — modelos que têm de ser
 * completados e revistos por um profissional jurídico qualificado antes do
 * lançamento. Não garantem a conformidade com qualquer lei.
 */
export const legalPtPt: LegalLocaleContent = {
  placeholders: {
    entityName: 'Denominação legal registada do responsável',
    registeredAddress: 'Morada da sede',
    companyNumber: 'Número de matrícula / NIPC',
    vatNumber: 'Número de IVA',
    privacyEmail: 'Email de contacto para privacidade',
    hostingProvider: 'Prestador de alojamento e local de alojamento',
    emailProvider: 'Prestador de envio de email',
    contactRetention: 'Prazo de conservação das mensagens de contacto',
    logRetention: 'Prazo de conservação dos registos do servidor',
    governingLaw: 'Lei aplicável e tribunais competentes',
  },
  links: {
    privacy: 'Política de privacidade',
    terms: 'Termos de utilização',
    cookies: 'Política de cookies',
    contact: 'página de contacto',
  },
  documents: {
    privacy: {
      title: 'Política de privacidade',
      intro:
        'Esta política explica que dados pessoais são tratados quando visita o website da BlackMint Interactive em {{siteUrl}}, para que fins e quais são os seus direitos. Aplica-se apenas a este website — cada jogo, plataforma ou serviço pode ter a sua própria informação de privacidade.',
      sections: [
        {
          id: 'controller',
          heading: '1. Quem é responsável pelos seus dados',
          blocks: [
            {
              type: 'p',
              text: 'O responsável pelo tratamento descrito nesta política é {{entityName}}, que opera com o nome BlackMint Interactive, com sede em {{registeredAddress}} (matrícula/NIPC {{companyNumber}}).',
            },
            {
              type: 'p',
              text: 'Para qualquer questão ou pedido relativo à privacidade, contacte {{privacyEmail}} ou utilize a {{link:contact}}.',
            },
          ],
        },
        {
          id: 'data',
          heading: '2. Que dados tratamos',
          blocks: [
            {
              type: 'list',
              items: [
                'Formulário de contacto: o nome, o endereço de email, o assunto e a mensagem que decidir enviar-nos.',
                'Dados técnicos: quando carrega uma página, o prestador de alojamento ({{hostingProvider}}) pode tratar automaticamente informação técnica como o endereço IP, o tipo de navegador, o URL pedido e a hora do pedido, por razões de segurança e para disponibilizar o site.',
                'Escolhas de cookies: um registo das categorias de cookies que aceitou ou rejeitou, guardado num cookie no seu dispositivo.',
                'Preferência de idioma: apenas se autorizar os cookies de preferências, a edição de idioma que escolheu.',
              ],
            },
            {
              type: 'p',
              text: 'Atualmente não utilizamos ferramentas de análise, publicidade ou rastreio de redes sociais neste website.',
            },
          ],
        },
        {
          id: 'purposes',
          heading: '3. Para que tratamos os dados e com que fundamento',
          blocks: [
            {
              type: 'list',
              items: [
                'Responder à sua mensagem — com base no nosso interesse legítimo em responder a pedidos, ou em diligências pré-contratuais a seu pedido (artigo 6.º, n.º 1, alíneas f) ou b), do RGPD).',
                'Funcionamento e segurança do website — com base no nosso interesse legítimo em disponibilizar um website seguro e funcional (artigo 6.º, n.º 1, alínea f), do RGPD).',
                'Guardar as suas escolhas de cookies — necessário para cumprir os requisitos de consentimento (artigo 6.º, n.º 1, alínea c), do RGPD e regras de privacidade eletrónica aplicáveis).',
                'Cookies de preferências e eventuais ferramentas futuras de análise ou marketing — apenas com o seu consentimento (artigo 6.º, n.º 1, alínea a), do RGPD), que pode retirar a qualquer momento.',
              ],
            },
          ],
        },
        {
          id: 'recipients',
          heading: '4. Quem recebe os seus dados',
          blocks: [
            {
              type: 'p',
              text: 'Não vendemos dados pessoais. Os dados podem ser tratados em nosso nome por prestadores de serviços que atuam como subcontratantes, ao abrigo de um acordo de tratamento de dados:',
            },
            {
              type: 'list',
              items: [
                'Alojamento do website: {{hostingProvider}}.',
                'Envio dos emails do formulário de contacto: {{emailProvider}}.',
              ],
            },
            {
              type: 'p',
              text: 'Se algum prestador tratar dados fora do Espaço Económico Europeu, recorreremos a uma garantia adequada, como uma decisão de adequação ou cláusulas contratuais-tipo, e descrevê-la-emos aqui.',
            },
          ],
        },
        {
          id: 'retention',
          heading: '5. Durante quanto tempo os conservamos',
          blocks: [
            {
              type: 'list',
              items: [
                'Mensagens de contacto: {{contactRetention}}.',
                'Registos do servidor: {{logRetention}}.',
                'Registo das escolhas de cookies: {{consentDays}} dias, após os quais voltamos a perguntar.',
                'Cookie de preferência de idioma: {{localeDays}} dias.',
              ],
            },
          ],
        },
        {
          id: 'rights',
          heading: '6. Os seus direitos',
          blocks: [
            {
              type: 'p',
              text: 'Nos termos do RGPD, tem direito de acesso aos seus dados, de retificação ou apagamento, de limitação ou oposição ao tratamento, de portabilidade e de retirar o consentimento a qualquer momento, sem comprometer a licitude do tratamento efetuado antes de o retirar.',
            },
            {
              type: 'p',
              text: 'Para exercer estes direitos, contacte {{privacyEmail}}. Tem também o direito de apresentar reclamação a uma autoridade de controlo — por exemplo, em Portugal, a Comissão Nacional de Proteção de Dados (CNPD), ou a autoridade do país onde reside ou trabalha.',
            },
          ],
        },
        {
          id: 'security',
          heading: '7. Segurança',
          blocks: [
            {
              type: 'p',
              text: 'O website é servido através de HTTPS, o formulário de contacto valida e limita os envios e as credenciais usadas para entregar mensagens ficam apenas no servidor. Nenhum método de transmissão ou armazenamento é totalmente seguro, mas trabalhamos para proteger os seus dados de forma adequada.',
            },
          ],
        },
        {
          id: 'children',
          heading: '8. Crianças',
          blocks: [
            {
              type: 'p',
              text: 'Este website não se dirige a crianças e não recolhemos intencionalmente dados pessoais de crianças através dele. Se acredita que uma criança nos enviou dados pessoais, contacte-nos para que os possamos apagar.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '9. Alterações a esta política',
          blocks: [
            {
              type: 'p',
              text: 'Podemos atualizar esta política quando o website ou a lei mudarem. A data no topo indica a versão mais recente. Alterações significativas que afetem o consentimento darão origem a um novo pedido de consentimento.',
            },
          ],
        },
      ],
    },

    terms: {
      title: 'Termos de utilização',
      intro:
        'Estes termos regem a utilização do website da BlackMint Interactive em {{siteUrl}}. Não regem qualquer jogo, demo, serviço ou plataforma — esses estão sujeitos aos seus próprios termos, contratos de licença (EULA) ou termos da plataforma.',
      sections: [
        {
          id: 'operator',
          heading: '1. Quem gere este website',
          blocks: [
            {
              type: 'p',
              text: 'Este website é gerido por {{entityName}} («BlackMint Interactive», «nós»), com sede em {{registeredAddress}}, matrícula/NIPC {{companyNumber}} e número de IVA {{vatNumber}}.',
            },
          ],
        },
        {
          id: 'use',
          heading: '2. Utilização do website',
          blocks: [
            {
              type: 'p',
              text: 'Pode navegar e partilhar ligações para este website para fins pessoais e não comerciais. Compromete-se a não o utilizar de forma abusiva — por exemplo, tentando perturbá-lo, obter acesso não autorizado, enviar spam através do formulário de contacto ou extrair conteúdos de forma que degrade o serviço.',
            },
          ],
        },
        {
          id: 'content',
          heading: '3. Conteúdos e marcadores provisórios',
          blocks: [
            {
              type: 'p',
              text: 'Alguns conteúdos deste website — incluindo projetos assinalados como «conceito provisório» e entradas do diário assinaladas como «exemplo» — são ilustrativos. Não anunciam um produto, não constituem uma proposta e não nos obrigam a lançar o que quer que seja. A informação confirmada é identificada como tal.',
            },
          ],
        },
        {
          id: 'ip',
          heading: '4. Propriedade intelectual',
          blocks: [
            {
              type: 'p',
              text: 'O nome BlackMint Interactive, o logótipo, o emblema, o lettering, as ilustrações, os textos e os restantes materiais deste website são nossos ou licenciados a nós e estão protegidos pela legislação de propriedade intelectual. Salvo quando a lei o permita, não os pode copiar, modificar ou reutilizar comercialmente sem a nossa autorização escrita. Os tipos de letra e recursos de terceiros são utilizados ao abrigo das respetivas licenças.',
            },
          ],
        },
        {
          id: 'submissions',
          heading: '5. Mensagens que nos envia',
          blocks: [
            {
              type: 'p',
              text: 'Quando nos contactar, não envie material confidencial nem ideias não solicitadas pelas quais espere ser remunerado. Podemos estar a trabalhar de forma independente em ideias semelhantes, e o envio de uma ideia não cria qualquer obrigação para nós. A forma como tratamos os dados pessoais da sua mensagem está descrita na {{link:privacy}}.',
            },
          ],
        },
        {
          id: 'links',
          heading: '6. Ligações para outros websites',
          blocks: [
            {
              type: 'p',
              text: 'Podemos incluir ligações para websites, lojas ou plataformas de terceiros. Não somos responsáveis pelos seus conteúdos, disponibilidade ou práticas, aplicando-se os respetivos termos e políticas de privacidade.',
            },
          ],
        },
        {
          id: 'liability',
          heading: '7. Disponibilidade e responsabilidade',
          blocks: [
            {
              type: 'p',
              text: 'Procuramos manter o website disponível e correto, mas disponibilizamo-lo «tal como está», sem garantir que funcione sem interrupções ou erros. Na medida permitida por lei, não somos responsáveis por danos indiretos resultantes da sua utilização. Nada nestes termos limita responsabilidades que não possam ser limitadas nos termos da lei aplicável, incluindo os direitos imperativos dos consumidores.',
            },
          ],
        },
        {
          id: 'law',
          heading: '8. Lei aplicável',
          blocks: [
            {
              type: 'p',
              text: 'Estes termos regem-se por {{governingLaw}}. Se for consumidor, mantém a proteção conferida pelas normas imperativas do seu país de residência.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '9. Alterações',
          blocks: [
            {
              type: 'p',
              text: 'Podemos atualizar estes termos. A data no topo indica a versão em vigor. Tem dúvidas? Utilize a {{link:contact}}.',
            },
          ],
        },
      ],
    },

    cookies: {
      title: 'Política de cookies',
      intro:
        'Os cookies são pequenos ficheiros de texto guardados no seu dispositivo. Esta política enumera todos os cookies definidos pelo website da BlackMint Interactive, para que servem e quanto tempo duram. Pode alterar as suas escolhas a qualquer momento em «Definições de cookies», no rodapé.',
      sections: [
        {
          id: 'categories',
          heading: '1. Categorias que utilizamos',
          blocks: [
            {
              type: 'list',
              items: [
                'Estritamente necessários — indispensáveis para o funcionamento do site e para guardar as suas escolhas de cookies. Sempre ativos.',
                'Preferências — guardam escolhas como o idioma. Apenas com o seu consentimento.',
                'Análise — não utilizados atualmente. Exigiriam o seu consentimento antes de qualquer ferramenta ser carregada.',
                'Marketing — não utilizados atualmente. Exigiriam o seu consentimento antes de qualquer ferramenta ser carregada.',
              ],
            },
          ],
        },
        {
          id: 'list',
          heading: '2. Cookies definidos por este website',
          blocks: [
            {
              type: 'table',
              caption: 'Todos os cookies são próprios e definidos por este website.',
              head: ['Nome', 'Finalidade', 'Categoria', 'Duração'],
              rows: [
                [
                  'bm_consent',
                  'Guarda as categorias de cookies que aceitou ou rejeitou e a versão da política que viu.',
                  'Estritamente necessários',
                  '{{consentDays}} dias',
                ],
                [
                  'bm_locale',
                  'Guarda a edição de idioma que escolheu, para a abrir da próxima vez.',
                  'Preferências',
                  '{{localeDays}} dias',
                ],
              ],
            },
            {
              type: 'p',
              text: 'Não são definidos cookies de análise, publicidade ou redes sociais. Não são carregados scripts de terceiros.',
            },
          ],
        },
        {
          id: 'third-parties',
          heading: '3. Prestador de alojamento',
          blocks: [
            {
              type: 'p',
              text: 'O nosso prestador de alojamento ({{hostingProvider}}) pode tratar dados técnicos para disponibilizar e proteger o site, conforme descrito na {{link:privacy}}. Se definir algum cookie próprio, será indicado aqui.',
            },
          ],
        },
        {
          id: 'manage',
          heading: '4. Gerir as suas escolhas',
          blocks: [
            {
              type: 'p',
              text: 'Utilize «Definições de cookies», no rodapé, para aceitar, rejeitar ou personalizar as categorias opcionais a qualquer momento. Retirar o consentimento remove os cookies correspondentes definidos por este website. Também pode apagar cookies nas definições do navegador; se apagar o bm_consent, voltaremos a pedir as suas escolhas.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '5. Alterações',
          blocks: [
            {
              type: 'p',
              text: 'Se adicionarmos uma ferramenta que utilize cookies, indicá-la-emos aqui antes de a ativar e voltaremos a pedir o seu consentimento quando necessário.',
            },
          ],
        },
      ],
    },
  },
};

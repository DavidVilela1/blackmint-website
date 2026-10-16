import type { LegalLocaleContent } from './types';

/**
 * ENGLISH LEGAL DRAFTS — templates that require completion and review by a
 * qualified legal professional before launch. They do not guarantee
 * compliance with any law.
 */
export const legalEn: LegalLocaleContent = {
  placeholders: {
    entityName: 'Registered legal name of the operator',
    registeredAddress: 'Registered address',
    companyNumber: 'Company registration number',
    vatNumber: 'VAT number',
    privacyEmail: 'Privacy contact email',
    hostingProvider: 'Hosting provider and hosting location',
    emailProvider: 'Email delivery provider',
    contactRetention: 'Retention period for contact messages',
    logRetention: 'Retention period for server logs',
    governingLaw: 'Governing law and competent courts',
  },
  links: {
    privacy: 'Privacy policy',
    terms: 'Terms of use',
    cookies: 'Cookie policy',
    contact: 'contact page',
  },
  documents: {
    privacy: {
      title: 'Privacy policy',
      intro:
        'This policy explains what personal data is processed when you visit the BlackMint Interactive website at {{siteUrl}}, why, and what rights you have. It covers this website only — each game, platform or service may have its own privacy notice.',
      sections: [
        {
          id: 'controller',
          heading: '1. Who is responsible for your data',
          blocks: [
            {
              type: 'p',
              text: 'The controller responsible for the processing described in this policy is {{entityName}}, operating under the name BlackMint Interactive, with its registered address at {{registeredAddress}} (company number {{companyNumber}}).',
            },
            {
              type: 'p',
              text: 'For any privacy question or request, contact {{privacyEmail}} or use the {{link:contact}}.',
            },
          ],
        },
        {
          id: 'data',
          heading: '2. What data we process',
          blocks: [
            {
              type: 'list',
              items: [
                'Contact form: the name, email address, topic and message you choose to send us.',
                'Technical data: when you load a page, the hosting provider ({{hostingProvider}}) may automatically process technical information such as your IP address, browser type, requested URL and time of the request, for security and to deliver the site.',
                'Cookie choices: a record of the cookie categories you accepted or rejected, stored in a cookie on your device.',
                'Language preference: only if you allow preference cookies, the language edition you chose.',
              ],
            },
            {
              type: 'p',
              text: 'We do not currently use analytics, advertising or social media tracking tools on this website.',
            },
          ],
        },
        {
          id: 'purposes',
          heading: '3. Why we process it and on what legal basis',
          blocks: [
            {
              type: 'list',
              items: [
                'Answering your message — based on our legitimate interest in responding to enquiries, or on steps taken at your request before entering into a contract (Article 6(1)(f) or 6(1)(b) GDPR).',
                'Operating and securing the website — based on our legitimate interest in providing a secure, working website (Article 6(1)(f) GDPR).',
                'Remembering your cookie choices — necessary to comply with consent requirements (Article 6(1)(c) GDPR and applicable e-privacy rules).',
                'Preference cookies and any future analytics or marketing tools — only with your consent (Article 6(1)(a) GDPR), which you can withdraw at any time.',
              ],
            },
          ],
        },
        {
          id: 'recipients',
          heading: '4. Who receives your data',
          blocks: [
            {
              type: 'p',
              text: 'We do not sell personal data. Data may be processed on our behalf by service providers acting as processors under a data processing agreement:',
            },
            {
              type: 'list',
              items: [
                'Website hosting: {{hostingProvider}}.',
                'Contact form email delivery: {{emailProvider}}.',
              ],
            },
            {
              type: 'p',
              text: 'If any provider processes data outside the European Economic Area, we will rely on an appropriate safeguard such as an adequacy decision or Standard Contractual Clauses, and describe it here.',
            },
          ],
        },
        {
          id: 'retention',
          heading: '5. How long we keep it',
          blocks: [
            {
              type: 'list',
              items: [
                'Contact messages: {{contactRetention}}.',
                'Server logs: {{logRetention}}.',
                'Cookie choice record: {{consentDays}} days, after which we ask again.',
                'Language preference cookie: {{localeDays}} days.',
              ],
            },
          ],
        },
        {
          id: 'rights',
          heading: '6. Your rights',
          blocks: [
            {
              type: 'p',
              text: 'Under the GDPR you have the right to access your data, to have it corrected or erased, to restrict or object to its processing, to data portability, and to withdraw consent at any time without affecting processing carried out before the withdrawal.',
            },
            {
              type: 'p',
              text: 'To exercise these rights, contact {{privacyEmail}}. You also have the right to lodge a complaint with a data protection supervisory authority — for example, in Portugal, the Comissão Nacional de Proteção de Dados (CNPD), or the authority where you live or work.',
            },
          ],
        },
        {
          id: 'security',
          heading: '7. Security',
          blocks: [
            {
              type: 'p',
              text: 'The website is served over HTTPS, the contact form validates and limits submissions, and secrets used to deliver messages are kept on the server only. No method of transmission or storage is completely secure, but we work to protect your data appropriately.',
            },
          ],
        },
        {
          id: 'children',
          heading: '8. Children',
          blocks: [
            {
              type: 'p',
              text: 'This website is not directed at children, and we do not knowingly collect personal data from children through it. If you believe a child has sent us personal data, please contact us so we can delete it.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '9. Changes to this policy',
          blocks: [
            {
              type: 'p',
              text: 'We may update this policy when the website or the law changes. The date at the top shows the latest version. Significant changes affecting consent will trigger a new consent request.',
            },
          ],
        },
      ],
    },

    terms: {
      title: 'Terms of use',
      intro:
        'These terms govern your use of the BlackMint Interactive website at {{siteUrl}}. They do not govern any game, demo, service or platform — those are covered by their own terms, licence agreements (EULAs) or platform terms.',
      sections: [
        {
          id: 'operator',
          heading: '1. Who operates this website',
          blocks: [
            {
              type: 'p',
              text: 'This website is operated by {{entityName}} (“BlackMint Interactive”, “we”), registered address {{registeredAddress}}, company number {{companyNumber}}, VAT number {{vatNumber}}.',
            },
          ],
        },
        {
          id: 'use',
          heading: '2. Using the website',
          blocks: [
            {
              type: 'p',
              text: 'You may browse and share links to this website for personal, non-commercial purposes. You agree not to misuse it — for example by attempting to disrupt it, gain unauthorised access, send spam through the contact form or scrape it in a way that degrades the service.',
            },
          ],
        },
        {
          id: 'content',
          heading: '3. Content and placeholders',
          blocks: [
            {
              type: 'p',
              text: 'Some content on this website — including projects marked as “concept placeholder” and journal entries marked as “sample” — is illustrative. It does not announce a product, constitute an offer or commit us to releasing anything. Confirmed information is labelled as such.',
            },
          ],
        },
        {
          id: 'ip',
          heading: '4. Intellectual property',
          blocks: [
            {
              type: 'p',
              text: 'The BlackMint Interactive name, logo, emblem, lettering, artwork, text and other materials on this website are owned by or licensed to us and are protected by intellectual property laws. Except where the law allows, you may not copy, modify or reuse them commercially without our written permission. Third-party fonts and assets are used under their own licences.',
            },
          ],
        },
        {
          id: 'submissions',
          heading: '5. Messages you send us',
          blocks: [
            {
              type: 'p',
              text: 'When you contact us, please do not send confidential material or unsolicited ideas you expect to be paid for. We may be working on similar ideas independently, and sending an idea does not create any obligation for us. How we handle the personal data in your message is described in the {{link:privacy}}.',
            },
          ],
        },
        {
          id: 'links',
          heading: '6. Links to other websites',
          blocks: [
            {
              type: 'p',
              text: 'We may link to third-party websites, stores or platforms. We are not responsible for their content, availability or practices, and their own terms and privacy notices apply.',
            },
          ],
        },
        {
          id: 'liability',
          heading: '7. Availability and liability',
          blocks: [
            {
              type: 'p',
              text: 'We aim to keep the website available and accurate but provide it “as is”, without guarantees that it will be uninterrupted or error-free. To the extent permitted by law, we are not liable for indirect losses arising from its use. Nothing in these terms limits liability that cannot be limited under applicable law, including mandatory consumer protection rights.',
            },
          ],
        },
        {
          id: 'law',
          heading: '8. Governing law',
          blocks: [
            {
              type: 'p',
              text: 'These terms are governed by {{governingLaw}}. If you are a consumer, you keep the protection of the mandatory laws of your country of residence.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '9. Changes',
          blocks: [
            {
              type: 'p',
              text: 'We may update these terms. The date at the top shows the current version. Questions? Use the {{link:contact}}.',
            },
          ],
        },
      ],
    },

    cookies: {
      title: 'Cookie policy',
      intro:
        'Cookies are small text files stored on your device. This policy lists every cookie the BlackMint Interactive website sets, what it is for and how long it lasts. You can change your choices at any time with “Cookie settings” in the footer.',
      sections: [
        {
          id: 'categories',
          heading: '1. Categories we use',
          blocks: [
            {
              type: 'list',
              items: [
                'Strictly necessary — required for the site to work and to remember your cookie choices. Always active.',
                'Preferences — remember choices such as your language. Only with your consent.',
                'Analytics — not in use today. Would require your consent before any tool is loaded.',
                'Marketing — not in use today. Would require your consent before any tool is loaded.',
              ],
            },
          ],
        },
        {
          id: 'list',
          heading: '2. Cookies set by this website',
          blocks: [
            {
              type: 'table',
              caption: 'All cookies are first-party and set by this website.',
              head: ['Name', 'Purpose', 'Category', 'Duration'],
              rows: [
                [
                  'bm_consent',
                  'Stores which cookie categories you accepted or rejected, and the policy version you saw.',
                  'Strictly necessary',
                  '{{consentDays}} days',
                ],
                [
                  'bm_locale',
                  'Remembers the language edition you chose, so you are sent to it next time.',
                  'Preferences',
                  '{{localeDays}} days',
                ],
              ],
            },
            {
              type: 'p',
              text: 'No analytics, advertising or social media cookies are set. No third-party scripts are loaded.',
            },
          ],
        },
        {
          id: 'third-parties',
          heading: '3. Hosting provider',
          blocks: [
            {
              type: 'p',
              text: 'Our hosting provider ({{hostingProvider}}) may process technical data to deliver and protect the site, as described in the {{link:privacy}}. If it sets any cookie of its own, it will be listed here.',
            },
          ],
        },
        {
          id: 'manage',
          heading: '4. Managing your choices',
          blocks: [
            {
              type: 'p',
              text: 'Use “Cookie settings” in the footer to accept, reject or customise optional categories at any time. Withdrawing consent removes the related cookies set by this website. You can also delete cookies in your browser settings; if you delete bm_consent, we will ask for your choices again.',
            },
          ],
        },
        {
          id: 'changes',
          heading: '5. Changes',
          blocks: [
            {
              type: 'p',
              text: 'If we add a tool that uses cookies, we will list it here before it is activated and ask for your consent again where required.',
            },
          ],
        },
      ],
    },
  },
};

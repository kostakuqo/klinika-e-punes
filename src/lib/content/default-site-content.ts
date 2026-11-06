import type { SiteContent, Localized } from "./content-types";

/**
 * Default content, used when Firestore is empty or not configured yet.
 * Albanian text comes from the old klinikaepunes.al site (typos corrected).
 * The seed script (scripts/seed-firestore.mjs) writes exactly this into
 * Firestore, and from then on everything is edited from the admin panel.
 */

const L = (sq: string, en: string, it: string): Localized => ({ sq, en, it });

export const defaultSiteContent: SiteContent = {
  settings: {
    name: "Klinika e Punës",
    phone: "+355 69 91 92 613",
    email: "info@klinikaepunes.al",
    facebook: "https://www.facebook.com/KlinikaPunes/",
    instagram: "",
    linkedin: "",
    address: L(
      "Spitali Italian Salus, Tiranë",
      "Salus Italian Hospital, Tirana",
      "Ospedale Italiano Salus, Tirana",
    ),
    hours: L("", "", ""),
    mapQuery: "Salus vidhe gjata",
    logoUrl: "",
  },

  // Off until the client uploads promo images in Admin → Promocionet
  promotions: { enabled: false, delaySeconds: 2, slides: [] },

  home: {
    seo: {
      title: L(
        "Klinika e Punës – Mjeku i punës për kompaninë tuaj",
        "Klinika e Punës – Occupational doctor for your company",
        "Klinika e Punës – Medico del lavoro per la tua azienda",
      ),
      description: L(
        "Mjeku i punës për kompani në Shqipëri: parandalim, vlerësim i riskut, mbikëqyrje shëndetësore dhe certifikata shëndetësore për punonjësit.",
        "Occupational health for companies in Albania: prevention, risk assessment, health surveillance and health certificates for employees.",
        "Medicina del lavoro per le aziende in Albania: prevenzione, valutazione dei rischi, sorveglianza sanitaria e certificati per i dipendenti.",
      ),
    },
    heroTitle: L(
      "Një e treta e ditës kalon në punë. Ne kujdesemi që të jetë e shëndetshme.",
      "A third of every day is spent at work. We make sure it's a healthy one.",
      "Un terzo della giornata si passa al lavoro. Ci assicuriamo che sia in salute.",
    ),
    heroLead: L(
      "Mjeku i punës parandalon dëmtimet e shëndetit nga rreziqet e ambientit dhe proceseve të punës, ndihmon stafin tuaj dhe kontrollon që ambientet e kompanisë të jenë në përputhje me ligjin.",
      "An occupational doctor prevents health damage from workplace risks, supports your staff and checks that your premises meet the legal requirements.",
      "Il medico del lavoro previene i danni alla salute dovuti ai rischi dell'ambiente e dei processi di lavoro, assiste il personale e verifica che gli ambienti aziendali siano a norma di legge.",
    ),
    heroImageUrl: "",
    servicesTitle: L(
      "Detyrat kryesore të mjekut të punës",
      "What an occupational doctor does",
      "I compiti principali del medico del lavoro",
    ),
    servicesIntro: L(
      "Katër fusha që mbulojmë për çdo kompani, nga zyra te kantieri.",
      "Four areas we cover for every company, from the office to the building site.",
      "Quattro ambiti che seguiamo per ogni azienda, dall'ufficio al cantiere.",
    ),
    processTitle: L(
      "Nga dita e parë e punës deri te raporti vjetor",
      "From an employee's first day to the yearly report",
      "Dal primo giorno di lavoro alla relazione annuale",
    ),
    processIntro: L(
      "Kështu e ndjekim shëndetin e çdo punonjësi gjatë gjithë kohës në kompaninë tuaj.",
      "This is how we follow each employee's health for as long as they work with you.",
      "Così seguiamo la salute di ogni dipendente per tutto il tempo che lavora con voi.",
    ),
    processSteps: [
      {
        title: L("Kontrolli para fillimit të punës", "Pre-employment check", "Visita preassuntiva"),
        text: L(
          "Kontrollojmë raportin mjeko-ligjor të punëmarrësit përpara se të fillojë punën.",
          "We review the employee's medico-legal report before they start work.",
          "Verifichiamo il certificato medico-legale del lavoratore prima dell'inizio del lavoro.",
        ),
      },
      {
        title: L("Kartela mjekësore", "Medical record", "Cartella sanitaria"),
        text: L(
          "Hapim kartelën mjekësore të punëmarrësit dhe mbajmë regjistrat përkatës.",
          "We open the employee's medical record and keep the required registers.",
          "Apriamo la cartella sanitaria del lavoratore e teniamo i registri previsti.",
        ),
      },
      {
        title: L("Kontrolle periodike", "Periodic check-ups", "Visite periodiche"),
        text: L(
          "Bëjmë kontrolle të rregullta dhe mbajmë korrespondencën me shoqëritë e sigurimit dhe qendrat e specializuara.",
          "We carry out regular check-ups and handle correspondence with insurers and specialist centres.",
          "Effettuiamo visite regolari e teniamo i rapporti con le assicurazioni e i centri specialistici.",
        ),
      },
      {
        title: L("Raporti vjetor i rreziqeve", "Yearly risk report", "Relazione annuale sui rischi"),
        text: L(
          "Të paktën një herë në vit kontrollojmë kushtet e punës dhe raportojmë nëse janë në përputhje me standardet.",
          "At least once a year we inspect working conditions and report whether they meet the standards.",
          "Almeno una volta l'anno controlliamo le condizioni di lavoro e segnaliamo se sono conformi agli standard.",
        ),
      },
    ],
    industriesTitle: L(
      "Punojmë me kompani nga këto sektorë",
      "We work with companies in these sectors",
      "Lavoriamo con aziende di questi settori",
    ),
    doctorsTitle: L("Mjekët e Klinikës së Punës", "Our doctors", "I nostri medici"),
    quote: L(
      "Shëndeti dhe siguria në punë nuk janë të rastësishme.",
      "Health and safety at work don't happen by chance.",
      "Salute e sicurezza sul lavoro non sono frutto del caso.",
    ),
    ctaTitle: L(
      "Keni nevojë për një mjek pune për kompaninë tuaj?",
      "Does your company need an occupational doctor?",
      "La vostra azienda ha bisogno di un medico del lavoro?",
    ),
    ctaText: L(
      "Na tregoni sa punonjës keni dhe në çfarë sektori punoni. Ju kthejmë përgjigje me një ofertë brenda një dite pune.",
      "Tell us how many employees you have and what sector you work in. We reply with an offer within one working day.",
      "Diteci quanti dipendenti avete e in quale settore operate. Rispondiamo con un'offerta entro un giorno lavorativo.",
    ),
  },

  pages: {
    about: {
      seo: {
        title: L("Rreth nesh – Klinika e Punës", "About us – Klinika e Punës", "Chi siamo – Klinika e Punës"),
        description: L(
          "Kush jemi dhe si punon mjeku i punës brenda kompanisë suaj.",
          "Who we are and how an occupational doctor works inside your company.",
          "Chi siamo e come lavora il medico del lavoro nella vostra azienda.",
        ),
      },
      title: L("Rreth nesh", "About us", "Chi siamo"),
      intro: L(
        "Mjeku i punës ka si detyrë themelore parandalimin e dëmtimit të shëndetit nga faktorët e rrezikut në ambientet dhe procedurat e punës.",
        "An occupational doctor's core task is preventing health damage caused by risks in the workplace and in work procedures.",
        "Il compito fondamentale del medico del lavoro è prevenire i danni alla salute causati dai rischi presenti negli ambienti e nelle procedure di lavoro.",
      ),
      body: L(
        "Mjeku siguron ndihmën e nevojshme për stafin dhe kontrollon vazhdimisht nëse ambientet e punës së kompanisë janë në përputhje me kërkesat e ligjit.\n\nAi është përgjegjës për evidentimin e gjendjes shëndetësore të stafit, për plotësimin e dosjeve mjekësore të punëmarrësve dhe për këshillimin e vazhdueshëm për çështjet e shëndetit dhe sigurisë.\n\nMjeku i punës është anëtar i këshillit të sigurisë që çdo ndërmarrje është e detyruar me ligj ta ketë, dhe raporton drejtpërdrejt te drejtori i përgjithshëm dhe zyra e burimeve njerëzore.",
        "The doctor supports your staff and continuously checks that the company's workplaces meet the legal requirements.\n\nThey are responsible for tracking the health of your staff, completing employees' medical files and giving ongoing advice on health and safety.\n\nThe occupational doctor sits on the safety council that every company is required by law to have, and reports directly to the general manager and the HR office.",
        "Il medico assiste il personale e verifica costantemente che gli ambienti di lavoro dell'azienda rispettino i requisiti di legge.\n\nÈ responsabile del monitoraggio dello stato di salute del personale, della compilazione delle cartelle sanitarie e della consulenza continua su salute e sicurezza.\n\nIl medico del lavoro fa parte del comitato per la sicurezza che ogni impresa è obbligata per legge ad avere e risponde direttamente al direttore generale e all'ufficio risorse umane.",
      ),
      imageUrl: "",
      heroImageUrl: "",
    },
    services: {
      seo: {
        title: L("Detyrat e mjekut të punës – Klinika e Punës", "Services – Klinika e Punës", "Servizi – Klinika e Punës"),
        description: L(
          "Parandalim, vlerësim i riskut, mbikëqyrje shëndetësore dhe certifikata shëndetësore.",
          "Prevention, risk assessment, health surveillance and health certificates.",
          "Prevenzione, valutazione dei rischi, sorveglianza sanitaria e certificati.",
        ),
      },
      title: L("Detyrat kryesore të mjekut të punës", "What we do for your company", "Cosa facciamo per la vostra azienda"),
      intro: L(
        "Çdo kompani ka rreziqe të ndryshme. Ne i vlerësojmë dhe ndërtojmë mbikëqyrjen shëndetësore rreth tyre.",
        "Every company has different risks. We assess them and build health surveillance around them.",
        "Ogni azienda ha rischi diversi. Li valutiamo e costruiamo la sorveglianza sanitaria intorno a essi.",
      ),
      body: L("", "", ""),
      imageUrl: "",
      heroImageUrl: "",
    },
    doctors: {
      seo: {
        title: L("Mjekët – Klinika e Punës", "Doctors – Klinika e Punës", "Medici – Klinika e Punës"),
        description: L("Njihuni me mjekët e Klinikës së Punës.", "Meet the doctors of Klinika e Punës.", "Conoscete i medici di Klinika e Punës."),
      },
      title: L("Mjekët tanë", "Our doctors", "I nostri medici"),
      intro: L(
        "Mjekë pune me përvojë në industri të ndryshme.",
        "Occupational doctors with experience across many industries.",
        "Medici del lavoro con esperienza in molti settori.",
      ),
      body: L("", "", ""),
      imageUrl: "",
      heroImageUrl: "",
    },
    clients: {
      seo: {
        title: L("Klientët tanë – Klinika e Punës", "Our clients – Klinika e Punës", "I nostri clienti – Klinika e Punës"),
        description: L(
          "Kompani nga prodhimi, ndërtimi, bankat, industria minerare dhe shumë sektorë të tjerë.",
          "Companies from manufacturing, construction, banking, mining and many other sectors.",
          "Aziende della produzione, dell'edilizia, delle banche, delle miniere e di molti altri settori.",
        ),
      },
      title: L("Klientët tanë", "Our clients", "I nostri clienti"),
      intro: L(
        "Nga fabrikat te bankat, çdo sektor ka rreziqet e veta dhe ne i njohim.",
        "From factories to banks, every sector has its own risks, and we know them.",
        "Dalle fabbriche alle banche, ogni settore ha i suoi rischi e noi li conosciamo.",
      ),
      body: L("", "", ""),
      imageUrl: "",
      heroImageUrl: "",
    },
    contact: {
      seo: {
        title: L("Kontakto – Klinika e Punës", "Contact – Klinika e Punës", "Contatti – Klinika e Punës"),
        description: L(
          "Telefon, email dhe adresa e Klinikës së Punës.",
          "Phone, email and address of Klinika e Punës.",
          "Telefono, email e indirizzo di Klinika e Punës.",
        ),
      },
      title: L("Kontakto", "Contact us", "Contatti"),
      intro: L(
        "Na telefononi ose na shkruani. Ju përgjigjemi brenda një dite pune.",
        "Call or write to us. We reply within one working day.",
        "Chiamateci o scriveteci. Rispondiamo entro un giorno lavorativo.",
      ),
      body: L("", "", ""),
      imageUrl: "",
      heroImageUrl: "",
    },
    book: {
      seo: {
        title: L("Rezervo një takim – Klinika e Punës", "Book an appointment – Klinika e Punës", "Prenota – Klinika e Punës"),
        description: L(
          "Rezervoni një takim me mjekun e punës për kompaninë tuaj.",
          "Book a meeting with an occupational doctor for your company.",
          "Prenotate un incontro con il medico del lavoro per la vostra azienda.",
        ),
      },
      title: L("Rezervo një takim", "Book an appointment", "Prenota un appuntamento"),
      intro: L(
        "Plotësoni formularin dhe ju kontaktojmë për të caktuar datën.",
        "Fill in the form and we will contact you to set a date.",
        "Compilate il modulo e vi contatteremo per fissare la data.",
      ),
      body: L("", "", ""),
      imageUrl: "",
      heroImageUrl: "",
    },
  },

  services: [
    {
      id: "parandalim",
      order: 1,
      icon: "shield",
      title: L("Parandalim", "Prevention", "Prevenzione"),
      text: L(
        "Mbrojmë shëndetin e punonjësve duke parandaluar dëmtimet që vijnë nga ekspozimi ndaj faktorëve të riskut në punë.",
        "We protect your employees' health by preventing the damage caused by exposure to workplace risks.",
        "Proteggiamo la salute dei dipendenti prevenendo i danni dovuti all'esposizione ai fattori di rischio sul lavoro.",
      ),
    },
    {
      id: "vleresim-i-riskut",
      order: 2,
      icon: "gauge",
      title: L("Vlerësim i riskut", "Risk assessment", "Valutazione dei rischi"),
      text: L(
        "Ndihmojmë punëdhënësin dhe shërbimin e parandalimit e mbrojtjes në vlerësimin e rreziqeve dhe në organizimin e mbikëqyrjes shëndetësore.",
        "We help the employer and the prevention and protection service assess risks and organise health surveillance.",
        "Supportiamo il datore di lavoro e il servizio di prevenzione e protezione nella valutazione dei rischi e nell'organizzazione della sorveglianza sanitaria.",
      ),
    },
    {
      id: "mbikeqyrje-shendetesore",
      order: 3,
      icon: "pulse",
      title: L("Mbikëqyrje shëndetësore", "Health surveillance", "Sorveglianza sanitaria"),
      text: L(
        "Administrojmë mbikëqyrjen shëndetësore për rreziqet specifike të përcaktuara sipas nenit 41 të ligjit.",
        "We manage health surveillance for the specific risks defined in Article 41 of the law.",
        "Gestiamo la sorveglianza sanitaria per i rischi specifici definiti dall'articolo 41 della legge.",
      ),
    },
    {
      id: "certifikata-shendetesore",
      order: 4,
      icon: "certificate",
      title: L("Certifikata shëndetësore", "Health certificates", "Certificati sanitari"),
      text: L(
        "I sigurojmë punëdhënësit certifikatat shëndetësore, duke respektuar sekretin profesional.",
        "We provide the employer with health certificates while respecting medical confidentiality.",
        "Forniamo al datore di lavoro i certificati sanitari nel rispetto del segreto professionale.",
      ),
    },
  ],

  doctors: [],

  industries: [
    L("Industria prodhuese", "Manufacturing", "Industria manifatturiera"),
    L("Banka dhe financa", "Banking and finance", "Banche e finanza"),
    L("Ndërtimi", "Construction", "Edilizia"),
    L("Tekstile dhe fasone", "Textiles and garment production", "Tessile e confezioni"),
    L("Industria minerare", "Mining", "Industria mineraria"),
    L("Nxjerrje dhe përpunim", "Extraction and processing", "Estrazione e lavorazione"),
    L("Teknologji dhe komunikim", "Technology and telecoms", "Tecnologia e comunicazioni"),
    L("Retail", "Retail", "Commercio al dettaglio"),
    L("Industria kimike", "Chemicals", "Industria chimica"),
    L("Biznes dhe shitje", "Business and sales", "Commercio e vendite"),
    L("Arsim", "Education", "Istruzione"),
    L("Shërbime profesionale", "Professional services", "Servizi professionali"),
  ].map((name, i) => ({ id: `industry-${i + 1}`, order: i + 1, name })),
};

import { Experience, Skill, Certification, Education, Project } from './types';

export const personalInfo = {
  fullName: 'Samuel Victor da Silva Nobre',
  shortName: 'Samuel Victor',
  title: 'IT Consultant',
  subtitle: 'Suporte Técnico, Redes & Infraestrutura',
  email: 'samuca.victor135@gmail.com',
  phone: '(85) 98511-0225',
  whatsappUrl: 'https://wa.me/5585985110225',
  linkedinUrl: 'https://www.linkedin.com/in/samuelnobree/',
  githubUrl: 'https://github.com/samueix', 
  location: 'Fortaleza e Região – CE',
  cnh: 'A & B (Possui moto própria)',
  availability: 'Aberto a novas oportunidades (Presencial, Híbrido ou Remoto)',
  english: 'Inglês Técnico (Leitura de documentação técnica, manuais e pesquisa de soluções)',
  experienceYears: 5,
  bio: 'Profissional de Tecnologia da Informação com sólida experiência em suporte técnico N1/N2, redes de computadores e telecomunicações. Atuo no diagnóstico e resolução de incidentes, manutenção de equipamentos críticos, configuração de redes corporativas e automação de processos. Possuo experiência no desenvolvimento de aplicações e ferramentas utilizando Python, integrações com APIs e Inteligência Artificial aplicada ao desenvolvimento como ferramenta de produtividade e auxílio na otimização de fluxos, buscando aumentar a eficiência operacional e a qualidade dos serviços prestados.',
  imageUrl: '/foto_perfil/samuel.png',
  cvPdfUrl: '/curriculo_pdf/curriculo.pdf',
  websiteUrl: 'https://samuel-victor-da-silva-nobre.vercel.app/',
  languages: [
    'Português – Nativo',
    'Inglês – Técnico (Leitura de documentação técnica, manuais e pesquisa de soluções)'
  ],
  tools: [
    'Visual Studio Code',
    'GitHub',
    'Notion',
    'Google Sheets com uso de Google Apps Script',
    'Telegram Bot API',
    'PyQt6'
  ]
};

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Analista de Operações de TI',
    company: 'LINKCE TELECOM',
    period: 'Fevereiro de 2022 – Presente',
    location: 'Maracanaú, CE',
    description: [
      'Atendimento consultivo e resolução de chamados de suporte técnico N1 e N2 para colaboradores internos e clientes externos.',
      'Triagem de incidentes, controle rigoroso de chamados de service desk e atualização ativa de cadastros operacionais.',
      'Gerenciamento dinâmico de rotas de atendimento técnico em campo, maximizando a produtividade das equipes externas.',
      'Identificação, diagnóstico e solução definitiva de anomalias em redes de computadores e equipamentos de telecomunicação.',
      'Colaboração na reengenharia de processos operacionais e mineração de dados para fornecer insights estruturados à gerência.'
    ],
    skills: ['Suporte Técnico N1/N2', 'Redes de Computadores', 'Gestão de Chamados', 'ITIL v4', 'Service Desk', 'Equipamentos de Rede']
  },
  {
    id: 'exp-2',
    role: 'Analista de Laboratório de Redes',
    company: 'LINKCE TELECOM',
    period: 'Julho de 2021 – Fevereiro de 2022',
    location: 'Maracanaú, CE',
    description: [
      'Atuação especializada em laboratório com foco em triagem, testes de estresse, manutenção e diagnóstico de falhas em ativos de rede.',
      'Validação e reparo físico/lógico em roteadores, switches, modems, ONUs, OLTs e equipamentos de medição óptica (OTDR e Power Meter).',
      'Homologação de equipamentos antes do envio para clientes, reduzindo chamados pós-instalação.',
      'Elaboração de relatórios técnicos detalhados sobre as falhas mais recorrentes para acionar garantias de fornecedores.'
    ],
    skills: ['Equipamentos de Telecomunicações', 'Instrumentação Óptica (OTDR / Power Meter)', 'Fibra Óptica Avançada', 'Diagnóstico de Hardware']
  },
  {
    id: 'exp-3',
    role: 'Suporte Técnico e Redes (Freelancer)',
    company: 'Solved It',
    period: 'Março de 2023 – Presente',
    location: 'Fortaleza e Região – CE (Presencial / Híbrido)',
    description: [
      'Desenho e execução de projetos de infraestrutura de redes locais (LAN) e redes Wi-Fi de alta densidade para PMEs.',
      'Instalação de cabeamento estruturado Cat6: conectorização, identificação física, organização de racks e fusões de fibra óptica.',
      'Certificação de pontos de rede seguindo normas técnicas nacionais, garantindo alta performance e imunidade a ruídos.',
      'Montagem, manutenção preventiva e formatação de computadores de alto desempenho e servidores de pequeno porte.'
    ],
    skills: ['Cabeamento Estruturado', 'Configuração de Wi-Fi', 'Equipamentos de Rede', 'Fusão de Fibra Óptica', 'Manutenção de Computadores']
  },
  {
    id: 'exp-4',
    role: 'Estagiário de Atendimento ao Cliente',
    company: 'Mundo Net',
    period: 'Junho de 2020 – Junho de 2021',
    location: 'Maracanaú, CE',
    description: [
      'Suporte técnico básico em primeiro nível por telefone e chat para usuários de internet banda larga residencial e corporativa.',
      'Auxílio no diagnóstico remoto de queda de conexão, configuração de roteadores em modo PPPoE e DHCP, e redefinições de Wi-Fi.',
      'Abertura e direcionamento correto de ordens de serviço complexas para a equipe de técnicos em campo.'
    ],
    skills: ['Atendimento ao Usuário', 'Suporte N1', 'Troubleshooting de Internet', 'Gestão de O.S.']
  }
];

export const skills: Skill[] = [
  // 1. Suporte Técnico & Operações de TI
  { name: 'Suporte Técnico N1/N2', level: 100, category: 'suporte' },
  { name: 'Service Desk & Atendimento ao Usuário', level: 100, category: 'suporte' },
  { name: 'Gestão de Chamados (SLA) & Metodologias ITIL', level: 100, category: 'suporte' },
  { name: 'Microsoft Windows & Sistemas Operacionais', level: 100, category: 'suporte' },
  { name: 'Diagnóstico de Incidentes & Resolução em Primeiro Contato', level: 100, category: 'suporte' },
  { name: 'Procedimentos Operacionais Padrão (POP)', level: 100, category: 'suporte' },
  { name: 'Active Directory (Conhecimento Teórico)', level: 100, category: 'suporte' },
  { name: 'Zabbix & pfSense (Conhecimento Teórico)', level: 100, category: 'suporte' },
  { name: 'Docker Containers (Conceito Teórico)', level: 100, category: 'suporte' },
  
  // 2. Telecomunicações & Redes Avançadas (Foco Prático: Equipamentos, OTDR, Power Meter, Fibra)
  { name: 'Equipamentos de Rede (Switches, Roteadores & Modems)', level: 100, category: 'redes' },
  { name: 'Instrumentação Óptica (OTDR - Reflectômetro Óptico)', level: 100, category: 'redes' },
  { name: 'Medição de Potência Óptica (Power Meter & VFL Caneta Óptica)', level: 100, category: 'redes' },
  { name: 'Fibra Óptica Avançada (FTTH / GPON / EPON / XGS-PON)', level: 100, category: 'redes' },
  { name: 'Fusão de Fibra Óptica (Máquina de Emenda por Arco Voltaico)', level: 100, category: 'redes' },
  { name: 'Infraestrutura Passiva Óptica (DIO, CTO, Splitters & Caixas de Emenda)', level: 100, category: 'redes' },
  { name: 'Configuração e Homologação de OLT & ONU', level: 100, category: 'redes' },
  { name: 'Wi-Fi Corporativo & Ecossistema UniFi (UEWA)', level: 100, category: 'redes' },
  { name: 'Cabeamento Estruturado Cat6, Patch Panels & Racks', level: 100, category: 'redes' },
  { name: 'Redes TCP/IP, Subredes, Roteamento & Protocolos (DNS/DHCP)', level: 100, category: 'redes' },

  // 3. Vibe Coding & Automação
  { name: 'Vibe Coding (Desenvolvimento com IA)', level: 100, category: 'desenvolvimento' },
  { name: 'Scripts Python com IA', level: 100, category: 'desenvolvimento' },
  { name: 'Automação de Processos com IA', level: 100, category: 'desenvolvimento' },
  { name: 'Integração de APIs REST via IA', level: 100, category: 'desenvolvimento' },
  { name: 'Front-end com IA (HTML/CSS/JS)', level: 100, category: 'desenvolvimento' },
  { name: 'Controle de Versão (Git & GitHub: samueix)', level: 100, category: 'desenvolvimento' },

  // 4. Inteligência Artificial
  { name: 'Vibe Coding & Prototipação Ágil', level: 100, category: 'ia' },
  { name: 'Engenharia de Prompt para Código', level: 100, category: 'ia' },
  { name: 'Ferramentas de IA (ChatGPT, Claude, Gemini)', level: 100, category: 'ia' },
  { name: 'Automação de Fluxos com IA', level: 100, category: 'ia' },
  { name: 'Depuração & Revisão de Código com IA', level: 100, category: 'ia' },

  // 5. Habilidades Pessoais (Soft Skills)
  { name: 'Resolução de Problemas', level: 100, category: 'soft' },
  { name: 'Comunicação Eficiente', level: 100, category: 'soft' },
  { name: 'Organização & Documentação', level: 100, category: 'soft' },
  { name: 'Proatividade', level: 100, category: 'soft' },
  { name: 'Trabalho em Equipe', level: 100, category: 'soft' },
  { name: 'Adaptabilidade', level: 100, category: 'soft' },
  { name: 'Pensamento Analítico', level: 100, category: 'soft' },
  { name: 'Aprendizado Contínuo', level: 100, category: 'soft' }
];

export const projects: Project[] = [
  {
    title: 'Cabeamento e Rede Estruturada do Posto de Gasolina J e L',
    description: 'Projeto e execução da infraestrutura de redes do Posto de Gasolina J e L, contemplando a conectorização e passagem de cabeamento Cat6, organização de rack principal, instalação de Wi-Fi corporativo de alta performance e montagem de canais de passagem metálicos, garantindo máxima imunidade a ruídos para os sistemas de bombas e computadores de PDV.',
    techStack: ['Cabeamento Estruturado', 'Redes de Computadores', 'Wi-Fi Corporativo', 'Infraestrutura']
  },
  {
    title: 'Sistema de Monitoramento de CTO em Python',
    description: 'Aplicação desenvolvida para otimizar o monitoramento técnico de caixas de terminação óptica (CTO), garantindo rápida identificação de quedas de potência e incidentes em tempo hábil.',
    techStack: ['Python', 'PyQt6', 'APIs', 'Monitoramento']
  },
  {
    title: 'Sistema Web para Gestão Financeira',
    description: 'Plataforma web intuitiva desenvolvida para controle eficiente de orçamentos, receitas e despesas com relatórios analíticos dinâmicos.',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Google Sheets', 'Apps Script']
  },
  {
    title: 'Desenvolvimento de Bots para Telegram',
    description: 'Criação de bots automatizados integrados à Telegram Bot API para notificações de status de infraestrutura em tempo real e facilitação de chamados técnicos.',
    techStack: ['Python', 'Telegram Bot API', 'Automação']
  },
  {
    title: 'Ferramentas Internas para Automação',
    description: 'Conjunto de scripts utilitários focados na eliminação de rotinas repetitivas de service desk e formatação automatizada de diagnósticos de redes.',
    techStack: ['Python', 'Shell Script', 'Git']
  },
  {
    title: 'Integração de APIs e Serviços Web',
    description: 'Construção de fluxos contínuos de dados entre sistemas internos e provedores externos por meio de requisições a APIs REST e tratamento estruturado de JSON.',
    techStack: ['Python', 'JSON', 'REST APIs', 'Automação']
  }
];

export const certifications: Certification[] = [
  {
    name: 'Ubiquiti Enterprise Wireless Admin (UEWA)',
    institution: 'Ubiquiti Academy',
    year: '2023',
    description: 'Certificação profissional focada na implementação de redes sem fio empresariais de alto desempenho.',
    bullets: [
      'Planejamento de RF e otimização de espectro eletromagnético.',
      'Configuração avançada de controladoras UniFi e múltiplos APs.',
      'Implementação de portais cativos para visitantes e redes corporativas seguras.'
    ]
  },
  {
    name: 'Fibra Óptica FTTH (GPON)',
    institution: 'Centro de Treinamento Técnico',
    year: '2025',
    description: 'Curso avançado em arquitetura, instalação e manutenção de redes de fibra óptica até a residência.',
    bullets: [
      'Técnicas de fusão por arco voltaico (splicing) e montagem de caixas de emenda.',
      'Diagnóstico avançado com uso de OTDR e Power Meter.',
      'Cálculo de orçamento de potência óptica (budget).'
    ]
  },
  {
    name: 'Metodologias e Boas Práticas ITIL & COBIT',
    institution: 'Capacitação Profissional',
    year: '2025',
    description: 'Alinhamento estratégico e operacional do suporte de TI com os objetivos de negócios.',
    bullets: [
      'Ciclo de vida do serviço: estratégia, desenho, transição, operação e melhoria.',
      'Processos de Gerenciamento de Incidentes, Problemas, Mudanças e Configuração.',
      'Gestão de acordos de nível de serviço (SLA).'
    ]
  },
  {
    name: 'Segurança da Informação e LGPD',
    institution: 'Formação Integrada',
    year: '2023',
    description: 'Conceitos fundamentais de proteção de dados, segurança cibernética e adequação à Lei Geral de Proteção de Dados.',
    bullets: [
      'Confidencialidade, Integridade, Disponibilidade (Tríade CID).',
      'Medidas de proteção contra engenharia social, phishing e malware.',
      'Diretrizes da LGPD para tratamento e segurança de dados pessoais.'
    ]
  }
];

export const educations: Education[] = [
  {
    degree: 'Tecnólogo em Cibersegurança (em andamento)',
    institution: 'Uniasselvi',
    period: '2023 – Presente',
    status: 'Em andamento',
    description: 'Curso superior focado na proteção cibernética de sistemas corporativos, análise de vulnerabilidades e resposta a incidentes.',
    bullets: [
      'Segurança em Redes e Sistemas Operacionais.',
      'Criptografia, Protocolos Seguros e Auditoria.',
      'Análise Forense Digital e Gestão de Riscos Cibernéticos.'
    ]
  },
  {
    degree: 'Tecnólogo em Análise e Desenvolvimento de Sistemas',
    institution: 'Faculdade Descomplica',
    period: '2022 – 2023',
    status: 'Cursado parcialmente',
    description: 'Formação em modelagem de sistemas de software, algoritmos e programação de computadores.',
    bullets: [
      'Lógica de programação e Estruturas de Dados.',
      'Arquitetura de Computadores e Engenharia de Requisitos.',
      'Bancos de Dados Relacionais e Não-Relacionais.'
    ]
  },
  {
    degree: 'Técnico em Redes de Computadores',
    institution: 'EEP Governador Gonzaga Mota',
    period: '2018 – 2020',
    status: 'Concluído',
    description: 'Ensino técnico integrado de alta carga horária prática voltado para montagem, configuração e gerência de redes.',
    bullets: [
      'Instalação e configuração de servidores Windows e Linux.',
      'Projetos de Redes Locais e de Longa Distância (WAN).',
      'Segurança de redes e cabeamento metálico/óptico estruturado.'
    ]
  }
];

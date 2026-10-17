export interface PersonalInfo {
  fullName: string;
  shortName: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  location: string;
  cnh: string;
  availability: string;
  english: string;
  experienceYears: number;
  bio: string;
  imageUrl?: string;
  cvPdfUrl?: string;
  websiteUrl?: string;
  languages?: string[];
  tools?: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface Skill {
  name: string;
  level: number; // 0-100 for visual progress bars or indicators
  category: 'suporte' | 'redes' | 'desenvolvimento' | 'ia' | 'soft';
}

export interface Project {
  title: string;
  description: string;
  techStack?: string[];
  link?: string;
}

export interface Certification {
  name: string;
  institution: string;
  year: string;
  description: string;
  bullets?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  status: 'Concluído' | 'Em andamento' | 'Incompleto' | 'Cursado parcialmente';
  description: string;
  bullets?: string[];
}

export interface Message {
  id: string;
  sender: string;
  email: string;
  company?: string;
  message: string;
  timestamp: string;
}

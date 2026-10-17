import React from 'react';
import { FolderGit2, LineChart, MessageSquare, Cpu, Radio, Code2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Project } from '../types';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const getProjectIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('cto') || lowerTitle.includes('monitoramento')) {
      return <Radio className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
    }
    if (lowerTitle.includes('financeira') || lowerTitle.includes('gestão')) {
      return <LineChart className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
    }
    if (lowerTitle.includes('bot') || lowerTitle.includes('telegram')) {
      return <MessageSquare className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
    }
    if (lowerTitle.includes('automação') || lowerTitle.includes('ferramentas')) {
      return <Cpu className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
    }
    if (lowerTitle.includes('api') || lowerTitle.includes('integração')) {
      return <Code2 className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
    }
    return <FolderGit2 className="w-5 h-5 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, idx) => (
        <motion.div 
          key={idx}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: idx * 0.05 }}
          className="bg-[#FFFFFF] border border-[#E6E1D6] border-l-4 border-l-[#0F766E] p-6 rounded-[12px] flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E] group"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-[#E6E1D6]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F1EEE6] flex items-center justify-center shrink-0">
                  {getProjectIcon(project.title)}
                </div>
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#4A5565]">
                  Case Técnico
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F1EEE6] text-[#0F766E] border border-[#E6E1D6]">
                #{String(idx + 1).padStart(2, '0')}
              </span>
            </div>
            
            <h3 className="text-lg font-bold font-display text-[#1B2430] mb-2 leading-snug group-hover:text-[#0F766E] transition-colors">
              {project.title}
            </h3>
            
            <p className="text-sm text-[#4A5565] leading-relaxed mb-5 font-medium">
              {project.description}
            </p>
          </div>

          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#E6E1D6] mt-auto">
              {project.techStack.map((tech, tIdx) => (
                <span 
                  key={tIdx} 
                  className="text-xs font-semibold px-3 py-1 bg-[#F1EEE6] text-[#1B2430] hover:bg-[#0F766E] hover:text-white rounded-full transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

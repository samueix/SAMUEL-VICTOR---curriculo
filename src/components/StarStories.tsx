import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  Edit2, 
  Trash2, 
  X, 
  HelpCircle, 
  Award,
  AlertCircle,
  FileText
} from 'lucide-react';

export interface StarStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  targetQuestion: string;
  createdAt: number;
}

const STORAGE_KEY = 'jobtracker_stories';
const MAX_STORIES = 8;

const INITIAL_STORIES: StarStory[] = [
  {
    id: 'star-1',
    title: 'Diagnóstico e Recuperação de Enlace Óptico com OTDR e Power Meter',
    situation: 'Durante a operação na LINKCE TELECOM, múltiplos clientes corporativos sofreram com lentidão e quedas intermitentes, sugerindo atenuação severa em uma rota de fibra óptica recém-instalada.',
    task: 'Localizar com exatidão o ponto de atenuação física no enlace óptico sem necessidade de substituição desnecessária de lances inteiros de cabo, respeitando a janela de SLA de 4 horas.',
    action: 'Utilizei o OTDR (Reflectômetro Óptico) para traçar a curva de atenuação e identifiquei uma perda anormal de 4.8 dB a exatos 3.2 km da central. Desloquei a equipe até a caixa de emenda (CTO) correspondente, verifiquei o raio de curvatura excessivo e realizei a nova fusão por arco voltaico com clivagem de precisão.',
    result: 'O enlace foi normalizado com perda inferior a 0.2 dB por fusão, restabelecendo a conexão dos clientes em menos de 2h30 e mitigando reincidência de chamados.',
    targetQuestion: 'Conte sobre uma situação de alta pressão em que você teve que diagnosticar e resolver um problema técnico complexo.',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'star-2',
    title: 'Implementação de Rede Wi-Fi Corporativa UniFi & Cabeamento Cat6',
    situation: 'No projeto do Posto de Gasolina J e L, a rede sem fio anterior apresentava instabilidades constantes devido a ruídos eletromagnéticos de motores e bombas, travando os terminais de pagamento (PDVs).',
    task: 'Desenhar e executar uma infraestrutura de rede corporativa de alta densidade e disponibilidade, protegendo o tráfego crítico dos sistemas de vendas.',
    action: 'Apliquei as boas práticas da certificação Ubiquiti Enterprise Wireless Admin (UEWA): realizei o planejamento de RF em 2.4/5GHz, instalei cabeamento Cat6 com blindagem e aterramento adequados, segmentei o tráfego em VLANs isoladas para PDVs e visitantes, e organizei o rack com patch panels etiquetados.',
    result: 'A operação de abastecimento e PDV alcançou 100% de estabilidade, sem registro de falhas ou chamados de instabilidade nos primeiros 6 meses após a entrega.',
    targetQuestion: 'Fale sobre um projeto que você planejou e entregou com sucesso.',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'star-3',
    title: 'Automação de Monitoramento e Alertas de CTOs em Python',
    situation: 'A equipe de suporte técnico e campo gastava muito tempo checando manualmente status e logs para identificar caixas de terminação óptica com perda de potência.',
    task: 'Otimizar o tempo operacional da equipe e reduzir o tempo médio de detecção de incidentes (MTTD).',
    action: 'Desenvolvi um script em Python integrado a APIs de mensageria (Telegram Bot API) e tratamento estruturado de JSON para monitorar os limites de sinal e disparar notificações imediatas aos técnicos.',
    result: 'O tempo de percepção de incidentes caiu de 30 minutos para menos de 2 minutos, permitindo atuação preventiva antes que os usuários finais notassem interrupção no serviço.',
    targetQuestion: 'Como você utiliza automação ou ferramentas digitais para melhorar processos de trabalho?',
    createdAt: Date.now() - 86400000 * 1
  }
];

export default function StarStories() {
  const [stories, setStories] = useState<StarStory[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [targetQuestion, setTargetQuestion] = useState('');
  const [formError, setFormError] = useState('');

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deletion modal
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStories(parsed);
          return;
        }
      }
      // If empty, initialize with pre-loaded authentic stories
      setStories(INITIAL_STORIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORIES));
    } catch (err) {
      console.warn('Erro ao carregar histórias STAR do localStorage:', err);
      setStorageError('Armazenamento local indisponível.');
      setStories(INITIAL_STORIES);
    }
  }, []);

  const saveStories = (updatedList: StarStory[]) => {
    setStories(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setStorageError(null);
    } catch (err) {
      console.warn('Erro ao salvar histórias:', err);
      setStorageError('Não foi possível gravar no armazenamento do navegador.');
    }
  };

  const handleOpenAddForm = () => {
    if (stories.length >= MAX_STORIES) {
      alert(`Você atingiu o limite de ${MAX_STORIES} histórias STAR. Edite ou exclua uma existente para adicionar outra.`);
      return;
    }
    setEditingId(null);
    setTitle('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setTargetQuestion('');
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (story: StarStory) => {
    setEditingId(story.id);
    setTitle(story.title);
    setSituation(story.situation);
    setTask(story.task);
    setAction(story.action);
    setResult(story.result);
    setTargetQuestion(story.targetQuestion);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !situation.trim() || !task.trim() || !action.trim() || !result.trim()) {
      setFormError('Por favor, preencha o título e os 4 campos do método STAR.');
      return;
    }

    if (editingId) {
      const updated = stories.map(st => {
        if (st.id === editingId) {
          return {
            ...st,
            title: title.trim(),
            situation: situation.trim(),
            task: task.trim(),
            action: action.trim(),
            result: result.trim(),
            targetQuestion: targetQuestion.trim() || 'Perguntas comportamentais gerais de entrevista técnica.'
          };
        }
        return st;
      });
      saveStories(updated);
    } else {
      const newStory: StarStory = {
        id: 'star-' + Date.now(),
        title: title.trim(),
        situation: situation.trim(),
        task: task.trim(),
        action: action.trim(),
        result: result.trim(),
        targetQuestion: targetQuestion.trim() || 'Perguntas comportamentais gerais de entrevista técnica.',
        createdAt: Date.now()
      };
      saveStories([...stories, newStory]);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = stories.filter(st => st.id !== id);
    saveStories(updated);
    setConfirmDeleteId(null);
  };

  const handleCopyStory = (story: StarStory) => {
    const formatted = `[HISTÓRIA STAR]: ${story.title}
Pergunta de Aplicação: ${story.targetQuestion}

1. SITUAÇÃO:
${story.situation}

2. TAREFA:
${story.task}

3. AÇÃO:
${story.action}

4. RESULTADO:
${story.result}`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(story.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Informative Header Box */}
      <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-5 rounded-[12px] space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#0F766E]">
            <Award className="w-5 h-5" strokeWidth={2.2} />
            <h4 className="font-display font-bold text-base text-[#1B2430]">
              Banco de Histórias STAR (Situação, Tarefa, Ação, Resultado)
            </h4>
          </div>

          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white border border-[#E6E1D6] text-[#0F766E] self-start sm:self-auto">
            {stories.length} de {MAX_STORIES} histórias cadastradas
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
          O método STAR é o formato padrão utilizado por entrevistadores e gestores de tecnologia para avaliar respostas comportamentais em processos seletivos. Tenha suas melhores conquistas estruturadas para responder com clareza e autoridade.
        </p>
      </div>

      {storageError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[10px] flex items-center gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{storageError}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-[#4A5565]">
          Suas Respostas Comportamentais
        </h5>

        <button
          onClick={handleOpenAddForm}
          disabled={stories.length >= MAX_STORIES}
          className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-transform shadow-xs ${
            stories.length >= MAX_STORIES
              ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
              : 'bg-[#0F766E] hover:bg-[#0C5F58] text-white hover:-translate-y-0.5 cursor-pointer'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Nova História ({stories.length}/{MAX_STORIES})</span>
        </button>
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {stories.map((story, idx) => {
          const isCopied = copiedId === story.id;

          return (
            <div
              key={story.id}
              className="bg-white border border-[#E6E1D6] rounded-[12px] p-5 shadow-xs space-y-4 hover:border-[#0F766E] transition-all"
            >
              {/* Story Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E1D6] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#F1EEE6] text-[#0F766E] text-xs font-bold flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <h4 className="font-display font-bold text-base text-[#1B2430]">
                      {story.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#0F766E] font-medium flex items-center gap-1.5 pt-0.5">
                    <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Aplica-se a: <em>"{story.targetQuestion}"</em></span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopyStory(story)}
                    aria-label={`Copiar história ${story.title}`}
                    className="px-3 py-1.5 bg-[#FFFBF2] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-[#4A5565]" />}
                    <span>{isCopied ? 'História Copiada!' : 'Copiar História'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditForm(story)}
                    aria-label={`Editar história ${story.title}`}
                    className="p-1.5 text-[#4A5565] hover:text-[#0F766E] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
                    title="Editar história"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setConfirmDeleteId(story.id)}
                    aria-label={`Excluir história ${story.title}`}
                    className="p-1.5 text-[#4A5565] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                    title="Excluir história"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* STAR 4 Grid Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px] space-y-1">
                  <span className="font-mono font-bold text-[10.5px] uppercase tracking-wider text-[#0F766E] block">
                    [S] Situação (Contexto & Desafio)
                  </span>
                  <p className="text-[#1B2430] font-sans">{story.situation}</p>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px] space-y-1">
                  <span className="font-mono font-bold text-[10.5px] uppercase tracking-wider text-[#0F766E] block">
                    [T] Tarefa (Sua Responsabilidade)
                  </span>
                  <p className="text-[#1B2430] font-sans">{story.task}</p>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px] space-y-1">
                  <span className="font-mono font-bold text-[10.5px] uppercase tracking-wider text-[#0F766E] block">
                    [A] Ação (O que você fez na prática)
                  </span>
                  <p className="text-[#1B2430] font-sans">{story.action}</p>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#E6E1D6] rounded-[8px] space-y-1">
                  <span className="font-mono font-bold text-[10.5px] uppercase tracking-wider text-emerald-700 block">
                    [R] Resultado (Impacto & Métricas)
                  </span>
                  <p className="text-[#1B2430] font-sans">{story.result}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-[#1B2430]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border border-[#E6E1D6] rounded-[16px] p-5 w-full max-w-sm shadow-xl space-y-4">
            <h5 className="font-display font-bold text-base text-[#1B2430]">
              Confirmar exclusão?
            </h5>
            <p className="text-xs text-[#4A5565] leading-relaxed">
              Tem certeza de que deseja remover esta história STAR?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-1.5 text-xs font-bold text-[#4A5565] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-[#1B2430]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-[#E6E1D6] rounded-[16px] w-full max-w-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 bg-[#FFFBF2] border-b border-[#E6E1D6] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-base text-[#1B2430]">
                  {editingId ? 'Editar História STAR' : 'Nova História STAR (Até 8)'}
                </h4>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-[#4A5565] hover:text-[#1B2430] hover:bg-[#F1EEE6] rounded-full transition-colors cursor-pointer"
                aria-label="Fechar formulário"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-4 sm:p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              {formError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-[6px] border border-rose-200 font-medium">
                  {formError}
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1B2430] mb-1">
                  Título da Conquista / Experiência <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Otimização de Rota Óptica FTTH com OTDR e Redução de Atenuação"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2430] mb-1">
                  Para qual pergunta de entrevista serve?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Conte sobre um momento em que precisou solucionar uma emergência de infraestrutura sob pressão."
                  value={targetQuestion}
                  onChange={(e) => setTargetQuestion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-[#0F766E] mb-1">
                    1. Situação (Qual era o cenário ou desafio?) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva o contexto onde o desafio aconteceu..."
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F766E] mb-1">
                    2. Tarefa (Qual era a sua meta ou responsabilidade?) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Qual era o objetivo específico que você precisava alcançar?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E] resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F766E] mb-1">
                    3. Ação (O que você fez na prática?) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ferramentas, comandos, equipamentos ou passos técnicos que você adotou..."
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-700 mb-1">
                    4. Resultado (Qual foi o impacto alcançado?) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Números, métricas, satisfação do cliente ou ausência de novos chamados..."
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-[8px] bg-[#FFFBF2] border border-[#E6E1D6] text-[#1B2430] focus:outline-none focus:border-[#0F766E] resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6E1D6]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-[#4A5565] hover:bg-[#F1EEE6] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-full text-xs font-bold transition-transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
                >
                  {editingId ? 'Salvar História' : 'Cadastrar História'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

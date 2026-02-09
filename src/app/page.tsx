'use client';

import Link from 'next/link';
import { useState } from 'react';

// FAQ Data
const faqItems = [
  {
    question: 'Como a IA realmente funciona?',
    answer:
      'A Mentora IA analisa todo o seu histórico de trades, identifica padrões comportamentais (horários, emoções, tipos de erro) e fornece feedback personalizado. Ela aprende com você e te orienta baseada nos SEUS dados reais.',
  },
  {
    question: 'Preciso de conhecimento prévio de trading?',
    answer:
      'O sistema é ideal para traders iniciantes a intermediários. Se você já sabe o básico (entrar/sair de trades), o sistema vai te ajudar a evoluir com disciplina e consistência.',
  },
  {
    question: 'Funciona com qualquer mercado?',
    answer:
      'Sim! Ações, mini índice, dólar, forex, crypto, opções. O sistema é agnóstico ao ativo. O foco é no SEU comportamento como trader, não no mercado específico.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer:
      'Claro. Não há fidelidade. Você pode cancelar a qualquer momento. Além disso, oferecemos 7 dias de garantia incondicional em todos os planos.',
  },
  {
    question: 'Como funciona a garantia de 7 dias?',
    answer:
      'Se dentro de 7 dias você não estiver satisfeito por QUALQUER motivo, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.',
  },
  {
    question: 'O sistema me dá sinais de compra/venda?',
    answer:
      'Não! Não somos grupo de sinais. O objetivo é te tornar um trader INDEPENDENTE e disciplinado. Você opera sua estratégia, nós te ajudamos a executá-la com consistência.',
  },
  {
    question: 'Funciona no celular?',
    answer:
      'Sim, a versão web é 100% responsiva e funciona perfeitamente no celular. App nativo iOS/Android está em desenvolvimento e será lançado em breve para assinantes.',
  },
  {
    question: 'Como faço para importar meus trades antigos?',
    answer:
      'Atualmente o sistema inicia do zero (por design, para autenticidade). Mas estamos desenvolvendo integração com MT5, corretoras e planilhas para importação automática.',
  },
];

// Pricing Data
const pricingPlans = [
  {
    name: 'Mensal',
    price: 'R$ 47',
    period: '/mês',
    economy: null,
    featured: false,
    badge: null,
    features: [
      'Acesso completo à Mentora IA',
      '6 gráficos interativos',
      'Checklist pré-trade',
      'Análise pós-trade',
      'Detecção de padrões',
      'Suporte via chat',
    ],
  },
  {
    name: 'Trimestral',
    price: 'R$ 97',
    period: '3 meses • R$ 32/mês',
    economy: 'Economize 30%',
    featured: true,
    badge: 'MAIS POPULAR',
    features: [
      'Tudo do plano Mensal',
      'Prioridade no suporte',
      'Relatórios mensais em PDF',
      'Acesso beta a novos recursos',
      'Badge exclusivo "Pro Trader"',
      'Garantia de 7 dias',
    ],
  },
  {
    name: 'Anual',
    price: 'R$ 297',
    period: '12 meses • R$ 25/mês',
    economy: 'Economize 47%',
    featured: false,
    badge: null,
    features: [
      'Tudo do plano Trimestral',
      'Consultoria 1-on-1 mensal',
      'Acesso vitalício à comunidade',
      'Templates de setup exclusivos',
      'Certificado de conclusão',
      'Suporte prioritário VIP',
    ],
  },
  {
    name: 'Vitalício',
    price: 'R$ 497',
    period: 'Pagamento único',
    economy: 'Acesso para sempre',
    featured: false,
    badge: 'MELHOR VALOR',
    features: [
      'TUDO incluído + atualizações vitalícias',
      'Todas as futuras funcionalidades',
      'Consultoria trimestral exclusiva',
      'Badge "Founding Member"',
      'Influência no roadmap do produto',
      'ROI garantido em 3 meses',
    ],
  },
];

// FAQ Accordion Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left font-semibold text-lg hover:bg-[var(--accent-primary)]/5 transition-colors"
      >
        <span>{question}</span>
        <div
          className={`w-8 h-8 bg-[var(--accent-primary)]/10 rounded-full flex items-center justify-center text-[var(--accent-primary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 py-4 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-gradient font-bold text-xl">MENTORA AI</div>
          <Link
            href="/register"
            className="px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              color: 'var(--bg-primary)',
            }}
          >
            Começar Agora
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 px-4 pb-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(106,79,240,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,255,136,0.1),transparent_40%)]" />

        <div className="relative max-w-4xl text-center z-10">
          {/* Badge */}
          <div className="inline-block px-5 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)] rounded-full text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-wide mb-8">
            A PRIMEIRA IA MENTORA PARA TRADERS DO BRASIL
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Pare de Repetir os <span className="text-gradient">Mesmos Erros</span> no Trading
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-3xl mx-auto">
            Sistema inteligente que analisa seus trades, identifica padrões de erro e te guia com IA
            para se tornar um trader consistente e lucrativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="px-10 py-4 rounded-xl font-bold text-lg uppercase transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,255,136,0.4)]"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                color: 'var(--bg-primary)',
              }}
            >
              Começar Gratuitamente
            </Link>
            <Link
              href="#features"
              className="px-10 py-4 rounded-xl font-semibold text-lg border-2 border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all hover:-translate-y-1"
            >
              Ver Como Funciona
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 justify-center pt-10 border-t border-white/10">
            <div className="text-center">
              <span className="text-4xl font-extrabold text-gradient block mb-1">80%</span>
              <span className="text-muted-foreground text-sm">Redução de Erros</span>
            </div>
            <div className="text-center">
              <span className="text-4xl font-extrabold text-gradient block mb-1">6</span>
              <span className="text-muted-foreground text-sm">Gráficos Interativos</span>
            </div>
            <div className="text-center">
              <span className="text-4xl font-extrabold text-gradient block mb-1">24/7</span>
              <span className="text-muted-foreground text-sm">Mentora IA Ativa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              O PROBLEMA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5">
              Por Que 90% dos Traders Perdem Dinheiro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Não é falta de conhecimento. É falta de disciplina, autoconhecimento e um sistema que te
              mostre exatamente onde você está errando.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔁',
                title: 'Erros Recorrentes',
                desc: 'Você comete os mesmos erros semana após semana, mas não consegue identificar o padrão sozinho.',
              },
              {
                icon: '😤',
                title: 'Falta de Disciplina',
                desc: 'Sabe as regras, mas não as segue. Emocional domina e você faz revenge trading sem perceber.',
              },
              {
                icon: '📊',
                title: 'Dados Sem Ação',
                desc: 'Planilhas cheias de dados, mas nenhum insight real. Você não sabe o que fazer com a informação.',
              },
              {
                icon: '🎯',
                title: 'Sem Feedback Real',
                desc: 'Ninguém te diz o que você está fazendo errado no momento certo, da forma certa.',
              },
              {
                icon: '📉',
                title: 'Inconsistência Total',
                desc: 'Uma semana ganha, duas perde. Não consegue manter resultados consistentes.',
              },
              {
                icon: '💸',
                title: 'Overtrading',
                desc: 'Opera demais, persegue mercado, não respeita seu plano. E a conta derrete.',
              },
            ].map((problem, index) => (
              <div
                key={index}
                className="bg-[var(--bg-secondary)] border border-[var(--accent-danger)]/30 rounded-2xl p-8 relative overflow-hidden transition-all hover:-translate-y-1 hover:border-[var(--accent-danger)]"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent-danger)] to-[#ff6b9d]" />
                <div className="text-4xl mb-5">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-[var(--accent-danger)]">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              A SOLUÇÃO
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5">Apresentamos: MENTORA AI</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              O primeiro sistema de mentoria inteligente que combina análise de dados, IA e psicologia
              do trading para transformar você em um trader profissional.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--accent-primary)]/5 border border-[var(--purple)]/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute -top-1/2 -right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(106,79,240,0.2),transparent)] rounded-full" />
            <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🤖',
                  title: 'IA que Te Conhece',
                  desc: 'Aprende seus padrões, identifica gatilhos emocionais e te orienta em tempo real.',
                },
                {
                  icon: '📊',
                  title: '6 Gráficos Inteligentes',
                  desc: 'Visualização clara de saldo, disciplina, win rate, volume, regras e resultados.',
                },
                {
                  icon: '✅',
                  title: 'Checklist Pré-Trade',
                  desc: 'Evita 80% dos erros antes mesmo de você apertar o botão de compra/venda.',
                },
                {
                  icon: '🎯',
                  title: 'Análise Pós-Trade',
                  desc: 'Feedback contextual: celebra vitórias, extrai lições de derrotas.',
                },
                {
                  icon: '🔍',
                  title: 'Pattern Recognition',
                  desc: 'Detecta erros recorrentes que você nem sabe que está cometendo.',
                },
                {
                  icon: '📈',
                  title: 'Dados Reais',
                  desc: 'Zero estatísticas falsas. Você começa do zero e constrói seu histórico real.',
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              FUNCIONALIDADES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Tudo Que Você Precisa em Um Só Lugar
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🤖',
                title: 'Mentora IA 24/7',
                desc: 'Converse com uma IA treinada especificamente para trading. Tire dúvidas, peça análises, receba conselhos baseados no SEU histórico real de trades.',
                highlight: 'Exclusivo',
              },
              {
                icon: '📊',
                title: 'Dashboard Completo',
                desc: '6 gráficos interativos que mostram evolução de saldo, score de disciplina, win rate, volume, cumprimento de regras e resultado por sessão.',
                highlight: 'Único no mercado',
              },
              {
                icon: '✅',
                title: 'Checklist Inteligente',
                desc: 'Antes de cada trade, um checklist personalizado garante que você está seguindo seu plano. Evita 80% dos erros por impulso.',
                highlight: 'Game changer',
              },
              {
                icon: '🎯',
                title: 'Feedback Contextual',
                desc: 'Ganhou? Recebe parabéns e análise do que fez certo. Perdeu? Reflexão guiada para extrair a lição. Nunca mais desperdice um trade.',
                highlight: 'Psicologia aplicada',
              },
              {
                icon: '🔍',
                title: 'Detecção de Padrões',
                desc: 'O sistema identifica automaticamente quando você comete o mesmo erro 3x ou mais. Te alerta antes que vire hábito destrutivo.',
                highlight: 'IA avançada',
              },
              {
                icon: '📈',
                title: 'Estatísticas Reais',
                desc: 'Começe com saldo zero. Construa seu histórico verdadeiro. Sem dados fictícios, sem ilusões. Apenas você e sua evolução real.',
                highlight: 'Autenticidade total',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--bg-secondary)] border border-white/10 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:border-[var(--accent-primary)] hover:shadow-[0_10px_40px_rgba(0,255,136,0.2)] relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] scale-x-0 group-hover:scale-x-100 transition-transform" />
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 rounded-xl flex items-center justify-center text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{feature.desc}</p>
                <span className="inline-block px-3 py-1 bg-[var(--accent-primary)]/10 rounded-full text-[var(--accent-primary)] text-sm font-semibold">
                  {feature.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              DIFERENCIAIS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Por Que a MENTORA AI é Única?</h2>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 sm:p-12">
            {[
              {
                title: '"A ÚNICA MENTORA DE IA PARA TRADERS DO BRASIL"',
                desc: 'Não existe outro sistema que combine IA conversacional + análise de padrões + feedback emocional específico para trading brasileiro.',
              },
              {
                title: '"ZERO ESTATÍSTICAS FAKE - COMECE DO ZERO REAL"',
                desc: 'Diferente de apps que mostram dados fictícios, você começa com saldo zero e constrói SEU histórico. Autenticidade completa.',
              },
              {
                title: '"6 GRÁFICOS QUE MOSTRAM EXATAMENTE ONDE VOCÊ ERRA"',
                desc: 'Saldo, disciplina, win rate, volume, regras, resultado por sessão. Tudo visualizado. Sem adivinhação.',
              },
              {
                title: '"CHECKLIST PRÉ-TRADE QUE EVITA 80% DOS ERROS"',
                desc: 'Baseado em ciência comportamental. Força você a pausar e pensar ANTES de apertar o botão.',
              },
              {
                title: '"ANÁLISE CONTEXTUAL: CELEBRA VITÓRIA, ENSINA NA DERROTA"',
                desc: 'Não é só registrar trades. É aprender com cada um deles através de feedback inteligente e emocional.',
              },
            ].map((diff, index) => (
              <div
                key={index}
                className="flex items-start gap-6 p-6 bg-background rounded-xl border border-white/5 mb-4 last:mb-0 transition-all hover:border-[var(--accent-primary)] hover:translate-x-2"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, var(--purple), var(--purple-light, #9b6fff))',
                  }}
                >
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[var(--accent-primary)]">{diff.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              DEPOIMENTOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">O Que Traders Reais Estão Dizendo</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                text: '"Finalmente um sistema que não me julga, mas me ensina. A IA identificou que eu fazia revenge trading toda quinta-feira. Desde que descobri isso, minha consistência triplicou."',
                name: 'Ricardo Costa',
                role: 'Day Trader • Mini Índice',
                initials: 'RC',
              },
              {
                text: '"Os 6 gráficos mudaram meu jogo. Eu achava que meu problema era setup, mas era disciplina. O score de disciplina me mostrou isso de forma clara e brutal."',
                name: 'Mariana Silva',
                role: 'Swing Trader • Ações',
                initials: 'MS',
              },
              {
                text: '"O checklist pré-trade salvou minha conta. Antes eu operava por impulso. Agora, se não passar no checklist, não entro. Simples assim."',
                name: 'Paulo Fernandes',
                role: 'Scalper • Dólar Futuro',
                initials: 'PF',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-[var(--bg-secondary)] border border-white/10 rounded-2xl p-8 relative"
              >
                <div className="absolute top-5 left-5 text-6xl text-[var(--accent-primary)]/10 font-serif">
                  "
                </div>
                <div className="relative z-10">
                  <div className="text-amber-400 text-lg mb-5">★★★★★</div>
                  <p className="text-muted-foreground leading-relaxed italic mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              PLANOS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-5">Escolha Seu Plano</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todos os planos incluem acesso completo à IA, gráficos, checklist e análises. Escolha a
              melhor opção para você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-[var(--bg-secondary)] border-2 rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:border-[var(--accent-primary)] hover:shadow-[0_20px_50px_rgba(0,255,136,0.2)] relative ${
                  plan.featured
                    ? 'border-[var(--accent-primary)] bg-gradient-to-br from-[var(--purple)]/20 to-[var(--accent-primary)]/10 lg:scale-105'
                    : 'border-white/10'
                }`}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      color: 'var(--bg-primary)',
                    }}
                  >
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="text-4xl font-extrabold text-gradient mb-2">{plan.price}</div>
                <div className="text-muted-foreground mb-2">{plan.period}</div>
                {plan.economy && (
                  <div className="inline-block px-3 py-1 bg-[var(--accent-primary)]/10 rounded-full text-[var(--accent-primary)] text-sm font-semibold mb-6">
                    {plan.economy}
                  </div>
                )}
                {!plan.economy && <div className="h-8 mb-6" />}
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-[var(--accent-primary)] font-bold text-lg">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="block w-full py-4 rounded-xl font-bold uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,255,136,0.4)]"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    color: 'var(--bg-primary)',
                  }}
                >
                  Começar Agora
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 text-muted-foreground space-y-2">
            <p>✅ 7 dias de garantia incondicional em todos os planos</p>
            <p>🔒 Ambiente 100% seguro e criptografado</p>
            <p>💳 Aceitamos cartão de crédito, PIX e boleto</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple)]/10 border border-[var(--purple)] rounded-full text-[var(--purple)] text-xs font-semibold uppercase tracking-wide mb-5">
              DÚVIDAS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Perguntas Frequentes</h2>
          </div>

          <div>
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--purple), var(--purple-light, #9b6fff))' }}
          >
            <div className="absolute -top-1/2 -right-20 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent)] rounded-full" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
                Pronto Para Se Tornar um Trader Consistente?
              </h2>
              <p className="text-lg mb-10 opacity-90">
                Junte-se a centenas de traders que já transformaram seus resultados com a MENTORA AI.
              </p>
              <Link
                href="/register"
                className="inline-block px-12 py-5 bg-white text-[var(--purple)] rounded-xl font-bold text-lg uppercase transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
              >
                Começar Minha Transformação Agora
              </Link>
              <p className="mt-6 text-sm opacity-80">
                ✅ 7 dias de garantia • ✅ Sem fidelidade • ✅ Suporte dedicado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-gradient font-bold text-2xl mb-4">MENTORA AI</div>
          <p className="text-muted-foreground mb-6">A primeira mentora de IA para traders do Brasil</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-10">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
          </div>
          <div className="pt-8 border-t border-white/10 text-muted-foreground text-sm">
            <p>© {new Date().getFullYear()} MENTORA AI. Todos os direitos reservados.</p>
            <p className="mt-2 text-xs">
              Este produto não oferece garantia de lucro. Trading envolve riscos e você pode perder
              dinheiro.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

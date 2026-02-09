import Link from 'next/link';

export const metadata = {
  title: 'Termos de Uso - MENTORA AI',
  description: 'Termos de Uso do sistema MENTORA AI',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para página inicial
      </Link>

      <header className="text-center mb-12 pb-8 border-b border-[var(--accent-primary)]/20">
        <h1 className="text-4xl font-bold text-gradient mb-4">Termos de Uso</h1>
        <p className="text-muted-foreground">Última atualização: 08 de fevereiro de 2024</p>
      </header>

      {/* Warning Box */}
      <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-lg mb-8">
        <p className="font-bold text-destructive mb-2">ATENÇÃO - LEIA COM CUIDADO:</p>
        <p className="text-muted-foreground">
          Este sistema é uma ferramenta educacional e de análise de trading. NÃO oferecemos garantia de lucro.
          Trading envolve riscos substanciais e você pode perder todo o seu capital. Ao usar este sistema,
          você reconhece e aceita todos os riscos envolvidos.
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">1. Aceitação dos Termos</h2>
          <p className="text-muted-foreground mb-4">
            Ao criar uma conta, acessar ou utilizar o sistema <strong className="text-foreground">MENTORA AI</strong>
            (&quot;Sistema&quot;, &quot;Plataforma&quot; ou &quot;Serviço&quot;), você (&quot;Usuário&quot;, &quot;Você&quot; ou &quot;Trader&quot;)
            concorda em cumprir e estar legalmente vinculado a estes Termos de Uso (&quot;Termos&quot;).
          </p>
          <p className="text-muted-foreground">
            Se você não concorda com qualquer parte destes termos, NÃO utilize o Sistema.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">2. Descrição do Serviço</h2>

          <h3 className="text-xl font-semibold mb-3">2.1 O Que É o MENTORA AI</h3>
          <p className="text-muted-foreground mb-4">O MENTORA AI é um sistema de mentoria inteligente que:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>Permite registro e acompanhamento de operações de trading</li>
            <li>Fornece análise de padrões comportamentais</li>
            <li>Oferece feedback através de inteligência artificial</li>
            <li>Gera gráficos e estatísticas sobre seu desempenho</li>
            <li>Auxilia na manutenção de disciplina operacional</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 O Que NÃO É o MENTORA AI</h3>
          <p className="text-muted-foreground mb-4">O Sistema NÃO é:</p>
          <ul className="text-muted-foreground space-y-2">
            <li>Consultoria de investimentos regulamentada</li>
            <li>Recomendação de compra ou venda de ativos</li>
            <li>Grupo de sinais ou &quot;dicas de trade&quot;</li>
            <li>Garantia de lucro ou rentabilidade</li>
            <li>Plataforma de execução de ordens</li>
            <li>Assessoria financeira personalizada</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">3. Elegibilidade</h2>
          <p className="text-muted-foreground mb-4">Para usar o Sistema, você deve:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Ter <strong className="text-foreground">18 anos ou mais</strong></li>
            <li>Ser capaz de celebrar contratos legalmente vinculantes</li>
            <li>Não estar proibido por lei de usar o serviço</li>
            <li>Residir em país onde o serviço é oferecido</li>
            <li>Fornecer informações verdadeiras e precisas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">4. Cadastro e Conta</h2>

          <h3 className="text-xl font-semibold mb-3">4.1 Criação de Conta</h3>
          <p className="text-muted-foreground mb-4">Para acessar o Sistema, você deve:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>Criar uma conta com informações verdadeiras e completas</li>
            <li>Manter suas informações atualizadas</li>
            <li>Proteger sua senha e credenciais de acesso</li>
            <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">4.2 Responsabilidade pela Conta</h3>
          <p className="text-muted-foreground mb-6">
            Você é <strong className="text-foreground">totalmente responsável</strong> por todas as atividades
            que ocorram em sua conta. Não compartilhe suas credenciais com terceiros.
          </p>

          <h3 className="text-xl font-semibold mb-3">4.3 Uma Conta por Pessoa</h3>
          <p className="text-muted-foreground">
            Cada usuário pode ter apenas <strong className="text-foreground">uma conta ativa</strong>.
            Contas duplicadas serão suspensas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">5. Pagamento e Assinatura</h2>

          <h3 className="text-xl font-semibold mb-3">5.1 Planos Disponíveis</h3>
          <p className="text-muted-foreground mb-4">Oferecemos os seguintes planos de assinatura:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Mensal:</strong> Renovação automática a cada mês</li>
            <li><strong className="text-foreground">Trimestral:</strong> Pagamento único para 3 meses</li>
            <li><strong className="text-foreground">Anual:</strong> Pagamento único para 12 meses</li>
            <li><strong className="text-foreground">Vitalício:</strong> Pagamento único com acesso permanente</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5.2 Garantia de 7 Dias</h3>
          <p className="text-muted-foreground">
            Oferecemos garantia incondicional de <strong className="text-foreground">7 dias</strong> a partir
            da primeira compra. Se você não estiver satisfeito, solicite reembolso integral via suporte@mentoraai.com.br.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">6. Uso Aceitável</h2>

          <h3 className="text-xl font-semibold mb-3">6.1 Você PODE</h3>
          <ul className="text-muted-foreground space-y-2 mb-6">
            <li className="text-green-400">Usar o Sistema para acompanhar suas próprias operações</li>
            <li className="text-green-400">Registrar quantos trades quiser</li>
            <li className="text-green-400">Exportar seus próprios dados</li>
            <li className="text-green-400">Interagir com a IA Mentora</li>
            <li className="text-green-400">Compartilhar suas conquistas pessoais</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">6.2 Você NÃO PODE</h3>
          <ul className="text-muted-foreground space-y-2">
            <li className="text-red-400">Compartilhar sua conta com outras pessoas</li>
            <li className="text-red-400">Revender acesso ao Sistema</li>
            <li className="text-red-400">Fazer engenharia reversa do código</li>
            <li className="text-red-400">Usar bots ou automação não autorizada</li>
            <li className="text-red-400">Tentar hackear, violar ou sobrecarregar o Sistema</li>
            <li className="text-red-400">Extrair dados de outros usuários</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">7. Isenção de Responsabilidade - RISCOS DE TRADING</h2>

          <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-lg mb-6">
            <p className="font-bold text-destructive mb-4">AVISO CRÍTICO DE RISCO:</p>
            <ul className="text-muted-foreground space-y-4">
              <li><strong className="text-foreground">TRADING É ARRISCADO.</strong> A negociação de ações, derivativos, forex, criptomoedas e outros ativos financeiros envolve risco substancial de perda. Você pode perder TODO o seu capital investido.</li>
              <li><strong className="text-foreground">SEM GARANTIA DE LUCRO.</strong> Este Sistema NÃO garante lucro, rentabilidade ou sucesso no trading. Resultados passados não garantem resultados futuros.</li>
              <li><strong className="text-foreground">NÃO SOMOS CONSULTORES.</strong> Não fornecemos consultoria de investimentos, recomendações de compra/venda ou aconselhamento financeiro personalizado.</li>
              <li><strong className="text-foreground">VOCÊ É RESPONSÁVEL.</strong> Todas as decisões de trading são suas. Você assume total responsabilidade por suas operações, lucros e perdas.</li>
              <li><strong className="text-foreground">CONSULTE PROFISSIONAIS.</strong> Antes de operar, consulte um assessor financeiro qualificado. Apenas invista dinheiro que você pode se dar ao luxo de perder.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">8. Privacidade e Proteção de Dados</h2>
          <p className="text-muted-foreground">
            O uso do Sistema também é regido por nossa{' '}
            <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">
              Política de Privacidade
            </Link>
            , que faz parte integrante destes Termos. Leia-a atentamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">9. Contato</h2>
          <p className="text-muted-foreground mb-4">Para dúvidas sobre estes Termos, entre em contato:</p>
          <ul className="text-muted-foreground space-y-2">
            <li><strong className="text-foreground">E-mail:</strong> juridico@mentoraai.com.br</li>
            <li><strong className="text-foreground">Suporte:</strong> suporte@mentoraai.com.br</li>
          </ul>
        </section>

        {/* Contact Box */}
        <div className="bg-card p-8 rounded-2xl text-center mt-12">
          <h3 className="text-xl font-semibold text-[var(--accent-primary)] mb-4">Dúvidas Jurídicas?</h3>
          <p className="text-muted-foreground mb-2">Entre em contato com nossa equipe jurídica:</p>
          <p className="text-foreground font-medium">juridico@mentoraai.com.br</p>
          <p className="text-muted-foreground text-sm mt-2">Respondemos em até 48 horas úteis.</p>
        </div>
      </div>
    </div>
  );
}

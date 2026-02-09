import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade - MENTORA AI',
  description: 'Política de Privacidade do sistema MENTORA AI - LGPD',
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gradient mb-4">Política de Privacidade</h1>
        <p className="text-muted-foreground">Última atualização: 08 de fevereiro de 2024</p>
      </header>

      {/* Highlight Box */}
      <div className="bg-[var(--accent-primary)]/10 border-l-4 border-[var(--accent-primary)] p-6 rounded-lg mb-8">
        <p className="font-bold text-[var(--accent-primary)] mb-2">Em resumo:</p>
        <p className="text-muted-foreground">
          Respeitamos sua privacidade. Coletamos apenas dados necessários para o funcionamento do sistema.
          Seus dados de trading são SEUS e permanecerão privados. Cumprimos integralmente a LGPD
          (Lei Geral de Proteção de Dados).
        </p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">1. Informações Gerais</h2>
          <p className="text-muted-foreground mb-4">
            Esta Política de Privacidade descreve como a <strong className="text-foreground">MENTORA AI</strong>
            (&quot;nós&quot;, &quot;nosso&quot; ou &quot;Empresa&quot;) coleta, usa, armazena e protege as informações pessoais
            dos usuários (&quot;você&quot; ou &quot;usuário&quot;) do nosso sistema de mentoria inteligente para traders.
          </p>
          <p className="text-muted-foreground">
            Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política.
            Se você não concorda, por favor, não utilize nosso sistema.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">2. Dados Coletados</h2>

          <h3 className="text-xl font-semibold mb-3">2.1 Dados de Cadastro</h3>
          <p className="text-muted-foreground mb-4">Coletamos as seguintes informações quando você se registra:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Nome completo:</strong> Para personalização da experiência</li>
            <li><strong className="text-foreground">E-mail:</strong> Para login, comunicação e recuperação de conta</li>
            <li><strong className="text-foreground">Telefone:</strong> Para suporte e notificações (opcional)</li>
            <li><strong className="text-foreground">Senha:</strong> Armazenada de forma criptografada (hash)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.2 Dados de Perfil de Trading</h3>
          <p className="text-muted-foreground mb-4">Durante o uso do sistema, você fornece:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Nível de experiência:</strong> Iniciante, intermediário ou avançado</li>
            <li><strong className="text-foreground">Objetivos de trading:</strong> Renda extra, profissionalização, etc.</li>
            <li><strong className="text-foreground">Configurações de conta:</strong> Saldo inicial, mercado, estratégia</li>
            <li><strong className="text-foreground">Horários de operação:</strong> Para análise de padrões comportamentais</li>
            <li><strong className="text-foreground">Regras pessoais:</strong> Para monitoramento de disciplina</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">2.3 Dados de Trades</h3>
          <p className="text-muted-foreground mb-4">Coletamos informações sobre suas operações:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Data e horário do trade</li>
            <li>Ativo negociado</li>
            <li>Tipo de operação (compra/venda)</li>
            <li>Resultado (lucro/prejuízo)</li>
            <li>Notas e observações pessoais</li>
            <li>Cumprimento de checklist pré-trade</li>
            <li>Análise pós-trade</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">3. Como Utilizamos Seus Dados</h2>

          <h3 className="text-xl font-semibold mb-3">3.1 Finalidades do Tratamento</h3>
          <p className="text-muted-foreground mb-4">Utilizamos seus dados para:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Fornecimento do serviço:</strong> Permitir acesso e uso do sistema de mentoria</li>
            <li><strong className="text-foreground">Personalização:</strong> Adaptar a IA às suas necessidades específicas</li>
            <li><strong className="text-foreground">Análise de padrões:</strong> Identificar erros recorrentes e comportamentos</li>
            <li><strong className="text-foreground">Geração de insights:</strong> Fornecer feedback inteligente baseado em dados</li>
            <li><strong className="text-foreground">Comunicação:</strong> Enviar notificações, atualizações e suporte</li>
            <li><strong className="text-foreground">Segurança:</strong> Detectar fraudes e proteger sua conta</li>
            <li><strong className="text-foreground">Melhoria contínua:</strong> Aprimorar funcionalidades e experiência</li>
            <li><strong className="text-foreground">Cumprimento legal:</strong> Atender obrigações legais e regulatórias</li>
          </ol>

          <h3 className="text-xl font-semibold mb-3">3.2 Base Legal (LGPD)</h3>
          <p className="text-muted-foreground mb-4">Tratamos seus dados com base em:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Consentimento:</strong> Você aceita esta política ao se cadastrar</li>
            <li><strong className="text-foreground">Execução de contrato:</strong> Necessário para prestar o serviço contratado</li>
            <li><strong className="text-foreground">Legítimo interesse:</strong> Melhoria do produto e segurança</li>
            <li><strong className="text-foreground">Obrigação legal:</strong> Quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">4. Compartilhamento de Dados</h2>

          <div className="bg-[var(--accent-primary)]/10 border-l-4 border-[var(--accent-primary)] p-6 rounded-lg mb-6">
            <p className="font-bold text-[var(--accent-primary)] mb-2">IMPORTANTE:</p>
            <p className="text-muted-foreground">
              Seus dados de trading (operações, estratégias, resultados) são 100% PRIVADOS.
              Nunca compartilhamos, vendemos ou divulgamos essas informações para terceiros.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-3">4.1 Com Quem Compartilhamos</h3>
          <p className="text-muted-foreground mb-4">Podemos compartilhar dados limitados com:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Provedores de infraestrutura:</strong> Servidores, bancos de dados (ex: Vercel, Neon)</li>
            <li><strong className="text-foreground">Processadores de pagamento:</strong> Stripe (apenas dados de cobrança)</li>
            <li><strong className="text-foreground">Ferramentas de comunicação:</strong> E-mail, suporte ao cliente</li>
            <li><strong className="text-foreground">Análise e métricas:</strong> Dados anonimizados</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">5. Armazenamento e Segurança</h2>

          <h3 className="text-xl font-semibold mb-3">5.1 Medidas de Segurança</h3>
          <p className="text-muted-foreground mb-4">Implementamos:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
            <li>Criptografia de dados em repouso</li>
            <li>Senhas armazenadas com hash (bcrypt)</li>
            <li>Backups regulares e redundância</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Controle de acesso baseado em funções</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">5.2 Tempo de Retenção</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Dados de cadastro:</strong> Enquanto sua conta estiver ativa</li>
            <li><strong className="text-foreground">Dados de trading:</strong> Enquanto sua conta estiver ativa</li>
            <li><strong className="text-foreground">Logs de acesso:</strong> 12 meses</li>
            <li><strong className="text-foreground">Dados financeiros:</strong> 5 anos (exigência legal)</li>
            <li><strong className="text-foreground">Após cancelamento:</strong> 30 dias para recuperação, depois deletados permanentemente</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="text-muted-foreground mb-4">De acordo com a LGPD, você tem direito a:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
            <li><strong className="text-foreground">Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
            <li><strong className="text-foreground">Anonimização, bloqueio ou eliminação:</strong> De dados desnecessários ou excessivos</li>
            <li><strong className="text-foreground">Portabilidade:</strong> Receber seus dados em formato estruturado (JSON, CSV)</li>
            <li><strong className="text-foreground">Eliminação:</strong> Solicitar exclusão de dados tratados com seu consentimento</li>
            <li><strong className="text-foreground">Revogação de consentimento:</strong> Retirar consentimento a qualquer momento</li>
            <li><strong className="text-foreground">Oposição:</strong> Se opor a tratamento realizado sem consentimento</li>
            <li><strong className="text-foreground">Revisão de decisões automatizadas:</strong> Questionar decisões baseadas apenas em IA</li>
          </ol>

          <h3 className="text-xl font-semibold mb-3">6.1 Como Exercer Seus Direitos</h3>
          <p className="text-muted-foreground mb-2">Para exercer qualquer um desses direitos, envie um e-mail para:</p>
          <p className="text-[var(--accent-primary)] font-medium mb-2">privacidade@mytradementorai.com.br</p>
          <p className="text-muted-foreground">Responderemos em até <strong className="text-foreground">15 dias úteis</strong>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">7. Cookies</h2>

          <h3 className="text-xl font-semibold mb-3">7.1 Tipos de Cookies Utilizados</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
            <li><strong className="text-foreground">Essenciais:</strong> Necessários para funcionamento do sistema (login, sessão)</li>
            <li><strong className="text-foreground">Funcionais:</strong> Lembram preferências (tema, idioma)</li>
            <li><strong className="text-foreground">Analíticos:</strong> Medem uso e performance</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">7.2 Gerenciamento de Cookies</h3>
          <p className="text-muted-foreground">
            Você pode gerenciar cookies através das configurações do seu navegador.
            Desabilitar cookies essenciais pode afetar o funcionamento do sistema.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">8. Menores de Idade</h2>
          <p className="text-muted-foreground">
            Nosso serviço é destinado a <strong className="text-foreground">maiores de 18 anos</strong>.
            Não coletamos intencionalmente dados de menores. Se identificarmos dados de menores, excluiremos imediatamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">9. Mudanças nesta Política</h2>
          <p className="text-muted-foreground mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente. Quando houver mudanças significativas:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Notificaremos por e-mail</li>
            <li>Exibiremos aviso destacado no sistema</li>
            <li>Atualizaremos a data no topo desta página</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">10. Legislação e Foro</h2>
          <p className="text-muted-foreground mb-4">Esta Política é regida pelas leis brasileiras, especialmente:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD)</li>
            <li>Lei nº 12.965/2014 (Marco Civil da Internet)</li>
            <li>Lei nº 8.078/1990 (Código de Defesa do Consumidor)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[var(--accent-primary)] mb-4">11. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
          <p className="text-muted-foreground mb-4">
            Você também pode apresentar reclamações à ANPD caso considere que seus direitos não foram respeitados:
          </p>
          <p className="text-muted-foreground">
            <strong className="text-foreground">Site:</strong>{' '}
            <a
              href="https://www.gov.br/anpd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:underline"
            >
              www.gov.br/anpd
            </a>
          </p>
        </section>

        {/* Contact Box */}
        <div className="bg-card p-8 rounded-2xl text-center mt-12">
          <h3 className="text-xl font-semibold text-[var(--accent-primary)] mb-4">Dúvidas sobre Privacidade?</h3>
          <p className="text-muted-foreground mb-2">Entre em contato conosco:</p>
          <p className="text-foreground font-medium">privacidade@mytradementorai.com.br</p>
          <p className="text-muted-foreground text-sm mt-2">Estamos aqui para esclarecer qualquer questão sobre seus dados.</p>
        </div>
      </div>
    </div>
  );
}

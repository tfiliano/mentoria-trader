import Link from 'next/link';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5512991037545';

export default function ForgotPasswordPage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Preciso redefinir minha senha no MENTORA AI')}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-gradient">
            MENTORA AI
          </Link>
          <p className="mt-2 text-muted-foreground">Recuperar senha</p>
        </div>

        <div className="card-glass p-8 rounded-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-muted">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold mb-4">Esqueceu sua senha?</h2>
          <p className="text-muted-foreground mb-6">
            Entre em contato com o suporte para redefinir sua senha.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 rounded-lg font-semibold text-center transition-all hover:scale-[1.02] mb-4"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: 'white',
            }}
          >
            Falar no WhatsApp
          </a>

          <Link
            href="/login"
            className="block w-full py-3 rounded-lg font-semibold text-center bg-muted hover:bg-muted/80 transition-colors"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  );
}

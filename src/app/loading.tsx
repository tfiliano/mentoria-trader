export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 relative">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: 'var(--accent-primary)', borderTopColor: 'transparent' }}
          />
        </div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </main>
  );
}

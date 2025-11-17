export const metadata = { title: 'Confirmar e-mail · BJJ Academy' };

export default function ConfirmarEmailPage() {
  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/70">Confirmação</p>
          <h1 className="text-2xl font-semibold">Verifique seu e-mail</h1>
          <p className="text-sm text-bjj-gray-200/70">Clique no link enviado para ativar sua conta.</p>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 text-sm text-bjj-gray-200/80">
          Este fluxo é mockado no momento. Quando a API estiver pronta, validaremos o token enviado por e-mail e liberaremos o acesso automático.
        </div>
      </div>
    </div>
  );
}

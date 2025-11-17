export const metadata = { title: 'Recuperar senha · BJJ Academy' };

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/70">Recuperar acesso</p>
          <h1 className="text-2xl font-semibold">Redefina sua senha</h1>
          <p className="text-sm text-bjj-gray-200/70">
            Informe o e-mail cadastrado para enviarmos as instruções de redefinição.
          </p>
        </div>
        <form className="space-y-4 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6">
          <label className="space-y-2 text-sm text-bjj-gray-200">
            <span>E-mail</span>
            <input
              type="email"
              required
              className="input input-bordered w-full bg-bjj-gray-800/60 text-bjj-white"
              placeholder="voce@bjj.academy"
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">Enviar instruções</button>
        </form>
      </div>
    </div>
  );
}

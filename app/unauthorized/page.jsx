export const metadata = {
  title: 'Acesso não autorizado · BJJ Academy'
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bjj-black px-6 text-center text-bjj-white">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Acesso negado</p>
        <h1 className="text-2xl font-semibold">Você não possui permissão para acessar esta área.</h1>
        <p className="text-sm text-bjj-gray-200/70">
          Entre com um usuário que tenha os papéis corretos ou solicite habilitação ao administrador da academia.
        </p>
      </div>
      <a href="/login" className="btn btn-primary px-6 text-sm">
        Voltar para o login
      </a>
    </div>
  );
}

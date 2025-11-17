export const metadata = {
  title: 'Usuários · BJJ Academy'
};

export default function UsuariosPage() {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6">
        <h1 className="text-xl font-semibold text-bjj-white">Usuários</h1>
        <p className="text-sm text-bjj-gray-200/70">
          Área administrativa para gestão de perfis. Integração real será conectada ao backend futuramente.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
        Cadastre e atualize usuários quando a API estiver disponível. Por enquanto este espaço atua como placeholder seguro.
      </div>
    </section>
  );
}

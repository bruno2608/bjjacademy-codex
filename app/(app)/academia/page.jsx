export const metadata = {
  title: 'Academia · BJJ Academy'
};

export default function AcademiaPage() {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6">
        <h1 className="text-xl font-semibold text-bjj-white">Configurações da Academia</h1>
        <p className="text-sm text-bjj-gray-200/70">Central de ajustes institucionais. Use esta página para configurar dados gerais quando a API estiver ativa.</p>
      </header>
      <div className="rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
        Placeholder seguro. Nenhuma alteração persistente é aplicada enquanto o backend não estiver conectado.
      </div>
    </section>
  );
}

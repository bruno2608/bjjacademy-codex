export const metadata = {
  title: 'Área de TI · BJJ Academy'
};

export default function TIPage() {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6">
        <h1 className="text-xl font-semibold text-bjj-white">Área de TI</h1>
        <p className="text-sm text-bjj-gray-200/70">Ferramentas avançadas reservadas para o time de tecnologia.</p>
      </header>
      <div className="rounded-2xl border border-dashed border-bjj-gray-800 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/70">
        Placeholder para logs e controles de infraestrutura. Liberaremos integrações reais na próxima etapa.
      </div>
    </section>
  );
}

export default function ZUiPlaygroundPage() {
  return (
    <main className="min-h-dvh bg-base-200 text-base-content py-10">
      <div className="mx-auto max-w-6xl space-y-8 px-4 lg:px-8">
        <header className="space-y-2">
          <p className="badge badge-outline border-base-300 uppercase tracking-[0.18em]">Playground interno</p>
          <h1 className="text-3xl font-semibold lg:text-4xl">ZEKAI UI – Components Playground</h1>
          <p className="max-w-3xl text-sm text-base-content/70 lg:text-base">
            Página interna para validar rapidamente o tema Z-Dark/Z-Light aplicado no DaisyUI. Use para conferir paleta, estados
            de interação e tipografia antes de levar ajustes para telas reais.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Paleta do tema</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: 'Base 100', classes: 'bg-base-100 text-base-content' },
                  { label: 'Base 200', classes: 'bg-base-200 text-base-content' },
                  { label: 'Base 300', classes: 'bg-base-300 text-base-content' },
                  { label: 'Primary', classes: 'bg-primary text-primary-content' },
                  { label: 'Secondary', classes: 'bg-secondary text-secondary-content' },
                  { label: 'Accent', classes: 'bg-accent text-accent-content' },
                  { label: 'Neutral', classes: 'bg-neutral text-neutral-content' },
                  { label: 'Info', classes: 'bg-info text-info-content' },
                  { label: 'Success', classes: 'bg-success text-success-content' },
                  { label: 'Warning', classes: 'bg-warning text-warning-content' },
                  { label: 'Error', classes: 'bg-error text-error-content' }
                ].map((token) => (
                  <div
                    key={token.label}
                    className={`flex items-center justify-between rounded-lg border border-base-300/60 px-3 py-3 ${token.classes}`}
                  >
                    <span className="font-medium">{token.label}</span>
                    <span className="text-xs uppercase tracking-wide">{token.classes.split(' ')[0].replace('bg-', '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Buttons</h2>
              <div className="flex flex-wrap gap-3">
                <button className="btn">Default</button>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-outline">Outline</button>
                <button className="btn btn-primary" disabled>
                  Disabled
                </button>
              </div>
            </div>
          </section>

          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Form inputs</h2>
              <div className="space-y-3">
                <input type="text" placeholder="input input-bordered" className="input input-bordered w-full bg-base-200/80" />
                <textarea className="textarea textarea-bordered w-full bg-base-200/80" placeholder="textarea" />
                <select className="select select-bordered w-full bg-base-200/80">
                  <option>select option</option>
                  <option>another option</option>
                </select>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="input-error"
                    className="input input-bordered input-error w-full bg-base-200/80"
                  />
                  <p className="text-xs text-error">Mensagem de erro ou validação.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Checkbox / Radio / Toggle</h2>
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" defaultChecked />
                    checkbox-primary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-secondary" />
                    checkbox-secondary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-accent" />
                    checkbox-accent
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="radio-demo" className="radio radio-primary" defaultChecked />
                    radio-primary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="radio-demo" className="radio radio-secondary" />
                    radio-secondary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="radio-demo" className="radio radio-accent" />
                    radio-accent
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    toggle-primary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="toggle toggle-secondary" />
                    toggle-secondary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="toggle toggle-accent" />
                    toggle-accent
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Alerts</h2>
              <div className="space-y-3 text-sm">
                <div className="alert alert-info">
                  <span>ℹ️ Alerta informativo com bg-info.</span>
                </div>
                <div className="alert alert-success">
                  <span>✅ Alerta de sucesso.</span>
                </div>
                <div className="alert alert-warning">
                  <span>⚠️ Alerta de aviso.</span>
                </div>
                <div className="alert alert-error">
                  <span>❌ Alerta de erro.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="card border border-base-300/70 bg-base-100/90 shadow-xl lg:col-span-2">
            <div className="card-body space-y-4">
              <h2 className="text-lg font-semibold">Tipografia e fundos</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-base-300/60 bg-base-300/80 p-4">
                  <p className="text-xs uppercase text-base-content/70">Base</p>
                  <h3 className="text-2xl font-bold">Título em base-300</h3>
                  <p className="text-sm text-base-content/80">Parágrafo com contraste suave.</p>
                </div>
                <div className="space-y-2 rounded-lg border border-base-300/60 bg-primary p-4 text-primary-content">
                  <p className="text-xs uppercase opacity-80">Primary</p>
                  <h3 className="text-2xl font-bold">Título sobre primary</h3>
                  <p className="text-sm opacity-90">Texto ajustado ao primary-content.</p>
                </div>
                <div className="space-y-2 rounded-lg border border-base-300/60 bg-success p-4 text-success-content">
                  <p className="text-xs uppercase opacity-80">Success</p>
                  <h3 className="text-2xl font-bold">Feedback positivo</h3>
                  <p className="text-sm opacity-90">Uso para confirmações e cartões de status.</p>
                </div>
                <div className="space-y-2 rounded-lg border border-base-300/60 bg-warning p-4 text-warning-content">
                  <p className="text-xs uppercase opacity-80">Warning</p>
                  <h3 className="text-2xl font-bold">Atenção do usuário</h3>
                  <p className="text-sm opacity-90">Indicado para alertas de risco moderado.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/**
 * Card componente reutilizável para métricas e blocos de conteúdo.
 */
export default function Card({ title, value, icon: Icon }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-wide text-bjj-gray-200/60">{title}</span>
        {Icon && <Icon size={22} className="text-bjj-red" />}
      </div>
      <strong className="text-3xl font-semibold">{value}</strong>
    </div>
  );
}

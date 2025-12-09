"use client";

import Image from "next/image";

import { BjjBeltProgressCard } from "@/components/bjj/BjjBeltProgressCard";
import { getFaixaConfigBySlug } from "@/data/mocks/bjjBeltUtils";
import type { DashboardAlunoHeroDTO } from "@/types/dashboard-aluno";

interface HeroAlunoDashboardProps {
  data: DashboardAlunoHeroDTO;
}

function formatUltimoTreino(ultimoTreino: DashboardAlunoHeroDTO["metricas"]["ultimoTreino"]) {
  if (!ultimoTreino) return "Sem registro";

  const dataTreino = new Date(ultimoTreino.dataHora);
  const dataFormatada = dataTreino.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const horaFormatada = dataTreino.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const turmaSuffix = ultimoTreino.turmaNome ? ` - ${ultimoTreino.turmaNome}` : "";

  return `${dataFormatada} ${horaFormatada}${turmaSuffix}`;
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AL"
  );
}

export function HeroAlunoDashboard({ data }: HeroAlunoDashboardProps) {
  const { aluno, faixa, metricas } = data;
  const beltConfig = getFaixaConfigBySlug(faixa.slug);
  const sinceYear = new Date(aluno.desde).getFullYear();
  const initials = getInitials(aluno.nome);

  const statusDotClass =
    aluno.statusMatricula === "ATIVO"
      ? "bg-emerald-500"
      : aluno.statusMatricula === "TRANCADO"
        ? "bg-amber-500"
        : "bg-red-500";

  const statusBadgeTone =
    aluno.statusMatricula === "ATIVO"
      ? { border: "border-emerald-500/40", bg: "bg-emerald-500/10", text: "text-emerald-400" }
      : aluno.statusMatricula === "TRANCADO"
        ? { border: "border-amber-500/40", bg: "bg-amber-500/10", text: "text-amber-400" }
        : { border: "border-red-500/40", bg: "bg-red-500/10", text: "text-red-400" };

  return (
    <section className="w-full rounded-3xl border border-base-300/40 bg-base-200/80 shadow-xl shadow-black/40 overflow-hidden">
      <div className="h-32 sm:h-36 bg-gradient-to-r from-[#4c1d95] via-[#3b2d82] to-[#0060ff]" />

      <div className="relative px-4 pb-6 pt-6 sm:px-6 lg:px-10 lg:pb-8 max-w-6xl mx-auto">
        <div className="-mt-14 sm:-mt-16 mb-6 flex justify-center md:justify-center md:mb-8">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-base-100 bg-neutral/40 overflow-hidden shadow-lg">
            {aluno.avatarUrl ? (
              <Image
                src={aluno.avatarUrl}
                alt={`Avatar de ${aluno.nome}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-base-content/80">
                {initials}
              </span>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-base-100 ${statusDotClass}`}
            />
          </div>
        </div>

        <div className="grid gap-8 md:gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:items-center">
          <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
                <h2 className="text-2xl sm:text-3xl font-semibold leading-tight text-base-content">{aluno.nome}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium uppercase tracking-wide ${statusBadgeTone.border} ${statusBadgeTone.bg} ${statusBadgeTone.text}`}
                >
                  {aluno.statusMatricula}
                </span>
              </div>
              <p className="text-sm sm:text-base text-base-content/70">Jiu-Jitsu Brasileiro - Desde {sinceYear}</p>
              <p className="text-sm sm:text-base text-base-content/70">
                {aluno.academiaNome}
                {aluno.academiaCidade ? ` - ${aluno.academiaCidade}` : ""}
              </p>
            </div>

          </div>

          <div className="flex flex-col gap-4 items-center lg:items-end">
            {beltConfig && (
              <BjjBeltProgressCard
                config={beltConfig}
                grauAtual={faixa.grauAtual}
                aulasFeitasNoGrau={faixa.aulasNoGrau}
                aulasMetaNoGrau={faixa.aulasMetaNoGrau}
                className="w-full lg:max-w-[460px]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

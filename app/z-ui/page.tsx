"use client";

import { LayoutGrid, Layers, Palette, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ZkContainer } from "@/components/zekai-ui/ZkContainer";
import { cn } from "@/lib/utils";

import { ColorPalette } from "./_components/ColorPalette";
import { ComponentVariants } from "./_components/ComponentVariants";
import { ComponentsDemo } from "./_components/ComponentsDemo";
import { ThemeEditor } from "./_components/ThemeEditor";

type TabKey = "editor" | "demo" | "variants" | "palette";
type ThemeKey = "zdark" | "zlight";

const STORAGE_KEY = "zekai-ui-theme";

export default function ZUiPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("editor");
  const [theme, setTheme] = useState<ThemeKey>("zdark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "zdark" || stored === "zlight") {
      setTheme(stored);
    } else if (stored === "Z-Dark") {
      setTheme("zdark");
    } else if (stored === "Z-Light" || document?.documentElement?.getAttribute("data-theme") === "zlight") {
      setTheme("zlight");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const tabIcon = useMemo(() => "h-4 w-4", []);

  return (
    <main className="min-h-dvh bg-base-200 text-base-content" data-theme={theme}>
      <ZkContainer className="space-y-8 py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/60">Playground</p>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ZEKAI UI · Theme Playground</h1>
              <p className="max-w-3xl text-sm text-base-content/70 lg:text-base">
                Página neutra para validar o visual da ZEKAI UI com DaisyUI. Alterne temas, navegue pelas abas e compare
                componentes antes de aplicar em produtos reais.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-base-content/70">
            <span>Tema</span>
            <div className="join rounded-full border border-base-300/60 bg-base-100/80 shadow-sm">
              <button
                type="button"
                className={cn("btn btn-xs join-item", theme === "zdark" && "btn-active btn-primary")}
                onClick={() => setTheme("zdark")}
                aria-pressed={theme === "zdark"}
              >
                zdark
              </button>
              <button
                type="button"
                className={cn("btn btn-xs join-item", theme === "zlight" && "btn-active btn-secondary")}
                onClick={() => setTheme("zlight")}
                aria-pressed={theme === "zlight"}
              >
                zlight
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="tabs tabs-boxed tabs-sm bg-base-200/80">
            <button
              className={cn("tab gap-2", activeTab === "editor" && "tab-active")}
              onClick={() => setActiveTab("editor")}
              title="Theme Editor"
            >
              <Wand2 className={tabIcon} />
              <span className="hidden md:inline">Theme Editor</span>
            </button>
            <button
              className={cn("tab gap-2", activeTab === "demo" && "tab-active")}
              onClick={() => setActiveTab("demo")}
              title="Components Demo"
            >
              <LayoutGrid className={tabIcon} />
              <span className="hidden md:inline">Components Demo</span>
            </button>
            <button
              className={cn("tab gap-2", activeTab === "variants" && "tab-active")}
              onClick={() => setActiveTab("variants")}
              title="Component Variants"
            >
              <Layers className={tabIcon} />
              <span className="hidden md:inline">Component Variants</span>
            </button>
            <button
              className={cn("tab gap-2", activeTab === "palette" && "tab-active")}
              onClick={() => setActiveTab("palette")}
              title="Color Palette"
            >
              <Palette className={tabIcon} />
              <span className="hidden md:inline">Color Palette</span>
            </button>
          </div>
          <span className="text-xs text-base-content/60">Static showcase</span>
        </div>

        {activeTab === "editor" && <ThemeEditor />}
        {activeTab === "demo" && <ComponentsDemo />}
        {activeTab === "variants" && <ComponentVariants />}
        {activeTab === "palette" && <ColorPalette />}
      </ZkContainer>
    </main>
  );
}

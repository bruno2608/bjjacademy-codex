import { Icon } from "@iconify/react";

export function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="gap-1 text-black bg-white border shadow-sm btn border-base-300 hover:bg-white/90"
      >
        <Icon icon="flat-color-icons:google" className="w-5 h-5" />
        <span>Continuar com Google</span>
      </button>
      <button
        type="button"
        className="btn gap-1 border-0 bg-[#1877F2] text-white shadow-sm hover:bg-[#0f6ae0]"
      >
        <Icon icon="mdi:facebook" className="w-5 h-5" />
        <span>Continuar com Facebook</span>
      </button>
    </div>
  );
}

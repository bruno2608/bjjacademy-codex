import { Icon } from "@iconify/react";

export function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button type="button" className="btn btn-outline btn-primary justify-start gap-3">
        <Icon icon="flat-color-icons:google" className="w-5 h-5" />
        <span>Continuar com Google</span>
      </button>
      <button type="button" className="btn btn-outline btn-primary justify-start gap-3">
        <Icon icon="mdi:facebook" className="w-5 h-5" />
        <span>Continuar com Facebook</span>
      </button>
    </div>
  );
}

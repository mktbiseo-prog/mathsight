import { useState } from "react";
import { Download, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { trackEvent } from "@/utils/analytics";

export function InstallBanner() {
  const { canInstall, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 safe-bottom">
      <div className="max-w-md mx-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
        <Download className="w-5 h-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">MathSight 앱 설치</p>
          <p className="text-xs opacity-80">홈 화면에 추가하면 더 빠르게!</p>
        </div>
        <button
          onClick={async () => {
            const accepted = await install();
            if (accepted) trackEvent("pwa_install");
          }}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-white text-primary text-sm font-bold hover:bg-white/90 transition-colors"
        >
          설치
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

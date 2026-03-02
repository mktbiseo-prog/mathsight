import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] bg-amber text-white text-center py-1.5 text-xs font-medium"
      role="alert"
      aria-live="polite"
    >
      <WifiOff className="w-3 h-3 inline mr-1.5 -mt-0.5" />
      오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.
    </div>
  );
}

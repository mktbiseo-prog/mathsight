import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm text-gray-400 dark:text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
}

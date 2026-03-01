import { Box, MousePointerClick } from "lucide-react";

export function FreeExplorePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <Box className="w-16 h-16 mx-auto text-neon-blue" />
        <h1 className="text-3xl font-bold">자유 탐구</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          3D 공간에서 함수를 자유롭게 입력하고, 그래프를 회전하고,
          슬라이더로 값을 바꿔보며 수학적 직관을 키워보세요.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 text-sm text-gray-500 dark:text-gray-400">
          <MousePointerClick className="w-4 h-4" />
          Three.js 3D 공간 — Phase 2에서 구현 예정
        </div>
      </div>
    </div>
  );
}

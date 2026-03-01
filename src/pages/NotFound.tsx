import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-7xl font-bold text-gray-200 dark:text-white/10">404</p>
        <p className="text-gray-500 dark:text-gray-400">페이지를 찾을 수 없습니다</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-lg bg-gray-900 dark:bg-white/10 text-white text-sm font-medium hover:bg-gray-800 dark:hover:bg-white/15 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

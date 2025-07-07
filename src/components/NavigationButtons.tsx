interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
}

export default function NavigationButtons({
  onPrevious,
  onNext,
  onReset,
  canGoPrevious,
  canGoNext,
  isCompleted
}: NavigationButtonsProps) {
  return (
    <div className="space-y-4">
      {/* 主要導航按鈕 */}
      <div className="flex justify-between gap-4">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            canGoPrevious
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>←</span>
            <span>上一張</span>
          </div>
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
            canGoNext
              ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-lg hover:shadow-xl'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>下一張</span>
            <span>→</span>
          </div>
        </button>
      </div>

      {/* 重置按鈕 */}
      {isCompleted && (
        <button
          onClick={onReset}
          className="w-full py-3 px-6 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span>🔄</span>
            <span>重新開始</span>
          </div>
        </button>
      )}

      {/* 快捷操作 */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <button
          onClick={() => window.location.href = '/create'}
          className="text-center p-3 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
        >
          <div className="text-lg mb-1">➕</div>
          <div className="text-xs text-green-700 dark:text-green-300">新增單字</div>
        </button>
        <button
          onClick={() => window.location.href = '/manage'}
          className="text-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
        >
          <div className="text-lg mb-1">📋</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">管理單字</div>
        </button>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-lg mb-1">📱</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">滑動切換</div>
        </div>
      </div>
    </div>
  );
}

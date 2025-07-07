interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">學習進度</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {progress === 100 && (
        <div className="text-center mt-2">
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✨ 完成所有單字！
          </span>
        </div>
      )}
    </div>
  );
}

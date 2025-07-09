'use client';

interface SettingsProps {
  onClose: () => void;
  onCategoryChange: (category: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  currentCategory: string;
  currentDifficulty: string;
}

export default function Settings({ 
  onClose, 
  onCategoryChange, 
  onDifficultyChange,
  currentCategory,
  currentDifficulty 
}: SettingsProps) {
  const categories = [
    { value: 'all', label: '全部' },
    { value: 'greetings', label: '問候語' },
    { value: 'food', label: '食物' },
    { value: 'numbers', label: '數字' },
    { value: 'colors', label: '顏色' },
    { value: 'family', label: '家庭' },
    { value: 'time', label: '時間' },
    { value: 'weather', label: '天氣' },
    { value: 'transportation', label: '交通' },
    { value: 'encouragement', label: '鼓勵' },
  ];

  const difficulties = [
    { value: 'all', label: '全部難度' },
    { value: 'easy', label: '簡單' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困難' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* 標題列 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">學習設定</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 設定內容 */}
        <div className="p-6 space-y-6">
          {/* 分類選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">選擇分類</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    currentCategory === category.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* 難度選擇 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">選擇難度</h3>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => onDifficultyChange(difficulty.value)}
                  className={`w-full p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    currentDifficulty === difficulty.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{difficulty.label}</span>
                    {difficulty.value !== 'all' && (
                      <span className="text-xs opacity-75">
                        {difficulty.value === 'easy' && '⭐'}
                        {difficulty.value === 'medium' && '⭐⭐'}
                        {difficulty.value === 'hard' && '⭐⭐⭐'}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 其他設定 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">其他設定</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">自動翻轉</span>
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">發音提示</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">隨機順序</span>
                <input
                  type="checkbox"
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
}

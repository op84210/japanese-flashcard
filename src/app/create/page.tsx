'use client';

import { useState } from 'react';
import { FlashcardAPI, categoryMap, difficultyMap } from '@/lib/api';

interface CreateFlashcardData {
  kanji: string;
  hiragana: string;
  katakana: string;
  meaning: string;
  example: string;
  wordType: number;
  difficulty: number;
  category: number;
}

export default function CreateFlashcard() {
  const [formData, setFormData] = useState<CreateFlashcardData>({
    kanji: '',
    hiragana: '',
    katakana: '',
    meaning: '',
    example: '',
    wordType: 0,
    difficulty: 1,
    category: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof CreateFlashcardData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本驗證
    if (!formData.meaning) {
      setMessage({ type: 'error', text: '中文意義為必填項目' });
      return;
    }

    if (!formData.hiragana && !formData.katakana && !formData.kanji) {
      setMessage({ type: 'error', text: '至少需要填寫一種日文表記（漢字、平假名或片假名）' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await FlashcardAPI.createFlashcard({
        kanji: formData.kanji,
        hiragana: formData.hiragana,
        katakana: formData.katakana,
        meaning: formData.meaning,
        example: formData.example,
        wordType: formData.wordType,
        difficulty: formData.difficulty,
        category: formData.category,
      });

      if (result.success) {
        setMessage({ type: 'success', text: '單字卡創建成功！' });
        // 重置表單
        setFormData({
          kanji: '',
          hiragana: '',
          katakana: '',
          meaning: '',
          example: '',
          wordType: 0,
          difficulty: 1,
          category: 0,
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || '創建失敗'
        });
      }
    } catch (error: unknown) {
      console.error('創建單字卡錯誤:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '創建失敗，請檢查網路連接' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordTypes = [
    { value: 0, label: '一般詞彙' },
    { value: 1, label: '動詞' },
    { value: 2, label: '形容詞' },
    { value: 3, label: '名詞' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* 頂部標題列 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                創建新單字卡
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 消息提示 */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* 日文表記 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">日文表記</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  漢字 <span className="text-gray-400">（可選）</span>
                </label>
                <input
                  type="text"
                  value={formData.kanji}
                  onChange={(e) => handleInputChange('kanji', e.target.value)}
                  placeholder="例：桜"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  平假名 <span className="text-gray-400">（可選）</span>
                </label>
                <input
                  type="text"
                  value={formData.hiragana}
                  onChange={(e) => handleInputChange('hiragana', e.target.value)}
                  placeholder="例：さくら"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  片假名 <span className="text-gray-400">（可選）</span>
                </label>
                <input
                  type="text"
                  value={formData.katakana}
                  onChange={(e) => handleInputChange('katakana', e.target.value)}
                  placeholder="例：サクラ"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 中文意義 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">中文翻譯</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  中文意義 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.meaning}
                  onChange={(e) => handleInputChange('meaning', e.target.value)}
                  placeholder="例：櫻花"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  例句 <span className="text-gray-400">（可選）</span>
                </label>
                <textarea
                  value={formData.example}
                  onChange={(e) => handleInputChange('example', e.target.value)}
                  placeholder="例：春に桜が咲きます。"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 分類設定 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分類設定</h2>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  單字類型
                </label>
                <select
                  value={formData.wordType}
                  onChange={(e) => handleInputChange('wordType', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {wordTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  難度等級
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(difficultyMap).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name === 'beginner' && '初級'}
                      {name === 'elementary' && '初中級'}
                      {name === 'intermediate' && '中級'}
                      {name === 'advanced' && '高級'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  主題分類
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {Object.entries(categoryMap).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name === 'basic' && '基礎'}
                      {name === 'greetings' && '問候語'}
                      {name === 'food' && '食物'}
                      {name === 'numbers' && '數字'}
                      {name === 'colors' && '顏色'}
                      {name === 'family' && '家庭'}
                      {name === 'time' && '時間'}
                      {name === 'weather' && '天氣'}
                      {name === 'transportation' && '交通'}
                      {name === 'body' && '身體'}
                      {name === 'school' && '學校'}
                      {name === 'nature' && '自然'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 text-white font-medium rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>創建中...</span>
                </div>
              ) : (
                '創建單字卡'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

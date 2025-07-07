'use client';

import { useState, useEffect } from 'react';
import { FlashcardAPI, formatFlashcardText, getCategoryName, getDifficultyName, type Flashcard } from '@/lib/api';

export default function ManageFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      const response = await FlashcardAPI.getAllFlashcards();
      
      if (response.success && response.data) {
        setFlashcards(response.data);
      }
    } catch (error) {
      console.error('載入單字卡錯誤:', error);
      setMessage({ type: 'error', text: '載入單字卡失敗' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('確定要刪除這張單字卡嗎？')) return;

    try {
      const response = await fetch(`https://japaneseflashcardapi-production.up.railway.app/api/Flashcards/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setFlashcards(prev => prev.filter(card => card.id !== id));
        setMessage({ type: 'success', text: '單字卡刪除成功' });
      } else {
        setMessage({ type: 'error', text: '刪除失敗' });
      }
    } catch (error) {
      console.error('刪除錯誤:', error);
      setMessage({ type: 'error', text: '刪除失敗，請檢查網路連接' });
    }
  };

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
  };

  const handleSaveEdit = async (updatedCard: Flashcard) => {
    try {
      const response = await fetch(`https://japaneseflashcardapi-production.up.railway.app/api/Flashcards/${updatedCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          kanji: updatedCard.kanji,
          hiragana: updatedCard.hiragana,
          katakana: updatedCard.katakana,
          meaning: updatedCard.meaning,
          example: updatedCard.example,
          wordType: updatedCard.wordType,
          difficulty: updatedCard.difficulty,
          category: updatedCard.category,
          isFavorite: updatedCard.isFavorite,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setFlashcards(prev => prev.map(card => card.id === updated.id ? updated : card));
        setEditingCard(null);
        setMessage({ type: 'success', text: '單字卡更新成功' });
      } else {
        setMessage({ type: 'error', text: '更新失敗' });
      }
    } catch (error) {
      console.error('更新錯誤:', error);
      setMessage({ type: 'error', text: '更新失敗，請檢查網路連接' });
    }
  };

  // 篩選單字卡
  const filteredCards = flashcards.filter(card => {
    const matchesSearch = searchTerm === '' || 
      (card.kanji && card.kanji.includes(searchTerm)) ||
      (card.hiragana && card.hiragana.includes(searchTerm)) ||
      (card.katakana && card.katakana.includes(searchTerm)) ||
      (card.meaning && card.meaning.includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'all' || card.category.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* 頂部標題列 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                ←
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                管理單字卡
              </h1>
            </div>
            <button
              onClick={() => window.location.href = '/create'}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ➕ 新增
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 消息提示 */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
              : 'bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* 搜尋和篩選 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="搜尋單字卡..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">所有分類</option>
              <option value="0">基礎</option>
              <option value="1">問候語</option>
              <option value="2">食物</option>
              <option value="3">數字</option>
              <option value="4">顏色</option>
              <option value="5">家庭</option>
              <option value="6">時間</option>
              <option value="7">天氣</option>
              <option value="8">交通</option>
              <option value="9">身體</option>
              <option value="10">學校</option>
              <option value="11">自然</option>
            </select>
          </div>
        </div>

        {/* 載入狀態 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">載入中...</p>
          </div>
        ) : (
          /* 單字卡列表 */
          <div className="space-y-4">
            {filteredCards.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">沒有找到符合條件的單字卡</p>
              </div>
            ) : (
              filteredCards.map(card => {
                const formatted = formatFlashcardText(card);
                return (
                  <div key={card.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatted.front}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatted.reading}
                          </span>
                        </div>
                        <div className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                          {formatted.back}
                        </div>
                        {card.example && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            例句：{card.example}
                          </div>
                        )}
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                            {getCategoryName(card.category)}
                          </span>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            {getDifficultyName(card.difficulty)}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            複習 {card.reviewCount} 次
                          </span>
                          {card.isFavorite && (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                              ⭐ 收藏
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(card)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="編輯"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="刪除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      {/* 編輯彈窗 */}
      {editingCard && (
        <EditCardModal
          card={editingCard}
          onSave={handleSaveEdit}
          onCancel={() => setEditingCard(null)}
        />
      )}
    </div>
  );
}

// 編輯單字卡的彈窗組件
function EditCardModal({ 
  card, 
  onSave, 
  onCancel 
}: { 
  card: Flashcard; 
  onSave: (card: Flashcard) => void; 
  onCancel: () => void; 
}) {
  const [editData, setEditData] = useState({ ...card });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">編輯單字卡</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">漢字</label>
                <input
                  type="text"
                  value={editData.kanji || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, kanji: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">平假名</label>
                <input
                  type="text"
                  value={editData.hiragana || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, hiragana: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">片假名</label>
                <input
                  type="text"
                  value={editData.katakana || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, katakana: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">中文意義</label>
              <input
                type="text"
                value={editData.meaning || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, meaning: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">例句</label>
              <textarea
                value={editData.example || ''}
                onChange={(e) => setEditData(prev => ({ ...prev, example: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

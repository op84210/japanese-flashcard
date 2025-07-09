'use client';

import { useState, useEffect } from 'react';
import FlashcardComponent from '@/components/FlashcardComponent';
import ProgressBar from '@/components/ProgressBar';
import NavigationButtons from '@/components/NavigationButtons';
import Settings from '@/components/Settings';
import { FlashcardAPI, sampleFlashcards, formatFlashcardText, Flashcard, categoryMap, difficultyMap } from '@/lib/api';

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState(new Set<number>());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // 載入單字卡資料
  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 嘗試從 API 載入資料
      const response = await FlashcardAPI.getAllFlashcards();
      
      if (response.success && response.data) {
        setFlashcards(response.data);
      } else {
        // API 失敗時使用範例資料
        console.warn('API 載入失敗，使用範例資料:', response.error);
        setFlashcards(sampleFlashcards);
      }
    } catch (err: unknown) {
      console.error('載入單字卡錯誤:', err);
      setError('載入單字卡失敗，使用範例資料');
      setFlashcards(sampleFlashcards);
    } finally {
      setIsLoading(false);
    }
  };

  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? (studiedCards.size / flashcards.length) * 100 : 0;

  // 格式化當前卡片的顯示內容
  const formattedCard = currentCard ? 
    (currentCard.kanji || currentCard.hiragana ? formatFlashcardText(currentCard) : currentCard) : null;

  const handleNext = async () => {
    if (currentCard) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
      
      // 記錄學習進度到後端
      try {
        await FlashcardAPI.recordProgress(currentCard.id);
      } catch (err: unknown) {
        console.warn('記錄進度失敗:', err);
      }
    }
    
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
  };

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    
    try {
      let response;
      if (category === 'all') {
        response = await FlashcardAPI.getAllFlashcards();
      } else {
        response = await FlashcardAPI.getFlashcardsByCategory(category);
      }
      
      if (response.success && response.data) {
        setFlashcards(response.data);
      } else {
        // 從範例資料中篩選
        const filtered = category === 'all' 
          ? sampleFlashcards 
          : sampleFlashcards.filter(card => {
              // 根據 categoryMap 進行比對
              const categoryId = Object.entries(categoryMap).find(([, name]) => name === category)?.[0];
              return categoryId ? card.category === parseInt(categoryId) : false;
            });
        setFlashcards(filtered);
      }
    } catch (err: unknown) {
      console.error('載入分類失敗:', err);
      const filtered = category === 'all' 
        ? sampleFlashcards 
        : sampleFlashcards.filter(card => {
            const categoryId = Object.entries(categoryMap).find(([, name]) => name === category)?.[0];
            return categoryId ? card.category === parseInt(categoryId) : false;
          });
      setFlashcards(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultyChange = async (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setIsLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
    
    try {
      let response;
      if (difficulty === 'all') {
        response = await FlashcardAPI.getAllFlashcards();
      } else {
        response = await FlashcardAPI.getFlashcardsByDifficulty(difficulty);
      }
      
      if (response.success && response.data) {
        setFlashcards(response.data);
      } else {
        // 從範例資料中篩選
        const filtered = difficulty === 'all' 
          ? sampleFlashcards 
          : sampleFlashcards.filter(card => {
              // 根據 difficultyMap 進行比對
              const difficultyId = Object.entries(difficultyMap).find(([, name]) => name === difficulty)?.[0];
              return difficultyId ? card.difficulty === parseInt(difficultyId) : false;
            });
        setFlashcards(filtered);
      }
    } catch (err: unknown) {
      console.error('載入難度失敗:', err);
      const filtered = difficulty === 'all' 
        ? sampleFlashcards 
        : sampleFlashcards.filter(card => {
            const difficultyId = Object.entries(difficultyMap).find(([, name]) => name === difficulty)?.[0];
            return difficultyId ? card.difficulty === parseInt(difficultyId) : false;
          });
      setFlashcards(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">載入單字卡中...</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-5xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">沒有找到單字卡</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || '無法載入單字卡資料'}
          </p>
          <button
            onClick={loadFlashcards}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* 頂部標題列 */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                日語單字卡
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                單字 {currentIndex + 1} / {flashcards.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/manage'}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="管理單字卡"
              >
                📋
              </button>
              <button
                onClick={() => window.location.href = '/create'}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="創建新單字卡"
              >
                ➕
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="設定"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 進度條 */}
        <ProgressBar progress={progress} />

        {/* 單字卡 */}
        <div className="flex justify-center">
          <FlashcardComponent
            card={formattedCard || currentCard}
            isFlipped={isFlipped}
            onFlip={handleFlip}
            onSwipeLeft={handleNext}
            onSwipeRight={handlePrevious}
          />
        </div>

        {/* 操作按鈕 */}
        <NavigationButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          onReset={handleReset}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < flashcards.length - 1}
          isCompleted={studiedCards.size === flashcards.length}
        />

        {/* 完成提示 */}
        {studiedCards.size === flashcards.length && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
            <div className="text-green-800 dark:text-green-200">
              <h3 className="font-semibold text-lg">🎉 恭喜完成！</h3>
              <p className="text-sm mt-1">您已經學習完所有單字卡</p>
            </div>
          </div>
        )}
      </main>

      {/* 底部提示 */}
      <footer className="max-w-md mx-auto px-4 py-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          點擊卡片翻轉查看答案
        </p>
      </footer>

      {/* 設定彈窗 */}
      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          onCategoryChange={handleCategoryChange}
          onDifficultyChange={handleDifficultyChange}
          currentCategory={selectedCategory}
          currentDifficulty={selectedDifficulty}
        />
      )}
    </div>
  );
}

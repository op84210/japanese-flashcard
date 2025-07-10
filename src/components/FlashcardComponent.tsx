'use client';

import { useState, useRef } from 'react';
import { Flashcard } from '@/lib/api';

interface FlashcardComponentProps {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function FlashcardComponent({ 
  card, 
  isFlipped, 
  onFlip, 
  onSwipeLeft, 
  onSwipeRight 
}: FlashcardComponentProps) {
  const [isPressed, setIsPressed] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPressed(true);
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPressed(false);
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // 檢查是否為水平滑動
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      // 點擊翻轉
      onFlip();
    }
  };

  // 格式化顯示文字
  const frontText = card.kanji || card.hiragana || card.katakana || '';
  const backText = card.meaning || '';
  const readingText = card.hiragana || card.katakana || '';

  return (
    <div className="perspective-1000 w-full max-w-sm swipe-container">
      <div
        className={`relative w-full h-64 cursor-pointer transition-all duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        } ${isPressed ? 'scale-95' : 'scale-100'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onFlip}
      >
        {/* 正面 - 日文 */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {frontText}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {readingText}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              點擊翻轉查看中文
            </div>
          </div>
          
          {/* 裝飾性元素 */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-400 text-lg">🇯🇵</span>
          </div>

          {/* 滑動提示 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 text-xs text-gray-400">
            <span>←</span>
            <span>滑動切換</span>
            <span>→</span>
          </div>
        </div>

        {/* 背面 - 中文 */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg rotate-y-180 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {backText}
            </div>
            <div className="text-lg text-blue-100 mb-4">
              {frontText}
            </div>
            <div className="text-sm text-blue-200">
              {readingText}
            </div>
            <div className="text-xs text-blue-300 mt-4">
              點擊翻轉回日文
            </div>
          </div>

          {/* 裝飾性元素 */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🇹🇼</span>
          </div>

          {/* 滑動提示 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 text-xs text-blue-300">
            <span>←</span>
            <span>滑動切換</span>
            <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

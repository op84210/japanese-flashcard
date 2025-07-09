// API 配置和資料類型定義 - 基於您的 API Swagger 文檔
export interface Flashcard {
  id: number;
  kanji?: string | null;          // 漢字表記
  hiragana?: string | null;       // 平假名表記
  katakana?: string | null;       // 片假名表記
  meaning?: string | null;        // 中文意義
  example?: string | null;        // 例句
  wordType: number;               // 單字類型 (0-3)
  difficulty: number;             // 難易度等級 (1-4)
  category: number;               // 分類 (0-11)
  createdDate: string;            // 創建日期
  lastReviewedDate?: string | null; // 最後複習日期
  reviewCount: number;            // 複習次數
  isFavorite: boolean;            // 是否收藏
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API 基礎 URL
const API_BASE_URL = 'https://japaneseflashcardapi-production.up.railway.app/api';

// 分類映射
export const categoryMap = {
  0: 'basic',      // 基礎
  1: 'greetings',  // 問候語
  2: 'food',       // 食物
  3: 'numbers',    // 數字
  4: 'colors',     // 顏色
  5: 'family',     // 家庭
  6: 'time',       // 時間
  7: 'weather',    // 天氣
  8: 'transportation', // 交通
  9: 'body',       // 身體
  10: 'school',    // 學校
  11: 'nature'     // 自然
};

// 難度映射
export const difficultyMap = {
  1: 'beginner',   // 初級
  2: 'elementary', // 初中級
  3: 'intermediate', // 中級
  4: 'advanced'    // 高級
};

// API 調用函數
export class FlashcardAPI {
  // 獲取所有單字卡
  static async getAllFlashcards(): Promise<ApiResponse<Flashcard[]>> {
    try {
      console.log('正在從 API 載入單字卡...', `${API_BASE_URL}/Flashcards`);
      
      const response = await fetch(`${API_BASE_URL}/Flashcards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`回應狀態: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('成功載入資料:', data);
        
        return {
          success: true,
          data: Array.isArray(data) ? data : [data],
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching flashcards:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取單字卡失敗',
      };
    }
  }

  // 根據類別獲取單字卡
  static async getFlashcardsByCategory(categoryName: string): Promise<ApiResponse<Flashcard[]>> {
    try {
      // 將類別名稱轉換為數字 ID
      const categoryId = Object.entries(categoryMap).find(([key, name]) => name === categoryName)?.[0];
      
      if (!categoryId) {
        // 如果找不到對應的分類，返回所有資料
        return this.getAllFlashcards();
      }

      const response = await fetch(`${API_BASE_URL}/Flashcards?Category=${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: Array.isArray(data) ? data : [data],
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching flashcards by category:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取分類單字卡失敗',
      };
    }
  }

  // 根據難度獲取單字卡
  static async getFlashcardsByDifficulty(difficultyName: string): Promise<ApiResponse<Flashcard[]>> {
    try {
      // 將難度名稱轉換為數字 ID
      const difficultyId = Object.entries(difficultyMap).find(([key, name]) => name === difficultyName)?.[0];
      
      if (!difficultyId) {
        // 如果找不到對應的難度，返回所有資料
        return this.getAllFlashcards();
      }

      const response = await fetch(`${API_BASE_URL}/Flashcards?Difficulty=${difficultyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: Array.isArray(data) ? data : [data],
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching flashcards by difficulty:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取難度單字卡失敗',
      };
    }
  }

  // 獲取隨機單字卡（用於練習）
  static async getRandomFlashcards(count: number = 5, category?: string, difficulty?: string): Promise<ApiResponse<Flashcard[]>> {
    try {
      let url = `${API_BASE_URL}/Flashcards/random?count=${count}`;
      
      if (category && category !== 'all') {
        const categoryId = Object.entries(categoryMap).find(([key, name]) => name === category)?.[0];
        if (categoryId) url += `&category=${categoryId}`;
      }
      
      if (difficulty && difficulty !== 'all') {
        const difficultyId = Object.entries(difficultyMap).find(([key, name]) => name === difficulty)?.[0];
        if (difficultyId) url += `&difficulty=${difficultyId}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: Array.isArray(data) ? data : [data],
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching random flashcards:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取隨機單字卡失敗',
      };
    }
  }

  // 標記單字卡為已複習
  static async recordProgress(cardId: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/Flashcards/${cardId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return {
          success: true,
          message: '進度記錄成功',
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error recording progress:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '記錄進度失敗',
      };
    }
  }

  // 獲取所有可用分類
  static async getCategories(): Promise<ApiResponse<unknown[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/Flashcards/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取分類失敗',
      };
    }
  }

  // 獲取所有可用難度
  static async getDifficulties(): Promise<ApiResponse<unknown[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/Flashcards/difficulties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data,
        };
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error: unknown) {
      console.error('Error fetching difficulties:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '獲取難度失敗',
      };
    }
  }
}

// 輔助函數：格式化單字卡顯示文字
export function formatFlashcardText(card: Flashcard): {
  front: string;
  back: string;
  reading: string;
} {
  // 正面顯示：優先顯示漢字，沒有則顯示平假名，最後是片假名
  const front = card.kanji || card.hiragana || card.katakana || '';
  
  // 背面顯示：中文意義
  const back = card.meaning || '';
  
  // 讀音：優先顯示平假名，沒有則顯示片假名
  const reading = card.hiragana || card.katakana || '';
  
  return { front, back, reading };
}

// 輔助函數：獲取分類中文名稱
export function getCategoryName(categoryId: number): string {
  const categoryNames = {
    0: '基礎',
    1: '問候語',
    2: '食物',
    3: '數字',
    4: '顏色',
    5: '家庭',
    6: '時間',
    7: '天氣',
    8: '交通',
    9: '身體',
    10: '學校',
    11: '自然'
  };
  return categoryNames[categoryId as keyof typeof categoryNames] || '未知';
}

// 輔助函數：獲取難度中文名稱
export function getDifficultyName(difficultyId: number): string {
  const difficultyNames = {
    1: '初級',
    2: '初中級',
    3: '中級',
    4: '高級'
  };
  return difficultyNames[difficultyId as keyof typeof difficultyNames] || '未知';
}

// 範例資料 - 當後端不可用時使用（兼容舊版格式）
export const sampleFlashcards = [
  { id: 1, front: 'こんにちは', back: '你好', reading: 'konnichiwa', category: 'greetings', difficulty: 'easy' },
  { id: 2, front: 'ありがとう', back: '謝謝', reading: 'arigatou', category: 'greetings', difficulty: 'easy' },
  { id: 3, front: 'すみません', back: '對不起', reading: 'sumimasen', category: 'greetings', difficulty: 'easy' },
  { id: 4, front: 'はじめまして', back: '初次見面', reading: 'hajimemashite', category: 'greetings', difficulty: 'medium' },
  { id: 5, front: 'おはよう', back: '早安', reading: 'ohayou', category: 'greetings', difficulty: 'easy' },
];

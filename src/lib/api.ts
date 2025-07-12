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
      const categoryId = Object.entries(categoryMap).find(([, name]) => name === categoryName)?.[0];
      
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
      const difficultyId = Object.entries(difficultyMap).find(([, name]) => name === difficultyName)?.[0];
      
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
        const categoryId = Object.entries(categoryMap).find(([, name]) => name === category)?.[0];
        if (categoryId) url += `&category=${categoryId}`;
      }
      
      if (difficulty && difficulty !== 'all') {
        const difficultyId = Object.entries(difficultyMap).find(([, name]) => name === difficulty)?.[0];
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

  // 創建新單字卡
  static async createFlashcard(flashcardData: {
    kanji?: string | null;
    hiragana?: string | null;
    katakana?: string | null;
    meaning: string;
    example?: string | null;
    wordType: number;
    difficulty: number;
    category: number;
  }): Promise<ApiResponse<Flashcard>> {
    try {
      console.log('正在創建單字卡...', flashcardData);
      
      // 確保數據格式正確
      const requestBody = {
        kanji: flashcardData.kanji?.trim() || '',
        hiragana: flashcardData.hiragana?.trim() || '',
        katakana: flashcardData.katakana?.trim() || '',
        meaning: flashcardData.meaning?.trim() || '',
        example: flashcardData.example?.trim() || '',
        wordType: Number(flashcardData.wordType),
        difficulty: Number(flashcardData.difficulty),
        category: Number(flashcardData.category),
        reviewCount: 0,
        isFavorite: false,
        createdDate: new Date().toISOString(),
        lastReviewedDate: null
      };

      console.log('請求體:', requestBody);

      const response = await fetch(`${API_BASE_URL}/Flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`創建響應狀態: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('創建成功:', data);
        
        return {
          success: true,
          data: data,
        };
      } else {
        // 詳細的錯誤處理
        let errorMessage = `創建失敗：HTTP ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error('API 錯誤詳情:', errorData);
          
          if (errorData.title) {
            errorMessage = errorData.title;
          } else if (errorData.errors) {
            // 處理驗證錯誤
            const validationErrors = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                const messageText = Array.isArray(messages) ? messages.join(', ') : String(messages);
                return `${field}: ${messageText}`;
              })
              .join('\n');
            errorMessage = `驗證錯誤:\n${validationErrors}`;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('解析錯誤響應失敗:', parseError);
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error('創建單字卡網路錯誤:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '創建失敗，請檢查網路連接',
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

// 範例資料 - 當後端不可用時使用（符合 API 規格）
export const sampleFlashcards: Flashcard[] = [
  {
    id: 1,
    kanji: null,
    hiragana: "こんにちは",
    katakana: null,
    meaning: "你好",
    example: "こんにちは、元気ですか？",
    wordType: 0,
    difficulty: 1,
    category: 1,
    createdDate: "2024-01-01T00:00:00Z",
    lastReviewedDate: null,
    reviewCount: 0,
    isFavorite: false
  },
  {
    id: 2,
    kanji: null,
    hiragana: "ありがとう",
    katakana: null,
    meaning: "謝謝",
    example: "ありがとうございます。",
    wordType: 0,
    difficulty: 1,
    category: 1,
    createdDate: "2024-01-01T00:00:00Z",
    lastReviewedDate: null,
    reviewCount: 0,
    isFavorite: false
  },
  {
    id: 3,
    kanji: null,
    hiragana: "すみません",
    katakana: null,
    meaning: "對不起",
    example: "すみません、遅れました。",
    wordType: 0,
    difficulty: 1,
    category: 1,
    createdDate: "2024-01-01T00:00:00Z",
    lastReviewedDate: null,
    reviewCount: 0,
    isFavorite: false
  },
  {
    id: 4,
    kanji: null,
    hiragana: "はじめまして",
    katakana: null,
    meaning: "初次見面",
    example: "はじめまして、よろしくお願いします。",
    wordType: 0,
    difficulty: 2,
    category: 1,
    createdDate: "2024-01-01T00:00:00Z",
    lastReviewedDate: null,
    reviewCount: 0,
    isFavorite: false
  },
  {
    id: 5,
    kanji: null,
    hiragana: "おはよう",
    katakana: null,
    meaning: "早安",
    example: "おはよう、今日もがんばろう。",
    wordType: 0,
    difficulty: 1,
    category: 1,
    createdDate: "2024-01-01T00:00:00Z",
    lastReviewedDate: null,
    reviewCount: 0,
    isFavorite: false
  },
];

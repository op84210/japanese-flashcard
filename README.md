# 日語單字卡應用 📱

一個現代化的日語學習單字卡應用，專為手機和平板設計，支援觸控操作和響應式介面。

## 🌟 功能特色

### 核心功能
- **3D 翻轉卡片**: 點擊卡片查看中文翻譯
- **滑動手勢**: 向左滑動下一張，向右滑動上一張
- **學習進度**: 即時進度追蹤和視覺化顯示
- **分類學習**: 按主題分類（問候語、食物、數字等）
- **難度分級**: 簡單、中等、困難三個等級
- **響應式設計**: 完美適配手機、平板和桌面

### 手機優化
- 觸控友好的介面設計
- 手勢滑動支援
- PWA 支援（可安裝到手機桌面）
- 離線使用功能
- 暗色模式支援

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

應用將在 http://localhost:3000 啟動

### 建置正式版本
```bash
npm run build
npm start
```

## 🛠 技術架構

### 前端技術
- **Next.js 15**: React 框架
- **TypeScript**: 型別安全
- **Tailwind CSS**: 現代化樣式設計
- **React Hooks**: 狀態管理

### 後端整合
- 支援 RESTful API 整合
- 學習進度記錄
- 單字卡資料管理
- 統計資料分析

## 📋 API 整合說明

### 環境設定
複製 `.env.example` 為 `.env.local` 並設定您的後端 API URL：

```env
NEXT_PUBLIC_API_URL=http://your-backend-url/api
```

### API 端點
應用程式會調用以下 API 端點：

#### 獲取單字卡
```
GET /api/flashcards
GET /api/flashcards?category=greetings
GET /api/flashcards?difficulty=easy
```

#### 記錄學習進度
```
POST /api/progress
{
  "cardId": 1,
  "isCorrect": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 獲取學習統計
```
GET /api/stats
```

### 後端資料格式
單字卡資料應符合以下格式：

```typescript
interface Flashcard {
  id: number;
  front: string;      // 日文
  back: string;       // 中文翻譯
  reading: string;    // 假名讀音
  category?: string;  // 分類
  difficulty?: 'easy' | 'medium' | 'hard';
}
```

## 🎨 使用方式

### 基本操作
1. **翻轉卡片**: 點擊卡片查看翻譯
2. **切換卡片**: 
   - 使用底部按鈕
   - 左滑查看下一張
   - 右滑查看上一張
3. **進度追蹤**: 自動記錄已學習的單字

### 設定選項
點擊右上角設定按鈕 ⚙️ 可以：
- 選擇學習分類
- 調整難度等級
- 開啟/關閉自動翻轉
- 設定隨機模式

### 分類說明
- **問候語**: 日常問候用語
- **食物**: 食物相關詞彙
- **數字**: 數字和計數
- **顏色**: 顏色詞彙
- **家庭**: 家庭成員稱謂
- **時間**: 時間相關詞彙
- **天氣**: 天氣描述
- **交通**: 交通工具
- **鼓勵**: 鼓勵和讚美

## 📱 手機使用技巧

### 手勢操作
- **點擊**: 翻轉卡片
- **左滑**: 下一張卡片
- **右滑**: 上一張卡片
- **長按**: 查看詳細資訊（未來功能）

### PWA 安裝
1. 在手機瀏覽器中開啟應用
2. 點擊「加入主畫面」或「安裝應用程式」
3. 享受原生應用般的體驗

## 🔧 開發指南

### 專案結構
```
src/
├── app/                 # Next.js 應用路由
│   ├── globals.css     # 全域樣式
│   ├── layout.tsx      # 應用佈局
│   └── page.tsx        # 主頁面
├── components/         # React 組件
│   ├── FlashcardComponent.tsx
│   ├── ProgressBar.tsx
│   ├── NavigationButtons.tsx
│   └── Settings.tsx
└── lib/               # 工具函數
    └── api.ts         # API 整合
```

### 自訂功能
您可以輕鬆擴展功能：
- 新增語音播放
- 實作間隔重複算法
- 加入遊戲化元素
- 支援多語言介面

## 🤝 貢獻指南

歡迎提交 Pull Request 或回報問題！

### 開發流程
1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 發起 Pull Request

## 📄 授權

MIT License

## 🙋‍♂️ 支援

如有問題或建議，請：
- 建立 GitHub Issue
- 發送 Email
- 查看 Wiki 文件

---

**祝您日語學習愉快！** 🎌📚

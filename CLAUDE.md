# CLAUDE.md — AI Coach 專案說明

這份文件是給 Claude Code 看的，描述本專案的架構、技術選型與開發規範。每次協助開發前請先讀這份文件。

---

## 專案概述

AI Coach 是一個讓企業主練習與職員一對一溝通的語音 Role Play 工具。企業主填入職員背景與對話目標後，AI 會扮演該職員進行語音對話練習。品牌隸屬於「企業主計畫 Business Booster」。

---

## 系統架構

本專案分為三個部分，分別部署在不同地方：

```
[使用者瀏覽器]
      ↓ GET 請求（無 API Key）
[Google Apps Script 後端]  ← API Key 安全存放在這裡
      ↓ 帶 API Key 呼叫
[MaiAgent API]
      ↓ 回傳 LiveKit token
[LiveKit 語音串流]  ← 實際語音對話在這裡發生
```

### 前端
- 檔案：`index.html`（單一檔案，HTML + CSS + JavaScript 全部在一起）
- 部署：GitHub Pages（`yumin0.github.io/ai-coach/`）
- 不含任何 API Key，所有敏感資料都透過 GAS 取得

### 後端
- 檔案：`Code.gs`
- 部署：Google Apps Script Web App
- 唯一職責：當 proxy，保護 API Key，代前端呼叫 MaiAgent API
- API Key 存放在 GAS 的「指令碼屬性」（Script Properties），屬性名稱：`MAIAGENT_API_KEY`
- 只有 `doGet` 有效，不使用 `doPost`（原因：GAS 的 doPost 在跨域請求時有 CORS 問題）

### AI Agent
- 平台：MaiAgent（台灣企業 AI 平台）
- Agent 名稱：AI Coach
- Chatbot ID：`98bed3c3-aa5a-47f0-b458-81d45ef6d5cc`
- Web Chat ID：`26a7ff94-bce8-4a1f-988f-f41990cd417b`
- 語音模式：即時對話 Realtime（底層為 OpenAI Realtime API）
- 語音串流：LiveKit（`wss://production-60widfpf.livekit.cloud`）

---

## API 呼叫流程

前端取得語音連線需要兩個步驟，都透過 GAS 執行：

**Step 1：建立對話**
```
POST https://api.maiagent.ai/api/conversations/
Body: { "webChat": "26a7ff94-bce8-4a1f-988f-f41990cd417b" }
回傳: { "id": "conversation_uuid" }
```

**Step 2：取得語音 Token**
```
POST https://api.maiagent.ai/api/v1/web-chats/{webChatId}/voice-agent/token/
Body: { "conversation_id": "conversation_uuid", "theme": { "primaryColor": "#F5C518" } }
回傳: { "livekitUrl": "wss://...", "accessToken": "...", "roomName": "...", ... }
```

前端拿到 `livekitUrl` 和 `accessToken` 後，使用 LiveKit SDK 直接連接語音房間。

---

## 前端呼叫 GAS 的方式

```javascript
// 一定要用 GET，不能用 POST（CORS 問題）
const res = await fetch(GAS_URL + '?action=getVoiceToken', { redirect: 'follow' });
const json = await res.json();
// json.data.livekitUrl
// json.data.accessToken
```

---

## 品牌設計規範

| 元素 | 值 |
|------|-----|
| 主色（黃）| `#F5C518` |
| 深色（黃 hover）| `#e6b800` |
| 背景（暖米色）| `#ede8df` |
| 深色背景（對話頁側欄）| `#111111` |
| 字體 | system-ui, -apple-system, 'Noto Sans TC' |
| 品牌名稱 | AI Coach |
| 副標 | 企業主計畫 |

---

## 開發規範

- `index.html` 是單一檔案，所有 CSS 和 JS 寫在同一個檔案裡，不拆分
- API Key 絕對不能出現在 `index.html` 裡
- GAS 的 `Code.gs` 只做一件事：proxy MaiAgent API，不做任何前端邏輯
- 修改 GAS 後必須「建立新版本」重新部署，否則修改不會生效
- GitHub Pages 更新後約需 30 秒～1 分鐘才生效，測試時加 `?nocache=數字` 避免快取

---

## 目前已完成的功能

- [x] 情境設定頁（職員姓名、職位、年資、個性背景、談話目標）
- [x] 談話目標快速選項（chip 選擇器）
- [x] 對話頁顯示職員資訊卡
- [x] GAS 後端安全取得 MaiAgent 語音 token
- [x] LiveKit 語音串流連線
- [x] 麥克風靜音/取消靜音
- [x] 結束練習斷線
- [x] 響應式設計（手機與桌機都可用）

## 待開發功能（未來）

- [ ] 練習結束後的回饋報告
- [ ] AI 虛擬人物動態 Avatar（考慮 HeyGen 或 D-ID）
- [ ] 男女角色選擇
- [ ] 練習歷史記錄
- [ ] 多語言支援

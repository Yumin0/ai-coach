# AI Coach｜企業主計畫

> 讓企業主在正式一對一溝通前，透過 AI 語音角色扮演充分練習。

🔗 **立即試用：** [yumin0.github.io/ai-coach](https://yumin0.github.io/ai-coach/)

---

## 這是什麼？

AI Coach 是專為企業主設計的語音練習工具。你可以設定一位虛擬職員的背景與個性，然後用語音與 AI 進行模擬一對一對話，練習如何處理各種職場溝通情境——在真實的重要會面前，先在這裡演練到有把握。

**適合練習的情境包括：**
- 業績下滑的職員面談
- 傳達組織變革或政策調整
- 給予績效回饋或設定改善期限
- 處理職員的離職意願
- 討論薪資調整

---

## 如何使用

1. 開啟網頁，在「情境設定」填入職員的姓名、職位、年資與個性背景
2. 選擇這次談話的目標（可複選）
3. 按下「開始練習」
4. 等待 AI 連線後，直接開口說第一句話
5. 練習完畢後按「結束練習」

---

## 技術架構

```
前端（GitHub Pages）
    ↓ GET 請求
後端 Proxy（Google Apps Script）
    ↓ 帶 API Key
MaiAgent AI Agent
    ↓ LiveKit 語音串流
瀏覽器語音對話
```

| 層級 | 技術 | 說明 |
|------|------|------|
| 前端 | HTML / CSS / JavaScript | 單一 index.html，部署於 GitHub Pages |
| 後端 | Google Apps Script | 保護 API Key，代理 MaiAgent API 請求 |
| AI Agent | MaiAgent | 語音 AI 平台，負責角色扮演與對話 |
| 語音串流 | LiveKit | 即時語音傳輸底層技術 |

---

## 本地部署說明

### 前置需求

- GitHub 帳號（用於 GitHub Pages）
- Google 帳號（用於 Google Apps Script）
- MaiAgent 帳號與 API Key

### 步驟一：設定 MaiAgent

1. 登入 [MaiAgent](https://maiagent.ai)
2. 建立新的 AI 助理，命名為「AI Coach」
3. 在語音助理設定選擇「即時對話 Realtime」模式
4. 在 System Prompt 貼入以下內容：

```
你是「AI Coach」職員角色扮演系統。

你的任務是扮演企業主公司裡的職員，讓企業主可以練習如何與職員進行一對一溝通。

【對話開始時】
你要先說一句開場白，內容是：
「您好，我是 AI Coach。請先用語音告訴我這次要扮演的職員背景，以及您這次談話想達成的目標，我會立刻進入角色。」

【收到企業主說明後】
簡短複述你收到的角色設定，例如：
「好的，我現在是＿＿，這次談話的目標是＿＿，我們開始吧。」
然後立刻進入角色，等企業主開口。

【扮演原則】
- 全程使用繁體中文
- 根據企業主描述的職員個性來回應，例如防禦性強、情緒低落、積極配合等
- 回應要自然、口語，像真實職員說話的方式
- 不要太快妥協，要讓企業主真正練習到溝通技巧
- 不要跳出角色，不要提醒對方「這是練習」
- 每次回應不要太長，保持對話節奏

【結束條件】
如果企業主說「結束練習」，則跳出角色，說：
「練習結束，謝謝您今天的練習。」
```

5. 記下你的 **Chatbot ID** 與 **Web Chat ID**

### 步驟二：設定 Google Apps Script 後端

1. 開啟 [script.google.com](https://script.google.com)，新增專案
2. 將 `Code.gs` 的內容貼入
3. 將 `Code.gs` 裡的 `WEB_CHAT_ID` 換成你自己的 Web Chat ID
4. 點「專案設定」→「指令碼屬性」→「新增屬性」
   - 屬性名稱：`MAIAGENT_API_KEY`
   - 值：你的 MaiAgent API Key
5. 點「部署」→「新增部署作業」
   - 類型：網頁應用程式
   - 執行身分：我自己
   - 誰可以存取：任何人
6. 複製部署網址

### 步驟三：設定前端

1. 打開 `index.html`，找到這行並替換成你的 GAS 部署網址：
```javascript
const GAS_URL = 'YOUR_GAS_DEPLOY_URL_HERE';
```

### 步驟四：部署到 GitHub Pages

1. 建立新的 GitHub repo
2. 上傳 `index.html`
3. 進入 repo 設定 → Pages → Branch 選 `main` → 儲存
4. 幾分鐘後即可透過 `你的帳號.github.io/repo名稱/` 存取

---

## 注意事項

- API Key 只能放在 Google Apps Script 的指令碼屬性裡，絕對不能出現在 `index.html`
- 修改 GAS 後必須重新部署新版本才會生效
- GitHub Pages 更新後約需 30 秒～1 分鐘才反映最新內容

---

## 品牌

本工具由 **企業主計畫 Business Booster** 開發，專為中小企業主提供管理能力培訓資源。

🌐 [boptaipei.com.tw](https://boptaipei.com.tw)

// ============================================================
// AI Coach - GAS 後端 v3
// ============================================================
// 指令碼屬性設定：
//   MAIAGENT_API_KEY = 你的 MaiAgent API Key
// ============================================================

const WEB_CHAT_ID   = '26a7ff94-bce8-4a1f-988f-f41990cd417b';
const MAIAGENT_BASE = 'https://api.maiagent.ai';

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getVoiceToken') {
    try {
      const apiKey = PropertiesService.getScriptProperties().getProperty('MAIAGENT_API_KEY');
      if (!apiKey) {
        return buildResponse({ error: '尚未設定 MAIAGENT_API_KEY' });
      }

      // Step 1：建立新對話，取得 conversation_id
      const convRes = UrlFetchApp.fetch(
        `${MAIAGENT_BASE}/api/conversations/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify({
            webChat: WEB_CHAT_ID
          }),
          muteHttpExceptions: true
        }
      );

      const convData = JSON.parse(convRes.getContentText());
      Logger.log('Step1 conversation: ' + JSON.stringify(convData));

      if (!convData.id) {
        return buildResponse({ error: '建立對話失敗', detail: convData });
      }

      const conversationId = convData.id;

      // Step 2：用 conversation_id 取得語音 token
      const tokenRes = UrlFetchApp.fetch(
        `${MAIAGENT_BASE}/api/v1/web-chats/${WEB_CHAT_ID}/voice-agent/token/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Api-Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          payload: JSON.stringify({
            conversation_id: conversationId,
            theme: { primaryColor: '#F5C518' }
          }),
          muteHttpExceptions: true
        }
      );

      const tokenData = JSON.parse(tokenRes.getContentText());
      Logger.log('Step2 token: ' + JSON.stringify(tokenData));

      return buildResponse({
        statusCode: tokenRes.getResponseCode(),
        conversationId: conversationId,
        data: tokenData
      });

    } catch (err) {
      return buildResponse({ error: err.toString() });
    }
  }

  return buildResponse({ status: 'AI Coach GAS 後端運作中 v3' });
}

function doPost(e) {
  return buildResponse({ status: 'AI Coach GAS 後端運作中，請使用 GET' });
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


export async function sendTelegramNotification(message: string) {
  const env = (import.meta as any).env;
  const token = env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('TELEGRAM_SIGNAL_LOST: Bot token or Chat ID missing.');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err: any) {
    console.error('TELEGRAM_UPLINK_FAILURE:', err.message || String(err));
  }
}

// IsBar AI — DeepSeek Chat API Proxy (Vercel Serverless)
// Hides API key from the client. Called from the chatbot frontend.

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-e82d4f33551f48d1b60a74dbfca0a985';
const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const systemPrompt = {
      role: 'system',
      content: `Waxaad tahay **IsBar AI Assistant** — caawiyaha rasmiga ah ee platform-ka IsBar AI.

Magacaaga: IsBar AI
Luuqadda: Af-Soomaali (Somali) — haddii lagu weydiiyo Ingiriisi, kaga jawaab Soomaali.

**Xogta IsBar AI:**
- Website: https://isbar-ai.com
- Aasaasaha: Mohamed Yasin Mohamoud (Faratoon)
- Location: Edmonton, Alberta, Canada
- Email: suxufi34@gmail.com | myasinfaratoon@gmail.com
- Phone: 780-335-8180 | 587-306-4137
- LinkedIn: https://www.linkedin.com/in/mfaratoon/
- Fiverr: https://www.fiverr.com/faratoon/
- Facebook: https://www.facebook.com/soomaalipodcast/
- Telegram: https://t.me/Farsamada

**Adeegyada IsBar AI:**
1. **AI Chatbot Development** — Samee chatbot-yo caqli leh oo 24/7 shaqeeya
2. **AI Video Editing** — AI ku dar video-yadaaga (captions, effects, auto-edit)
3. **AI Web Design** — Dhise website-yo AI ah oo modern, responsive ah
4. **Automation** — Automate social media, email, data entry

**Koorsooyinka:**
- AI Fundamentals (6 maalmood, Bilow)
- Machine Learning 101 (8 maalmood, Dhexe)
- ChatGPT Mastery (5 maalmood, Bilow)
- Python for AI (10 maalmood, Sare)
- Data Science (8 maalmood, Dhexe)

**Buugaagta Free PDF:**
- AI Fundamentals (42 bog)
- ChatGPT-ga oo Fudud (38 bog)

**Community:**
- WhatsApp Group, Telegram @Farsamada, Facebook soomaalipodcast, YouTube MrFaraton
- Live sessions: Khamiis/Jimce 8-11PM

**Quiz:** IsBar AI quiz wuxuu leeyahay 28 su'aalood, gamification (levels, badges, leaderboard).

**Support:** @MFARATOON — 24 saac gudahood waa laga jawaabaa.

Jawaabtaadu ha ahaato **kooban, waxtar leh, oo Soomaali fiican**. Hadday su'aashu khusayso IsBar AI, si faahfaahsan uga jawaab. Haddii kale, caawinta guud ee AI-ga ku saabsan si kooban u sharax.`
    };

    const messages = [systemPrompt];
    if (history && Array.isArray(history)) {
      messages.push(...history.slice(-10));
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 800,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      return res.status(500).json({ error: 'DeepSeek API request failed' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Waan ka xumahay, jawaab heli kari waayay.';

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

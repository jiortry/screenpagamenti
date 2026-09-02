export type ReviewTurn = {
  from: 'me' | 'them'
  kind: 'text' | 'voice' | 'pay'
  text?: string
  duration?: string
  rx?: string
}

export type ReviewScript = {
  peerName: string
  online?: boolean
  turns: ReviewTurn[]
}

const SYSTEM = `You write a casual Telegram DM in English only.
It is a short review-style chat after a payment (sent or received). JSON only. No markdown.

Hard rules:
- English only. No other languages.
- NEVER put a person's name, surname, username, @handle, phone, IBAN, or email in message text. Say you / bro / dude / man.
- 7 to 11 turns.
- Exactly one turn must have kind "pay" and from "them". That screenshot is always sent by the other person (left, white bubble). No other photos.
- kind is text | voice | pay.
- Short Telegram lines. Slang and small typos are ok.
- Do NOT put emojis in message text. Almost all lines are plain text.
- 0 to 2 voice turns (kind "voice", duration like "0:07").
- Do not add reactions. They are applied later on about 4% of messages.
- peerName: a realistic first and last name (it will be painted over, never shown).

Shape:
{"peerName":"Jason Miller","online":true,"turns":[{"from":"them","kind":"text","text":"did it land?"},{"from":"them","kind":"pay"},{"from":"me","kind":"text","text":"got it bro"}]}`

export async function generateReviewScript(): Promise<ReviewScript> {
  const res = await fetch('/openrouter/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      temperature: 0.95,
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content:
            'Generate one new Telegram payment-review chat now. Vary the story (waiting, received, sending proof, asking if fees hit). JSON only.',
        },
      ],
    }),
  })
  const raw = await res.text()
  if (!res.ok) throw new Error(raw.slice(0, 280) || `OpenRouter HTTP ${res.status}`)
  let data: { choices?: { message?: { content?: string } }[] }
  try {
    data = JSON.parse(raw) as { choices?: { message?: { content?: string } }[] }
  } catch {
    throw new Error('OpenRouter returned non-JSON')
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Gemini returned an empty chat')
  return parseScript(content)
}

function parseScript(content: string): ReviewScript {
  const trimmed = content.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim()
  const parsed = JSON.parse(trimmed) as ReviewScript
  if (!parsed?.peerName || !Array.isArray(parsed.turns) || parsed.turns.length < 3) {
    throw new Error('Gemini JSON missing turns')
  }
  const turns = parsed.turns.filter((t) => t && (t.kind === 'text' || t.kind === 'voice' || t.kind === 'pay'))
  const payAt = turns.findIndex((t) => t.kind === 'pay')
  if (payAt < 0) {
    turns.splice(Math.max(2, Math.floor(turns.length / 2)), 0, { from: 'them', kind: 'pay' })
  } else {
    let seen = false
    for (let i = 0; i < turns.length; i++) {
      if (turns[i]!.kind === 'pay') {
        if (seen) turns[i] = { from: turns[i]!.from, kind: 'text', text: 'here' }
        else turns[i] = { ...turns[i]!, from: 'them', kind: 'pay' }
        seen = true
      }
    }
  }
  return { peerName: String(parsed.peerName).slice(0, 40), online: Boolean(parsed.online), turns }
}

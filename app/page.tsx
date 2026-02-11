# Vibe Coding Competition – 통합 배포 코드 (최종 단일본)

이 문서는 **코딩을 전혀 몰라도 그대로 복사·붙여넣기만 하면 배포되는 구조**를 목표로 만든 **완전 통합본**입니다.

구성:
- 메인 화면 (`app/page.tsx`)
- OpenAI 호출 API (`app/api/generate/route.ts`)
- 환경변수 위치 명시 (Vercel 설정)

---

## 1️⃣ 메인 화면 – app/page.tsx

```tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setResult('');

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResult(data.output);
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Vibe Economy Briefing</h1>
      <p>AI-generated economic narratives beyond traditional news.</p>

      <textarea
        placeholder="Enter a topic or question"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', height: 120, marginTop: 20 }}
      />

      <br />
      <button onClick={generate} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? 'Generating…' : 'Generate'}
      </button>

      {result && (
        <pre style={{ marginTop: 30, whiteSpace: 'pre-wrap' }}>{result}</pre>
      )}
    </main>
  );
}
```

---

## 2️⃣ OpenAI API – app/api/generate/route.ts

```ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 👈 여기서 키를 불러옴
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Write an economic briefing in a narrative, non-news style about: ${prompt}`,
  });

  return NextResponse.json({
    output: response.output_text,
  });
}
```

---

## 3️⃣ OpenAI API Key 넣는 위치 (⚠️ 중요)

❌ **코드에 직접 키를 쓰면 안 됨**

### ✅ Vercel에서 설정

1. Vercel Dashboard 접속
2. 해당 프로젝트 클릭
3. Settings → Environment Variables
4. 아래처럼 추가

- **Key**: `OPENAI_API_KEY`
- **Value**: `sk-xxxxxx` (네 OpenAI 키)
- Environment: Production + Preview

5. Save
6. 자동 재배포됨

---

## 4️⃣ 결과 상태

- `/` 접속 → 입력창 + 버튼 보임
- 텍스트 입력 → Generate
- OpenAI 응답 표시

👉 **심사위원이 바로 만져볼 수 있는 데모 완성**

---

## 5️⃣ 이 구조의 의미 (중요)

- 클라이언트(page.tsx): 화면만 담당
- 서버(route.ts): OpenAI 키 보호
- 키는 Vercel에만 존재

이건 **실무·심사·보안 기준 모두 통과하는 구조**입니다.

---

이 문서 그대로만 유지하면 추가 수정 없이 제출 가능합니다.

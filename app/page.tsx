// ===============================
// 📦 단일 레포 통합 코드 (Next.js App Router)
// 👉 그대로 복사 → GitHub → Vercel 배포 가능
// ===============================

// -------------------------------
// 1️⃣ app/page.tsx (프론트엔드)
// -------------------------------
'use client';
import { useState } from 'react';

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const topics = [
    { title: '한국은행 기준금리 동결', content: '한국은행이 기준금리를 3.5%로 동결했다.' },
    { title: '반도체 수출 증가', content: 'AI 서버 수요로 반도체 수출이 증가했다.' },
    { title: '미국 연준 금리 인하 시사', content: '연준이 하반기 금리 인하 가능성을 언급했다.' }
  ];

  const generate = async () => {
    setLoading(true);
    const results = [];
    for (const t of topics) {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t)
      });
      results.push(await res.json());
      setNews([...results]);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>📊 Daily Economy Briefing</h1>
      <button onClick={generate} disabled={loading}>
        {loading ? '생성 중...' : '오늘의 뉴스 생성'}
      </button>

      <div style={{ marginTop: 24 }}>
        {news.map((n, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2>{n.title}</h2>
            <img src={n.image} width={256} />
            <p>{n.summary}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

// -------------------------------
// 2️⃣ app/api/generate/route.ts (서버)
// -------------------------------
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { title, content } = await req.json();

  const summary = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: `다음 경제 뉴스를 2문장으로 요약해줘:\n${title}\n${content}` }]
  });

  const image = await openai.images.generate({
    model: 'gpt-image-1',
    prompt: `${title}를 상징하는 미니멀 경제 일러스트`,
    size: '512x512'
  });

  return NextResponse.json({
    title,
    summary: summary.choices[0].message.content,
    image: image.data[0].url
  });
}

// -------------------------------
// 3️⃣ 배포 방법
// -------------------------------
// ① npx create-next-app
// ② 위 파일 구조 그대로 덮어쓰기
// ③ Vercel → OPENAI_API_KEY 등록
// ④ 배포 → 심사위원 URL 접속 테스트 가능


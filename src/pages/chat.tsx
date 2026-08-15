import { FormEvent, useEffect, useState } from 'react';

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('omni_ai_token');
    setToken(saved);
    if (!saved) window.location.href = '/login';
  }, []);

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || !token || loading) return;
    setInput('');
    setError('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ input: text }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || `AI request failed (${response.status})`);
      const answer = data?.output ?? data?.response ?? data?.message ?? JSON.stringify(data);
      setMessages(prev => [...prev, { role: 'assistant', content: String(answer) }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI request failed');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('omni_ai_token');
    window.location.href = '/login';
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div><h1 className="text-xl font-bold">OMNI-AI</h1><p className="text-xs text-slate-400">AI workspace</p></div>
        <button onClick={logout} className="rounded-lg bg-slate-800 px-4 py-2 text-sm">Logout</button>
      </header>
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col p-4">
        <div className="flex-1 space-y-4 overflow-y-auto py-6">
          {messages.length === 0 && <div className="rounded-2xl border border-slate-800 p-8 text-center text-slate-400">Ask OMNI-AI anything.</div>}
          {messages.map((message, index) => <div key={index} className={`rounded-2xl p-4 ${message.role === 'user' ? 'ml-8 bg-blue-700' : 'mr-8 bg-slate-900 border border-slate-800'}`}><div className="mb-1 text-xs uppercase text-slate-300">{message.role}</div><div className="whitespace-pre-wrap">{message.content}</div></div>)}
          {loading && <div className="mr-8 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-400">Thinking…</div>}
        </div>
        {error && <div className="mb-3 rounded-lg bg-red-950 p-3 text-sm text-red-300">{error}</div>}
        <form onSubmit={send} className="flex gap-2 border-t border-slate-800 pt-4">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Message OMNI-AI…" className="flex-1 rounded-xl bg-slate-900 p-4 outline-none ring-blue-600 focus:ring-2" disabled={!token || loading} />
          <button disabled={!token || loading || !input.trim()} className="rounded-xl bg-blue-600 px-5 font-semibold disabled:opacity-50">Send</button>
        </form>
      </section>
    </main>
  );
}

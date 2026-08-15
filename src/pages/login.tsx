import Link from 'next/link';
import { FormEvent, useState } from 'react';

async function readApiResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as { error?: string; success?: boolean };
  } catch {
    throw new Error(`Authentication API returned HTTP ${response.status} instead of JSON`);
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await readApiResponse(response);
      if (!response.ok) throw new Error(data.error || `Login failed (${response.status})`);
      window.location.href = '/chat';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Login to OMNI-AI</h1>
        <input className="mt-6 w-full rounded-lg bg-slate-800 p-3" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="mt-3 w-full rounded-lg bg-slate-800 p-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="mt-5 w-full rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-50" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
        <p className="mt-5 text-sm text-slate-400">New here? <Link className="text-blue-400" href="/register">Create an account</Link></p>
      </form>
    </main>
  );
}

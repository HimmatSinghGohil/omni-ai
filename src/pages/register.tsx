import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      window.location.href = '/login';
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold">Create OMNI-AI account</h1>
        <input className="mt-6 w-full rounded-lg bg-slate-800 p-3" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="mt-3 w-full rounded-lg bg-slate-800 p-3" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="mt-3 w-full rounded-lg bg-slate-800 p-3" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
        <button className="mt-5 w-full rounded-lg bg-blue-600 p-3 font-semibold disabled:opacity-50" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
        <p className="mt-5 text-sm text-slate-400">Already have an account? <Link className="text-blue-400" href="/login">Login</Link></p>
      </form>
    </main>
  );
}

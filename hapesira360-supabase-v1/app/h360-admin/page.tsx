'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard');
    });
  }, [router]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError('Emaili ose fjalëkalimi nuk është i saktë.');
      setLoading(false);
      return;
    }
    router.replace('/dashboard');
    router.refresh();
  }

  return (
    <main className="adminLogin">
      <form onSubmit={login} className="loginCard">
        <div className="adminIcon"><LockKeyhole /></div>
        <p className="eyebrow">Hapësira360</p>
        <h1>Paneli privat</h1>
        <p>Hyr për të menaxhuar pronat.</p>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Fjalëkalimi<input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="formError">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Duke hyrë...' : 'Hyr në panel'}</button>
      </form>
    </main>
  );
}

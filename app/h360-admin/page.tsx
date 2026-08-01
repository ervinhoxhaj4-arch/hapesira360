'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get('email') || !data.get('password')) return setError('Plotëso emailin dhe fjalëkalimin.');
    sessionStorage.setItem('h360-admin', 'true');
    router.push('/dashboard');
  }
  return <main className="adminLogin"><form onSubmit={login} className="loginCard"><div className="adminIcon"><LockKeyhole/></div><p className="eyebrow">Hapësira360</p><h1>Paneli privat</h1><p>Hyr për të menaxhuar pronat.</p><label>Email<input name="email" type="email" placeholder="admin@hapesira360.com"/></label><label>Fjalëkalimi<input name="password" type="password" placeholder="••••••••"/></label>{error&&<p className="formError">{error}</p>}<button type="submit">Hyr në panel</button></form></main>;
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, LogOut, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getAdminProperties } from '@/lib/properties';
import type { DbProperty } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<DbProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return router.replace('/h360-admin');
      setProperties(await getAdminProperties());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nuk u ngarkuan pronat.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/h360-admin');
  }

  async function removeProperty(id: string) {
    if (!window.confirm('A je i sigurt që dëshiron ta fshish këtë pronë?')) return;
    const { error: imageDeleteError } = await supabase.storage.from('property-images').remove(
      (properties.find((item) => item.id === id)?.property_images || []).map((image) => {
        const marker = '/property-images/';
        return image.image_url.includes(marker) ? image.image_url.split(marker)[1] : '';
      }).filter(Boolean)
    );
    if (imageDeleteError) console.warn(imageDeleteError.message);
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) return setError(error.message);
    setProperties((current) => current.filter((item) => item.id !== id));
  }

  if (loading) return <main className="loadingScreen">Duke ngarkuar panelin...</main>;

  return (
    <main className="dashboard">
      <aside className="adminSidebar">
        <div className="brand"><img src="/logo-icon.png" alt="" className="brandLogo"/><span>Hapësira<span>360</span></span></div>
        <nav><Link className="active" href="/dashboard"><Building2/> Pronat</Link><Link href="/shto-prone"><Plus/> Shto pronë</Link></nav>
        <button onClick={logout}><LogOut/> Dil</button>
      </aside>
      <section className="dashboardContent">
        <div className="dashboardHead"><div><p className="eyebrow">Paneli administrativ</p><h1>Menaxho pronat</h1></div><Link className="darkButton" href="/shto-prone"><Plus/> Shto pronë</Link></div>
        <div className="stats"><article><span>Gjithsej</span><strong>{properties.length}</strong></article><article><span>Në shitje</span><strong>{properties.filter(p=>p.status==='sale').length}</strong></article><article><span>Me qira</span><strong>{properties.filter(p=>p.status==='rent').length}</strong></article></div>
        {error && <div className="formErrorBox">{error}</div>}
        <div className="adminTable"><div className="tableHead"><h2>Pronat</h2><span>Të dhëna reale</span></div>
          {!properties.length && <div className="emptyState">Ende nuk ke publikuar prona. Kliko “Shto pronë”.</div>}
          {properties.map(p=><div className="tableRow" key={p.id}><div><b>{p.title}</b><span>{p.city} · {p.area || 0} m²</span></div><strong>€{Number(p.price).toLocaleString('de-DE')}</strong><span className="status">{p.published ? 'Publikuar' : 'Draft'}</span><div className="rowActions"><Link href={`/prona/${p.id}`} title="Shiko"><ExternalLink size={18}/></Link><button onClick={()=>removeProperty(p.id)} title="Fshi"><Trash2 size={18}/></button></div></div>)}
        </div>
      </section>
    </main>
  );
}

'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { properties } from '@/lib/demo-data';
import { Building2, Plus, LogOut } from 'lucide-react';

export default function DashboardPage() {
 const router=useRouter(); const [ready,setReady]=useState(false);
 useEffect(()=>{if(sessionStorage.getItem('h360-admin')!=='true') router.replace('/h360-admin'); else setReady(true)},[router]);
 if(!ready) return null;
 return <main className="dashboard"><aside className="adminSidebar"><div className="brand"><span className="brandMark">H</span><span>Hapësira<span>360</span></span></div><nav><Link className="active" href="/dashboard"><Building2/> Pronat</Link><Link href="/shto-prone"><Plus/> Shto pronë</Link></nav><button onClick={()=>{sessionStorage.removeItem('h360-admin');router.push('/h360-admin')}}><LogOut/> Dil</button></aside><section className="dashboardContent"><div className="dashboardHead"><div><p className="eyebrow">Paneli administrativ</p><h1>Mirë se erdhe, Ervin</h1></div><Link className="darkButton" href="/shto-prone"><Plus/> Shto pronë</Link></div><div className="stats"><article><span>Prona aktive</span><strong>{properties.length}</strong></article><article><span>Në shitje</span><strong>{properties.filter(p=>p.purpose==='shitje').length}</strong></article><article><span>Me qira</span><strong>{properties.filter(p=>p.purpose==='qira').length}</strong></article></div><div className="adminTable"><div className="tableHead"><h2>Pronat</h2><span>Demo data</span></div>{properties.map(p=><div className="tableRow" key={p.id}><div><b>{p.title}</b><span>{p.city} · {p.area} m²</span></div><strong>€{p.price.toLocaleString('de-DE')}</strong><span className="status">Publikuar</span><Link href={`/prona/${p.id}`}>Shiko</Link></div>)}</div></section></main>
}

import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import SearchBox from '@/components/SearchBox';
import { getPublishedProperties } from '@/lib/properties';
import { ArrowRight, Camera, MapPinned, ScanLine, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  const properties = await getPublishedProperties(true);
  const featured = properties.slice(0, 4);
  return <><Header/><main>
    <section className="hero"><div className="heroOverlay"/><div className="container heroContent"><div className="heroCopy"><p className="heroEyebrow"><span/> Platformë moderne për prona</p><h1>Gjej hapësirën që të përshtatet.</h1><p className="heroIntro">Prona në shitje dhe me qira në Kosovë, të prezantuara me fotografi të qarta, lokacion dhe vizita virtuale 360°.</p></div><SearchBox/><div className="heroTrust"><span><ShieldCheck size={17}/> Listime të qarta</span><span><ScanLine size={17}/> Vizita 360° kur janë në dispozicion</span><span><MapPinned size={17}/> Lokacion në hartë</span></div></div></section>
    <section className="section container"><div className="sectionHeading"><div><p className="eyebrow">Përzgjedhja jonë</p><h2>Prona të veçuara</h2><p className="sectionLead">Listimet më të fundit për shitje dhe me qira.</p></div><Link href="/kerko">Shiko të gjitha <ArrowRight size={18}/></Link></div><div className="propertyGrid">{featured.map(p=><PropertyCard key={p.id} property={p}/>)}</div></section>
    <section className="experienceSection"><div className="container experienceGrid"><div className="experienceCopy"><p className="eyebrow">Përvoja Hapësira360</p><h2>Shiko më shumë para se ta vizitosh.</h2><p>Fotografi, detaje, vizitë 360° kur ekziston dhe lokacion në Google Maps.</p><Link href="/kerko" className="darkButton">Eksploro pronat <ArrowRight size={18}/></Link></div><div className="featureCards"><article><div className="featureIcon"><Camera/></div><div><h3>Fotografi të qarta</h3><p>Pamje që të ndihmojnë ta kuptosh pronën.</p></div></article><article><div className="featureIcon"><ScanLine/></div><div><h3>Vizitë virtuale 360°</h3><p>Hyr në pronë nga telefoni kur turi është i disponueshëm.</p></div></article><article><div className="featureIcon"><MapPinned/></div><div><h3>Vendndodhje në hartë</h3><p>Shiko zonën dhe qasjen përmes Google Maps.</p></div></article></div></div></section>
    <section className="ctaSection"><div className="container ctaInner"><div><p className="eyebrow">Hapësira jote e ardhshme</p><h2>Shitje apo me qira?</h2><p>Filtro pronat sipas qytetit, llojit dhe buxhetit.</p></div><div className="ctaActions"><Link href="/kerko?purpose=shitje" className="darkButton">Prona në shitje</Link><Link href="/kerko?purpose=qira" className="lightButton">Prona me qira</Link></div></div></section>
  </main><footer id="kontakt" className="footer"><div className="container footerInner"><div><div className="brand footerBrand"><img src="/logo-icon.png" alt="" className="footerLogo"/><span>Hapësira<span>360</span></span></div><p>Platformë moderne për prona në Kosovë.</p></div><div><strong>Kontakt</strong><a href="mailto:info@hapesira360.com">info@hapesira360.com</a></div></div><div className="container footerBottom">© 2026 Hapësira360. Të gjitha të drejtat e rezervuara.</div></footer></>;
}

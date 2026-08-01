import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import SearchBox from '@/components/SearchBox';
import { properties } from '@/lib/demo-data';
import { ArrowRight, Camera, MapPin, ScanLine } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featured = properties.filter((property) => property.featured && property.published);
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="heroOverlay" />
          <div className="container heroContent">
            <p className="heroEyebrow">Prona të prezantuara ndryshe</p>
            <h1>Gjej hapësirën që të përshtatet.</h1>
            <p>Eksploro prona në shitje dhe me qira përmes fotografive cilësore dhe vizitave virtuale 360°.</p>
            <SearchBox />
          </div>
        </section>

        <section className="section container">
          <div className="sectionHeading"><div><p className="eyebrow">Përzgjedhja jonë</p><h2>Prona të veçuara</h2></div><Link href="/kerko">Shiko të gjitha <ArrowRight size={18}/></Link></div>
          <div className="propertyGrid">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div>
        </section>

        <section className="experienceSection">
          <div className="container experienceGrid">
            <div><p className="eyebrow">Përvoja Hapësira360</p><h2>Shiko më shumë para se ta vizitosh.</h2><p>Çdo listim është i qartë, i pastër dhe i lehtë për t’u eksploruar. Kur vizita 360° është e disponueshme, mund të hysh virtualisht në pronë nga telefoni yt.</p><Link href="/kerko" className="darkButton">Eksploro pronat <ArrowRight size={18}/></Link></div>
            <div className="featureCards">
              <article><Camera/><h3>Fotografi të qarta</h3><p>Galeritë fokusohen vetëm te ajo që duhet të shohësh.</p></article>
              <article><ScanLine/><h3>Vizitë 360°</h3><p>Ec virtualisht nëpër pronë kur turi është në dispozicion.</p></article>
              <article><MapPin/><h3>Vendndodhja</h3><p>Shiko zonën e pronës drejtpërdrejt në Google Maps.</p></article>
            </div>
          </div>
        </section>
      </main>
      <footer id="kontakt" className="footer"><div className="container footerInner"><div><div className="brand footerBrand"><span className="brandMark">H</span><span>Hapësira<span>360</span></span></div><p>Platformë moderne për prona në Kosovë.</p></div><div><strong>Kontakt</strong><a href="tel:+38344111222">+383 44 111 222</a><a href="mailto:info@hapesira360.com">info@hapesira360.com</a></div></div></footer>
    </>
  );
}

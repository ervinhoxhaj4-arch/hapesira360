import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import SearchBox from '@/components/SearchBox';
import { getPublishedProperties } from '@/lib/properties';
import { getTranslations } from '@/lib/i18n/translations';
import {
  ArrowRight,
  Camera,
  MapPinned,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function EnglishHomePage() {
  const properties = await getPublishedProperties(true);
  const t = getTranslations('en');

  const featuredProperties = properties.filter(
    (property) => property.featured
  );

  const normalProperties = properties.filter(
    (property) => !property.featured
  );

  const featured = [
    ...featuredProperties,
    ...normalProperties,
  ].slice(0, 4);

  return (
    <>
      <Header />

      <main>
        <section className="hero">
          <div className="heroOverlay" />

          <div className="container heroContent">
            <div className="heroCopy">
              <p className="heroEyebrow">
                <span />
                {t.homepage.eyebrow}
              </p>

              <h1>{t.homepage.title}</h1>

              <p className="heroIntro">
                {t.homepage.intro}
              </p>
            </div>

            <SearchBox />

            <div className="heroTrust">
              <span>
                <ShieldCheck size={17} />
                Clear listings
              </span>

              <span>
                <ScanLine size={17} />
                360° tours when available
              </span>

              <span>
                <MapPinned size={17} />
                Map location
              </span>
            </div>
          </div>
        </section>

        <section className="section container">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                {t.homepage.featuredEyebrow}
              </p>

              <h2>{t.homepage.featuredTitle}</h2>

              <p className="sectionLead">
                {t.homepage.featuredText}
              </p>
            </div>

            <Link href="/en/kerko">
              {t.homepage.viewAll}
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="propertyGrid">
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        </section>

        <section className="experienceSection">
          <div className="container experienceGrid">
            <div className="experienceCopy">
              <p className="eyebrow">
                {t.homepage.experienceEyebrow}
              </p>

              <h2>
                {t.homepage.experienceTitle}
              </h2>

              <p>
                {t.homepage.experienceText}
              </p>

              <Link
                href="/en/kerko"
                className="darkButton"
              >
                {t.homepage.explore}
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="featureCards">
              <article>
                <div className="featureIcon">
                  <Camera />
                </div>

                <div>
                  <h3>Clear photography</h3>
                  <p>
                    Images that help visitors understand
                    the property.
                  </p>
                </div>
              </article>

              <article>
                <div className="featureIcon">
                  <ScanLine />
                </div>

                <div>
                  <h3>Virtual 360° tour</h3>
                  <p>
                    Explore the property from your phone
                    when a tour is available.
                  </p>
                </div>
              </article>

              <article>
                <div className="featureIcon">
                  <MapPinned />
                </div>

                <div>
                  <h3>Map location</h3>
                  <p>
                    View the area and access through
                    Google Maps.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="ctaSection">
          <div className="container ctaInner">
            <div>
              <p className="eyebrow">
                {t.homepage.nextSpace}
              </p>

              <h2>{t.homepage.saleOrRent}</h2>

              <p>{t.homepage.filterText}</p>
            </div>

            <div className="ctaActions">
              <Link
                href="/en/kerko?purpose=shitje"
                className="darkButton"
              >
                {t.homepage.propertiesForSale}
              </Link>

              <Link
                href="/en/kerko?purpose=qira"
                className="lightButton"
              >
                {t.homepage.propertiesForRent}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontakt" className="footer">
        <div className="container footerInner">
          <div>
            <div className="brand footerBrand">
              <img
                src="/logo-icon.png"
                alt=""
                className="footerLogo"
              />

              <span>
                Hapësira<span>360</span>
              </span>
            </div>

            <p>{t.footer.description}</p>
          </div>

          <div>
            <strong>{t.footer.contact}</strong>

            <a href="mailto:info@hapesira360.com">
              info@hapesira360.com
            </a>
          </div>
        </div>

        <div className="container footerBottom">
          © 2026 Hapësira360. {t.footer.copyright}
        </div>
      </footer>
    </>
  );
}
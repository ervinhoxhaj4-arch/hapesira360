'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ExternalLink,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';

import { getAdminProperties } from '@/lib/properties';
import { supabase } from '@/lib/supabase';
import type { DbProperty } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<DbProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProperties() {
      try {
        setError('');

        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!data.session) {
          router.replace('/h360-admin');
          return;
        }

        const adminProperties = await getAdminProperties();
        setProperties(adminProperties);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Nuk u ngarkuan pronat.'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProperties();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/h360-admin');
    router.refresh();
  }

  async function removeProperty(id: string) {
    const confirmed = window.confirm(
      'A je i sigurt që dëshiron ta fshish këtë pronë?'
    );

    if (!confirmed) return;

    setError('');

    const property = properties.find((item) => item.id === id);

    const imagePaths =
      property?.property_images
        ?.map((image) => {
          const marker = '/property-images/';

          if (!image.image_url.includes(marker)) {
            return '';
          }

          return image.image_url.split(marker)[1] ?? '';
        })
        .filter(Boolean) ?? [];

    if (imagePaths.length > 0) {
      const { error: imageDeleteError } = await supabase.storage
        .from('property-images')
        .remove(imagePaths);

      if (imageDeleteError) {
        console.warn(imageDeleteError.message);
      }
    }

    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setProperties((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  if (loading) {
    return (
      <main className="loadingScreen">
        Duke ngarkuar panelin...
      </main>
    );
  }

  const totalProperties = properties.length;

  const saleProperties = properties.filter(
    (property) => property.status === 'sale'
  ).length;

  const rentProperties = properties.filter(
    (property) => property.status === 'rent'
  ).length;

  return (
    <main className="dashboard">
      <aside className="adminSidebar">
        <Link
          href="/dashboard"
          className="adminBrand"
          aria-label="Hapësira360 Dashboard"
        >
          <Image
            src="/logo-icon.png"
            alt=""
            width={44}
            height={44}
            className="adminBrandLogo"
            priority
          />

          <span className="adminBrandText">
            Hapësira<span>360</span>
          </span>
        </Link>

        <nav className="adminNav" aria-label="Navigimi administrativ">
          <Link className="active" href="/dashboard">
            <Building2 size={20} />
            Pronat
          </Link>

          <Link href="/shto-prone">
            <Plus size={20} />
            Shto pronë
          </Link>
        </nav>

        <button
          type="button"
          className="adminLogout"
          onClick={logout}
        >
          <LogOut size={20} />
          Dil
        </button>
      </aside>

      <section className="dashboardContent">
        <div className="dashboardHead">
          <div>
            <p className="eyebrow">Paneli administrativ</p>
            <h1>Menaxho pronat</h1>
          </div>

          <Link className="darkButton" href="/shto-prone">
            <Plus size={20} />
            Shto pronë
          </Link>
        </div>

        <div className="stats">
          <article>
            <span>Gjithsej</span>
            <strong>{totalProperties}</strong>
          </article>

          <article>
            <span>Në shitje</span>
            <strong>{saleProperties}</strong>
          </article>

          <article>
            <span>Me qira</span>
            <strong>{rentProperties}</strong>
          </article>
        </div>

        {error && (
          <div className="formErrorBox">
            {error}
          </div>
        )}

        <div className="adminTable">
          <div className="tableHead">
            <h2>Pronat</h2>
            <span>Të dhëna reale</span>
          </div>

          {properties.length === 0 && (
            <div className="emptyState">
              Ende nuk ke publikuar prona. Kliko “Shto pronë”.
            </div>
          )}

          {properties.map((property) => (
            <div className="tableRow" key={property.id}>
              <div className="propertySummary">
                <b>{property.title}</b>
                <span>
                  {property.city} · {property.area ?? 0} m²
                </span>
              </div>

              <strong>
                €{Number(property.price).toLocaleString('de-DE')}
              </strong>

              <span
                className={
                  property.published
                    ? 'status published'
                    : 'status draft'
                }
              >
                {property.published ? 'Publikuar' : 'Draft'}
              </span>

              <div className="rowActions">
  <Link
    href={`/dashboard/prona/${property.id}/edit`}
    title="Ndrysho pronën"
    aria-label="Ndrysho pronën"
  >
    <Pencil size={18} />
  </Link>

  <Link
    href={`/prona/${property.id}`}
    title="Shiko pronën"
    aria-label="Shiko pronën"
  >
    <ExternalLink size={18} />
  </Link>

  <button
    type="button"
    onClick={() => removeProperty(property.id)}
    title="Fshi pronën"
    aria-label="Fshi pronën"
  >
    <Trash2 size={18} />
  </button>
</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
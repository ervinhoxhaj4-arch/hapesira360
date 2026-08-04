'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ImagePlus,
  Save,
  X,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-');
}

export default function AddPropertyPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace('/h360-admin');
        return;
      }

      setReady(true);
    }

    void checkSession();
  }, [router]);

  function chooseFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(
      event.target.files || []
    );

    setFiles(selected.slice(0, 30));
  }

  async function save(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const submitter = (
      event.nativeEvent as SubmitEvent
    ).submitter as HTMLButtonElement | null;

    const published = submitter?.value !== 'draft';

    setLoading(true);
    setError('');
    setMessage('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const googleMapsUrl = String(
  form.get('google_maps_url') || ''
).trim();

let resolvedLatitude: number | null = null;
let resolvedLongitude: number | null = null;

if (googleMapsUrl) {
  const mapsResponse = await fetch(
    '/api/resolve-google-maps',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        googleMapsUrl,
      }),
    }
  );

  const mapsResult = await mapsResponse.json();

  if (!mapsResponse.ok) {
    setError(
      mapsResult.error ||
        'Google Maps link could not be processed.'
    );
    setLoading(false);
    return;
  }

  resolvedLatitude = mapsResult.latitude;
  resolvedLongitude = mapsResult.longitude;
}

    const payload = {
      title: String(form.get('title') || '').trim(),

      status:
        String(form.get('status')) === 'rent'
          ? 'rent'
          : 'sale',

      property_type: String(
        form.get('property_type') || 'Apartament'
      ),

      city: String(form.get('city') || '').trim(),

      address:
        String(form.get('address') || '').trim() ||
        null,

      whatsapp:
        String(form.get('whatsapp') || '').trim() ||
        null,

      price: Number(form.get('price')),

      area:
        Number(form.get('area')) || null,

      bedrooms:
        Number(form.get('bedrooms')) || null,

      bathrooms:
        Number(form.get('bathrooms')) || null,

      floor:
        Number(form.get('floor')) || null,

      description:
        String(form.get('description') || '').trim() ||
        null,

      tour360_url:
        String(form.get('tour360_url') || '').trim() ||
        null,

      google_maps_url:
  googleMapsUrl || null,

latitude:
  resolvedLatitude,

longitude:
  resolvedLongitude,
    };

    const {
      data: property,
      error: propertyError,
    } = await supabase
      .from('properties')
      .insert(payload)
      .select()
      .single();

    if (propertyError) {
      setError(propertyError.message);
      setLoading(false);
      return;
    }

    const uploaded: {
      property_id: string;
      image_url: string;
      cover: boolean;
    }[] = [];

    for (
      let index = 0;
      index < files.length;
      index++
    ) {
      const file = files[index];

      const path =
        `${property.id}/` +
        `${crypto.randomUUID()}-` +
        safeFileName(file.name);

      const { error: uploadError } =
        await supabase.storage
          .from('property-images')
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
          });

      if (uploadError) {
        setError(
          `Prona u ruajt, por fotografia nuk u ngarkua: ${uploadError.message}`
        );

        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(path);

      uploaded.push({
        property_id: property.id,
        image_url: data.publicUrl,
        cover: index === 0,
      });
    }

    if (uploaded.length > 0) {
      const { error: imagesError } = await supabase
        .from('property_images')
        .insert(uploaded);

      if (imagesError) {
        setError(imagesError.message);
        setLoading(false);
        return;
      }
    }

    setMessage(
      published
        ? 'Prona u publikua me sukses.'
        : 'Drafti u ruajt me sukses.'
    );

    formElement.reset();
    setFiles([]);

    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 900);
  }

  if (!ready) {
    return null;
  }

  return (
    <main className="addPage">
      <div className="container">
        <Link
          href="/dashboard"
          className="backLink"
        >
          <ArrowLeft />
          Kthehu në panel
        </Link>

        <div className="addHead">
          <div>
            <p className="eyebrow">
              Paneli administrativ
            </p>

            <h1>Shto pronë</h1>
          </div>
        </div>

        <form
          className="propertyForm"
          onSubmit={save}
        >
          <section>
            <h2>Informacioni kryesor</h2>

            <div className="formGrid">
              <label className="wide">
                Titulli

                <input
                  name="title"
                  required
                  placeholder="p.sh. Apartament modern në Prizren"
                />
              </label>

              <label>
                Qëllimi

                <select name="status">
                  <option value="sale">
                    Shitje
                  </option>

                  <option value="rent">
                    Me Qira
                  </option>
                </select>
              </label>

              <label>
                Lloji

                <select name="property_type">
                  <option>Apartament</option>
                  <option>Shtëpi</option>
                  <option>Vilë</option>
                  <option>Lokal</option>
                  <option>Truall</option>
                </select>
              </label>

              <label className="featuredToggle wide">
                <input
                  type="checkbox"
                  name="featured"
                />

                <span>
                  <strong>Pronë e veçuar</strong>

                  <small>
                    Shfaqe këtë pronë me përparësi në ballinë dhe në rezultate.
                  </small>
                </span>
              </label>

              <label>
                Qyteti

                <input
                  name="city"
                  required
                  placeholder="Prizren"
                />
              </label>

              <label>
                Lagjja / adresa

                <input
                  name="address"
                  placeholder="Bazhdarhane"
                />
              </label>

              <label className="wide">
                Numri i WhatsApp
                <small> (opsional)</small>

                <input
                  name="whatsapp"
                  type="tel"
                  placeholder="38344111222"
                />
              </label>

              <label>
                Çmimi (€)

                <input
                  name="price"
                  type="number"
                  min="0"
                  required
                />
              </label>

              <label>
                Sipërfaqja (m²)

                <input
                  name="area"
                  type="number"
                  min="0"
                  required
                />
              </label>

              <label>
                Dhoma

                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                />
              </label>

              <label>
                Banjo

                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                />
              </label>

              <label>
                Kati

                <input
                  name="floor"
                  type="number"
                />
              </label>

              <label className="wide">
                Përshkrimi

                <textarea
                  name="description"
                  rows={6}
                />
              </label>
            </div>
          </section>

          <section>
            <h2>Fotografitë</h2>

            <label className="uploadBox">
              <ImagePlus />

              <strong>
                Zgjidh fotografitë
              </strong>

              <span>
                Mund të ngarkosh deri në 30 fotografi. E para bëhet kopertina.
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={chooseFiles}
              />
            </label>

            {files.length > 0 && (
              <div className="selectedFiles">
                <strong>
                  {files.length} fotografi të zgjedhura
                </strong>

                <button
                  type="button"
                  onClick={() => setFiles([])}
                >
                  <X size={17} />
                  Pastro
                </button>
              </div>
            )}
          </section>

          <section>
            <h2>Vizita 360° dhe harta</h2>

            <div className="formGrid">
              <label className="wide">
                Linku i vizitës 360°
                <small> (opsional)</small>

                <input
                  name="tour360_url"
                  type="url"
                  placeholder="https://..."
                />
              </label>

              <label className="wide">
                Linku i Google Maps
                <small> (opsional)</small>

                <input
                  name="google_maps_url"
                  type="url"
                  placeholder="https://maps.google.com/..."
                />
              </label>
              <label className="wide">
  Linku i Google Maps
  <small> (opsional)</small>

  <input
    name="google_maps_url"
    type="url"
    placeholder="https://maps.app.goo.gl/..."
  />
</label>

            
            </div>
          </section>

          {message && (
            <div className="successBox">
              {message}
            </div>
          )}

          {error && (
            <div className="formErrorBox">
              {error}
            </div>
          )}

          <div className="formActions">
            <button
              type="submit"
              name="intent"
              value="draft"
              className="secondary"
              disabled={loading}
            >
              Ruaj draft
            </button>

            <button
              type="submit"
              name="intent"
              value="publish"
              disabled={loading}
            >
              <Save />

              {loading
                ? 'Duke ruajtur...'
                : 'Publiko pronën'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
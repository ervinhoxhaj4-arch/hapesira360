'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ImagePlus,
  Save,
  Trash2,
  X,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import type { DbProperty } from '@/lib/types';

type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  cover: boolean;
};

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-');
}

function getStoragePath(publicUrl: string) {
  const marker = '/property-images/';

  if (!publicUrl.includes(marker)) {
    return '';
  }

  return publicUrl.split(marker)[1] ?? '';
}

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const propertyId = params.id;

  const [property, setProperty] =
    useState<DbProperty | null>(null);

  const [existingImages, setExistingImages] =
    useState<PropertyImage[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProperty() {
      try {
        const { data: sessionData } =
          await supabase.auth.getSession();

        if (!sessionData.session) {
          router.replace('/h360-admin');
          return;
        }

        const { data, error: propertyError } = await supabase
          .from('properties')
          .select('*, property_images(*)')
          .eq('id', propertyId)
          .single();

        if (propertyError) {
          throw propertyError;
        }

        setProperty(data);

        setExistingImages(
          (data.property_images || []) as PropertyImage[]
        );

        setReady(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Prona nuk u ngarkua.'
        );

        setReady(true);
      }
    }

    void loadProperty();
  }, [propertyId, router]);

  function chooseFiles(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(
      event.target.files || []
    );

    setNewFiles(selected.slice(0, 30));
  }

  async function deleteImage(image: PropertyImage) {
    const confirmed = window.confirm(
      'A dëshiron ta fshish këtë fotografi?'
    );

    if (!confirmed) return;

    setError('');

    const path = getStoragePath(image.image_url);

    if (path) {
      const { error: storageError } =
        await supabase.storage
          .from('property-images')
          .remove([path]);

      if (storageError) {
        setError(storageError.message);
        return;
      }
    }

    const { error: databaseError } = await supabase
      .from('property_images')
      .delete()
      .eq('id', image.id);

    if (databaseError) {
      setError(databaseError.message);
      return;
    }

    setExistingImages((current) =>
      current.filter((item) => item.id !== image.id)
    );
  }

  async function setCoverImage(imageId: string) {
    setError('');

    const { error: resetError } = await supabase
      .from('property_images')
      .update({ cover: false })
      .eq('property_id', propertyId);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    const { error: coverError } = await supabase
      .from('property_images')
      .update({ cover: true })
      .eq('id', imageId);

    if (coverError) {
      setError(coverError.message);
      return;
    }

    setExistingImages((current) =>
      current.map((image) => ({
        ...image,
        cover: image.id === imageId,
      }))
    );

    setMessage('Fotografia e kopertinës u ndryshua.');
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

    const form = new FormData(event.currentTarget);

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

      price: Number(form.get('price')),

      area: Number(form.get('area')) || null,

      bedrooms:
        Number(form.get('bedrooms')) || null,

      bathrooms:
        Number(form.get('bathrooms')) || null,

      floor: Number(form.get('floor')) || null,

      description:
        String(form.get('description') || '').trim() ||
        null,

      tour360_url:
        String(form.get('tour360_url') || '').trim() ||
        null,

      google_maps_url:
        String(
          form.get('google_maps_url') || ''
        ).trim() || null,

      latitude:
        Number(form.get('latitude')) || null,

      longitude:
        Number(form.get('longitude')) || null,

        featured: form.get('featured') === 'on',

      published,
    };

    const { error: updateError } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', propertyId);

    if (updateError) {
      setError(updateError.message);
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
      index < newFiles.length;
      index++
    ) {
      const file = newFiles[index];

      const path =
        `${propertyId}/` +
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
          `Prona u ndryshua, por fotografia nuk u ngarkua: ${uploadError.message}`
        );

        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from('property-images')
        .getPublicUrl(path);

      uploaded.push({
        property_id: propertyId,
        image_url: data.publicUrl,
        cover:
          existingImages.length === 0 &&
          index === 0,
      });
    }

    if (uploaded.length > 0) {
      const { data: insertedImages, error: imagesError } =
        await supabase
          .from('property_images')
          .insert(uploaded)
          .select();

      if (imagesError) {
        setError(imagesError.message);
        setLoading(false);
        return;
      }

      setExistingImages((current) => [
        ...current,
        ...((insertedImages || []) as PropertyImage[]),
      ]);
    }

    setNewFiles([]);

    setMessage(
      published
        ? 'Ndryshimet u publikuan me sukses.'
        : 'Ndryshimet u ruajtën si draft.'
    );

    setLoading(false);

    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 900);
  }

  if (!ready) {
    return (
      <main className="loadingScreen">
        Duke ngarkuar pronën...
      </main>
    );
  }

  if (!property) {
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

          <div className="formErrorBox">
            {error || 'Prona nuk u gjet.'}
          </div>
        </div>
      </main>
    );
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

            <h1>Ndrysho pronën</h1>
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
                  defaultValue={property.title}
                />
              </label>

              <label>
                Qëllimi
                <select
                  name="status"
                  defaultValue={property.status}
                >
                  <option value="sale">Shitje</option>
                  <option value="rent">
                    Me Qira
                  </option>
                </select>
              </label>


<label>
  Lloji
  <select
    name="property_type"
    defaultValue={property.property_type}
  >
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
    defaultChecked={property.featured}
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
                  defaultValue={property.city}
                />
              </label>

              <label>
                Lagjja / adresa
                <input
                  name="address"
                  defaultValue={
                    property.address || ''
                  }
                />
              </label>

              <label>
                Çmimi (€)
                <input
                  name="price"
                  type="number"
                  min="0"
                  required
                  defaultValue={property.price}
                />
              </label>

              <label>
                Sipërfaqja (m²)
                <input
                  name="area"
                  type="number"
                  min="0"
                  required
                  defaultValue={
                    property.area || ''
                  }
                />
              </label>

              <label>
                Dhoma
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  defaultValue={
                    property.bedrooms || ''
                  }
                />
              </label>

              <label>
                Banjo
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  defaultValue={
                    property.bathrooms || ''
                  }
                />
              </label>

              <label>
                Kati
                <input
                  name="floor"
                  type="number"
                  defaultValue={
                    property.floor || ''
                  }
                />
              </label>

              <label className="wide">
                Përshkrimi
                <textarea
                  name="description"
                  rows={6}
                  defaultValue={
                    property.description || ''
                  }
                />
              </label>
            </div>
          </section>

          <section>
            <h2>Fotografitë ekzistuese</h2>

            {existingImages.length === 0 && (
              <p className="sectionLead">
                Kjo pronë nuk ka fotografi.
              </p>
            )}

            <div className="adminImageGrid">
              {existingImages.map((image) => (
                <article
                  className="adminImageCard"
                  key={image.id}
                >
                  <img
                    src={image.image_url}
                    alt="Fotografi e pronës"
                  />

                  {image.cover && (
                    <span className="coverLabel">
                      Kopertina
                    </span>
                  )}

                  <div className="adminImageActions">
                    {!image.cover && (
                      <button
                        type="button"
                        onClick={() =>
                          setCoverImage(image.id)
                        }
                      >
                        Bëje kopertinë
                      </button>
                    )}

                    <button
                      type="button"
                      className="deleteImageButton"
                      onClick={() =>
                        deleteImage(image)
                      }
                    >
                      <Trash2 size={16} />
                      Fshi
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2>Shto fotografi të reja</h2>

            <label className="uploadBox">
              <ImagePlus />

              <strong>
                Zgjidh fotografitë
              </strong>

              <span>
                Mund të ngarkosh deri në 30
                fotografi.
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={chooseFiles}
              />
            </label>

            {newFiles.length > 0 && (
              <div className="selectedFiles">
                <strong>
                  {newFiles.length} fotografi të
                  zgjedhura
                </strong>

                <button
                  type="button"
                  onClick={() => setNewFiles([])}
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
                  defaultValue={
                    property.tour360_url || ''
                  }
                  placeholder="https://..."
                />
              </label>

              <label className="wide">
                Linku i Google Maps
                <small> (opsional)</small>

                <input
                  name="google_maps_url"
                  type="url"
                  defaultValue={
                    property.google_maps_url || ''
                  }
                  placeholder="https://maps.google.com/..."
                />
              </label>

              <label>
                Latitude
                <input
                  name="latitude"
                  inputMode="decimal"
                  defaultValue={
                    property.latitude || ''
                  }
                />
              </label>

              <label>
                Longitude
                <input
                  name="longitude"
                  inputMode="decimal"
                  defaultValue={
                    property.longitude || ''
                  }
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
                : 'Ruaj ndryshimet'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
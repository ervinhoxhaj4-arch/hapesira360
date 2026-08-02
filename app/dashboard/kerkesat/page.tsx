'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

type PropertyInquiry = {
  id: string;
  property_id: string;
  property_title: string;
  full_name: string;
  phone: string;
  email: string | null;
  message: string | null;
  created_at: string;
};

export default function InquiriesPage() {
  const router = useRouter();

  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInquiries() {
      try {
        const { data: sessionData } =
          await supabase.auth.getSession();

        if (!sessionData.session) {
          router.replace('/h360-admin');
          return;
        }

        const { data, error: inquiriesError } = await supabase
          .from('property_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (inquiriesError) {
          throw inquiriesError;
        }

        setInquiries(data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Kërkesat nuk u ngarkuan.'
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInquiries();
  }, [router]);

  async function deleteInquiry(id: string) {
    const confirmed = window.confirm(
      'A je i sigurt që dëshiron ta fshish këtë kërkesë?'
    );

    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from('property_inquiries')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setInquiries((current) =>
      current.filter((inquiry) => inquiry.id !== id)
    );
  }

  if (loading) {
    return (
      <main className="loadingScreen">
        Duke ngarkuar kërkesat...
      </main>
    );
  }

  return (
    <main className="addPage">
      <div className="container">
        <Link href="/dashboard" className="backLink">
          <ArrowLeft />
          Kthehu në panel
        </Link>

        <div className="inquiriesHeader">
          <div>
            <p className="eyebrow">Paneli administrativ</p>
            <h1>Kërkesat për vizitë</h1>
          </div>

          <div className="inquiriesCount">
            {inquiries.length} kërkesa
          </div>
        </div>

        {error && (
          <div className="formErrorBox">
            {error}
          </div>
        )}

        {inquiries.length === 0 ? (
          <div className="emptyState inquiriesEmpty">
            Ende nuk ka kërkesa për vizitë.
          </div>
        ) : (
          <div className="inquiriesGrid">
            {inquiries.map((inquiry) => {
              const whatsappPhone = inquiry.phone.replace(/\D/g, '');

              return (
                <article className="inquiryCard" key={inquiry.id}>
                  <div className="inquiryCardTop">
                    <div>
                      <p className="eyebrow">
                        {new Date(inquiry.created_at).toLocaleDateString(
                          'sq-AL'
                        )}
                      </p>

                      <h2>{inquiry.full_name}</h2>

                      <Link
                        href={`/prona/${inquiry.property_id}`}
                        className="inquiryProperty"
                      >
                        {inquiry.property_title}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteInquiry(inquiry.id)}
                      aria-label="Fshi kërkesën"
                      title="Fshi kërkesën"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="inquiryContacts">
                    <a href={`tel:${inquiry.phone}`}>
                      <Phone size={17} />
                      {inquiry.phone}
                    </a>

                    <a
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={17} />
                      WhatsApp
                    </a>

                    {inquiry.email && (
                      <a href={`mailto:${inquiry.email}`}>
                        <Mail size={17} />
                        {inquiry.email}
                      </a>
                    )}
                  </div>

                  {inquiry.message && (
                    <div className="inquiryMessage">
                      <strong>Mesazhi</strong>
                      <p>{inquiry.message}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
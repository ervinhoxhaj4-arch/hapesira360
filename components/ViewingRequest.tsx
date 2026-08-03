'use client';

import { FormEvent, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import { supabase } from '@/lib/supabase';

type ViewingRequestProps = {
  propertyId: string;
  propertyTitle: string;
};

export default function ViewingRequest({
  propertyId,
  propertyTitle,
}: ViewingRequestProps) {
  const pathname = usePathname();

  const isEnglish =
    pathname === '/en' ||
    pathname.startsWith('/en/');

  const text = isEnglish
    ? {
        eyebrow: 'Request a viewing',
        title: 'See the property in person',
        fullName: 'Full name',
        fullNamePlaceholder: 'Your name',
        phone: 'Phone number',
        email: 'Email',
        message: 'Message',
        messagePlaceholder:
          'When would you like to view the property?',
        success:
          'Your viewing request was sent successfully.',
        savedButEmailFailed:
          'Your request was saved, but the email notification could not be sent.',
        loading: 'Sending...',
        submit: 'Request a viewing',
      }
    : {
        eyebrow: 'Cakto një vizitë',
        title: 'Shiko pronën nga afër',
        fullName: 'Emri dhe mbiemri',
        fullNamePlaceholder: 'Emri juaj',
        phone: 'Numri i telefonit',
        email: 'Email',
        message: 'Mesazhi',
        messagePlaceholder:
          'Kur dëshironi ta vizitoni pronën?',
        success:
          'Kërkesa u dërgua me sukses.',
        savedButEmailFailed:
          'Kërkesa u ruajt, por njoftimi me email nuk u dërgua.',
        loading: 'Duke dërguar...',
        submit: 'Kërko një vizitë',
      };

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState('');

  async function submitRequest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError('');

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const payload = {
      property_id: propertyId,
      property_title: propertyTitle,

      full_name: String(
        form.get('full_name') || ''
      ).trim(),

      phone: String(
        form.get('phone') || ''
      ).trim(),

      email:
        String(
          form.get('email') || ''
        ).trim() || null,

      message:
        String(
          form.get('message') || ''
        ).trim() || null,
    };

    const { error: insertError } =
      await supabase
        .from('property_inquiries')
        .insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    const emailResponse = await fetch(
      '/api/viewing-request',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          propertyId,
          propertyTitle,
          fullName: payload.full_name,
          phone: payload.phone,
          email: payload.email,
          message: payload.message,
        }),
      }
    );

    if (!emailResponse.ok) {
      const result = await emailResponse
        .json()
        .catch(() => null);

      setError(
        result?.error ||
          text.savedButEmailFailed
      );

      setLoading(false);
      return;
    }

    formElement.reset();
    setSuccess(true);
    setLoading(false);
  }

  return (
    <section className="viewingRequest">
      <div className="viewingRequestHead">
        <CalendarDays />

        <div>
          <p className="eyebrow">
            {text.eyebrow}
          </p>

          <h3>{text.title}</h3>
        </div>
      </div>

      <form onSubmit={submitRequest}>
        <label>
          {text.fullName}

          <input
            name="full_name"
            required
            placeholder={
              text.fullNamePlaceholder
            }
          />
        </label>

        <label>
          {text.phone}

          <input
            name="phone"
            type="tel"
            required
            placeholder="+383..."
          />
        </label>

        <label>
          {text.email}

          <input
            name="email"
            type="email"
            placeholder="email@example.com"
          />
        </label>

        <label>
          {text.message}

          <textarea
            name="message"
            rows={4}
            placeholder={
              text.messagePlaceholder
            }
          />
        </label>

        {success && (
          <div className="inquirySuccess">
            <CheckCircle2 size={19} />
            {text.success}
          </div>
        )}

        {error && (
          <div className="formErrorBox">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          <CalendarDays size={18} />

          {loading
            ? text.loading
            : text.submit}
        </button>
      </form>
    </section>
  );
}
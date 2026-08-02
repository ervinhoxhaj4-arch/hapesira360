'use client';

import { FormEvent, useState } from 'react';
import { CalendarDays, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type ViewingRequestProps = {
  propertyId: string;
  propertyTitle: string;
};

export default function ViewingRequest({
  propertyId,
  propertyTitle,
}: ViewingRequestProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
      full_name: String(form.get('full_name') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      email:
        String(form.get('email') || '').trim() || null,
      message:
        String(form.get('message') || '').trim() || null,
    };

    const { error: insertError } = await supabase
      .from('property_inquiries')
      .insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    const emailResponse = await fetch('/api/viewing-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        propertyTitle,
        fullName: payload.full_name,
        phone: payload.phone,
        email: payload.email,
        message: payload.message,
      }),
    });

    if (!emailResponse.ok) {
      const result = await emailResponse
        .json()
        .catch(() => null);

      setError(
        result?.error ||
          'Kërkesa u ruajt, por njoftimi me email nuk u dërgua.'
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
          <p className="eyebrow">Cakto një vizitë</p>
          <h3>Shiko pronën nga afër</h3>
        </div>
      </div>

      <form onSubmit={submitRequest}>
        <label>
          Emri dhe mbiemri
          <input
            name="full_name"
            required
            placeholder="Emri juaj"
          />
        </label>

        <label>
          Numri i telefonit
          <input
            name="phone"
            type="tel"
            required
            placeholder="+383..."
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="email@example.com"
          />
        </label>

        <label>
          Mesazhi
          <textarea
            name="message"
            rows={4}
            placeholder="Kur dëshironi ta vizitoni pronën?"
          />
        </label>

        {success && (
          <div className="inquirySuccess">
            <CheckCircle2 size={19} />
            Kërkesa u dërgua me sukses.
          </div>
        )}

        {error && (
          <div className="formErrorBox">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          <CalendarDays size={18} />

          {loading
            ? 'Duke dërguar...'
            : 'Kërko një vizitë'}
        </button>
      </form>
    </section>
  );
}
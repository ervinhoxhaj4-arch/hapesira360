'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { supabase } from '@/lib/supabase';

type WhatsAppButtonProps = {
  propertyId: string;
  whatsappLink: string;
};

function getVisitorId() {
  const storageKey = 'h360-visitor-id';

  const existingVisitorId =
    localStorage.getItem(storageKey);

  if (existingVisitorId) {
    return existingVisitorId;
  }

  const visitorId = crypto.randomUUID();

  localStorage.setItem(
    storageKey,
    visitorId
  );

  return visitorId;
}

export default function WhatsAppButton({
  propertyId,
  whatsappLink,
}: WhatsAppButtonProps) {
  const pathname = usePathname();

  const isEnglish =
    pathname === '/en' ||
    pathname.startsWith('/en/');

  async function recordClick() {
    try {
      const visitorId = getVisitorId();

      const { error } = await supabase
        .from('property_whatsapp_clicks')
        .insert({
          property_id: propertyId,
          visitor_id: visitorId,
        });

      if (error) {
        console.warn(
          'WhatsApp click tracking error:',
          error.message
        );
      }
    } catch (error) {
      console.warn(
        'WhatsApp click tracking error:',
        error
      );
    }
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      className="whatsappButton"
      onClick={() => {
        void recordClick();
      }}
    >
      <MessageCircle />

      {isEnglish
        ? 'Contact on WhatsApp'
        : 'Kontakto në WhatsApp'}
    </a>
  );
}
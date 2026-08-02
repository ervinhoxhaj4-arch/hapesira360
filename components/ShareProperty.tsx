'use client';

import { useState } from 'react';
import {
  Check,
  Copy,
  Facebook,
  MessageCircle,
  Share2,
  X,
} from 'lucide-react';

type SharePropertyProps = {
  title: string;
};

export default function ShareProperty({
  title,
}: SharePropertyProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(
    `Shiko këtë pronë në Hapësira360: ${title}`
  );

  async function shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Shiko këtë pronë në Hapësira360`,
          url: pageUrl,
        });

        return;
      } catch {
        return;
      }
    }

    setOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="sharePropertyButton"
        onClick={shareNative}
      >
        <Share2 size={18} />
        Shpërndaje pronën
      </button>

      {open && (
        <div
          className="shareModalOverlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="shareModal"
            role="dialog"
            aria-modal="true"
            aria-label="Shpërndaje pronën"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="shareModalHead">
              <div>
                <p className="eyebrow">Shpërndaje</p>
                <h3>Dërgoja dikujt këtë pronë</h3>
              </div>

              <button
                type="button"
                className="shareModalClose"
                onClick={() => setOpen(false)}
                aria-label="Mbyll"
              >
                <X size={20} />
              </button>
            </div>

            <div className="shareOptions">
              <a
                href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
                target="_blank"
                rel="noreferrer"
                className="shareOption whatsappShare"
              >
                <MessageCircle size={21} />
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noreferrer"
                className="shareOption facebookShare"
              >
                <Facebook size={21} />
                Facebook
              </a>

              <button
                type="button"
                className="shareOption copyShare"
                onClick={copyLink}
              >
                {copied ? (
                  <Check size={21} />
                ) : (
                  <Copy size={21} />
                )}

                {copied ? 'U kopjua' : 'Kopjo linkun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
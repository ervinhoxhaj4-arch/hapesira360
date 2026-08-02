'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Building2,
  MapPin,
  Search,
  WalletCards,
} from 'lucide-react';

export default function SearchBox() {
  const router = useRouter();

  const [purpose, setPurpose] = useState<'shitje' | 'qira'>(
    'shitje'
  );

  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  function searchProperties() {
    const params = new URLSearchParams();

    params.set('purpose', purpose);

    if (city) {
      params.set('city', city);
    }

    if (propertyType) {
      params.set('type', propertyType);
    }

    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    }

    router.push(`/kerko?${params.toString()}`);
  }

  return (
    <div className="searchBox">
      <div
        className="toggle"
        role="group"
        aria-label="Lloji i listimit"
      >
        <button
          type="button"
          className={purpose === 'shitje' ? 'active' : ''}
          onClick={() => setPurpose('shitje')}
        >
          Shitje
        </button>

        <button
          type="button"
          className={purpose === 'qira' ? 'active' : ''}
          onClick={() => setPurpose('qira')}
        >
          Me Qira
        </button>
      </div>

      <div className="searchFields">
        <label>
          <span>
            <MapPin size={14} />
            Qyteti
          </span>

          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="">Të gjitha qytetet</option>
            <option value="Prizren">Prizren</option>
            <option value="Prishtinë">Prishtinë</option>
            <option value="Ferizaj">Ferizaj</option>
            <option value="Pejë">Pejë</option>
            <option value="Gjakovë">Gjakovë</option>
            <option value="Gjilan">Gjilan</option>
            <option value="Mitrovicë">Mitrovicë</option>
          </select>
        </label>

        <label>
          <span>
            <Building2 size={14} />
            Lloji
          </span>

          <select
            value={propertyType}
            onChange={(event) =>
              setPropertyType(event.target.value)
            }
          >
            <option value="">Të gjitha pronat</option>
            <option value="Apartament">Apartament</option>
            <option value="Shtëpi">Shtëpi</option>
            <option value="Vilë">Vilë</option>
            <option value="Lokal">Lokal</option>
            <option value="Truall">Truall</option>
          </select>
        </label>

        <label>
          <span>
            <WalletCards size={14} />
            Çmimi maksimal
          </span>

          <select
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
          >
            <option value="">Pa kufi</option>

            {purpose === 'shitje' ? (
              <>
                <option value="50000">€50,000</option>
                <option value="100000">€100,000</option>
                <option value="150000">€150,000</option>
                <option value="250000">€250,000</option>
                <option value="500000">€500,000</option>
              </>
            ) : (
              <>
                <option value="300">€300 / muaj</option>
                <option value="500">€500 / muaj</option>
                <option value="750">€750 / muaj</option>
                <option value="1000">€1,000 / muaj</option>
                <option value="2000">€2,000 / muaj</option>
              </>
            )}
          </select>
        </label>

        <button
          type="button"
          className="searchButton"
          onClick={searchProperties}
        >
          <Search size={19} />
          Kërko
        </button>
      </div>
    </div>
  );
}
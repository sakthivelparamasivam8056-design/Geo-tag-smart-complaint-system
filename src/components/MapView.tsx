import React, { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Complaint, Coordinates } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS, DEFAULT_CENTER, DEFAULT_ZOOM } from '../utils/constants';
import { timeAgo } from '../utils/helpers';

// Fix Leaflet default icon path issue with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom Marker Icons ───────────────────────────────────────────────────────

const createComplaintIcon = (color: string, size: number = 32) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border:3px solid white;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
        transition: transform 0.2s;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });

const createUserIcon = () =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width:16px; height:16px;
        background:#6366f1;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 0 0 4px rgba(99,102,241,0.3);
        animation: pulse 2s infinite;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

// ─── Map Events Handler ────────────────────────────────────────────────────────

interface ClickHandlerProps {
  onMapClick: (coords: Coordinates) => void;
  showForm: boolean;
}

const ClickHandler: React.FC<ClickHandlerProps> = ({ onMapClick, showForm }) => {
  useMapEvents({
    click(e) {
      if (showForm) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};

// ─── Fly-to selected complaint ─────────────────────────────────────────────────

const FlyToSelected: React.FC<{ complaint: Complaint | null }> = ({ complaint }) => {
  const map = useMap();
  useEffect(() => {
    if (complaint) {
      map.flyTo([complaint.coordinates.lat, complaint.coordinates.lng], 15, { duration: 1.2 });
    }
  }, [complaint, map]);
  return null;
};

// ─── Map View Component ────────────────────────────────────────────────────────

interface Props {
  onMapClick?: (coords: Coordinates) => void;
}

const MapView: React.FC<Props> = ({ onMapClick }) => {
  const { filteredComplaints, selectedComplaint, selectComplaint, showForm, theme } = useApp();
  const userMarkerRef = useRef<L.Marker | null>(null);

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const tileAttrib =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

  const handleMapClick = useCallback(
    (coords: Coordinates) => {
      onMapClick?.(coords);
    },
    [onMapClick]
  );

  const getIconForComplaint = (c: Complaint) => {
    const color = c.id === selectedComplaint?.id
      ? '#818cf8'
      : STATUS_COLORS[c.status];
    const size = c.id === selectedComplaint?.id ? 40 : 32;
    return createComplaintIcon(color, size);
  };

  return (
    <div id="map-container" className="w-full h-full relative">
      {showForm && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg pointer-events-none">
          📍 Click on the map to pin your complaint location
        </div>
      )}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url={tileUrl} attribution={tileAttrib} />

        <FlyToSelected complaint={selectedComplaint} />
        <ClickHandler onMapClick={handleMapClick} showForm={showForm} />

        {filteredComplaints.map((complaint) => (
          <Marker
            key={complaint.id}
            position={[complaint.coordinates.lat, complaint.coordinates.lng]}
            icon={getIconForComplaint(complaint)}
            eventHandlers={{ click: () => selectComplaint(complaint) }}
          >
            <Popup maxWidth={260} className="geo-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm leading-snug text-gray-900">{complaint.title}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[complaint.status] + '22', color: STATUS_COLORS[complaint.status] }}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{complaint.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{complaint.category}</span>
                  <span>{timeAgo(complaint.timestamp)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;

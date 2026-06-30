import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Shelter } from '@/types/index.d';

// Fix default marker icon issue with bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapWidgetProps {
  shelters: Shelter[];
}

export default function MapWidget({ shelters }: MapWidgetProps) {
  const center: [number, number] = [10.598959, -66.974415];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return '#006b5f';
      case 'saturado': return '#ba1a1a';
      case 'cerrado': return '#757682';
      default: return '#00236f';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo';
      case 'saturado': return 'Saturado';
      case 'cerrado': return 'Cerrado';
      default: return status;
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shelters.map((shelter) => (
        <Marker
          key={shelter.id}
          position={[Number(shelter.latitud), Number(shelter.longitud)]}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#00236f', marginBottom: '8px' }}>
                {shelter.nombre}
              </h3>
              <p style={{ fontSize: '13px', color: '#444651', marginBottom: '6px' }}>
                {shelter.direccion}
              </p>
              <p style={{ fontSize: '13px', color: '#444651', marginBottom: '6px' }}>
                {shelter.municipio}, {shelter.estado}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  color: '#fff',
                  background: getStatusColor(shelter.estado_operativo)
                }}>
                  {getStatusLabel(shelter.estado_operativo)}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#191c1e' }}>
                  {shelter.capacidad_ocupada}/{shelter.capacidad_total}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

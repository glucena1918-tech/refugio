import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { Search, X, FileDown, FileSpreadsheet, MapPin, Users, AlertTriangle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import type { Refugee, Shelter, PageProps } from '@/types/index.d';

interface HomeProps extends PageProps {
  refugees: Refugee[];
  shelters: Shelter[];
  total: number;
}

const SUPABASE_URL = 'https://unwraxprhvuqldqsropm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

export default function Home({ refugees: initialRefugees, shelters: initialShelters, total: initialTotal }: HomeProps) {
  const [refugees, setRefugees] = useState<Refugee[]>(initialRefugees || []);
  const [shelters, setShelters] = useState<Shelter[]>(initialShelters || []);
  const [loading, setLoading] = useState(!initialRefugees);
  const [searchApellido, setSearchApellido] = useState('');
  const [searchCedula, setSearchCedula] = useState('');
  const [searchZona, setSearchZona] = useState('');
  const [searchRefugio, setSearchRefugio] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const perPage = 10;

  // Load data from Supabase directly on client if no SSR data
  useEffect(() => {
    if (!initialRefugees) {
      fetchData();
    }
    if (!initialShelters) {
      fetchShelters();
    }
  }, []);

  // Dynamic import of Leaflet (SSR-safe)
  useEffect(() => {
    import('./MapWidget').then((mod) => {
      setMapComponent(() => mod.default);
    }).catch(() => {});
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${SUPABASE_URL}/rest/v1/refugees?select=*&order=apellido.asc`;
      const filters: string[] = [];
      if (searchApellido) filters.push(`apellido=ilike.*${searchApellido}*`);
      if (searchCedula) filters.push(`cedula=ilike.*${searchCedula}*`);
      if (searchZona) filters.push(`zona_residencia=ilike.*${searchZona}*`);
      if (searchRefugio) filters.push(`refugio_id=eq.${searchRefugio}`);
      if (activeFilter === 'masculino') filters.push('genero=eq.masculino');
      if (activeFilter === 'femenino') filters.push('genero=eq.femenino');
      if (filters.length) url += '&' + filters.join('&');

      const res = await fetch(url, {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        }
      });
      const data = await res.json();
      setRefugees(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchShelters = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/shelters?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
        }
      });
      const data = await res.json();
      setShelters(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching shelters:', e);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchApellido, searchCedula, searchZona, searchRefugio, activeFilter]);

  const clearSearch = () => {
    setSearchApellido('');
    setSearchCedula('');
    setSearchZona('');
    setSearchRefugio('');
    setActiveFilter('todos');
  };

  // Pagination
  const totalPages = Math.ceil(refugees.length / perPage);
  const paginatedRefugees = refugees.slice((currentPage - 1) * perPage, currentPage * perPage);

  const getPriorityChipClass = (p: string) => {
    switch (p) {
      case 'urgente': return 'chip chip-urgente';
      case 'medica': return 'chip chip-medica';
      default: return 'chip chip-normal';
    }
  };

  const getGenderLabel = (g: string) => {
    switch (g) {
      case 'masculino': return 'M';
      case 'femenino': return 'F';
      default: return 'Otro';
    }
  };


  return (
    <>
      <Head title="Buscador Público" />
      <Navbar currentPage="public" />

      <main className="container-main" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Hero Section */}
        <header className="animate-fade-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 className="text-headline-xl" style={{ color: 'var(--primary)', marginBottom: '12px' }}>
            Encuentra a tus seres queridos
          </h1>
          <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '640px', margin: '0 auto 24px' }}>
            Sistema público de búsqueda de personas ubicadas en refugios y albergues tras la emergencia. Busca por apellido, cédula o zona de residencia.
          </p>

          {/* Warning Banner */}
          <div className="alert-banner alert-warning" style={{ maxWidth: '700px', margin: '0 auto', justifyContent: 'center' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span className="text-body-md">
              <strong>Importante:</strong> Verifica siempre la información antes de difundirla.
            </span>
          </div>
        </header>

        {/* Search Section */}
        <section className="glass-card animate-slide-up" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Search size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="text-label-md" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Buscador Múltiple
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label className="input-label">Por Apellido</label>
              <input
                type="text"
                className="search-bar"
                placeholder="Ej: González"
                value={searchApellido}
                onChange={(e) => setSearchApellido(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Por Cédula (DNI)</label>
              <input
                type="text"
                className="search-bar"
                placeholder="Ej: V-12345678"
                value={searchCedula}
                onChange={(e) => setSearchCedula(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Por Zona de Ubicación</label>
              <input
                type="text"
                className="search-bar"
                placeholder="Ej: La Vega"
                value={searchZona}
                onChange={(e) => setSearchZona(e.target.value)}
              />
            </div>
            <div>
              <label className="input-label">Por Refugio</label>
              <select
                className="search-bar"
                value={searchRefugio}
                onChange={(e) => setSearchRefugio(e.target.value)}
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="">Todos los Refugios</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <Filter size={16} style={{ color: 'var(--on-surface-variant)' }} />
            {['todos', 'masculino', 'femenino'].map((f) => (
              <button
                key={f}
                className={`btn ${activeFilter === f ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '6px 16px', fontSize: '13px' }}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'todos' ? 'Todos' : f === 'masculino' ? 'Hombres' : 'Mujeres'}
              </button>
            ))}
            {(searchApellido || searchCedula || searchZona || searchRefugio || activeFilter !== 'todos') && (
              <button
                className="btn btn-outline"
                style={{ padding: '6px 16px', fontSize: '13px', color: 'var(--error)' }}
                onClick={clearSearch}
              >
                <X size={14} /> Limpiar
              </button>
            )}
          </div>
        </section>

        {/* Results Count + Export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-label-md" style={{ color: 'var(--on-surface-variant)' }}>
              {refugees.length} persona{refugees.length !== 1 ? 's' : ''} encontrada{refugees.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a
              href="/export/refugees.pdf"
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
              target="_blank"
              rel="external"
            >
              <FileDown size={16} /> PDF
            </a>
          </div>
        </div>

        {/* Data Table */}
        <section className="bento-item" style={{ padding: '0', overflow: 'hidden', marginBottom: '40px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Nombres</th>
                  <th>Apellidos</th>
                  <th>Cédula</th>
                  <th>Género</th>
                  <th>Lugar de Residencia</th>
                  <th>Refugio</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Ficha</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} style={{ paddingLeft: j === 0 ? '24px' : '0', paddingRight: j === 8 ? '24px' : '0' }}>
                          <div className="skeleton" style={{ height: '16px', width: `${60 + Math.random() * 40}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : paginatedRefugees.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--on-surface-variant)' }}>
                      <Search size={40} style={{ color: 'var(--outline-variant)', marginBottom: '12px' }} />
                      <p className="text-body-lg" style={{ fontWeight: 600 }}>No se encontraron resultados</p>
                      <p className="text-body-md" style={{ color: 'var(--outline)' }}>Intenta con otros términos de búsqueda</p>
                    </td>
                  </tr>
                ) : (
                  paginatedRefugees.map((r, idx) => (
                    <tr key={r.id} className="animate-fade-in" style={{ animationDelay: `${idx * 40}ms` }}>
                      <td style={{ paddingLeft: '24px', fontWeight: 500 }}>{r.nombre}</td>
                      <td style={{ fontWeight: 500 }}>{r.apellido}</td>
                      <td className="text-body-md">{r.cedula || '—'}</td>
                      <td>
                        <span className="chip" style={{
                          background: r.genero === 'femenino' ? 'var(--primary-fixed)' : r.genero === 'masculino' ? 'var(--secondary-fixed)' : 'var(--surface-container-highest)',
                          color: r.genero === 'femenino' ? 'var(--primary)' : r.genero === 'masculino' ? '#005047' : 'var(--on-surface-variant)'
                        }}>
                          {getGenderLabel(r.genero)}
                        </span>
                      </td>
                      <td className="text-body-md">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} style={{ color: 'var(--outline)', flexShrink: 0 }} />
                          {r.zona_residencia || r.municipio_residencia || '—'}
                        </div>
                      </td>
                      <td className="text-body-md" style={{ fontWeight: 500 }}>
                        {shelters.find(s => s.id === r.refugio_id)?.nombre || '—'}
                      </td>
                      <td>
                        <span className={getPriorityChipClass(r.prioridad)}>
                          {r.prioridad === 'medica' ? 'Médica' : r.prioridad.charAt(0).toUpperCase() + r.prioridad.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={r.verificado ? 'chip chip-verificado' : 'chip chip-no-verificado'}>
                          {r.verificado ? 'Verificado' : 'Pendiente'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <a
                          href={`/export/refugee/${r.id}/ficha.pdf`}
                          className="btn btn-outline"
                          style={{ padding: '4px 12px', fontSize: '12px' }}
                          target="_blank"
                          rel="external"
                          title="Ver ficha PDF en nueva pestaña"
                        >
                          <FileDown size={14} /> PDF
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '20px' }}>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.4 : 1 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin size={20} style={{ color: 'var(--primary)' }} />
            <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>Ubicación de Refugios</h2>
          </div>
          <div className="map-container">
            {MapComponent ? (
              <MapComponent shelters={shelters} />
            ) : (
              <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container)' }}>
                <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>Cargando mapa...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

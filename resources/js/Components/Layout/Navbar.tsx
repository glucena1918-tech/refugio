import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Shield, Bell, Settings, Menu, X } from 'lucide-react';
import type { PageProps } from '@/types/index.d';

interface NavbarProps {
  currentPage: 'public' | 'admin' | 'registro';
}

export default function Navbar({ currentPage }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { auth } = usePage<PageProps>().props;

  return (
    <nav className="nav-bar">
      <div className="container-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        {/* Logo + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="text-headline-md" style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={24} strokeWidth={2.5} />
              Refugio Conectado
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link
              href="/"
              className={`nav-link ${currentPage === 'public' ? 'active' : ''}`}
            >
              Buscador Público
            </Link>
            {auth?.user?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              >
                Administración
              </Link>
            )}
            {auth?.user?.role === 'inspector' && auth?.user?.is_authorized && (
              <Link
                href="/registro"
                className={`nav-link ${currentPage === 'registro' ? 'active' : ''}`}
              >
                Registro
              </Link>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {auth?.user ? (
            <>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--on-surface-variant)',
                  transition: 'background 0.2s'
                }}
                title="Notificaciones"
              >
                <Bell size={20} />
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--on-surface-variant)',
                  transition: 'background 0.2s'
                }}
                title="Configuración"
              >
                <Settings size={20} />
              </button>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary-container)',
                  color: 'var(--on-primary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  border: '1px solid var(--outline-variant)'
                }}
              >
                {auth.user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--error)' }}
              >
                Cerrar Sesión
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="btn btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Iniciar Sesión
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              color: 'var(--on-surface-variant)'
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div
          className="mobile-nav animate-fade-in"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'var(--surface-container-lowest)',
            borderBottom: '1px solid var(--outline-variant)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 49
          }}
        >
          <Link href="/" className={`nav-link ${currentPage === 'public' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            Buscador Público
          </Link>
          {auth?.user?.role === 'admin' && (
            <Link href="/admin/dashboard" className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Administración
            </Link>
          )}
          {auth?.user?.role === 'inspector' && auth?.user?.is_authorized && (
            <Link href="/registro" className={`nav-link ${currentPage === 'registro' ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
              Registro
            </Link>
          )}
          {auth?.user ? (
            <Link href="/logout" method="post" as="button" className="btn btn-outline" style={{ width: '100%', color: 'var(--error)', marginTop: '8px' }} onClick={() => setMobileOpen(false)}>
              Cerrar Sesión
            </Link>
          ) : (
            <Link href="/login" className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }} onClick={() => setMobileOpen(false)}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Shield, Lock, Mail, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.redirect) {
        window.location.href = data.redirect;
      } else {
        setError(data.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Acceso Administración" />

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface)',
        padding: '16px'
      }}>
        <div className="glass-card animate-slide-up" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '48px 40px',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Shield size={28} style={{ color: 'var(--on-primary)' }} />
            </div>
            <h1 className="text-headline-lg" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
              Refugio Conectado
            </h1>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              Acceso restringido para Administradores e Inspectores
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-banner alert-emergency" style={{ marginBottom: '20px', padding: '12px 16px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span className="text-body-md">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">
                <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                Correo Electrónico
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="admin@refugio.gob.ve"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">
                <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                Contraseña
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? 'Verificando...' : <><LogIn size={18} /> Iniciar Sesión</>}
            </button>
          </form>

          <p className="text-label-sm" style={{ color: 'var(--outline)', textAlign: 'center', marginTop: '24px' }}>
            Sistema de acceso controlado. Solo personal autorizado.
          </p>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { Phone, Mail, AlertTriangle, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: '48px' }}>
      <div className="container-main">
        {/* Emergency Warning */}
        <div className="alert-banner alert-warning" style={{ marginBottom: '32px' }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Aviso Importante:</strong> Ante una emergencia médica, llama inmediatamente a los organismos de rescate. Verifica siempre la información antes de difundirla. Este sistema es una herramienta de apoyo, no sustituye la atención profesional.
          </div>
        </div>

        {/* Emergency Directory */}
        <div style={{ marginBottom: '32px' }}>
          <h3 className="text-label-md" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Directorio de Emergencias — Caracas
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Emergency Numbers */}
            <div className="emergency-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={18} style={{ color: 'var(--error)' }} />
                <span className="text-label-md" style={{ color: 'var(--error)' }}>Números de Emergencia</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="text-body-md"><strong>171</strong> — Fijo CANTV</span>
                <span className="text-body-md"><strong>*1</strong> — Movilnet</span>
                <span className="text-body-md"><strong>112</strong> — Digitel</span>
                <span className="text-body-md"><strong>911</strong> — Movistar</span>
              </div>
            </div>

            {/* Aeroambulancias */}
            <div className="emergency-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={18} style={{ color: 'var(--secondary)' }} />
                <span className="text-label-md" style={{ color: 'var(--secondary)' }}>Aeroambulancias</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="text-body-md">0212-993.25.41</span>
                <span className="text-body-md">0212-992.89.80</span>
                <span className="text-body-md">0212-992.89.90</span>
                <span className="text-body-md">0212-991.79.40</span>
              </div>
            </div>

            {/* Rescarven */}
            <div className="emergency-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={18} style={{ color: 'var(--primary)' }} />
                <span className="text-label-md" style={{ color: 'var(--primary)' }}>Rescarven</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="text-body-md">0212-993.69.11</span>
                <span className="text-body-md">0212-993.69.91</span>
                <span className="text-body-md">0212-993.13.10</span>
                <span className="text-body-md">0212-993.33.67</span>
              </div>
            </div>

            {/* Ambulancia Metropolitano */}
            <div className="emergency-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Phone size={18} style={{ color: 'var(--secondary)' }} />
                <span className="text-label-md" style={{ color: 'var(--secondary)' }}>Ambulancia Metropolitano</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="text-body-md">0212-545.45.45</span>
                <span className="text-body-md">0212-545.46.55</span>
                <span className="text-body-md">0212-577.92.09</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', paddingTop: '24px', borderTop: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="text-label-md" style={{ fontWeight: 700, color: 'var(--primary)' }}>Refugio Conectado</span>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
              © {new Date().getFullYear()} Refugio Conectado. Sistema de gestión humanitaria de datos protegidos.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
            <a href="mailto:despachodelapresidenciacuspal@gmail.com" className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.2s' }}>
              <Mail size={14} />
              Reportar Problema
            </a>
            <a href="#" className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}>Protección de Datos</a>
            <a href="#" className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textDecoration: 'none', transition: 'color 0.2s' }}>Términos Legales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

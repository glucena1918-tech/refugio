import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Check, ChevronRight, ChevronLeft, Save, Upload, User, Heart, MapPin, ShieldCheck, Loader2, CheckCircle, Download, FileText, AlertCircle } from 'lucide-react';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';

const STEPS = [
  { label: 'Datos Básicos', icon: <User size={16} /> },
  { label: 'Atención y Seguridad', icon: <Heart size={16} /> },
  { label: 'Localización', icon: <MapPin size={16} /> },
  { label: 'Datos Protegidos', icon: <ShieldCheck size={16} /> },
];

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'done'>('idle');
  const [formData, setFormData] = useState<Record<string, any>>({
    nombre: '', apellido: '', cedula: '', fecha_nacimiento: '', edad: '',
    genero: 'femenino', telefono_contacto: '', nombre_familiar_referencia: '',
    procedencia: '', zona_residencia: '', estado_residencia: 'Distrito Capital',
    municipio_residencia: '', integrantes_grupo_familiar: 1,
    tipo_sanguineo: '', necesidades_medicas: '', enfermedades_previas: '',
    alergias_medicinas: '', alergias_alimentos: '', discapacidad: '',
    necesidades_especiales: '', personas_dependientes: '',
    personas_desaparecidas: '', ultima_ubicacion_conocida: '',
    ruta_traslado: '', contactos_emergencia: '', religion: '',
    prioridad: 'normal', refugio_id: 1,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [registeredId, setRegisteredId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shelters, setShelters] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchShelters = async () => {
      try {
        const res = await fetch('https://unwraxprhvuqldqsropm.supabase.co/rest/v1/shelters?select=id,nombre', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w',
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setShelters(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, refugio_id: data[0].id }));
          }
        }
      } catch (e) {
        console.error('Error fetching shelters:', e);
      }
    };
    fetchShelters();
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [wantsPdf, setWantsPdf] = useState(false);
  const pdfLinkRef = React.useRef<HTMLAnchorElement>(null);

  const handleSubmit = async (downloadPdf: boolean = false) => {
    setSaving('saving');
    setErrorMsg(null);
    setWantsPdf(downloadPdf);

    try {
      // Build FormData to send to Laravel backend (handles Supabase insert server-side)
      const fd = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, String(value));
        }
      });

      // Add photo if provided
      if (photoFile) {
        fd.append('foto', photoFile);
      }

      // Get CSRF token from cookie
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
        || document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];

      const response = await fetch('/registro', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: fd,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Registration error:', response.status, errText);
        try {
          const errData = JSON.parse(errText);
          if (errData.messages) {
            const firstErr = Object.values(errData.messages)[0];
            setErrorMsg(Array.isArray(firstErr) ? firstErr[0] : String(firstErr));
          } else {
            setErrorMsg(errData.error || 'Ocurrió un error al guardar el registro.');
          }
        } catch {
          setErrorMsg(`Error del servidor (${response.status}): No se pudo completar la operación.`);
        }
        setSaving('idle');
        return;
      }

      const result = await response.json();

      if (result.success && result.id) {
        setRegisteredId(result.id);
      }

      setSaving('done');
    } catch (e) {
      console.error('Error saving registration:', e);
      setSaving('idle');
    }
  };

  // Auto-click PDF link when success screen renders with wantsPdf=true
  React.useEffect(() => {
    if (saving === 'done' && wantsPdf && registeredId && pdfLinkRef.current) {
      // Small delay to ensure the DOM is rendered
      const timer = setTimeout(() => {
        pdfLinkRef.current?.click();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [saving, wantsPdf, registeredId]);

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px', justifyContent: 'center' }}>
      {STEPS.map((step, idx) => (
        <React.Fragment key={idx}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: idx <= currentStep ? 'pointer' : 'default' }}
            onClick={() => { if (idx <= currentStep) setCurrentStep(idx); }}>
            <div className={`step-dot ${idx < currentStep ? 'completed' : idx === currentStep ? 'current' : 'pending'}`}>
              {idx < currentStep ? <Check size={16} /> : idx + 1}
            </div>
            <span className="text-label-sm" style={{
              color: idx <= currentStep ? 'var(--primary)' : 'var(--on-surface-variant)',
              fontWeight: idx === currentStep ? 700 : 500,
              whiteSpace: 'nowrap'
            }}>
              {step.label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`step-line ${idx < currentStep ? 'completed' : ''}`} style={{ minWidth: '40px', maxWidth: '80px', marginBottom: '22px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderField = (label: string, field: string, type: string = 'text', placeholder: string = '', required: boolean = false) => (
    <div>
      <label className="input-label">{label}{required && <span style={{ color: 'var(--error)' }}> *</span>}</label>
      {type === 'textarea' ? (
        <textarea className="textarea-field" placeholder={placeholder} value={formData[field] || ''} onChange={e => updateField(field, e.target.value)} />
      ) : type === 'select-gender' ? (
        <select className="select-field" value={formData[field]} onChange={e => updateField(field, e.target.value)}>
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="otro">Otro / Prefiere no decir</option>
        </select>
      ) : type === 'select-blood' ? (
        <select className="select-field" value={formData[field]} onChange={e => updateField(field, e.target.value)}>
          <option value="">Seleccionar...</option>
          {BLOOD_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
        </select>
      ) : (
        <input type={type} className="input-field" placeholder={placeholder} value={formData[field] || ''} onChange={e => updateField(field, e.target.value)} required={required} />
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Datos Básicos
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderField('Nombre(s)', 'nombre', 'text', 'Ej: María Elena', true)}
              {renderField('Apellido(s)', 'apellido', 'text', 'Ej: González Pérez', true)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              {renderField('Cédula de Identidad', 'cedula', 'text', 'V-12345678')}
              {renderField('Fecha de Nacimiento', 'fecha_nacimiento', 'date')}
              {renderField('Edad', 'edad', 'number', '25')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderField('Género', 'genero', 'select-gender')}
              {renderField('Teléfono de Contacto', 'telefono_contacto', 'tel', '0412-5551234')}
            </div>
            {renderField('Nombre de Familiar de Referencia', 'nombre_familiar_referencia', 'text', 'Ej: José González')}
            {renderField('Procedencia / Última ubicación conocida', 'procedencia', 'text', 'Ej: Sector La Vega, Caracas')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderField('Zona de Residencia', 'zona_residencia', 'text', 'Ej: La Vega')}
              {renderField('Nº Integrantes Grupo Familiar', 'integrantes_grupo_familiar', 'number', '4')}
            </div>
          </div>
        );

      case 1: // Atención y Seguridad
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="alert-banner alert-info" style={{ marginBottom: '8px' }}>
              <Heart size={18} style={{ flexShrink: 0 }} />
              <span className="text-body-md">Esta información es confidencial y será protegida según los protocolos de datos sensibles.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderField('Tipo Sanguíneo', 'tipo_sanguineo', 'select-blood')}
              <div>
                <label className="input-label">Categoría de Prioridad</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {(['normal', 'medica', 'urgente'] as const).map(p => (
                    <label key={p} className="radio-pill">
                      <input type="radio" name="reg-priority" value={p} checked={formData.prioridad === p} onChange={() => updateField('prioridad', p)} />
                      <span className="pill-label">{p === 'medica' ? 'Médica' : p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {renderField('Necesidades Médicas Urgentes', 'necesidades_medicas', 'textarea', 'Describa si requiere atención inmediata...')}
            {renderField('Enfermedades Previas Relevantes', 'enfermedades_previas', 'textarea', 'Ej: Diabetes, Hipertensión...')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {renderField('Alergias a Medicinas', 'alergias_medicinas', 'textarea', 'Ej: Penicilina...')}
              {renderField('Alergias a Alimentos', 'alergias_alimentos', 'textarea', 'Ej: Gluten, Mariscos...')}
            </div>
            {renderField('Discapacidad o Movilidad Reducida', 'discapacidad', 'textarea', 'Describa si aplica...')}
            {renderField('Necesidades Especiales (alimentación, lactancia, cuidado infantil)', 'necesidades_especiales', 'textarea')}
            {renderField('Personas Dependientes a Cargo', 'personas_dependientes', 'textarea', 'Ej: 2 niños menores de 5 años...')}
          </div>
        );

      case 2: // Localización
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="input-label">Refugio Asignado <span style={{ color: 'var(--error)' }}> *</span></label>
              <select 
                className="select-field" 
                value={formData.refugio_id} 
                onChange={e => updateField('refugio_id', parseInt(e.target.value))}
                required
              >
                {shelters.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
            {renderField('Personas Desaparecidas o Separadas del Grupo Familiar', 'personas_desaparecidas', 'textarea', 'Nombre, edad y última vez que se vieron...')}
            <div>
              <label className="input-label"><Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> Fotografía Reciente</label>
              <input
                type="file"
                accept="image/*"
                className="input-field"
                style={{ padding: '12px' }}
                onChange={e => setPhotoFile(e.target.files?.[0] || null)}
              />
              {photoFile && (
                <p className="text-label-sm" style={{ color: 'var(--secondary)', marginTop: '4px' }}>
                  ✓ Archivo seleccionado: {photoFile.name}
                </p>
              )}
            </div>
            {renderField('Última Ubicación Conocida', 'ultima_ubicacion_conocida', 'textarea', 'Describa la última ubicación de la persona...')}
            {renderField('Ruta de Traslado', 'ruta_traslado', 'textarea', 'Cómo llegó al refugio...')}
            {renderField('Contactos de Emergencia Adicionales', 'contactos_emergencia', 'textarea', 'Nombre: 0412-xxx / Nombre: 0414-xxx...')}
          </div>
        );

      case 3: // Datos Protegidos + Review
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="alert-banner alert-warning" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <span className="text-body-md"><strong>Datos Protegidos:</strong> Esta información requiere tratamiento especial según las normativas de protección de datos personales sensibles.</span>
            </div>
            {renderField('Religión', 'religion', 'text', 'Opcional')}

            {/* Summary Review */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 'var(--radius-lg)', padding: '24px', marginTop: '12px' }}>
              <h3 className="text-label-md" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Resumen del Registro
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Nombre:</span> <strong>{formData.nombre} {formData.apellido}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Cédula:</span> <strong>{formData.cedula || 'No registrada'}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Género:</span> <strong>{formData.genero}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Edad:</span> <strong>{formData.edad || '—'}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Tipo Sangre:</span> <strong>{formData.tipo_sanguineo || '—'}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Prioridad:</span> <strong>{formData.prioridad}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Zona:</span> <strong>{formData.zona_residencia || '—'}</strong></div>
                <div><span className="text-label-sm" style={{ color: 'var(--outline)' }}>Foto:</span> <strong>{photoFile ? '✓ Adjunta' : 'No'}</strong></div>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  if (saving === 'done') {
    return (
      <>
        <Head title="Registro Completado" />
        <Navbar currentPage="registro" />
        <main className="container-main" style={{ paddingTop: '80px', paddingBottom: '80px', textAlign: 'center' }}>
          <div className="animate-slide-up" style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} style={{ color: 'var(--on-secondary)' }} />
            </div>
            <h1 className="text-headline-lg" style={{ color: 'var(--primary)', marginBottom: '12px' }}>¡Registro Completado!</h1>
            <p className="text-body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>
              La persona ha sido registrada exitosamente en el sistema.{registeredId && ` Ficha Nº ${registeredId}.`} Un administrador verificará los datos ingresados.
            </p>

            {/* Prominent PDF Section */}
            {registeredId && (
              <div style={{
                background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f5f3 100%)',
                border: '2px solid var(--primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <FileText size={32} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                <p className="text-label-md" style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                  La ficha PDF de registro está lista para descargar
                </p>
                <a
                  ref={pdfLinkRef}
                  href={`/export/refugee/${registeredId}/ficha.pdf`}
                  className="btn btn-primary"
                  style={{
                    padding: '16px 40px',
                    fontSize: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={20} /> Descargar Ficha PDF
                </a>
              </div>
            )}

            <button className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '16px' }} onClick={() => { setSaving('idle'); setCurrentStep(0); setFormData({ ...formData, nombre: '', apellido: '', cedula: '' }); setRegisteredId(null); setWantsPdf(false); }}>
              Registrar Otra Persona
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head title="Formulario de Registro" />
      <Navbar currentPage="registro" />

      <main className="container-main" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <header style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 className="text-headline-xl" style={{ color: 'var(--primary)', marginBottom: '8px' }}>
            Registro de Personas
          </h1>
          <p className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>
            Formulario de captura de datos para personas ubicadas en refugios
          </p>
        </header>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Content */}
        <div className="bento-item animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }} key={currentStep}>
          
          {errorMsg && (
            <div className="alert-banner alert-emergency" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span className="text-body-md" style={{ fontWeight: 600 }}>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
            {STEPS[currentStep].icon}
            <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>{STEPS[currentStep].label}</h2>
          </div>

          {renderStep()}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '16px' }}>
            {currentStep > 0 ? (
              <button className="btn btn-outline" onClick={() => { setErrorMsg(null); setCurrentStep(currentStep - 1); }}>
                <ChevronLeft size={18} /> Anterior
              </button>
            ) : <div />}

            {currentStep < STEPS.length - 1 ? (
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!formData.nombre.trim() || !formData.apellido.trim()) {
                    setErrorMsg('Por favor complete los campos obligatorios (Nombre y Apellido) en la pestaña Datos Básicos.');
                    setCurrentStep(0);
                  } else {
                    setErrorMsg(null);
                    setCurrentStep(currentStep + 1);
                  }
                }}
              >
                Siguiente <ChevronRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ padding: '14px 24px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => {
                    if (!formData.nombre.trim() || !formData.apellido.trim()) {
                      setErrorMsg('Por favor complete los campos obligatorios (Nombre y Apellido) en la pestaña Datos Básicos.');
                      setCurrentStep(0);
                    } else {
                      handleSubmit(true);
                    }
                  }}
                  disabled={saving === 'saving'}
                >
                  <Download size={18} /> Guardar y Generar PDF
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '14px 32px', fontWeight: 700 }}
                  onClick={() => {
                    if (!formData.nombre.trim() || !formData.apellido.trim()) {
                      setErrorMsg('Por favor complete los campos obligatorios (Nombre y Apellido) en la pestaña Datos Básicos.');
                      setCurrentStep(0);
                    } else {
                      handleSubmit(false);
                    }
                  }}
                  disabled={saving === 'saving'}
                >
                  {saving === 'saving' ? (<><Loader2 size={18} className="animate-pulse-soft" /> Guardando...</>) :
                   (<><Save size={18} /> Confirmar y Guardar</>)}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  Plus, Download, FileDown, FileSpreadsheet, Search, Pill, UtensilsCrossed,
  Sparkles, SprayCan, Wrench, Ellipsis, Save, CheckCircle, Loader2, Users, X, Trash2, Pencil
} from 'lucide-react';
import Navbar from '@/Components/Layout/Navbar';
import Footer from '@/Components/Layout/Footer';
import type { SupplyRequirement, PageProps } from '@/types/index.d';

const SUPABASE_URL = 'https://unwraxprhvuqldqsropm.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

interface DashboardStats {
  total: number;
  byGender: { name: string; value: number; color: string }[];
  byAge: { range: string; count: number }[];
  childrenCount: number;
  newToday: number;
  capacityPct: number;
  maxDensity: string;
}

export default function Dashboard({ inspectors = [] }: { inspectors?: any[] }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [supplies, setSupplies] = useState<SupplyRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [supplyFilter, setSupplyFilter] = useState('');
  const [formSaving, setFormSaving] = useState<'idle' | 'saving' | 'done'>('idle');

  const [shelters, setShelters] = useState<any[]>([]);
  const [sShelterId, setSShelterId] = useState<string>('');
  const [sCategory, setSCategory] = useState<string>('medicina');
  const [sStatus, setSStatus] = useState<string>('suficiente');
  const [sStock, setSStock] = useState<number>(100);
  const [sDescription, setSDescription] = useState<string>('');

  // Inspector management state
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const { data: inspectorData, setData: setInspectorData, post: postInspector, reset: resetInspector, errors: inspectorErrors } = useForm({
    name: '',
    email: '',
    password: '',
  });

  // Shelter management state
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [shelterNombre, setShelterNombre] = useState('');
  const [shelterDireccion, setShelterDireccion] = useState('');
  const [shelterEstado, setShelterEstado] = useState('Distrito Capital');
  const [shelterMunicipio, setShelterMunicipio] = useState('');
  const [shelterLatitud, setShelterLatitud] = useState('');
  const [shelterLongitud, setShelterLongitud] = useState('');
  const [shelterCapacidadTotal, setShelterCapacidadTotal] = useState<number>(100);
  const [shelterEstadoOperativo, setShelterEstadoOperativo] = useState('activo');
  const [shelterSaving, setShelterSaving] = useState(false);

  // Shelter editing state
  const [editingShelter, setEditingShelter] = useState<any>(null);
  const [showEditShelterModal, setShowEditShelterModal] = useState(false);

  // Refugees management state
  const [refugeesList, setRefugeesList] = useState<any[]>([]);
  const [refugeeSearch, setRefugeeSearch] = useState('');
  const [refugeeFilterStatus, setRefugeeFilterStatus] = useState('todos'); // 'todos', 'verificado', 'pendiente'
  const [refugeeFilterShelter, setRefugeeFilterShelter] = useState('');
  
  // Refugee editing state
  const [editingRefugee, setEditingRefugee] = useState<any>(null);
  const [showEditRefugeeModal, setShowEditRefugeeModal] = useState(false);
  const [refugeeNombre, setRefugeeNombre] = useState('');
  const [refugeeApellido, setRefugeeApellido] = useState('');
  const [refugeeCedula, setRefugeeCedula] = useState('');
  const [refugeeEdad, setRefugeeEdad] = useState('');
  const [refugeeGenero, setRefugeeGenero] = useState('femenino');
  const [refugeePrioridad, setRefugeePrioridad] = useState('normal');
  const [refugeeRefugioId, setRefugeeRefugioId] = useState('');
  const [refugeeSaving, setRefugeeSaving] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInspector, setEditingInspector] = useState<any>(null);
  const editForm = useForm({
    name: '',
    email: '',
    password: '',
  });

  const [customDialog, setCustomDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setCustomDialog({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm,
    });
  };

  const showAlert = (title: string, message: string) => {
    setCustomDialog({
      isOpen: true,
      title,
      message,
      type: 'alert',
    });
  };

  const handleCreateInspector = (e: React.FormEvent) => {
    e.preventDefault();
    postInspector('/admin/inspectors', {
      onSuccess: () => {
        setShowInspectorModal(false);
        resetInspector();
      }
    });
  };

  const handleOpenEditModal = (ins: any) => {
    setEditingInspector(ins);
    editForm.setData({
      name: ins.name,
      email: ins.email,
      password: '',
    });
    editForm.clearErrors();
    setShowEditModal(true);
  };

  const handleUpdateInspector = (e: React.FormEvent) => {
    e.preventDefault();
    editForm.patch(`/admin/inspectors/${editingInspector.id}`, {
      onSuccess: () => {
        setShowEditModal(false);
        setEditingInspector(null);
        editForm.reset();
      }
    });
  };

  const handleDeleteInspector = (id: number, name: string) => {
    showConfirm(
      'Eliminar Inspector',
      `¿Seguro que deseas eliminar al inspector ${name}?`,
      () => {
        router.delete(`/admin/inspectors/${id}`);
      }
    );
  };

  const handleToggleInspector = (id: number) => {
    router.post(`/admin/inspectors/${id}/toggle`);
  };

  const handleCreateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    setShelterSaving(true);
    try {
      const headers = {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      const payload = {
        nombre: shelterNombre,
        direccion: shelterDireccion,
        estado: shelterEstado,
        municipio: shelterMunicipio,
        latitud: parseFloat(shelterLatitud || '0'),
        longitud: parseFloat(shelterLongitud || '0'),
        capacidad_total: parseInt(String(shelterCapacidadTotal)),
        capacidad_ocupada: 0,
        estado_operativo: shelterEstadoOperativo,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/shelters`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save shelter');
      }

      setShowShelterModal(false);
      // Reset form
      setShelterNombre('');
      setShelterDireccion('');
      setShelterEstado('Distrito Capital');
      setShelterMunicipio('');
      setShelterLatitud('');
      setShelterLongitud('');
      setShelterCapacidadTotal(100);
      setShelterEstadoOperativo('activo');
      
      loadDashboard();
      showAlert('Éxito', 'Refugio creado exitosamente.');
    } catch (e) {
      console.error('Error creating shelter:', e);
      showAlert('Error', 'No se pudo crear el refugio en la base de datos.');
    } finally {
      setShelterSaving(false);
    }
  };

  const handleOpenEditShelterModal = (shelter: any) => {
    setEditingShelter(shelter);
    setShelterNombre(shelter.nombre);
    setShelterDireccion(shelter.direccion);
    setShelterEstado(shelter.estado);
    setShelterMunicipio(shelter.municipio);
    setShelterLatitud(String(shelter.latitud));
    setShelterLongitud(String(shelter.longitud));
    setShelterCapacidadTotal(shelter.capacidad_total);
    setShelterEstadoOperativo(shelter.estado_operativo);
    setShowEditShelterModal(true);
  };

  const handleUpdateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelter) return;
    setShelterSaving(true);
    try {
      const headers = {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      const payload = {
        nombre: shelterNombre,
        direccion: shelterDireccion,
        estado: shelterEstado,
        municipio: shelterMunicipio,
        latitud: parseFloat(shelterLatitud || '0'),
        longitud: parseFloat(shelterLongitud || '0'),
        capacidad_total: parseInt(String(shelterCapacidadTotal)),
        estado_operativo: shelterEstadoOperativo,
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/shelters?id=eq.${editingShelter.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update shelter');
      }

      setShowEditShelterModal(false);
      setEditingShelter(null);
      // Reset form
      setShelterNombre('');
      setShelterDireccion('');
      setShelterEstado('Distrito Capital');
      setShelterMunicipio('');
      setShelterLatitud('');
      setShelterLongitud('');
      setShelterCapacidadTotal(100);
      setShelterEstadoOperativo('activo');
      
      loadDashboard();
      showAlert('Éxito', 'Refugio actualizado exitosamente.');
    } catch (e) {
      console.error('Error updating shelter:', e);
      showAlert('Error', 'No se pudo actualizar el refugio.');
    } finally {
      setShelterSaving(false);
    }
  };

  const handleToggleRefugeeVerification = async (id: number, currentStatus: boolean) => {
    try {
      const headers = {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      // Optimistic update
      setRefugeesList(prev => prev.map(r => r.id === id ? { ...r, verificado: !currentStatus } : r));

      await fetch(`${SUPABASE_URL}/rest/v1/refugees?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ verificado: !currentStatus }),
      });
      loadDashboard();
    } catch (e) {
      console.error('Error toggling refugee verification:', e);
      showAlert('Error', 'No se pudo cambiar el estado de verificación.');
    }
  };

  const handleOpenEditRefugeeModal = (refugee: any) => {
    setEditingRefugee(refugee);
    setRefugeeNombre(refugee.nombre);
    setRefugeeApellido(refugee.apellido);
    setRefugeeCedula(refugee.cedula || '');
    setRefugeeEdad(refugee.edad ? String(refugee.edad) : '');
    setRefugeeGenero(refugee.genero);
    setRefugeePrioridad(refugee.prioridad);
    setRefugeeRefugioId(String(refugee.refugio_id));
    setShowEditRefugeeModal(true);
  };

  const handleUpdateRefugee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRefugee) return;
    setRefugeeSaving(true);
    try {
      const headers = {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      const payload = {
        nombre: refugeeNombre,
        apellido: refugeeApellido,
        cedula: refugeeCedula || null,
        edad: refugeeEdad ? parseInt(refugeeEdad) : null,
        genero: refugeeGenero,
        prioridad: refugeePrioridad,
        refugio_id: parseInt(refugeeRefugioId),
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/refugees?id=eq.${editingRefugee.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to update refugee');
      }

      setShowEditRefugeeModal(false);
      setEditingRefugee(null);
      loadDashboard();
      showAlert('Éxito', 'Datos del refugiado actualizados exitosamente.');
    } catch (e) {
      console.error('Error updating refugee:', e);
      showAlert('Error', 'No se pudo actualizar el registro del refugiado.');
    } finally {
      setRefugeeSaving(false);
    }
  };

  const handleDeleteRefugee = (id: number, name: string) => {
    showConfirm(
      'Eliminar Refugiado',
      `¿Seguro que deseas eliminar el registro de ${name}? Esta acción no se puede deshacer.`,
      async () => {
        try {
          const headers = {
            'apikey': SUPABASE_ANON,
            'Authorization': `Bearer ${SUPABASE_ANON}`,
          };
          setRefugeesList(prev => prev.filter(r => r.id !== id));
          await fetch(`${SUPABASE_URL}/rest/v1/refugees?id=eq.${id}`, {
            method: 'DELETE',
            headers,
          });
          loadDashboard();
          showAlert('Éxito', 'Registro eliminado correctamente.');
        } catch (e) {
          console.error('Error deleting refugee:', e);
          showAlert('Error', 'No se pudo eliminar el registro.');
        }
      }
    );
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const headers = { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` };

      const [refugeesRes, suppliesRes, sheltersRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/refugees?select=id,nombre,apellido,cedula,genero,edad,prioridad,verificado,refugio_id,created_at&order=apellido.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/supply_requirements?select=*,shelters(nombre)&order=id.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/shelters?select=*`, { headers }),
      ]);

      const refugees = await refugeesRes.json();
      const suppliesData = await suppliesRes.json();
      const sheltersData = await sheltersRes.json();

      setRefugeesList(Array.isArray(refugees) ? refugees : []);

      setSupplies(Array.isArray(suppliesData) ? suppliesData : []);
      setShelters(Array.isArray(sheltersData) ? sheltersData : []);
      if (Array.isArray(sheltersData) && sheltersData.length > 0 && !sShelterId) {
        setSShelterId(String(sheltersData[0].id));
      }

      if (Array.isArray(refugees)) {
        const total = refugees.length;
        const masc = refugees.filter((r: any) => r.genero === 'masculino').length;
        const fem = refugees.filter((r: any) => r.genero === 'femenino').length;
        const other = total - masc - fem;

        const ageBlocks = { '0-12': 0, '13-17': 0, '18-45': 0, '46-64': 0, '65+': 0 };
        refugees.forEach((r: any) => {
          const age = r.edad || 0;
          if (age <= 12) ageBlocks['0-12']++;
          else if (age <= 17) ageBlocks['13-17']++;
          else if (age <= 45) ageBlocks['18-45']++;
          else if (age <= 64) ageBlocks['46-64']++;
          else ageBlocks['65+']++;
        });

        const maxAge = Object.entries(ageBlocks).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0] as [string, number]);

        const today = new Date().toISOString().slice(0, 10);
        const newToday = refugees.filter((r: any) => r.created_at?.slice(0, 10) === today).length;

        let totalCap = 0, totalOcc = 0;
        if (Array.isArray(sheltersData)) {
          sheltersData.forEach((s: any) => { totalCap += s.capacidad_total; totalOcc += s.capacidad_ocupada; });
        }

        setStats({
          total,
          byGender: [
            { name: 'Mujeres', value: fem, color: '#1e3a8a' },
            { name: 'Hombres', value: masc, color: '#006b5f' },
            { name: 'Otros', value: other, color: '#c5c5d3' },
          ],
          byAge: Object.entries(ageBlocks).map(([range, count]) => ({ range, count })),
          childrenCount: ageBlocks['0-12'],
          newToday,
          capacityPct: totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0,
          maxDensity: `${maxAge[0]} años`,
        });
      }
    } catch (e) {
      console.error('Error loading dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sShelterId) return;

    setFormSaving('saving');
    try {
      const headers = {
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      };

      const payload = {
        refugio_id: parseInt(sShelterId),
        categoria: sCategory,
        estado: sStatus,
        stock_porcentaje: sStock,
        descripcion_requerimiento: sDescription || null,
      };

      const existing = supplies.find(
        (s: any) => String(s.refugio_id) === sShelterId && s.categoria === sCategory
      );

      if (existing) {
        // Update existing record
        await fetch(`${SUPABASE_URL}/rest/v1/supply_requirements?id=eq.${existing.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        // Insert new record
        await fetch(`${SUPABASE_URL}/rest/v1/supply_requirements`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }

      setFormSaving('done');
      setTimeout(() => {
        setFormSaving('idle');
        setSDescription('');
        loadDashboard();
      }, 2000);
    } catch (e) {
      console.error('Error saving requirement:', e);
      setFormSaving('idle');
    }
  };

  const handleDeleteRequirement = (id: number) => {
    showConfirm(
      'Eliminar Requerimiento',
      '¿Seguro que deseas eliminar este requerimiento?',
      () => {
        // Optimistic UI update: remove from state immediately
        setSupplies(prev => prev.filter(s => s.id !== id));

        router.delete(`/admin/requirements/${id}`, {
          onSuccess: () => {
            loadDashboard();
          },
          onError: (errors: any) => {
            showAlert('Error', 'No se pudo eliminar el requerimiento: ' + (errors.error || 'Error en el servidor.'));
            loadDashboard();
          }
        });
      }
    );
  };

  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, React.ReactNode> = {
      medicina: <Pill size={20} style={{ color: 'var(--error)' }} />,
      comida: <UtensilsCrossed size={20} style={{ color: 'var(--secondary)' }} />,
      aseo_personal: <Sparkles size={20} style={{ color: 'var(--primary)' }} />,
      limpieza: <SprayCan size={20} style={{ color: 'var(--primary)' }} />,
      ferreteria: <Wrench size={20} style={{ color: 'var(--primary)' }} />,
      otros: <Ellipsis size={20} style={{ color: 'var(--outline)' }} />,
    };
    return icons[cat] || <Ellipsis size={20} />;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      medicina: 'Medicina', comida: 'Comida', aseo_personal: 'Aseo Personal',
      limpieza: 'Limpieza', ferreteria: 'Ferretería', otros: 'Otros',
    };
    return labels[cat] || cat;
  };

  const getStatusChipClass = (status: string) => {
    switch (status) {
      case 'critico': return 'chip chip-critico';
      case 'moderado': return 'chip chip-moderado';
      case 'suficiente': return 'chip chip-suficiente';
      default: return 'chip chip-na';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      critico: 'Crítico', moderado: 'Moderado', suficiente: 'Suficiente', n_a: 'N/A',
    };
    return labels[status] || status;
  };

  const filteredSupplies = supplies.filter(s =>
    !supplyFilter || getCategoryLabel(s.categoria).toLowerCase().includes(supplyFilter.toLowerCase())
  );

  const ageBarColors = ['#1e3a8a', '#00236f', '#006b5f', '#1e3a8a', '#c5c5d3'];



  return (
    <>
      <Head title="Panel de Administración" />
      <Navbar currentPage="admin" />

      <main className="container-main" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        {/* Dashboard Header */}
        <header style={{ marginBottom: '40px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
          <div>
            <h1 className="text-headline-xl" style={{ color: 'var(--primary)' }}>Panel de Administración</h1>
            <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '8px' }}>
              Gestión integral de recursos y refugiados en tiempo real.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary">
              <Plus size={18} /> Nueva Entrada
            </button>
            <div style={{ position: 'relative' }}>
              <button className="btn btn-secondary">
                <Download size={18} /> Exportar Datos
              </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div className="bento-item" style={{ height: '400px' }}><div className="skeleton" style={{ height: '100%' }} /></div>
            <div className="bento-item" style={{ height: '400px' }}><div className="skeleton" style={{ height: '100%' }} /></div>
          </div>
        ) : stats && (
          <>
            {/* Bento Grid — Stats */}
            <div className="bento-grid" style={{ marginBottom: '24px' }}>
              {/* Gender Pie Chart */}
              <section className="bento-item" style={{ gridColumn: 'span 12' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  {/* Pie Chart */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h2 className="text-label-md" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Distribución por Género
                      </h2>
                    </div>
                    <div style={{ position: 'relative', height: '240px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.byGender}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {stats.byGender.map((entry, idx) => (
                              <Cell key={idx} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Inter' }}
                            formatter={(value: any) => [`${value} personas`, '']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <span className="text-headline-md" style={{ fontWeight: 700, color: 'var(--primary)', display: 'block' }}>
                          {stats.total.toLocaleString()}
                        </span>
                        <span className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Total</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                      {stats.byGender.map((g) => (
                        <div key={g.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: g.color }} />
                            <span className="text-body-md">{g.name}</span>
                          </div>
                          <span style={{ fontWeight: 700 }}>
                            {stats.total > 0 ? Math.round((g.value / stats.total) * 100) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Age Bar Chart */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h2 className="text-label-md" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Demografía por Bloque de Edad
                      </h2>
                      <span className="chip chip-suficiente">Tendencia: Estable</span>
                    </div>
                    <div style={{ height: '240px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.byAge} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                          <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12, fill: 'var(--on-surface-variant)' }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Inter' }}
                            formatter={(value: any) => [`${value} personas`, '']}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {stats.byAge.map((_, idx) => (
                              <Cell key={idx} fill={ageBarColors[idx % ageBarColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '24px' }}>
                      <div className="stat-card">
                        <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Mayor Densidad</p>
                        <p className="text-headline-md" style={{ fontWeight: 700, color: 'var(--primary)' }}>{stats.maxDensity}</p>
                      </div>
                      <div className="stat-card">
                        <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Población Infantil</p>
                        <p className="text-headline-md" style={{ fontWeight: 700, color: 'var(--secondary)' }}>{stats.childrenCount} niños</p>
                      </div>
                      <div className="stat-card">
                        <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Capacidad Ocupada</p>
                        <p className="text-headline-md" style={{ fontWeight: 700, color: 'var(--primary)' }}>{stats.capacityPct}%</p>
                      </div>
                      <div className="stat-card">
                        <p className="text-label-sm" style={{ color: 'var(--on-surface-variant)' }}>Nuevos Ingresos (Hoy)</p>
                        <p className="text-headline-md" style={{ fontWeight: 700, color: 'var(--secondary)' }}>{stats.newToday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Quick Entry + Supply Requirements */}
            <div className="bento-grid">
              {/* Quick Entry Form */}
              <section className="bento-item" style={{ gridColumn: 'span 12', maxWidth: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
                  {/* Form */}
                  <div>
                    <h2 className="text-headline-md" style={{ color: 'var(--primary)', marginBottom: '24px' }}>Incorporar nuevos renglones</h2>
                    <form onSubmit={handleSubmitRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label className="input-label">Refugio</label>
                        <select className="select-field" value={sShelterId} onChange={e => setSShelterId(e.target.value)} required>
                          {shelters.map(s => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label className="input-label">Categoría</label>
                          <select className="select-field" value={sCategory} onChange={e => setSCategory(e.target.value)}>
                            <option value="medicina">Medicina</option>
                            <option value="comida">Comida</option>
                            <option value="aseo_personal">Aseo Personal</option>
                            <option value="limpieza">Limpieza</option>
                            <option value="ferreteria">Ferretería</option>
                            <option value="otros">Otros</option>
                          </select>
                        </div>
                        <div>
                          <label className="input-label">Estado de Stock</label>
                          <select className="select-field" value={sStatus} onChange={e => setSStatus(e.target.value)}>
                            <option value="suficiente">Suficiente</option>
                            <option value="moderado">Moderado</option>
                            <option value="critico">Crítico</option>
                            <option value="n_a">N/A</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Porcentaje de Stock</span>
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{sStock}%</span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          style={{ width: '100%', accentColor: 'var(--primary)' }}
                          value={sStock} 
                          onChange={e => setSStock(parseInt(e.target.value))} 
                        />
                      </div>
                      <div>
                        <label className="input-label">Insumos Requeridos / Detalle</label>
                        <textarea 
                          className="input-field" 
                          style={{ minHeight: '80px', padding: '12px', resize: 'vertical', fontFamily: 'inherit' }}
                          placeholder="Ej: Antibióticos, Agua embotellada, Pañales..." 
                          value={sDescription} 
                          onChange={e => setSDescription(e.target.value)} 
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-container"
                        style={{ width: '100%', padding: '16px', fontWeight: 700 }}
                        disabled={formSaving !== 'idle'}
                      >
                        {formSaving === 'saving' ? (<><Loader2 size={18} className="animate-pulse-soft" /> Procesando...</>) :
                         formSaving === 'done' ? (<><CheckCircle size={18} /> ¡Registrado!</>) :
                         (<><Save size={18} /> Registrar Requerimiento</>)}
                      </button>
                    </form>
                  </div>

                  {/* Supply Requirements Table */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                      <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>Reporte de Requerimientos</h2>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
                        <input
                          type="text"
                          className="search-bar"
                          style={{ height: '40px', paddingLeft: '36px', width: '220px', fontSize: '14px' }}
                          placeholder="Filtrar categorías..."
                          value={supplyFilter}
                          onChange={e => setSupplyFilter(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Refugio</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Stock</th>
                            <th>Requerimiento</th>
                            <th style={{ textAlign: 'right' }}>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSupplies.map((s: any) => (
                            <tr key={s.id}>
                              <td className="text-body-md" style={{ fontWeight: 500 }}>
                                {s.shelters?.nombre || 'No asignado'}
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  {getCategoryIcon(s.categoria)}
                                  <span style={{ fontWeight: 500 }}>{getCategoryLabel(s.categoria)}</span>
                                </div>
                              </td>
                              <td><span className={getStatusChipClass(s.estado)}>{getStatusLabel(s.estado)}</span></td>
                              <td className="text-body-md">{s.stock_porcentaje >= 0 ? `${s.stock_porcentaje}%` : '--'}</td>
                              <td className="text-body-md">{s.descripcion_requerimiento || 'Sin pedidos'}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  onClick={() => handleDeleteRequirement(s.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--error)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                  title="Eliminar requerimiento"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Export Supply Report */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                       <a
                         href="/export/requirements.pdf"
                         className="btn btn-primary"
                         style={{ padding: '8px 16px', fontSize: '13px' }}
                         target="_blank"
                         rel="external"
                       >
                         <FileDown size={14} /> Reporte PDF
                       </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            {/* Gestión de Inspectores */}
            <div className="bento-grid" style={{ marginTop: '24px', marginBottom: '40px' }}>
              <section className="bento-item" style={{ gridColumn: 'span 12' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>Gestión de Inspectores</h2>
                    <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      Carga nuevos inspectores y autoriza su acceso a la pantalla de Registro de refugiados.
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowInspectorModal(true)}>
                    <Plus size={16} /> Registrar Inspector
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Correo Electrónico</th>
                        <th style={{ textAlign: 'center' }}>Estado de Autorización</th>
                        <th style={{ textAlign: 'center', width: '50px' }}><Pencil size={18} /></th>
                        <th style={{ textAlign: 'center', width: '50px' }}><Trash2 size={18} style={{ color: 'var(--error)' }} /></th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspectors.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)' }}>
                            No hay inspectores cargados en el sistema.
                          </td>
                        </tr>
                      ) : (
                        inspectors.map((ins: any) => (
                          <tr key={ins.id}>
                            <td><span style={{ fontWeight: 500 }}>{ins.name}</span></td>
                            <td><span className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>{ins.email}</span></td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`chip ${ins.is_authorized ? 'chip-suficiente' : 'chip-critico'}`}>
                                {ins.is_authorized ? 'Autorizado' : 'No Autorizado'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleOpenEditModal(ins)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Editar inspector"
                              >
                                <Pencil size={18} />
                              </button>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteInspector(ins.id, ins.name)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Eliminar inspector"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => handleToggleInspector(ins.id)}
                                className={`btn ${ins.is_authorized ? 'btn-outline' : 'btn-primary'}`}
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                {ins.is_authorized ? 'Desautorizar' : 'Autorizar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Gestión de Refugios */}
            <div className="bento-grid" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <section className="bento-item" style={{ gridColumn: 'span 12' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>Gestión de Refugios</h2>
                    <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      Administra los refugios disponibles, su capacidad total y su estado operativo.
                    </p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setShowShelterModal(true)}>
                    <Plus size={16} /> Registrar Refugio
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Estado / Municipio</th>
                        <th style={{ textAlign: 'center' }}>Coordenadas</th>
                        <th style={{ textAlign: 'center' }}>Capacidad</th>
                        <th style={{ textAlign: 'center' }}>Estado Operativo</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shelters.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)' }}>
                            No hay refugios cargados en el sistema.
                          </td>
                        </tr>
                      ) : (
                        shelters.map((s: any) => (
                          <tr key={s.id}>
                            <td><span style={{ fontWeight: 500 }}>{s.nombre}</span></td>
                            <td><span className="text-body-md" style={{ color: 'var(--on-surface-variant)' }}>{s.direccion}</span></td>
                            <td className="text-body-md">{s.estado}, {s.municipio}</td>
                            <td className="text-body-md" style={{ textAlign: 'center', color: 'var(--on-surface-variant)' }}>
                              {s.latitud}, {s.longitud}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span style={{ fontWeight: 600 }}>{s.capacidad_ocupada}</span> / {s.capacidad_total}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`chip ${
                                s.estado_operativo === 'activo' ? 'chip-suficiente' :
                                s.estado_operativo === 'saturado' ? 'chip-critico' : 'chip-na'
                              }`}>
                                {s.estado_operativo === 'activo' ? 'Activo' :
                                 s.estado_operativo === 'saturado' ? 'Saturado' : 'Cerrado'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => handleOpenEditShelterModal(s)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                                title="Editar refugio"
                              >
                                <Pencil size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Gestión de Refugiados */}
            <div className="bento-grid" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <section className="bento-item" style={{ gridColumn: 'span 12' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 className="text-headline-md" style={{ color: 'var(--primary)' }}>Gestión de Refugiados</h2>
                    <p className="text-body-sm" style={{ color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      Listado, verificación y actualización de los datos de los ciudadanos registrados en los refugios.
                    </p>
                  </div>
                  
                  {/* Filters bar */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
                      <input
                        type="text"
                        className="search-bar"
                        style={{ height: '40px', paddingLeft: '36px', width: '200px', fontSize: '14px' }}
                        placeholder="Buscar por nombre/cédula..."
                        value={refugeeSearch}
                        onChange={e => setRefugeeSearch(e.target.value)}
                      />
                    </div>
                    
                    <select
                      className="select-field"
                      style={{ height: '40px', padding: '0 12px', width: '150px', fontSize: '14px' }}
                      value={refugeeFilterStatus}
                      onChange={e => setRefugeeFilterStatus(e.target.value)}
                    >
                      <option value="todos">Todos los Estados</option>
                      <option value="verificado">Verificados</option>
                      <option value="pendiente">Pendientes</option>
                    </select>

                    <select
                      className="select-field"
                      style={{ height: '40px', padding: '0 12px', width: '180px', fontSize: '14px' }}
                      value={refugeeFilterShelter}
                      onChange={e => setRefugeeFilterShelter(e.target.value)}
                    >
                      <option value="">Todos los Refugios</option>
                      {shelters.map(s => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nombres y Apellidos</th>
                        <th>Cédula</th>
                        <th>Género / Edad</th>
                        <th>Refugio Asignado</th>
                        <th style={{ textAlign: 'center' }}>Prioridad</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                        <th style={{ textAlign: 'center', width: '50px' }}><Pencil size={18} /></th>
                        <th style={{ textAlign: 'center', width: '50px' }}><Trash2 size={18} style={{ color: 'var(--error)' }} /></th>
                        <th style={{ textAlign: 'right' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refugeesList.filter(r => {
                        const matchesSearch = !refugeeSearch || 
                          `${r.nombre} ${r.apellido}`.toLowerCase().includes(refugeeSearch.toLowerCase()) ||
                          (r.cedula && r.cedula.toLowerCase().includes(refugeeSearch.toLowerCase()));
                        
                        const matchesStatus = refugeeFilterStatus === 'todos' ||
                          (refugeeFilterStatus === 'verificado' && r.verificado) ||
                          (refugeeFilterStatus === 'pendiente' && !r.verificado);

                        const matchesShelter = !refugeeFilterShelter || String(r.refugio_id) === refugeeFilterShelter;

                        return matchesSearch && matchesStatus && matchesShelter;
                      }).length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--on-surface-variant)' }}>
                            No se encontraron refugiados registrados con los filtros seleccionados.
                          </td>
                        </tr>
                      ) : (
                        refugeesList.filter(r => {
                          const matchesSearch = !refugeeSearch || 
                            `${r.nombre} ${r.apellido}`.toLowerCase().includes(refugeeSearch.toLowerCase()) ||
                            (r.cedula && r.cedula.toLowerCase().includes(refugeeSearch.toLowerCase()));
                          
                          const matchesStatus = refugeeFilterStatus === 'todos' ||
                            (refugeeFilterStatus === 'verificado' && r.verificado) ||
                            (refugeeFilterStatus === 'pendiente' && !r.verificado);

                          const matchesShelter = !refugeeFilterShelter || String(r.refugio_id) === refugeeFilterShelter;

                          return matchesSearch && matchesStatus && matchesShelter;
                        }).map((r: any) => (
                          <tr key={r.id}>
                            <td>
                              <span style={{ fontWeight: 500 }}>{r.nombre} {r.apellido}</span>
                            </td>
                            <td className="text-body-md">{r.cedula || '—'}</td>
                            <td className="text-body-md">
                              <span style={{ textTransform: 'capitalize' }}>{r.genero}</span>, {r.edad ? `${r.edad} años` : '—'}
                            </td>
                            <td className="text-body-md" style={{ fontWeight: 500 }}>
                              {shelters.find(s => s.id === r.refugio_id)?.nombre || 'Cargando...'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`chip ${
                                r.prioridad === 'urgente' ? 'chip-urgente' :
                                r.prioridad === 'medica' ? 'chip-medica' : 'chip-normal'
                              }`}>
                                {r.prioridad === 'medica' ? 'Médica' : r.prioridad.charAt(0).toUpperCase() + r.prioridad.slice(1)}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`chip ${r.verificado ? 'chip-suficiente' : 'chip-critico'}`}>
                                {r.verificado ? 'Verificado' : 'Pendiente'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleOpenEditRefugeeModal(r)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Editar datos"
                              >
                                <Pencil size={18} />
                              </button>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteRefugee(r.id, `${r.nombre} ${r.apellido}`)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Eliminar registro"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => handleToggleRefugeeVerification(r.id, r.verificado)}
                                className={`btn ${r.verificado ? 'btn-outline' : 'btn-primary'}`}
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                {r.verificado ? 'Desmarcar' : 'Verificar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Modal de Registro de Inspector */}
            {showInspectorModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
              }}>
                <div className="bento-item" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: 'var(--surface-container-lowest)', borderRadius: '16px', boxShadow: 'var(--elevation-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Registrar Inspector</h3>
                    <button className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%', minWidth: 'auto' }} onClick={() => setShowInspectorModal(false)}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateInspector} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="input-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ej: Inspector Gómez" 
                        value={inspectorData.name} 
                        onChange={e => setInspectorData('name', e.target.value)} 
                        required 
                      />
                      {inspectorErrors.name && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{inspectorErrors.name}</span>}
                    </div>
                    <div>
                      <label className="input-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        className="input-field" 
                        placeholder="correo@refugio.gob.ve" 
                        value={inspectorData.email} 
                        onChange={e => setInspectorData('email', e.target.value)} 
                        required 
                      />
                      {inspectorErrors.email && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{inspectorErrors.email}</span>}
                    </div>
                    <div>
                      <label className="input-label">Contraseña</label>
                      <input 
                        type="password" 
                        className="input-field" 
                        placeholder="Mínimo 6 caracteres" 
                        value={inspectorData.password} 
                        onChange={e => setInspectorData('password', e.target.value)} 
                        required 
                      />
                      {inspectorErrors.password && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{inspectorErrors.password}</span>}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px', fontWeight: 700, marginTop: '8px' }}
                    >
                      Registrar y Guardar
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Registro de Refugio */}
            {showShelterModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
              }}>
                <div className="bento-item" style={{ width: '100%', maxWidth: '520px', padding: '24px', background: 'var(--surface-container-lowest)', borderRadius: '16px', boxShadow: 'var(--elevation-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Registrar Refugio</h3>
                    <button className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%', minWidth: 'auto' }} onClick={() => setShowShelterModal(false)}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCreateShelter} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="input-label">Nombre del Refugio</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ej: Gimnasio Vertical La Vega" 
                        value={shelterNombre} 
                        onChange={e => setShelterNombre(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="input-label">Dirección</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ej: Av. Principal, frente a la plaza" 
                        value={shelterDireccion} 
                        onChange={e => setShelterDireccion(e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Estado</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={shelterEstado} 
                          onChange={e => setShelterEstado(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Municipio</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ej: Libertador" 
                          value={shelterMunicipio} 
                          onChange={e => setShelterMunicipio(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Latitud</label>
                        <input 
                          type="number" 
                          step="any"
                          className="input-field" 
                          placeholder="Ej: 10.4806" 
                          value={shelterLatitud} 
                          onChange={e => setShelterLatitud(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Longitud</label>
                        <input 
                          type="number" 
                          step="any"
                          className="input-field" 
                          placeholder="Ej: -66.9036" 
                          value={shelterLongitud} 
                          onChange={e => setShelterLongitud(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Capacidad Total</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={shelterCapacidadTotal} 
                          onChange={e => setShelterCapacidadTotal(parseInt(e.target.value) || 0)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Estado Operativo</label>
                        <select 
                          className="select-field" 
                          value={shelterEstadoOperativo} 
                          onChange={e => setShelterEstadoOperativo(e.target.value)}
                        >
                          <option value="activo">Activo</option>
                          <option value="saturado">Saturado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={shelterSaving}
                    >
                      {shelterSaving ? (<><Loader2 size={18} className="animate-pulse-soft" /> Guardando...</>) : 'Registrar Refugio'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Edición de Refugio */}
            {showEditShelterModal && editingShelter && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
              }}>
                <div className="bento-item" style={{ width: '100%', maxWidth: '520px', padding: '24px', background: 'var(--surface-container-lowest)', borderRadius: '16px', boxShadow: 'var(--elevation-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Editar Refugio</h3>
                    <button className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%', minWidth: 'auto' }} onClick={() => { setShowEditShelterModal(false); setEditingShelter(null); }}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateShelter} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="input-label">Nombre del Refugio</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={shelterNombre} 
                        onChange={e => setShelterNombre(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="input-label">Dirección</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={shelterDireccion} 
                        onChange={e => setShelterDireccion(e.target.value)} 
                        required 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Estado</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={shelterEstado} 
                          onChange={e => setShelterEstado(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Municipio</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={shelterMunicipio} 
                          onChange={e => setShelterMunicipio(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Latitud</label>
                        <input 
                          type="number" 
                          step="any"
                          className="input-field" 
                          value={shelterLatitud} 
                          onChange={e => setShelterLatitud(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Longitud</label>
                        <input 
                          type="number" 
                          step="any"
                          className="input-field" 
                          value={shelterLongitud} 
                          onChange={e => setShelterLongitud(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Capacidad Total</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={shelterCapacidadTotal} 
                          onChange={e => setShelterCapacidadTotal(parseInt(e.target.value) || 0)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Estado Operativo</label>
                        <select 
                          className="select-field" 
                          value={shelterEstadoOperativo} 
                          onChange={e => setShelterEstadoOperativo(e.target.value)}
                        >
                          <option value="activo">Activo</option>
                          <option value="saturado">Saturado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={shelterSaving}
                    >
                      {shelterSaving ? (<><Loader2 size={18} className="animate-pulse-soft" /> Guardando...</>) : 'Guardar Cambios'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Edición de Refugiado */}
            {showEditRefugeeModal && editingRefugee && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
              }}>
                <div className="bento-item" style={{ width: '100%', maxWidth: '520px', padding: '24px', background: 'var(--surface-container-lowest)', borderRadius: '16px', boxShadow: 'var(--elevation-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Editar Datos del Refugiado</h3>
                    <button className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%', minWidth: 'auto' }} onClick={() => { setShowEditRefugeeModal(false); setEditingRefugee(null); }}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateRefugee} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Nombres</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={refugeeNombre} 
                          onChange={e => setRefugeeNombre(e.target.value)} 
                          required 
                        />
                      </div>
                      <div>
                        <label className="input-label">Apellidos</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={refugeeApellido} 
                          onChange={e => setRefugeeApellido(e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Cédula</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="Ej: V-12345678" 
                          value={refugeeCedula} 
                          onChange={e => setRefugeeCedula(e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="input-label">Edad</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          placeholder="Ej: 25" 
                          value={refugeeEdad} 
                          onChange={e => setRefugeeEdad(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Género</label>
                        <select 
                          className="select-field" 
                          value={refugeeGenero} 
                          onChange={e => setRefugeeGenero(e.target.value)}
                        >
                          <option value="femenino">Femenino</option>
                          <option value="masculino">Masculino</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Prioridad</label>
                        <select 
                          className="select-field" 
                          value={refugeePrioridad} 
                          onChange={e => setRefugeePrioridad(e.target.value)}
                        >
                          <option value="normal">Normal</option>
                          <option value="medica">Médica</option>
                          <option value="urgente">Urgente</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Refugio Asignado</label>
                      <select 
                        className="select-field" 
                        value={refugeeRefugioId} 
                        onChange={e => setRefugeeRefugioId(e.target.value)}
                        required
                      >
                        {shelters.map(s => (
                          <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={refugeeSaving}
                    >
                      {refugeeSaving ? (<><Loader2 size={18} className="animate-pulse-soft" /> Guardando...</>) : 'Guardar Cambios'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Modal de Edición de Inspector */}
            {showEditModal && editingInspector && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
              }}>
                <div className="bento-item" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: 'var(--surface-container-lowest)', borderRadius: '16px', boxShadow: 'var(--elevation-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>Editar Inspector</h3>
                    <button className="btn btn-outline" style={{ padding: '6px', borderRadius: '50%', minWidth: 'auto' }} onClick={() => { setShowEditModal(false); setEditingInspector(null); }}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateInspector} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="input-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Ej: Inspector Gómez" 
                        value={editForm.data.name} 
                        onChange={e => editForm.setData('name', e.target.value)} 
                        required 
                      />
                      {editForm.errors.name && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{editForm.errors.name}</span>}
                    </div>
                    <div>
                      <label className="input-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        className="input-field" 
                        placeholder="correo@refugio.gob.ve" 
                        value={editForm.data.email} 
                        onChange={e => editForm.setData('email', e.target.value)} 
                        required 
                      />
                      {editForm.errors.email && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{editForm.errors.email}</span>}
                    </div>
                    <div>
                      <label className="input-label">Nueva Contraseña (dejar en blanco para conservar la actual)</label>
                      <input 
                        type="password" 
                        className="input-field" 
                        placeholder="Mínimo 6 caracteres" 
                        value={editForm.data.password} 
                        onChange={e => editForm.setData('password', e.target.value)} 
                      />
                      {editForm.errors.password && <span style={{ color: 'var(--error)', fontSize: '12px' }}>{editForm.errors.password}</span>}
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '12px', fontWeight: 700, marginTop: '8px' }}
                    >
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              </div>
            )}
            {/* Modal de Diálogo Personalizado (Confirm/Alert) */}
            {customDialog.isOpen && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
                padding: '16px'
              }}>
                <div className="bento-item" style={{
                  width: '100%',
                  maxWidth: '400px',
                  padding: '24px',
                  background: 'var(--surface-container-lowest)',
                  borderRadius: '16px',
                  boxShadow: 'var(--elevation-4)',
                  textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: customDialog.type === 'confirm' ? 'rgba(30, 58, 138, 0.1)' : 'rgba(185, 28, 28, 0.1)',
                      color: customDialog.type === 'confirm' ? 'var(--primary)' : 'var(--error)',
                      marginBottom: '12px'
                    }}>
                      {customDialog.type === 'confirm' ? (
                        <Users size={24} />
                      ) : (
                        <X size={24} />
                      )}
                    </div>
                    <h3 className="text-headline-md" style={{ color: 'var(--primary)', margin: 0 }}>
                      {customDialog.title}
                    </h3>
                  </div>
                  <p className="text-body-md" style={{ color: 'var(--on-surface-variant)', marginBottom: '24px', lineHeight: '1.5' }}>
                    {customDialog.message}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {customDialog.type === 'confirm' ? (
                      <>
                        <button
                          className="btn btn-outline"
                          style={{ flex: 1, padding: '10px 16px' }}
                          onClick={() => setCustomDialog(prev => ({ ...prev, isOpen: false }))}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '10px 16px' }}
                          onClick={() => {
                            if (customDialog.onConfirm) customDialog.onConfirm();
                            setCustomDialog(prev => ({ ...prev, isOpen: false }));
                          }}
                        >
                          Aceptar
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px 16px' }}
                        onClick={() => setCustomDialog(prev => ({ ...prev, isOpen: false }))}
                      >
                        Aceptar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

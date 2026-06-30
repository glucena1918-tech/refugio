export interface Shelter {
  id: number;
  nombre: string;
  direccion: string;
  estado: string;
  municipio: string;
  parroquia?: string;
  latitud: number;
  longitud: number;
  capacidad_total: number;
  capacidad_ocupada: number;
  estado_operativo: 'activo' | 'saturado' | 'cerrado';
  created_at: string;
  updated_at: string;
}

export interface Refugee {
  id: number;
  nombre: string;
  apellido: string;
  cedula?: string;
  fecha_nacimiento?: string;
  edad?: number;
  genero: 'masculino' | 'femenino' | 'otro';
  telefono_contacto?: string;
  nombre_familiar_referencia?: string;
  procedencia?: string;
  zona_residencia?: string;
  estado_residencia?: string;
  municipio_residencia?: string;
  integrantes_grupo_familiar: number;
  tipo_sanguineo?: string;
  necesidades_medicas?: string;
  enfermedades_previas?: string;
  alergias_medicinas?: string;
  alergias_alimentos?: string;
  discapacidad?: string;
  necesidades_especiales?: string;
  personas_dependientes?: string;
  personas_desaparecidas?: string;
  foto_path?: string;
  ultima_ubicacion_conocida?: string;
  ruta_traslado?: string;
  contactos_emergencia?: Record<string, string>;
  religion?: string;
  prioridad: 'normal' | 'medica' | 'urgente';
  refugio_id?: number;
  verificado: boolean;
  registrado_por?: string;
  created_at: string;
  updated_at: string;
  shelter?: Shelter;
}

export interface SupplyRequirement {
  id: number;
  refugio_id: number;
  categoria: 'medicina' | 'comida' | 'aseo_personal' | 'limpieza' | 'ferreteria' | 'otros';
  estado: 'critico' | 'moderado' | 'suficiente' | 'n_a';
  stock_porcentaje: number;
  descripcion_requerimiento?: string;
  icono?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'inspector';
}

export interface DashboardStats {
  total_refugees: number;
  by_gender: {
    masculino: number;
    femenino: number;
    otro: number;
  };
  by_age_block: {
    '0-12': number;
    '13-17': number;
    '18-45': number;
    '46-64': number;
    '65+': number;
  };
  capacity_occupied_pct: number;
  new_today: number;
  children_count: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth?: {
    user?: UserProfile;
  };
  flash?: {
    success?: string;
    error?: string;
  };
};

export interface EmergencyContact {
  name: string;
  numbers: string[];
  icon: string;
  category: string;
}

export interface SearchFilters {
  apellido?: string;
  cedula?: string;
  zona?: string;
}

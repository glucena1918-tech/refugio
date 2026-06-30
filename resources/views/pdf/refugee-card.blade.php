<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Ficha de Registro Humanitario — Refugio Conectado</title>
    <style>
        @page {
            margin: 30px 40px;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1a1c1e;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.4;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .header-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a8a;
            letter-spacing: 0.02em;
        }
        .header-subtitle {
            font-size: 10px;
            color: #5b5e66;
            text-transform: uppercase;
            margin-top: 2px;
            font-weight: bold;
        }
        .header-meta {
            text-align: right;
            font-size: 11px;
            color: #43474e;
        }
        .header-meta strong {
            color: #1e3a8a;
            font-size: 12px;
        }
        .photo-box {
            width: 110px;
            height: 110px;
            border: 1px solid #c4c6cf;
            border-radius: 8px;
            text-align: center;
            line-height: 110px;
            color: #74777f;
            font-size: 10px;
            background-color: #f0f0f4;
            float: right;
            margin-left: 20px;
            margin-bottom: 12px;
        }
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 7px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #1e3a8a;
            background-color: #f0f4ff;
            padding: 4px 8px;
            margin-top: 18px;
            margin-bottom: 10px;
            text-transform: uppercase;
            border-left: 3px solid #1e3a8a;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .data-table td {
            padding: 5px 6px;
            vertical-align: top;
            border-bottom: 1px solid #e1e2ec;
        }
        .label {
            font-weight: bold;
            color: #43474e;
            width: 170px;
            font-size: 11px;
        }
        .value {
            color: #1a1c1e;
            font-size: 11px;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-normal { background-color: #dce1ff; color: #001549; }
        .badge-medica { background-color: #ffe082; color: #5d4037; }
        .badge-urgente { background-color: #ffdad6; color: #410002; }
        
        .badge-verificado { background-color: #bffff0; color: #005144; }
        .badge-pendiente { background-color: #e1e2ec; color: #43474e; }

        .footer {
            margin-top: 30px;
            border-top: 1px solid #c4c6cf;
            padding-top: 8px;
            font-size: 8.5px;
            color: #74777f;
            text-align: center;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td style="vertical-align: middle;">
                <div class="header-title">Ficha de Registro Humanitario</div>
                <div class="header-subtitle">Sistema de Monitoreo y Reunificación Familiar — CUSPAL</div>
            </td>
            <td style="text-align: right; vertical-align: middle;" class="header-meta">
                <div>Registro Nº: <strong>{{ str_pad($refugee['id'], 6, '0', STR_PAD_LEFT) }}</strong></div>
                <div style="margin-top: 4px; color: #74777f;">Fecha: {{ date('d-m-Y H:i', strtotime($refugee['created_at'])) }}</div>
            </td>
        </tr>
    </table>

    <!-- Foto box -->
    @if(!empty($refugee['foto_path']))
        <div class="photo-box">
            <img class="photo-img" src="https://unwraxprhvuqldqsropm.supabase.co/storage/v1/object/public/photos/{{ $refugee['foto_path'] }}" alt="Foto Reciente">
        </div>
    @else
        <div class="photo-box">
            Sin Fotografía
        </div>
    @endif

    <!-- Datos Básicos -->
    <div class="section-title">1. Datos Básicos y del Grupo Familiar</div>
    <table class="data-table">
        <tr>
            <td class="label">Nombre Completo:</td>
            <td class="value"><strong>{{ $refugee['nombre'] }} {{ $refugee['apellido'] }}</strong></td>
        </tr>
        <tr>
            <td class="label">Cédula de Identidad:</td>
            <td class="value">{{ $refugee['cedula'] ?? 'No registrada / Sin documento' }}</td>
        </tr>
        <tr>
            <td class="label">Edad / Fec. Nacimiento:</td>
            <td class="value">
                {{ $refugee['edad'] ?? '—' }} años 
                @if(!empty($refugee['fecha_nacimiento']))
                    (Nacido el: {{ date('d-m-Y', strtotime($refugee['fecha_nacimiento'])) }})
                @endif
            </td>
        </tr>
        <tr>
            <td class="label">Género:</td>
            <td class="value">{{ ucfirst($refugee['genero'] ?? '—') }}</td>
        </tr>
        <tr>
            <td class="label">Familiar de Referencia:</td>
            <td class="value">{{ $refugee['nombre_familiar_referencia'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Teléfono de Contacto:</td>
            <td class="value">{{ $refugee['telefono_contacto'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Procedencia:</td>
            <td class="value">{{ $refugee['procedencia'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Lugar de Residencia:</td>
            <td class="value">
                {{ $refugee['zona_residencia'] ?? '—' }}
                @if(!empty($refugee['municipio_residencia']))
                    , Mun. {{ $refugee['municipio_residencia'] }}
                @endif
                @if(!empty($refugee['estado_residencia']))
                    , Edo. {{ $refugee['estado_residencia'] }}
                @endif
            </td>
        </tr>
        <tr>
            <td class="label">Integrantes del Grupo Familiar:</td>
            <td class="value">{{ $refugee['integrantes_grupo_familiar'] ?? 1 }} personas</td>
        </tr>
    </table>

    <div class="clear"></div>

    <!-- Atención y Seguridad -->
    <div class="section-title">2. Atención Humanitaria y de Salud</div>
    <table class="data-table">
        <tr>
            <td class="label">Prioridad de Atención:</td>
            <td class="value">
                <span class="badge badge-{{ $refugee['prioridad'] }}">
                    {{ $refugee['prioridad'] === 'medica' ? 'Médica' : $refugee['prioridad'] }}
                </span>
            </td>
        </tr>
        <tr>
            <td class="label">Tipo Sanguíneo:</td>
            <td class="value"><strong>{{ $refugee['tipo_sanguineo'] ?? 'No registrado' }}</strong></td>
        </tr>
        <tr>
            <td class="label">Necesidades Médicas Urgentes:</td>
            <td class="value" style="color: #ba1a1a; font-weight: bold;">{{ $refugee['necesidades_medicas'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Enfermedades Previas Relevantes:</td>
            <td class="value">{{ $refugee['enfermedades_previas'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Alergias a Medicamentos:</td>
            <td class="value">{{ $refugee['alergias_medicinas'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Alergias a Alimentos:</td>
            <td class="value">{{ $refugee['alergias_alimentos'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Discapacidad o Movilidad Reducida:</td>
            <td class="value">{{ $refugee['discapacidad'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Necesidades Especiales (lactancia, infantil, etc):</td>
            <td class="value">{{ $refugee['necesidades_especiales'] ?? 'Ninguna' }}</td>
        </tr>
        <tr>
            <td class="label">Personas Dependientes a Cargo:</td>
            <td class="value">{{ $refugee['personas_dependientes'] ?? 'Ninguna' }}</td>
        </tr>
    </table>

    <!-- Localización y Reunificación -->
    <div class="section-title">3. Localización y Reunificación Familiar</div>
    <table class="data-table">
        <tr>
            <td class="label">Familiares Separados o Desaparecidos:</td>
            <td class="value" style="color: #6a3b00;">{{ $refugee['personas_desaparecidas'] ?? 'Ninguno reportado' }}</td>
        </tr>
        <tr>
            <td class="label">Última Ubicación Conocida:</td>
            <td class="value">{{ $refugee['ultima_ubicacion_conocida'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Ruta de Traslado Realizada:</td>
            <td class="value">{{ $refugee['ruta_traslado'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Contactos de Emergencia Adicionales:</td>
            <td class="value">{{ $refugee['contactos_emergencia'] ?? '—' }}</td>
        </tr>
        <tr>
            <td class="label">Ubicación Actual (Refugio Asignado):</td>
            <td class="value">
                <strong>{{ $refugee['shelters']['nombre'] ?? 'No Asignado' }}</strong> 
                @if(!empty($refugee['shelters']['direccion']))
                    — {{ $refugee['shelters']['direccion'] }}
                @endif
            </td>
        </tr>
    </table>

    <!-- Datos de Control -->
    <div class="section-title">4. Datos Sensibles y de Control Interno</div>
    <table class="data-table">
        <tr>
            <td class="label">Religión / Creencia:</td>
            <td class="value">{{ $refugee['religion'] ?? 'No registrada / Prefiere no decir' }}</td>
        </tr>
        <tr>
            <td class="label">Estado de Verificación:</td>
            <td class="value">
                <span class="badge badge-{{ $refugee['verificado'] ? 'verificado' : 'pendiente' }}">
                    {{ $refugee['verificado'] ? 'Verificado' : 'Pendiente por Moderación' }}
                </span>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>Este documento contiene datos humanitarios personales y protegidos por la Ley. Uso exclusivo para entes autorizados del Despacho de la Presidencia / CUSPAL.</p>
        <p>Ante emergencias de seguridad o salud en el refugio, notifique al Administrador a cargo.</p>
    </div>

</body>
</html>

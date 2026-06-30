<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte General de Refugiados — Refugio Conectado</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #191c1e;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 11px;
            line-height: 1.4;
        }
        .header {
            border-bottom: 2px solid #00236f;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .logo-title {
            font-size: 18px;
            font-weight: bold;
            color: #00236f;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }
        .subtitle {
            font-size: 10px;
            color: #757682;
            margin-top: 2px;
            text-transform: uppercase;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .table th {
            background-color: #00236f;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
            padding: 8px 6px;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.02em;
        }
        .table td {
            padding: 8px 6px;
            border-bottom: 1px solid #eceef0;
        }
        .table tr:nth-child(even) {
            background-color: #f7f9fb;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-normal { background-color: #dce1ff; color: #00236f; }
        .badge-medica { background-color: #fff8e1; color: #5d4e00; }
        .badge-urgente { background-color: #ffdad6; color: #93000a; }

        .badge-verificado { background-color: #62fae3; color: #007165; }
        .badge-pendiente { background-color: #eceef0; color: #444651; }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            border-top: 1px solid #eceef0;
            padding-top: 8px;
            font-size: 8px;
            color: #757682;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="header">
        <table style="width: 100%">
            <tr>
                <td>
                    <div class="logo-title">Base de Datos General de Refugiados</div>
                    <div class="subtitle">Reporte Consolidado de Personas Registradas — CUSPAL</div>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <div style="font-size: 11px; font-weight: bold; color: #00236f;">Total Registros: {{ count($refugees) }}</div>
                    <div style="font-size: 9px; color: #757682;">Generado: {{ date('d-m-Y H:i') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Cédula</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Lugar de Residencia</th>
                <th>Refugio Asignado</th>
                <th>Prioridad</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($refugees as $r)
                <tr>
                    <td>{{ str_pad($r['id'], 5, '0', STR_PAD_LEFT) }}</td>
                    <td><strong>{{ $r['nombre'] }} {{ $r['apellido'] }}</strong></td>
                    <td>{{ $r['cedula'] ?? '—' }}</td>
                    <td>{{ $r['edad'] ?? '—' }}</td>
                    <td>{{ $r['genero'] === 'femenino' ? 'F' : ($r['genero'] === 'masculino' ? 'M' : 'Otro') }}</td>
                    <td>{{ $r['zona_residencia'] ?? '—' }}</td>
                    <td>{{ $r['shelters']['nombre'] ?? '—' }}</td>
                    <td>
                        <span class="badge badge-{{ $r['prioridad'] }}">
                            {{ $r['prioridad'] === 'medica' ? 'Médica' : $r['prioridad'] }}
                        </span>
                    </td>
                    <td>
                        <span class="badge badge-{{ $r['verificado'] ? 'verificado' : 'pendiente' }}">
                            {{ $r['verificado'] ? 'Verificado' : 'Pendiente' }}
                        </span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Este reporte contiene información confidencial protegida por las normativas de seguridad y privacidad nacional.</p>
        <p>Despacho de la Presidencia de la República Bolivariana de Venezuela — CUSPAL</p>
    </div>

</body>
</html>

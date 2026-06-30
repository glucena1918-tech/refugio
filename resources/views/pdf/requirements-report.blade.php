<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reporte de Suministros y Requerimientos — Refugio Conectado</title>
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
        .badge-critico { background-color: #ffdad6; color: #93000a; }
        .badge-moderado { background-color: #ffdbcb; color: #773205; }
        .badge-suficiente { background-color: #62fae3; color: #007165; }
        .badge-na { background-color: #eceef0; color: #444651; }

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
                    <div class="logo-title">Reporte de Requerimientos de Suministros</div>
                    <div class="subtitle">Análisis de Necesidades Críticas por Refugio — CUSPAL</div>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <div style="font-size: 11px; font-weight: bold; color: #00236f;">Requerimientos: {{ count($requirements) }}</div>
                    <div style="font-size: 9px; color: #757682;">Generado: {{ date('d-m-Y H:i') }}</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Refugio</th>
                <th>Categoría</th>
                <th>Estado de Abastecimiento</th>
                <th>Stock Estimado (%)</th>
                <th>Descripción Detallada / Necesidades</th>
                <th>Última Actualización</th>
            </tr>
        </thead>
        <tbody>
            @php
                $categories = [
                    'medicina' => 'Medicina',
                    'comida' => 'Comida',
                    'aseo_personal' => 'Aseo Personal',
                    'limpieza' => 'Limpieza',
                    'ferreteria' => 'Ferretería',
                    'otros' => 'Otros'
                ];

                $statuses = [
                    'critico' => 'Crítico',
                    'moderado' => 'Moderado',
                    'suficiente' => 'Suficiente',
                    'n_a' => 'N/A'
                ];
            @endphp
            @foreach($requirements as $req)
                <tr>
                    <td>{{ str_pad($req['id'], 4, '0', STR_PAD_LEFT) }}</td>
                    <td><strong>{{ $req['shelters']['nombre'] ?? '—' }}</strong></td>
                    <td>{{ $categories[$req['categoria']] ?? $req['categoria'] }}</td>
                    <td>
                        <span class="badge badge-{{ $req['estado'] }}">
                            {{ $statuses[$req['estado']] ?? $req['estado'] }}
                        </span>
                    </td>
                    <td>{{ $req['stock_porcentaje'] > 0 ? $req['stock_porcentaje'] . '%' : '—' }}</td>
                    <td>{{ $req['descripcion_requerimiento'] ?? 'Sin requerimientos pendientes' }}</td>
                    <td>{{ date('d-m-Y H:i', strtotime($req['updated_at'])) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Este documento es de uso logístico para la remisión de suministros de ayuda humanitaria a los albergues afectados.</p>
        <p>Despacho de la Presidencia de la República Bolivariana de Venezuela — CUSPAL</p>
    </div>

</body>
</html>

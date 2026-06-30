<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Facades\Http;

class RefugeesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    private $supabaseUrl = 'https://unwraxprhvuqldqsropm.supabase.co';
    private $supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

    public function collection()
    {
        $response = Http::withHeaders([
            'apikey' => $this->supabaseAnon,
            'Authorization' => 'Bearer ' . $this->supabaseAnon,
        ])->get($this->supabaseUrl . '/rest/v1/refugees?select=*,shelters(*)&order=apellido.asc');

        return collect($response->json());
    }

    public function headings(): array
    {
        return [
            'ID',
            'Nombres',
            'Apellidos',
            'Cédula',
            'Edad',
            'Género',
            'Teléfono de Contacto',
            'Refugio',
            'Procedencia / Última Ubicación',
            'Zona de Residencia',
            'Tipo Sanguíneo',
            'Necesidades Médicas Urgentes',
            'Enfermedades Previas',
            'Prioridad',
            'Estado de Verificación',
            'Fecha de Registro'
        ];
    }

    public function map($refugee): array
    {
        return [
            $refugee['id'],
            $refugee['nombre'],
            $refugee['apellido'],
            $refugee['cedula'] ?? '—',
            $refugee['edad'] ?? '—',
            ucfirst($refugee['genero'] ?? 'otro'),
            $refugee['telefono_contacto'] ?? '—',
            $refugee['shelters']['nombre'] ?? '—',
            $refugee['procedencia'] ?? '—',
            $refugee['zona_residencia'] ?? '—',
            $refugee['tipo_sanguineo'] ?? '—',
            $refugee['necesidades_medicas'] ?? '—',
            $refugee['enfermedades_previas'] ?? '—',
            ucfirst($refugee['prioridad'] ?? 'normal'),
            ($refugee['verificado'] ?? false) ? 'Verificado' : 'Pendiente',
            date('d-m-Y H:i', strtotime($refugee['created_at']))
        ];
    }
}

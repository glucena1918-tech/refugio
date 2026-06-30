<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Illuminate\Support\Facades\Http;

class SupplyRequirementsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    private $supabaseUrl = 'https://unwraxprhvuqldqsropm.supabase.co';
    private $supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

    public function collection()
    {
        $response = Http::withHeaders([
            'apikey' => $this->supabaseAnon,
            'Authorization' => 'Bearer ' . $this->supabaseAnon,
        ])->get($this->supabaseUrl . '/rest/v1/supply_requirements?select=*,shelters(*)&order=id.asc');

        return collect($response->json());
    }

    public function headings(): array
    {
        return [
            'ID',
            'Refugio',
            'Categoría',
            'Estado',
            'Stock Actual (%)',
            'Requerimientos Pendientes',
            'Última Actualización'
        ];
    }

    public function map($req): array
    {
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

        return [
            $req['id'],
            $req['shelters']['nombre'] ?? '—',
            $categories[$req['categoria']] ?? $req['categoria'],
            $statuses[$req['estado']] ?? $req['estado'],
            $req['stock_porcentaje'] > 0 ? $req['stock_porcentaje'] . '%' : '—',
            $req['descripcion_requerimiento'] ?? 'Ninguno',
            date('d-m-Y H:i', strtotime($req['updated_at']))
        ];
    }
}

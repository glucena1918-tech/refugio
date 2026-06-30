<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RefugeesExport;
use App\Exports\SupplyRequirementsExport;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ExportController extends Controller
{
    private $supabaseUrl = 'https://unwraxprhvuqldqsropm.supabase.co';
    private $supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

    private function getHeaders()
    {
        return [
            'apikey' => $this->supabaseAnon,
            'Authorization' => 'Bearer ' . $this->supabaseAnon,
        ];
    }
    public function refugeesPdf()
    {
        $response = Http::withHeaders($this->getHeaders())
            ->get($this->supabaseUrl . '/rest/v1/refugees?select=*,shelters(*)&order=apellido.asc');

        $refugees = $response->json();

        $pdf = Pdf::loadView('pdf.refugees-report', compact('refugees'));
        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="reporte_general_refugiados.pdf"',
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    public function refugeeCardPdf($id)
    {
        $response = Http::withHeaders($this->getHeaders())
            ->get($this->supabaseUrl . '/rest/v1/refugees?id=eq.' . $id . '&select=*,shelters(*)');

        $refugees = $response->json();

        if (empty($refugees)) {
            abort(404, 'Ficha no encontrada');
        }

        $refugee = $refugees[0];

        $pdf = Pdf::loadView('pdf.refugee-card', compact('refugee'));
        
        $filename = 'ficha_registro_' . ($refugee['cedula'] ?? $refugee['id']) . '.pdf';
        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, private',
        ]);
    }

    public function requirementsPdf()
    {
        $response = Http::withHeaders($this->getHeaders())
            ->get($this->supabaseUrl . '/rest/v1/supply_requirements?select=*,shelters(*)&order=id.asc');

        $requirements = $response->json();

        $pdf = Pdf::loadView('pdf.requirements-report', compact('requirements'));
        
        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="reporte_requerimientos_suministros.pdf"',
            'Cache-Control' => 'no-cache, private',
        ]);
    }
}

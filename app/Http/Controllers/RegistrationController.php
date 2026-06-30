<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RegistrationController extends Controller
{
    private $supabaseUrl = 'https://unwraxprhvuqldqsropm.supabase.co';
    private $supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

    public function create()
    {
        return Inertia::render('Registration/Form');
    }

    public function store(Request $request)
    {
        $data = $request->only([
            'nombre', 'apellido', 'cedula', 'fecha_nacimiento', 'edad',
            'genero', 'telefono_contacto', 'nombre_familiar_referencia',
            'procedencia', 'zona_residencia', 'estado_residencia',
            'municipio_residencia', 'integrantes_grupo_familiar',
            'tipo_sanguineo', 'necesidades_medicas', 'enfermedades_previas',
            'alergias_medicinas', 'alergias_alimentos', 'discapacidad',
            'necesidades_especiales', 'personas_dependientes',
            'personas_desaparecidas', 'ultima_ubicacion_conocida',
            'ruta_traslado', 'contactos_emergencia', 'religion',
            'prioridad', 'refugio_id',
        ]);

        // Validate required fields manually to avoid redirection
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'nombre' => 'required|string|min:1',
            'apellido' => 'required|string|min:1',
            'genero' => 'required|string',
            'refugio_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'La validación falló.',
                'messages' => $validator->errors()
            ], 422);
        }

        // Fields that must NOT be set to null (NOT NULL in database)
        $requiredFields = ['nombre', 'apellido', 'genero', 'prioridad', 'refugio_id'];

        // Clean empty strings to null ONLY for optional fields
        foreach ($data as $key => $value) {
            if (in_array($key, $requiredFields)) {
                continue; // Never nullify required fields
            }
            if ($value === '' || $value === null) {
                $data[$key] = null;
            }
        }

        // Ensure numeric fields (handle empty strings for integers)
        if (isset($data['edad']) && $data['edad'] !== null) {
            $data['edad'] = (int) $data['edad'];
            if ($data['edad'] === 0) $data['edad'] = null;
        }
        if (isset($data['integrantes_grupo_familiar']) && $data['integrantes_grupo_familiar'] !== null) {
            $data['integrantes_grupo_familiar'] = (int) $data['integrantes_grupo_familiar'];
        }
        if (isset($data['refugio_id'])) {
            $data['refugio_id'] = (int) $data['refugio_id'];
        }

        // Remove null/empty optional fields entirely to avoid DB constraint issues
        if ($data['cedula'] === null) {
            unset($data['cedula']);
        }
        if (isset($data['fecha_nacimiento']) && $data['fecha_nacimiento'] === null) {
            unset($data['fecha_nacimiento']);
        }

        // Upload photo if provided
        if ($request->hasFile('foto')) {
            $photo = $request->file('foto');
            $filename = 'refugees/' . time() . '_' . $photo->getClientOriginalName();

            $uploadResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->supabaseAnon,
                'Content-Type' => $photo->getMimeType(),
            ])->withBody(
                file_get_contents($photo->getRealPath()),
                $photo->getMimeType()
            )->post($this->supabaseUrl . '/storage/v1/object/photos/' . $filename);

            if ($uploadResponse->ok()) {
                $data['foto_path'] = 'photos/' . $filename;
            }
        }

        // Insert into Supabase
        $response = Http::withHeaders([
            'apikey' => $this->supabaseAnon,
            'Authorization' => 'Bearer ' . $this->supabaseAnon,
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation',
        ])->post($this->supabaseUrl . '/rest/v1/refugees', $data);

        if ($response->successful()) {
            $result = $response->json();
            $newId = null;

            if (is_array($result) && count($result) > 0 && isset($result[0]['id'])) {
                $newId = $result[0]['id'];
            }

            return response()->json([
                'success' => true,
                'id' => $newId,
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => $response->body(),
        ], 422);
    }
}

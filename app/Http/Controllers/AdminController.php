<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Http;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'inspectors' => User::where('role', 'inspector')->orderBy('id', 'desc')->get()
        ]);
    }

    public function storeInspector(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'inspector',
            'is_authorized' => false,
        ]);

        return back()->with('success', 'Inspector registrado exitosamente y pendiente por autorización.');
    }

    public function toggleInspectorAuth($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'inspector') {
            $user->is_authorized = !$user->is_authorized;
            $user->save();
        }

        return back()->with('success', 'Estado de autorización del inspector actualizado.');
    }

    public function updateInspector(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->role !== 'inspector') {
            return back()->withErrors(['error' => 'Usuario no es un inspector.']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        return back()->with('success', 'Inspector actualizado exitosamente.');
    }

    public function deleteInspector($id)
    {
        $user = User::findOrFail($id);
        if ($user->role !== 'inspector') {
            return back()->withErrors(['error' => 'Usuario no es un inspector.']);
        }

        $user->delete();

        return back()->with('success', 'Inspector eliminado exitosamente.');
    }

    public function deleteRequirement($id)
    {
        $supabaseUrl = 'https://unwraxprhvuqldqsropm.supabase.co';
        $supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVud3JheHByaHZ1cWxkcXNyb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzQzMTUsImV4cCI6MjA5ODMxMDMxNX0.9Ay68RnjEvtpF27HAIcJqKu2XpQHy7SByxv-QPA206w';

        $response = Http::withHeaders([
            'apikey' => $supabaseAnon,
            'Authorization' => 'Bearer ' . $supabaseAnon,
        ])->delete($supabaseUrl . '/rest/v1/supply_requirements?id=eq.' . $id);

        if ($response->failed()) {
            return back()->withErrors(['error' => 'No se pudo eliminar el requerimiento de la base de datos.']);
        }

        return back()->with('success', 'Requerimiento eliminado con éxito.');
    }
}

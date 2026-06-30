<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (auth()->attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            $user = auth()->user();

            if ($user->role === 'inspector' && !$user->is_authorized) {
                auth()->logout();
                return response()->json([
                    'message' => 'Su cuenta de Inspector aún no ha sido autorizada por el Administrador.'
                ], 403);
            }

            $redirectUrl = $user->role === 'admin' ? '/admin/dashboard' : '/registro';
            return response()->json(['redirect' => $redirectUrl]);
        }

        return response()->json([
            'message' => 'Credenciales incorrectas. Verifica tu correo y contraseña.'
        ], 401);
    }

    public function logout(Request $request)
    {
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}

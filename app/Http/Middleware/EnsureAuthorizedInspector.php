<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAuthorizedInspector
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'No autenticado'], 401);
            }
            return redirect()->route('login');
        }

        $user = auth()->user();

        // Allow both inspectors and admins to access registration
        if (!in_array($user->role, ['inspector', 'admin'])) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Acceso restringido'], 403);
            }
            abort(403, 'Acceso restringido. Solo los Inspectores pueden acceder a esta pantalla.');
        }

        if ($user->role === 'inspector' && !$user->is_authorized) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Cuenta no autorizada'], 403);
            }
            abort(403, 'Su cuenta de Inspector aún no ha sido autorizada por el Administrador.');
        }

        return $next($request);
    }
}

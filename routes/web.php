<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicSearchController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExportController;

/*
|--------------------------------------------------------------------------
| Web Routes — Refugio Conectado
|--------------------------------------------------------------------------
|
| Pestaña 1: Landing Pública (sin auth)
| Pestaña 2: Admin Dashboard (auth requerido)
| Pestaña 3: Formulario de Registro (auth requerido)
|
*/

// === Pestaña 1: Landing Pública (sin auth) ===
Route::get('/', [PublicSearchController::class, 'index'])->name('home');

// === Autenticación ===
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// === Pestaña 2: Admin Dashboard ===
Route::prefix('admin')->middleware(['admin'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/inspectors', [AdminController::class, 'storeInspector'])->name('admin.inspectors.store');
    Route::patch('/inspectors/{id}', [AdminController::class, 'updateInspector'])->name('admin.inspectors.update');
    Route::delete('/inspectors/{id}', [AdminController::class, 'deleteInspector'])->name('admin.inspectors.delete');
    Route::post('/inspectors/{id}/toggle', [AdminController::class, 'toggleInspectorAuth'])->name('admin.inspectors.toggle');
    Route::delete('/requirements/{id}', [AdminController::class, 'deleteRequirement'])->name('admin.requirements.delete');
});

// === Pestaña 3: Formulario de Registro ===
Route::get('/registro', [RegistrationController::class, 'create'])
    ->middleware(['authorized.inspector'])
    ->name('registration.create');
Route::post('/registro', [RegistrationController::class, 'store'])
    ->middleware(['authorized.inspector'])
    ->name('registration.store');

// === Export Routes (PDF) ===
Route::prefix('export')->group(function () {
    Route::get('/refugees.pdf', [ExportController::class, 'refugeesPdf'])->name('export.refugees.pdf');
    Route::get('/refugee/{id}/ficha.pdf', [ExportController::class, 'refugeeCardPdf'])->name('export.refugee.pdf');
    Route::get('/requirements.pdf', [ExportController::class, 'requirementsPdf'])->name('export.requirements.pdf');
});

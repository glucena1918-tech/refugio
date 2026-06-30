<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'is_authorized'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted()
    {
        static::created(function ($user) {
            self::syncToSupabase($user);
        });

        static::updated(function ($user) {
            self::syncToSupabase($user);
        });

        static::deleted(function ($user) {
            self::deleteFromSupabase($user->id);
        });
    }

    public static function syncToSupabase($user)
    {
        $supabaseUrl = env('SUPABASE_URL');
        $supabaseAnon = env('SUPABASE_ANON_KEY');

        if (!$supabaseUrl || !$supabaseAnon) {
            return;
        }

        $createdAt = $user->created_at;
        $updatedAt = $user->updated_at;

        \Illuminate\Support\Facades\Http::withHeaders([
            'apikey' => $supabaseAnon,
            'Authorization' => 'Bearer ' . $supabaseAnon,
            'Content-Type' => 'application/json',
            'Prefer' => 'resolution=merge-duplicates',
        ])->post($supabaseUrl . '/rest/v1/user_profiles', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_authorized' => (bool)$user->is_authorized,
            'created_at' => $createdAt instanceof \Carbon\Carbon ? $createdAt->toIso8601String() : $createdAt,
            'updated_at' => $updatedAt instanceof \Carbon\Carbon ? $updatedAt->toIso8601String() : $updatedAt,
        ]);
    }

    public static function deleteFromSupabase($id)
    {
        $supabaseUrl = env('SUPABASE_URL');
        $supabaseAnon = env('SUPABASE_ANON_KEY');

        if (!$supabaseUrl || !$supabaseAnon) {
            return;
        }

        \Illuminate\Support\Facades\Http::withHeaders([
            'apikey' => $supabaseAnon,
            'Authorization' => 'Bearer ' . $supabaseAnon,
        ])->delete($supabaseUrl . '/rest/v1/user_profiles?id=eq.' . $id);
    }
}

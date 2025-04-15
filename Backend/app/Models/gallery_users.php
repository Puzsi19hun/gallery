<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;


class gallery_users extends Authenticable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'users';

    protected $fillable = ['name', 'email', 'password', 'pfp', 'location', 'pass_token'];

    protected $hidden = [
        'password'
    ];
    protected $primaryKey = 'id';
    public $timestamps = true;
}

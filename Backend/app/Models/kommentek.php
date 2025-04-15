<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;


class kommentek extends Model
{
    protected $table = 'kommentek';
    protected $primaryKey = 'id';
    public $timestamps = true;
    const UPDATED_AT = null;
    protected $fillable = [
        'user_id',
        'kep_id',
        'komment'
    ];

  
    
    
       
    }
    
    


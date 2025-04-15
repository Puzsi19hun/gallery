<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;


class hashtags extends Model
{
    protected $table = 'hashtags';
    protected $primaryKey = 'id';
    public $timestamps = false;
  
    protected $fillable = [
        'name',
    
    ];

  
    
    
       
    }
    
    
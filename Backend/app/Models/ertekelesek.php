<?php


    namespace App\Models;

    use Illuminate\Database\Eloquent\Model;
    
    class ertekelesek extends Model
    {
        protected $table = 'ertekelesek';
        const CREATED_AT = null;
        protected $fillable = [
            'user_id', 'kep_id', 'likes'
        ];
    
        public function kep()
        {
            return $this->belongsTo(Kep::class, 'kep_id');
        }
    }
    

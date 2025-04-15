<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use App\Models\Hashtag;


class kepek extends Model
{
    protected $table = 'kepek';
    protected $primaryKey = 'id';
    public $timestamps = true;
    const UPDATED_AT = null;
    protected $fillable = [
        'user_id',
        'kep',
        'name',
        'canBeEdited',
        'hashtag',
        'width',
        'forked',
        'forkedFrom',
        'hashtags',
        'description'
    ];




    public function user()
    {
        return $this->belongsTo(gallery_users::class, 'user_id', 'id');
    }


}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    protected $fillable = [
        'user_id',
        'license_number',
        'branch',
        'name',
        'address',
        'contact',
        'is_registered',
        'uuid',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = ['user_id', 'address', 'branch', 'contact', 'link_expiration_date', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

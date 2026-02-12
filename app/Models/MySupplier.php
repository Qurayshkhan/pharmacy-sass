<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MySupplier extends Model
{
    use HasFactory;

    protected $table = 'my_suppliers';

    protected $fillable = [
        'user_id',
        'supplier_name',
        'company_name',
        'contact',
        'address',
    ];

    /**
     * Get the user that owns this supplier.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}

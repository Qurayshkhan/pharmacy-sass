<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PharmacySupplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'pharmacy_id',
        'supplier_name',
        'company_name',
        'contact',
        'address',
    ];

    /**
     * Get the pharmacy that owns this supplier.
     */
    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class, 'pharmacy_id', 'id');
    }
}

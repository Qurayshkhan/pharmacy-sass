<?php

use App\Models\Pharmacy;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pharmacy_suppliers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pharmacy::class)->constrained('pharmacies')->cascadeOnDelete();
            $table->string('supplier_name');
            $table->string('company_name')->nullable();
            $table->string('contact')->nullable();
            $table->longText('address')->nullable();
            $table->timestamps();

            $table->index('pharmacy_id', 'idx_pharmacy_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_suppliers');
    }
};

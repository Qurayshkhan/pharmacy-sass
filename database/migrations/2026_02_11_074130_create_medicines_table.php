<?php

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
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->index('idx_name');
            $table->string('company')->nullable()->index('idx_company');
            $table->string('pack_size')->nullable();
            $table->string('sale_price')->nullable();
            $table->string('link')->nullable();
            $table->string('mrp')->nullable();
            $table->string('letter')->nullable();
            $table->timestamps();

            $table->fullText(['name', 'company']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};

<?php

use App\Models\Category;
use App\Models\Pharmacy;
use App\Models\PharmacySupplier;
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
        Schema::create('Items', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Pharmacy::class, 'pharmacy_id')->nullable()->constrained('pharmacies')->cascadeOnDelete();
            $table->foreignIdFor(Category::class, 'category_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->foreignIdFor(PharmacySupplier::class, 'supplier_id')->nullable()->constrained('pharmacy_suppliers')->cascadeOnDelete();
            $table->string('name')->nullable()->index('idx_name');
            $table->string('company')->nullable()->index('idx_company');
            $table->double('pieces_in_packing')->nullable();
            $table->double('purchase_price')->nullable();
            $table->double('sales_price')->nullable();
            $table->double('pack_sale_tax')->default(0);
            $table->double('stock_quantity')->default(0);
            $table->double('retail_price')->default(0);
            $table->string('rag_location')->default(0);
            $table->double('max_sale_discount')->default(0);
            $table->string('item_alert')->default(0);
            $table->boolean('allow_due')->default(0);
            $table->boolean('is_active')->default(1);
            $table->boolean('generate_po')->default(1);
            $table->longText('barcode')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Items');
    }
};

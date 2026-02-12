<?php

use App\Models\Category;
use App\Models\MySupplier;
use App\Models\User;
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
            $table->foreignIdFor(User::class, 'user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignIdFor(Category::class, 'category_id')->nullable()->constrained('categories')->cascadeOnDelete();
            $table->foreignIdFor(MySupplier::class, 'my_supplier_id')->nullable()->constrained('my_suppliers')->cascadeOnDelete();
            $table->string('name')->nullable()->index('idx_name');
            $table->string('company')->nullable()->index('idx_company');
            $table->double('pieces_in_packing')->nullable();
            $table->double('purchase_price')->nullable();
            $table->double('sales_price')->nullable();
            $table->double('pack_sale_tax')->default(0);
            $table->double('stock_quantity')->default(0);
            $table->string('pack_size')->nullable();
            $table->double('retail_price')->default(0);
            $table->string('rag_location')->default(0);
            $table->double('max_sale_discount')->default(0);
            $table->string('item_alert')->default(0);
            $table->boolean('allow_due')->default(0);
            $table->boolean('is_active')->default(1);
            $table->boolean('generate_po')->default(1);
            $table->datetime('manufacture_date')->nullable();
            $table->datetime('expiry_date')->nullable();
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

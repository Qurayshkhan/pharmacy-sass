<?php

use App\Models\Pharmacy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pharmacies', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique()->nullable();
            $table->foreignIdFor(User::class)->constrained('users')->cascadeOnDelete();
            $table->string('logo')->nullable()->default('/assets/images/pharmacy/default.png');
            $table->string('license_number')->nullable()->index('idx_license_number');
            $table->string('branch')->nullable()->index('idx_branch');
            $table->string('name')->index('idx_name')->nullable();
            $table->longText('address')->nullable();
            $table->string('contact')->nullable();
            $table->longText('invite_link')->nullable();
            $table->dateTime('link_expires_at')->nullable()->default(Carbon::now()->addDays(3));
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacies');
    }
};

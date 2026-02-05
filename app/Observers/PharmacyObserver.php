<?php

namespace App\Observers;

use App\Models\Pharmacy;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PharmacyObserver
{
    /**
     * Handle the Pharmacy "created" event.
     */
    public function created(Pharmacy $pharmacy): void
    {
        $pharmacy->uuid =  Str::uuid();
        $pharmacy->link_expires_at = Carbon::now()->addDays(3);
        $pharmacy->save();
    }

    /**
     * Handle the Pharmacy "updated" event.
     */
    public function updated(Pharmacy $pharmacy): void
    {
        //
    }

    /**
     * Handle the Pharmacy "deleted" event.
     */
    public function deleted(Pharmacy $pharmacy): void
    {
        //
    }

    /**
     * Handle the Pharmacy "restored" event.
     */
    public function restored(Pharmacy $pharmacy): void
    {
        //
    }

    /**
     * Handle the Pharmacy "force deleted" event.
     */
    public function forceDeleted(Pharmacy $pharmacy): void
    {
        //
    }
}

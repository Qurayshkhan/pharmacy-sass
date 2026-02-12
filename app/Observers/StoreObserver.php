<?php

namespace App\Observers;

use App\Models\Store;
use Carbon\Carbon;

class StoreObserver
{
    public function created(Store $store): void
    {
        $store->link_expiration_date = Carbon::now()->addDays(3);
        $store->save();
    }
}

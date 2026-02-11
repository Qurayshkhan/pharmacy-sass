<?php

namespace App\Http\Controllers\Medicines;

use App\Http\Controllers\Controller;
use App\Services\MedicineJsonStream;
use App\Services\MedicineService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class MedicineController extends Controller
{
    protected $medicineService;

    public function __construct(MedicineService $medicineService)
    {
        $this->medicineService = $medicineService;
    }

    public function index(Request $request)
    {
        // Sanitize and normalize search input
        $search = trim($request->input('search', ''));

        $cacheKey = 'medicines:'.md5(json_encode([
            'search' => $search,
            'page' => $request->input('page', 1),
        ]));

        // Cache can be enabled for better performance if needed
        // $medicines = Cache::remember($cacheKey, now()->addSeconds(60), function () use ($request) {
        //     return $this->medicineService->getMedicines($request);
        // });

        $medicines = $this->medicineService->getMedicines($request);

        return Inertia::render('medicines/medicines', [
            'medicines' => Inertia::scroll(fn () => $medicines),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function search(Request $request)
    {
        $search = strtolower(trim($request->query('search', '')));

        return response()->stream(function () use ($search) {
            // Start JSON array
            echo '[';
            $first = true;
            $count = 0;
            $maxResults = 10000; // Limit results for performance

            foreach (MedicineJsonStream::stream() as $medicine) {
                // Apply search filter
                if ($search) {
                    $name = strtolower($medicine['name'] ?? '');
                    $company = strtolower($medicine['company'] ?? '');

                    if (! str_contains($name, $search) && ! str_contains($company, $search)) {
                        continue;
                    }
                }

                // Add comma separator
                if (! $first) {
                    echo ',';
                }
                $first = false;

                // Output JSON-encoded medicine
                echo json_encode($medicine, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

                // Flush output for streaming
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();

                $count++;
                if ($count >= $maxResults) {
                    break;
                }
            }

            // Close JSON array
            echo ']';
        }, 200, [
            'Content-Type' => 'application/json',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Accel-Buffering' => 'no', // Disable nginx buffering
        ]);
    }
}

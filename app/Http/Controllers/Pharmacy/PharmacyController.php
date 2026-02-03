<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use App\Service\PharmacyService;
use Illuminate\Http\Request;

class PharmacyController extends Controller
{
    protected $pharmacyService;
    public function __construct(PharmacyService $pharmacyService)
    {
        $this->pharmacyService = $pharmacyService;
    }
}
<?php

namespace App\Services;

use App\Repositories\MedicineRepository;

class MedicineService
{
    protected $medicineRepository;

    public function __construct(MedicineRepository $medicineRepository)
    {
        $this->medicineRepository = $medicineRepository;
    }

    public function getMedicines($request)
    {
        return $this->medicineRepository->getAllMedicines($request);
    }
}

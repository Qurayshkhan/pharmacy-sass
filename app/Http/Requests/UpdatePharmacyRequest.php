<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePharmacyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'name' => 'required|string|max:255',
            'is_update_pharmacy' => 'nullable',
            'email' => 'nullable|required_unless:is_update_pharmacy,true|email|unique:users,email,'.$this->uuid.',uuid',
            'password' => 'nullable|required_unless:is_update_pharmacy,true|string|min:8|confirmed',
            'license_number' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact' => 'required|string',
            'branch' => 'nullable',
            'uuid' => 'nullable',
            'status' => 'nullable',
        ];
    }
}

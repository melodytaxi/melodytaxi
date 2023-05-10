<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreDriverRequest extends FormRequest
{
    /**
     * Determine if the driver is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:55',
            'email' => 'required|email|unique:drivers,email',
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->symbols(),
            ]
        ];
    }
}

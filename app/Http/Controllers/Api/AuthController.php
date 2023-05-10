<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Driver;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var \App\Models\Driver $driver */
        $driver = Driver::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $token = $driver->createToken('main')->plainTextToken;
        return response(compact('driver', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\Driver $driver */
        $driver = Auth::user();
        $token = $driver->createToken('main')->plainTextToken;
        return response(compact('driver', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\Driver $driver */
        $driver = $request->user();
        $driver->currentAccessToken()->delete();
        return response('', 204);
    }
}

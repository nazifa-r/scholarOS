<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/otp/verify', [AuthController::class, 'verifyOtp'])
    ->middleware('throttle:10,1');

Route::post('/otp/resend', [AuthController::class, 'resendOtp'])
    ->middleware('throttle:3,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });
});
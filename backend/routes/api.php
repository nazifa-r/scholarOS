<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResearchPaperController;
use App\Http\Controllers\Api\ResearchAreaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Authentication routes remain at /api/*
| Versioned application routes are under /api/v1/*
|
*/


// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// Register
Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

// Verify email OTP
Route::post('/otp/verify', [AuthController::class, 'verifyOtp'])
    ->middleware('throttle:10,1');

// Resend email OTP
Route::post('/otp/resend', [AuthController::class, 'resendOtp'])
    ->middleware('throttle:3,1');

// Login
Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Current authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


// ============================================================================
// VERSION 1 API ROUTES
// ============================================================================

Route::prefix('v1')->group(function () {

    // ========================================================================
    // PUBLIC ROUTES
    // ========================================================================

    // API health check
    Route::get('/ping', function () {
        return response()->json([
            'success' => true,
            'message' => 'ScholarOS API is working!',
            'timestamp' => now()->toISOString()
        ]);
    });


    // ========================================================================
    // RESEARCH AREAS
    // ========================================================================

    // GET /api/v1/research-areas
    // Retrieve all available research areas
    Route::get('/research-areas', [ResearchAreaController::class, 'index']);

    // POST /api/v1/research-areas
    // Save the authenticated user's selected research areas
    Route::middleware('auth:sanctum')->post(
        '/research-areas',
        [ResearchAreaController::class, 'store']
    );


    // ========================================================================
    // RESEARCH PAPERS
    // ========================================================================

    Route::prefix('papers')->group(function () {

        // ------------------------------------------------------------
        // GET ALL PAPERS
        // GET /api/v1/papers
        // ------------------------------------------------------------
        Route::get('/', [ResearchPaperController::class, 'index']);


        // ------------------------------------------------------------
        // GET SINGLE PAPER
        // GET /api/v1/papers/{id}
        // ------------------------------------------------------------
        Route::get('/{id}', [ResearchPaperController::class, 'show']);


        // ------------------------------------------------------------
        // PROTECTED PAPER ROUTES
        // ------------------------------------------------------------

        Route::middleware('auth:sanctum')->group(function () {

            // Create paper
            // POST /api/v1/papers
            Route::post('/', [ResearchPaperController::class, 'store']);

            // Update paper
            // PUT /api/v1/papers/{id}
            Route::put('/{id}', [ResearchPaperController::class, 'update']);

            // Delete paper
            // DELETE /api/v1/papers/{id}
            Route::delete('/{id}', [ResearchPaperController::class, 'destroy']);
        });
    });


    // ========================================================================
    // VERSIONED USER PROFILE
    // ========================================================================

    // GET /api/v1/user
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    });

});
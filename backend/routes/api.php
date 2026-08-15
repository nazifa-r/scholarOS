<?php

use App\Http\Controllers\Api\ResearchPaperController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Test endpoint
    Route::get('/ping', function () {
        return response()->json([
            'success' => true,
            'message' => 'ScholarOS API is working!',
            'timestamp' => now()->toISOString()
        ]);
    });

    // Research Papers
    Route::prefix('papers')->group(function () {
        Route::get('/', [ResearchPaperController::class, 'index']);
        Route::get('/{id}', [ResearchPaperController::class, 'show']);
        Route::post('/', [ResearchPaperController::class, 'store']);
        Route::put('/{id}', [ResearchPaperController::class, 'update']);
        Route::delete('/{id}', [ResearchPaperController::class, 'destroy']);
    });
});
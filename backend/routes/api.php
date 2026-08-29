<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ResearchPaperController;
use App\Http\Controllers\Api\ResearchAreaController;
use App\Http\Controllers\Api\RoleVerificationController;
use App\Http\Controllers\Api\Admin\VerificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PaperController;
use App\Http\Controllers\Api\ResearcherController;
use App\Http\Controllers\Api\NotificationController;
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
    // ADMIN VERIFICATION
    // ========================================================================

    // Protected admin verification routes.
    //
    // auth:sanctum -> user must be authenticated
    // admin         -> user must have an administrator role
    //
    Route::middleware(['auth:sanctum', 'admin'])
        ->prefix('admin/verifications')
        ->group(function () {

            // GET /api/v1/admin/verifications
            // Retrieve verification requests
            Route::get('/', [VerificationController::class, 'index']);

            // GET /api/v1/admin/verifications/{id}
            // Retrieve a single verification request
            Route::get('/{id}', [VerificationController::class, 'show']);

            // POST /api/v1/admin/verifications/{id}/approve
            // Approve a pending verification request
            Route::post(
                '/{id}/approve',
                [VerificationController::class, 'approve']
            );

            // POST /api/v1/admin/verifications/{id}/reject
            // Reject a pending verification request
            Route::post(
                '/{id}/reject',
                [VerificationController::class, 'reject']
            );

            // GET /api/v1/admin/verifications/{id}/id-card
            // Securely retrieve the uploaded university ID card
            Route::get(
                '/{id}/id-card',
                [VerificationController::class, 'idCard']
            );
        });

    // ========================================================================
    // RESEARCH AREAS
    // ========================================================================

    // GET /api/v1/research-areas
    // Retrieve all available research areas
    Route::get(
        '/research-areas',
        [ResearchAreaController::class, 'index']
    );

    // POST /api/v1/research-areas
    // Save the authenticated user's selected research areas
    Route::middleware('auth:sanctum')->post(
        '/research-areas',
        [ResearchAreaController::class, 'store']
    );

    // ========================================================================
    // ROLE VERIFICATION
    // ========================================================================

    // Protected role verification routes
    Route::middleware('auth:sanctum')->group(function () {

        // POST /api/v1/role-verification
        // Submit a role verification request
        Route::post(
            '/role-verification',
            [RoleVerificationController::class, 'store']
        );

        // GET /api/v1/role-verification
        // Retrieve the authenticated user's verification status
        Route::get(
            '/role-verification',
            [RoleVerificationController::class, 'show']
        );
    });

    // ========================================================================
    // RESEARCH PAPERS
    // ========================================================================

    Route::prefix('papers')->group(function () {

        // ------------------------------------------------------------
        // GET ALL PAPERS
        // GET /api/v1/papers
        // ------------------------------------------------------------
        Route::get(
            '/',
            [ResearchPaperController::class, 'index']
        );

        // ------------------------------------------------------------
        // GET SINGLE PAPER
        // GET /api/v1/papers/{id}
        // ------------------------------------------------------------
        Route::get(
            '/{id}',
            [ResearchPaperController::class, 'show']
        );

        // ------------------------------------------------------------
        // PROTECTED PAPER ROUTES
        // ------------------------------------------------------------

        Route::middleware('auth:sanctum')->group(function () {

            // Create paper
            // POST /api/v1/papers
            Route::post(
                '/',
                [ResearchPaperController::class, 'store']
            );

            // Update paper
            // PUT /api/v1/papers/{id}
            Route::put(
                '/{id}',
                [ResearchPaperController::class, 'update']
            );

            // Delete paper
            // DELETE /api/v1/papers/{id}
            Route::delete(
                '/{id}',
                [ResearchPaperController::class, 'destroy']
            );
        });
    });

    // ========================================================================
    // DASHBOARD ROUTES (ADD THESE)
    // ========================================================================

    // All dashboard routes require authentication
    Route::middleware('auth:sanctum')->prefix('dashboard')->group(function () {

        // ------------------------------------------------------------
        // STATISTICS
        // GET /api/v1/dashboard/stats
        // ------------------------------------------------------------
        Route::get('/stats', [DashboardController::class, 'stats']);

        // ------------------------------------------------------------
        // RECENT ACTIVITY
        // GET /api/v1/dashboard/recent-activity
        // ------------------------------------------------------------
        Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);

        // ------------------------------------------------------------
        // PROJECTS
        // ------------------------------------------------------------
        Route::get('/projects', [ProjectController::class, 'index']);
        Route::get('/projects/{id}', [ProjectController::class, 'show']);
        Route::post('/projects', [ProjectController::class, 'store']);

        // ------------------------------------------------------------
        // PAPERS
        // ------------------------------------------------------------
        Route::get('/papers', [PaperController::class, 'index']);
        Route::get('/papers/stats', [PaperController::class, 'stats']);

        // ------------------------------------------------------------
        // RESEARCHERS
        // ------------------------------------------------------------
        Route::get('/researchers', [ResearcherController::class, 'index']);
        Route::get('/researchers/{id}', [ResearcherController::class, 'show']);
        Route::get('/researchers/search', [ResearcherController::class, 'search']);

        // ------------------------------------------------------------
        // NOTIFICATIONS
        // ------------------------------------------------------------
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/count', [NotificationController::class, 'count']);
        Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    });

    // ========================================================================
    // VERSIONED USER PROFILE
    // ========================================================================

    // GET /api/v1/user
    Route::middleware('auth:sanctum')->get(
        '/user',
        function (Request $request) {
            $user = $request->user()->load([
                'role',
                'researchAreas',
                'department',
                'projectsAsMember',
                'supervisedProjects',
            ]);

            return response()->json([
                'success' => true,
                'data' => $user,
            ]);
        }
    );
});
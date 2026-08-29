<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Get all projects for the authenticated user
     * GET /api/v1/dashboard/projects
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Get projects where user is a member OR supervisor
        $projects = Project::where(function ($query) use ($user) {
            $query->whereHas('members', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->orWhere('supervisor_id', $user->id);
        })->with([
            'supervisor',
            'members.user',
            'researchArea',
            'tasks'
        ]);

        // Apply filters
        if ($request->has('status')) {
            $projects->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $projects->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Order by latest
        $projects = $projects->latest()->paginate(10);

        // Transform data
        $projects->getCollection()->transform(function ($project) {
            return [
                'id' => $project->id,
                'title' => $project->title,
                'description' => $project->description,
                'status' => $project->status,
                'status_color' => $project->status_color ?? 'blue',
                'progress' => $project->progress_pct,
                'supervisor' => $project->supervisor ? [
                    'id' => $project->supervisor->id,
                    'name' => $project->supervisor->full_name,
                    'email' => $project->supervisor->email,
                ] : null,
                'members_count' => $project->members->count(),
                'tasks_count' => $project->tasks->count(),
                'completed_tasks' => $project->tasks->where('status', 'completed')->count(),
                'start_date' => $project->start_date->toDateString(),
                'deadline' => $project->deadline ? $project->deadline->toDateString() : null,
                'created_at' => $project->created_at->toISOString(),
                'updated_at' => $project->updated_at->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully',
            'data' => $projects,
        ]);
    }

    /**
     * Get a single project
     * GET /api/v1/dashboard/projects/{id}
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $project = Project::with([
            'supervisor',
            'members.user',
            'researchArea',
            'tasks',
            'files',
            'comments.user'
        ])->findOrFail($id);

        // Check if user has access to this project
        $isMember = $project->members()->where('user_id', $user->id)->exists();
        $isSupervisor = $project->supervisor_id === $user->id;

        if (!$isMember && !$isSupervisor) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have access to this project',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $project,
        ]);
    }

    /**
     * Create a new project
     * POST /api/v1/dashboard/projects
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'research_area_id' => 'required|exists:research_areas,id',
            'start_date' => 'required|date',
            'deadline' => 'nullable|date|after:start_date',
            'is_public' => 'boolean',
        ]);

        $project = Project::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'research_area_id' => $validated['research_area_id'],
            'created_by' => $request->user()->id,
            'start_date' => $validated['start_date'],
            'deadline' => $validated['deadline'] ?? null,
            'is_public' => $validated['is_public'] ?? false,
            'status' => 'planning',
            'progress_pct' => 0,
        ]);

        // Add creator as a member
        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $request->user()->id,
            'role' => 'admin',
            'joined_at' => now(),
            'is_active' => true,
        ]);

        // Log activity
        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'created',
            'entity_type' => 'project',
            'entity_id' => $project->id,
            'new_values' => ['title' => $project->title],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project->load(['supervisor', 'members.user', 'researchArea']),
        ], 201);
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Task;
use App\Models\Notification;
use App\Models\ActivityLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // SEED ROLES
        // ============================================
        $roles = [
            ['name' => 'student', 'display_name' => 'Student', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'faculty', 'display_name' => 'Faculty Member', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'dept_admin', 'display_name' => 'Department Admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'sys_admin', 'display_name' => 'System Administrator', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('roles')->insert($roles);

        // ============================================
        // SEED DEPARTMENTS
        // ============================================
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CS', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software Engineering', 'code' => 'SE', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Data Science', 'code' => 'DS', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Information Technology', 'code' => 'IT', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('departments')->insert($departments);

        // ============================================
        // SEED CATEGORIES
        // ============================================
        $categories = [
            ['name' => 'Journal Article', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Conference Paper', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Thesis', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Dissertation', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Technical Report', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Working Paper', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('categories')->insert($categories);

        // ============================================
        // SEED RESEARCH AREAS
        // ============================================
        $researchAreas = [
            ['name' => 'Artificial Intelligence', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Machine Learning', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Data Mining', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Computer Vision', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Natural Language Processing', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software Architecture', 'department_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('research_areas')->insert($researchAreas);

        // ============================================
        // SEED KEYWORDS
        // ============================================
        $keywords = [
            ['name' => 'Deep Learning', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Neural Networks', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'NLP', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Computer Vision', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Big Data', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Transformers', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('keywords')->insert($keywords);

        // ============================================
        // CREATE TEST USERS
        // ============================================

        // Admin User
        $admin = User::create([
            'role_id' => 4,
            'department_id' => 1,
            'full_name' => 'System Admin',
            'email' => 'admin@scholaros.com',
            'password_hash' => Hash::make('password'),
            'institution' => 'University of Technology',
            'bio' => 'System Administrator for ScholarOS',
            'research_interests' => 'System Administration, Database Management',
            'skills' => 'Laravel, MySQL, PHP',
            'email_verified_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Faculty User
        $faculty = User::create([
            'role_id' => 2,
            'department_id' => 1,
            'full_name' => 'Dr. John Smith',
            'email' => 'faculty@scholaros.com',
            'password_hash' => Hash::make('password'),
            'institution' => 'University of Technology',
            'bio' => 'Professor of Computer Science. Research focuses on AI and Machine Learning.',
            'research_interests' => 'Artificial Intelligence, Machine Learning, Deep Learning',
            'skills' => 'Python, TensorFlow, PyTorch, Research Methodology',
            'email_verified_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Student User
        $student = User::create([
            'role_id' => 1,
            'department_id' => 1,
            'full_name' => 'Jane Doe',
            'email' => 'student@scholaros.com',
            'password_hash' => Hash::make('password'),
            'institution' => 'University of Technology',
            'bio' => 'PhD Student in Computer Science. Passionate about NLP.',
            'research_interests' => 'Natural Language Processing, Transformer Models, BERT',
            'skills' => 'Python, PyTorch, Java, React',
            'email_verified_at' => now(),
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ============================================
        // CREATE PROJECTS
        // ============================================

        $projects = [
            [
                'title' => 'AI in Healthcare Research',
                'description' => 'Research on AI applications in healthcare, focusing on diagnostic tools and patient care optimization.',
                'supervisor_id' => $faculty->id,
                'created_by' => $faculty->id,
                'research_area_id' => 1,
                'start_date' => now()->subMonths(2),
                'deadline' => now()->addMonths(2),
                'status' => 'in_progress',
                'progress_pct' => 65,
                'is_public' => true,
                'created_at' => now()->subMonths(2),
                'updated_at' => now(),
            ],
            [
                'title' => 'NLP for Social Media Analysis',
                'description' => 'Analyzing sentiment and trends in social media using advanced NLP techniques and transformer models.',
                'supervisor_id' => $faculty->id,
                'created_by' => $faculty->id,
                'research_area_id' => 5,
                'start_date' => now()->subMonths(1),
                'deadline' => now()->addMonths(3),
                'status' => 'planning',
                'progress_pct' => 10,
                'is_public' => true,
                'created_at' => now()->subMonths(1),
                'updated_at' => now(),
            ],
            [
                'title' => 'Blockchain for Supply Chain Management',
                'description' => 'Implementing blockchain technology to enhance traceability and transparency in supply chain management.',
                'supervisor_id' => $faculty->id,
                'created_by' => $student->id,
                'research_area_id' => 6,
                'start_date' => now()->subMonths(4),
                'deadline' => now()->addMonths(1),
                'status' => 'in_progress',
                'progress_pct' => 80,
                'is_public' => true,
                'created_at' => now()->subMonths(4),
                'updated_at' => now(),
            ],
            [
                'title' => 'Data Mining in E-Commerce',
                'description' => 'Analyzing customer behavior and improving recommendation systems using advanced data mining techniques.',
                'supervisor_id' => $faculty->id,
                'created_by' => $student->id,
                'research_area_id' => 3,
                'start_date' => now()->subMonths(6),
                'deadline' => now()->subDays(10),
                'status' => 'completed',
                'progress_pct' => 100,
                'is_public' => true,
                'completed_at' => now()->subDays(10),
                'created_at' => now()->subMonths(6),
                'updated_at' => now()->subDays(10),
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create($projectData);

            // Add supervisor as member
            ProjectMember::create([
                'project_id' => $project->id,
                'user_id' => $faculty->id,
                'role' => 'supervisor',
                'joined_at' => now(),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add student as member
            ProjectMember::create([
                'project_id' => $project->id,
                'user_id' => $student->id,
                'role' => 'member',
                'joined_at' => now(),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // ============================================
        // CREATE TASKS
        // ============================================

        $projectIds = Project::pluck('id')->toArray();

        $tasks = [
            // Project 1 Tasks
            [
                'project_id' => $projectIds[0],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'Literature Review',
                'description' => 'Review existing literature on AI in healthcare, focusing on recent advances and challenges.',
                'priority' => 'high',
                'status' => 'completed',
                'deadline' => now()->subDays(20),
                'completed_at' => now()->subDays(15),
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subDays(15),
            ],
            [
                'project_id' => $projectIds[0],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'Data Collection',
                'description' => 'Collect and preprocess healthcare datasets for AI model training and validation.',
                'priority' => 'medium',
                'status' => 'in_progress',
                'deadline' => now()->addDays(10),
                'created_at' => now()->subMonths(1),
                'updated_at' => now(),
            ],
            [
                'project_id' => $projectIds[0],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'Model Training',
                'description' => 'Train and evaluate AI models on preprocessed healthcare data.',
                'priority' => 'high',
                'status' => 'pending',
                'deadline' => now()->addDays(30),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            // Project 2 Tasks
            [
                'project_id' => $projectIds[1],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'NLP Literature Review',
                'description' => 'Review NLP techniques for social media sentiment analysis.',
                'priority' => 'medium',
                'status' => 'pending',
                'deadline' => now()->addDays(15),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'project_id' => $projectIds[1],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'Data Collection',
                'description' => 'Collect social media datasets for analysis.',
                'priority' => 'medium',
                'status' => 'pending',
                'deadline' => now()->addDays(20),
                'created_at' => now()->subDays(1),
                'updated_at' => now(),
            ],
            // Project 3 Tasks
            [
                'project_id' => $projectIds[2],
                'assigned_to' => $student->id,
                'created_by' => $faculty->id,
                'name' => 'Final Report',
                'description' => 'Write final project report and prepare presentation.',
                'priority' => 'high',
                'status' => 'pending',
                'deadline' => now()->addDays(5),
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create($taskData);
        }

        // ============================================
        // CREATE NOTIFICATIONS
        // ============================================

        $notificationTypes = ['project_invite', 'task_assigned', 'task_completed', 'paper_uploaded', 'comment_added', 'project_updated'];

        $notificationMessages = [
            'You have been invited to join the project: AI in Healthcare Research',
            'A new task has been assigned to you: Literature Review',
            'Your task has been completed: Data Collection',
            'A new paper has been uploaded to your project',
            'Someone commented on your project: AI in Healthcare Research',
            'Your project status has been updated',
        ];

        for ($i = 0; $i < 15; $i++) {
            $isRead = $i < 5 ? false : true; // First 5 are unread
            $index = array_rand($notificationTypes);

            Notification::create([
                'user_id' => $student->id,
                'sender_id' => $faculty->id,
                'type' => $notificationTypes[$index],
                'message' => $notificationMessages[array_rand($notificationMessages)],
                'data' => ['project_id' => $projectIds[array_rand($projectIds)]],
                'link' => '/dashboard/projects',
                'is_read' => $isRead,
                'read_at' => $isRead ? now()->subDays(rand(1, 5)) : null,
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
        }

        // ============================================
        // CREATE ACTIVITY LOGS
        // ============================================

        $actions = ['created', 'updated', 'viewed', 'uploaded', 'assigned', 'completed'];
        $entities = ['project', 'paper', 'task', 'file', 'comment'];

        $actionMessages = [
            'created' => 'created a new',
            'updated' => 'updated',
            'viewed' => 'viewed',
            'uploaded' => 'uploaded a',
            'assigned' => 'assigned a',
            'completed' => 'completed',
        ];

        for ($i = 0; $i < 25; $i++) {
            $action = $actions[array_rand($actions)];
            $entity = $entities[array_rand($entities)];

            ActivityLog::create([
                'user_id' => $student->id,
                'action' => $action,
                'entity_type' => $entity,
                'entity_id' => rand(1, 10),
                'old_values' => null,
                'new_values' => ['description' => $actionMessages[$action] . ' ' . $entity],
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Seeder/1.0',
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now(),
            ]);
        }

        // ============================================
        // UPDATE USERS WITH ADDITIONAL DATA
        // ============================================

        // Update student with more research interests
        $student->update([
            'research_interests' => 'Natural Language Processing, Machine Learning, Deep Learning, Transformer Models',
            'skills' => 'Python, PyTorch, TensorFlow, React, Laravel, Docker',
            'bio' => 'PhD student in Computer Science at the University of Technology. Researching NLP applications in healthcare. Passionate about AI and its impact on society.',
        ]);

        // Update faculty with more details
        $faculty->update([
            'research_interests' => 'Artificial Intelligence, Machine Learning, Deep Learning, Healthcare AI, NLP',
            'skills' => 'Python, R, MATLAB, Research Methodology, Grant Writing, Project Management',
            'bio' => 'Professor of Computer Science with 15 years of experience. Published over 50 papers in top-tier journals. Research focuses on AI applications in healthcare and NLP.',
        ]);

        $this->command->info('✅ Database seeded successfully!');
        $this->command->info('📊 Created projects, tasks, notifications, and activity logs.');
        $this->command->info('👤 Test users:');
        $this->command->info('   - admin@scholaros.com (System Admin)');
        $this->command->info('   - faculty@scholaros.com (Faculty)');
        $this->command->info('   - student@scholaros.com (Student)');
        $this->command->info('🔑 All passwords: password');
        $this->command->info('📚 4 projects, 6 tasks, 15 notifications, 25 activity logs created.');
    }
}
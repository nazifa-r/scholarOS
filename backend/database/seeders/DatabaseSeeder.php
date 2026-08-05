<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Roles
        $roles = [
            ['name' => 'student', 'display_name' => 'Student', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'faculty', 'display_name' => 'Faculty Member', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'dept_admin', 'display_name' => 'Department Admin', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'sys_admin', 'display_name' => 'System Administrator', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('roles')->insert($roles);

        // Seed Departments
        $departments = [
            ['name' => 'Computer Science', 'code' => 'CS', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software Engineering', 'code' => 'SE', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Data Science', 'code' => 'DS', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Information Technology', 'code' => 'IT', 'institution' => 'University of Technology', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('departments')->insert($departments);

        // Seed Categories
        $categories = [
            ['name' => 'Journal Article', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Conference Paper', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Thesis', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Dissertation', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Technical Report', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Working Paper', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('categories')->insert($categories);

        // Seed Research Areas
        $researchAreas = [
            ['name' => 'Artificial Intelligence', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Machine Learning', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Data Mining', 'department_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Computer Vision', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Natural Language Processing', 'department_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software Architecture', 'department_id' => 2, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('research_areas')->insert($researchAreas);

        // Seed Keywords
        $keywords = [
            ['name' => 'Deep Learning', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Neural Networks', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'NLP', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Computer Vision', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Big Data', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Transformers', 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('keywords')->insert($keywords);

        // Create admin user
        DB::table('users')->insert([
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

        // Create faculty user
        DB::table('users')->insert([
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

        // Create student user
        DB::table('users')->insert([
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
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ResearchPaperController extends Controller
{
    /**
     * Get all research papers (placeholder data)
     */
    public function index(Request $request)
    {
        $papers = $this->getPlaceholderPapers();

        // Apply filters to placeholder data
        if ($request->has('search')) {
            $search = strtolower($request->search);
            $papers = array_filter($papers, function ($paper) use ($search) {
                return strpos(strtolower($paper['title']), $search) !== false ||
                       strpos(strtolower($paper['abstract']), $search) !== false ||
                       strpos(strtolower($paper['authors']), $search) !== false;
            });
            $papers = array_values($papers);
        }

        if ($request->has('category')) {
            $category = $request->category;
            $papers = array_filter($papers, function ($paper) use ($category) {
                return $paper['category'] === $category;
            });
            $papers = array_values($papers);
        }

        return response()->json([
            'success' => true,
            'message' => 'Research papers retrieved successfully',
            'data' => $papers,
            'meta' => [
                'total' => count($papers),
                'per_page' => 10,
                'current_page' => 1,
                'last_page' => 1,
            ]
        ]);
    }

    /**
     * Get a single research paper (placeholder)
     */
    public function show($id)
    {
        $paper = $this->getPlaceholderPaper($id);

        return response()->json([
            'success' => true,
            'message' => 'Research paper retrieved successfully (placeholder)',
            'data' => $paper
        ]);
    }

    /**
     * Create a new research paper (placeholder)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'abstract' => 'required|string',
            'keywords' => 'nullable|string',
            'research_area' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'authors' => 'nullable|string|max:255',
            'google_scholar_url' => 'nullable|url|max:255',
            'publication_status' => 'nullable|string|in:draft,submitted,under_review,published',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Research paper created successfully (placeholder - database integration pending)',
            'data' => [
                'id' => rand(1000, 9999),
                'title' => $validated['title'],
                'abstract' => $validated['abstract'],
                'keywords' => $validated['keywords'] ?? null,
                'research_area' => $validated['research_area'] ?? null,
                'category' => $validated['category'] ?? null,
                'authors' => $validated['authors'] ?? null,
                'google_scholar_url' => $validated['google_scholar_url'] ?? null,
                'publication_status' => $validated['publication_status'] ?? 'draft',
                'status' => 'pending',
                'is_verified' => false,
                'views' => 0,
                'downloads' => 0,
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString(),
            ]
        ], 201);
    }

    /**
     * Update a research paper (placeholder)
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:300',
            'abstract' => 'sometimes|required|string',
            'keywords' => 'nullable|string',
            'research_area' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'authors' => 'nullable|string|max:255',
            'google_scholar_url' => 'nullable|url|max:255',
            'publication_status' => 'nullable|string|in:draft,submitted,under_review,published',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Research paper updated successfully (placeholder - database integration pending)',
            'data' => [
                'id' => (int) $id,
                'title' => $validated['title'] ?? 'Updated Research Paper',
                'abstract' => $validated['abstract'] ?? 'Updated abstract',
                'keywords' => $validated['keywords'] ?? null,
                'research_area' => $validated['research_area'] ?? null,
                'category' => $validated['category'] ?? null,
                'authors' => $validated['authors'] ?? null,
                'google_scholar_url' => $validated['google_scholar_url'] ?? null,
                'publication_status' => $validated['publication_status'] ?? 'draft',
                'updated_at' => now()->toISOString(),
            ]
        ]);
    }

    /**
     * Delete a research paper (placeholder)
     */
    public function destroy($id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Research paper deleted successfully (placeholder - database integration pending)',
            'data' => [
                'id' => (int) $id,
                'deleted_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Get a single placeholder paper
     */
    private function getPlaceholderPaper($id)
    {
        $papers = $this->getPlaceholderPapers();

        foreach ($papers as $paper) {
            if ($paper['id'] == $id) {
                return $paper;
            }
        }

        return [
            'id' => (int) $id,
            'title' => 'Sample Research Paper #' . $id,
            'abstract' => 'This is a placeholder abstract for the research paper. In the actual implementation, this will be populated from the database.',
            'keywords' => 'laravel, api, research, placeholder',
            'research_area' => 'Computer Science',
            'category' => 'Journal Article',
            'authors' => 'Dr. John Smith, Jane Doe',
            'google_scholar_url' => 'https://scholar.google.com/citations?user=sample123',
            'publication_status' => 'published',
            'status' => 'approved',
            'is_verified' => true,
            'views' => rand(10, 1000),
            'downloads' => rand(5, 500),
            'created_at' => now()->subDays(rand(1, 30))->toISOString(),
            'updated_at' => now()->toISOString(),
        ];
    }

    /**
     * Get placeholder papers list
     */
    private function getPlaceholderPapers()
    {
        return [
            [
                'id' => 1,
                'title' => 'Artificial Intelligence in Modern Healthcare',
                'abstract' => 'This paper explores the applications of artificial intelligence in healthcare systems, focusing on diagnostic tools and patient care optimization.',
                'keywords' => 'AI, Healthcare, Machine Learning, Diagnostics',
                'research_area' => 'Artificial Intelligence',
                'category' => 'Journal Article',
                'authors' => 'Dr. Sarah Johnson, Prof. Michael Chen',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=aihealth123',
                'publication_status' => 'published',
                'status' => 'approved',
                'is_verified' => true,
                'views' => 234,
                'downloads' => 89,
                'created_at' => now()->subDays(15)->toISOString(),
                'updated_at' => now()->subDays(10)->toISOString(),
            ],
            [
                'id' => 2,
                'title' => 'Machine Learning Approaches for Natural Language Processing',
                'abstract' => 'A comprehensive review of machine learning techniques applied to natural language processing tasks, including sentiment analysis and text classification.',
                'keywords' => 'NLP, Machine Learning, Deep Learning, Transformers',
                'research_area' => 'Natural Language Processing',
                'category' => 'Conference Paper',
                'authors' => 'Dr. Emily Brown, Dr. David Wilson',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=nlpml456',
                'publication_status' => 'published',
                'status' => 'approved',
                'is_verified' => true,
                'views' => 156,
                'downloads' => 67,
                'created_at' => now()->subDays(20)->toISOString(),
                'updated_at' => now()->subDays(18)->toISOString(),
            ],
            [
                'id' => 3,
                'title' => 'Data Mining Techniques for E-Commerce Analytics',
                'abstract' => 'This research investigates various data mining approaches for analyzing customer behavior and improving e-commerce recommendation systems.',
                'keywords' => 'Data Mining, E-Commerce, Analytics, Recommendations',
                'research_area' => 'Data Mining',
                'category' => 'Journal Article',
                'authors' => 'Prof. Robert Taylor, Dr. Lisa Park',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=datamine789',
                'publication_status' => 'under_review',
                'status' => 'pending',
                'is_verified' => false,
                'views' => 45,
                'downloads' => 12,
                'created_at' => now()->subDays(5)->toISOString(),
                'updated_at' => now()->subDays(3)->toISOString(),
            ],
            [
                'id' => 4,
                'title' => 'Cybersecurity Challenges in Internet of Things (IoT)',
                'abstract' => 'An analysis of security vulnerabilities in IoT devices and networks, with proposed solutions for enhancing cybersecurity in smart environments.',
                'keywords' => 'Cybersecurity, IoT, Security, Smart Devices',
                'research_area' => 'Cybersecurity',
                'category' => 'Conference Paper',
                'authors' => 'Dr. James Martinez, Dr. Anna Kim',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=iotsec321',
                'publication_status' => 'submitted',
                'status' => 'pending',
                'is_verified' => false,
                'views' => 78,
                'downloads' => 34,
                'created_at' => now()->subDays(8)->toISOString(),
                'updated_at' => now()->subDays(7)->toISOString(),
            ],
            [
                'id' => 5,
                'title' => 'Blockchain Technology for Supply Chain Management',
                'abstract' => 'This paper explores the application of blockchain technology in supply chain management, focusing on traceability, transparency, and efficiency improvements.',
                'keywords' => 'Blockchain, Supply Chain, Traceability, Transparency',
                'research_area' => 'Blockchain',
                'category' => 'Journal Article',
                'authors' => 'Prof. William Chen, Dr. Maria Garcia',
                'google_scholar_url' => 'https://scholar.google.com/citations?user=blockscm654',
                'publication_status' => 'published',
                'status' => 'approved',
                'is_verified' => true,
                'views' => 312,
                'downloads' => 145,
                'created_at' => now()->subDays(25)->toISOString(),
                'updated_at' => now()->subDays(22)->toISOString(),
            ],
        ];
    }
}
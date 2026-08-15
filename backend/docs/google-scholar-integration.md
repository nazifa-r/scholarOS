# Google Scholar Integration Documentation

## Overview
Research papers in ScholarOS support Google Scholar links for easy access to academic references.

## API Response Structure

When fetching research papers, the API returns the following fields:

```json
{
    "id": 1,
    "title": "Artificial Intelligence in Modern Healthcare",
    "authors": "Dr. Sarah Johnson, Prof. Michael Chen",
    "google_scholar_url": "https://scholar.google.com/citations?user=aihealth123",
    "doi": "10.1016/j.health.2024.01.001",
    "publication_status": "published",
    "status": "approved",
    "is_verified": true,
    "views": 234,
    "downloads": 89,
    "created_at": "2026-08-01T15:00:00.000000Z",
    "updated_at": "2026-08-10T15:00:00.000000Z"
}
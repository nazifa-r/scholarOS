<?php

namespace App\Services;

class GoogleScholarService
{
    /**
     * Base URL for Google Scholar
     */
    private const BASE_URL = 'https://scholar.google.com/scholar';

    /**
     * Generate a Google Scholar search URL from a paper title
     *
     * @param string $title
     * @return string
     */
    public function generateSearchUrl(string $title): string
    {
        // Clean and encode the title
        $encodedTitle = $this->encodeTitle($title);

        return self::BASE_URL . '?q=' . $encodedTitle;
    }

    /**
     * Encode a title for Google Scholar search
     * - URL encode spaces and special characters
     * - Remove excessive whitespace
     *
     * @param string $title
     * @return string
     */
    private function encodeTitle(string $title): string
    {
        // Trim whitespace
        $title = trim($title);

        // Replace multiple spaces with single space
        $title = preg_replace('/\s+/', ' ', $title);

        // URL encode
        return urlencode($title);
    }

    /**
     * Get the best available Google Scholar link for a paper
     *
     * @param string|null $exactUrl
     * @param string|null $title
     * @return array
     */
    public function getScholarLinks(?string $exactUrl, ?string $title): array
    {
        $result = [
            'google_scholar_url' => null,
            'google_scholar_search_url' => null,
        ];

        // If exact URL exists, use it
        if ($exactUrl) {
            $result['google_scholar_url'] = $exactUrl;
        }

        // Always generate a search URL if title exists
        if ($title) {
            $result['google_scholar_search_url'] = $this->generateSearchUrl($title);
        }

        return $result;
    }

    /**
     * Validate a Google Scholar URL
     *
     * @param string|null $url
     * @return bool
     */
    public function isValidScholarUrl(?string $url): bool
    {
        if (empty($url)) {
            return false;
        }

        // Must start with https://scholar.google.com/
        if (!preg_match('/^https?:\/\/scholar\.google\.com\/.*/', $url)) {
            return false;
        }

        // Must be a valid URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        return true;
    }
}
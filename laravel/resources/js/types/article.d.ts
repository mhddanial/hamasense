export interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    image: string;
    // readingTime: string;
    // views: number; // Kept internally for sorting only (popular)
    body?: string | string[]; // Added to match dynamic structure optional
}
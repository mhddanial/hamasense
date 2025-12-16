import { PageProps } from '@inertiajs/core';

type Id = {
    id: number;
}

type Timestamps = {
    created_at: string;
    updated_at: string;
}

export type ArticleInput = {
    title: string;
    slug?: string;
    content: string;
    category_id: number;
    writer_id: number;
    writer: Writer;
    category: Category;
    image?: string | File | null;
    tags?: string[] | null;
    summary?: string | null;
    published_at?: string | null;
    views_count?: number;
    estimated_read_time?: string | null;
    related_article_ids?: number[];
    related_articles?: Article[]; // Untuk melihat hubungan
}

export interface Article extends ArticleInput, Id, Timestamps {}

export type PlantInput = {
    name: string;
    scientific_name: string;
    detail: string;
    images: string[];
}

export interface Plant extends PlantInput, Id, Timestamps {}

export type DiseaseInput = {
    name: string;
    description: string;
    cause: string;
    solution: string;
    severity_level: string;
    plant_type_id: number;
    img_path: string;
}

export interface Disease extends DiseaseInput, Id, Timestamps {}

export type Category = {
    id: number;
    name: string;
}

export type Writer = {
    id: number;
    name: string;
    role: string;
}

export type PestInput = {
    name: string;
    scientific_name: string;
    description: string;
    img_path: string;
}

export interface Pest extends PestInput, Id, Timestamps {
    category: string;
    risk_level: string;
    image_path?: string;
    plant_types?: PlantType[];
}

export interface PlantType {
    id: number;
    name: string;
    scientific_name: string;
    detail: string;
}

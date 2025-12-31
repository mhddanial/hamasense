import { PageProps } from '@inertiajs/core';

type Id = {
    id: number;
}

export type Category = {
    id: number;
    name: string;
}

type Timestamps = {
    created_at: string;
    updated_at: string;
}

export type Writer = {
    id: number;
    name: string;
    role: string;
}

export interface PlantType {
    id: number;
    name: string;
    scientific_name: string;
    detail: string;
}

export type Reference = {
    source_name: string;
    url: string;
}

export type ArticleInput = {
    image?: string | File | null;
    title: string;
    category_id: number;
    category: Category;
    related_article_ids?: number[];
    related_articles?: Article[]; // Untuk melihat hubungan
    content: string;
    slug?: string;
    references?: Reference[];
}

export interface Article extends ArticleInput, Id, Timestamps { }

export type PlantInput = {
    name: string;
    slug: string;
    scientific_name: string;
    detail: string;
    disease: Disease[];
    pest: Pest[];
    img_path?: string;
    images?: string[];
}

export interface Plant extends PlantInput, Id, Timestamps { }

export type DiseaseInput = {
    label: string;
    name: string;
    slug: string;
    description?: string;
    severity_level: 'rendah' | 'sedang' | 'tinggi';
    plant_type_id: number;
    img_path?: string;
}

export interface Disease extends DiseaseInput, Id, Timestamps { }

export type PestInput = {
    name: string;
    slug?: string;
    scientific_name: string;
    description?: string;
    img_path?: string;
    category: string;
    risk_level: 'rendah' | 'sedang' | 'tinggi';
    plant?: string[];
    pencegahan?: string[];
    penanganan?: string[];
}

export interface Pest extends PestInput, Id, Timestamps {
    category: string;
    risk_level: string;
    image_path?: string;
    plant_type?: PlantType[];
}

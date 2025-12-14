import { PageProps } from '@inertiajs/core';

type Id = {
    id: number;
}

type Timestamps = {
    created_at: string;
    updated_at: string;
}

export type DiseaseInput = {
    name:string;
    description: string;
    cause: string;
    solution: string;
    severity_level: string;
    plant_type_id: number;
    img_path: string;
}

export type PlantInput = {
    name: string;
    scientific_name: string;
    detail: string;
    img_path: string;
}

export type Category = {
    id: number;
    name: string;
}

export type Writer = {
    id: number;
    name: string;
    role: string;
}

export type ArticleInput = {
  title: string;
  content: string;
  category_id: number;
  writer_id: number;
  writer: Writer;
  category: Category;
  img_path: string;
}

export type PestInput = {
    name: string;
    scientific_name: string;
    description: string;
    img_path: string;
}

export interface Article extends ArticleInput, Id, Timestamps {

}

export interface Pest {
    id: number;
    name: string;
    scientific_name: string;
    description: string;
    category: string;
    risk_level: string;
    image_path?: string;
    plant_types?: PlantType[];
    pics: string[];
    created_at?: string;
    updated_at?: string;
}

export interface PlantType {
    id: number;
    name: string;
    scientific_name: string;
    detail: string;
}

export interface Plant extends PlantInput, Id, Timestamps {

}

export interface Disease extends DiseaseInput, Id, Timestamps {
    
}
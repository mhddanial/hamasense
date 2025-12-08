import { PageProps } from '@inertiajs/core';

type Id = {
    id: number;
}

type Timestamps = {
    created_at: string;
    updated_at: string;
}

export type PlantInput = {
    name: string;
    scientific_name: string;
    detail: string;
    images: string[];
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
  image: string;
}

export type PestInput = {
    name: string;
    scientific_name: string;
    description: string;
    pics: string[];
}

export interface Article extends ArticleInput, Id, Timestamps {

}

export interface Pest extends PestInput, Id, Timestamps {

}

export interface Plant extends PlantInput, Id, Timestamps {

}
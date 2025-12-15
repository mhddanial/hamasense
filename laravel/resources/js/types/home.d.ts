export type NavItem = { name: string; link: string };

export type DetectionExample = {
    id: number;
    plantName: string;
    disease: string;
    severity: 'Rendah' | 'Sedang' | 'Tinggi';
    confidence: number;   // 0..100
    description: string;
    symptoms: string[];
    treatment: string[];
    prevention: string[];
    image: string;
};

export type Faq = { q: string; a: string };

export type HomePageProps = {
    navItems: NavItem[];
    features: string[];
    detectionExamples: DetectionExample[];
    faqs: Faq[];
};

export type AboutPageProps = {
    navItems: NavItem[];
    hero: { title: string; subtitle: string };
    sections: { title: string; body: string }[];
};

export type Article = {
    id: number;
    title: string;
    excerpt: string;
    cover?: string | null;
    published_at: string; // ISO
    slug: string;
};
export type ArticlesPageProps = {
    navItems: NavItem[];
    articles: {
        data: Article[];
        current_page: number;
        last_page: number;
    };
};
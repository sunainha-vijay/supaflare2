export declare interface Link {
    id?: string;
    user_id: string;
    url: string;
    slug: string;
    meta?: {
        android_url?: string;
        ios_url?: string;
    };
    updated_at?: string;
    inserted_at?: string;
    start_date?: string | null; // Adjust type to string or null
    end_date?: string | null; // Adjust type to string or null
}

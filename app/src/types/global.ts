// src/types/global.d.ts or wherever your types are defined
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
    start_date?: string; // New property for start date
    end_date?: string; // New property for end date
}

import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/data/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;
    const now = new Date();

    return [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/home`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/events`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/members`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];
}


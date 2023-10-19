'use client'

import { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";

export default function Categories({ provider_token }: { provider_token: string }) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams();
    params.append('country', 'US');
    params.append('offset', '0');
    params.append('limit', '50');

    const fetchCategories = async (url: string) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (response.status === 401) {
            router.push('/login');
            return [];
        }
        const { categories: data } = await response.json();
        return data;
    };

    const getCategories = async () => {
        setLoading(true);
        let nextPage = `https://api.spotify.com/v1/browse/categories?${params.toString()}`;

        const allCategories: Category[] = [];

        while (nextPage) {
            const data = await fetchCategories(nextPage);
            allCategories.push(...data.items);

            if (data.next) {
                nextPage = data.next;
            } else {
                nextPage = '';
            }
        }

        setCategories(allCategories);
        setLoading(false)
    };

    return (
        <>
            <Button onClick={getCategories} disabled={loading}>
                Get Categories
            </Button>
            <Typography typeof={'p'}>{}</Typography>
            {loading ? (
                <Typography typeof={'p'}>Loading...</Typography>
            ) : (
                categories?.map((category, index) => (
                    <div key={index}>
                        <Typography typeof={'p'}>{category.name}</Typography>
                    </div>
                ))
            )}
        </>
    );
}

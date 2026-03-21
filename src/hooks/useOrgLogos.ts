import { useState, useEffect } from "react";

export interface OrgLogo {
    publicId: string;
    url: string;
    width: number;
    height: number;
}

export function useOrgLogos(ids: string[]) {
    const [logos, setLogos] = useState<Record<string, OrgLogo>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogos = async () => {
            const validIds = Array.from(new Set(ids.filter(Boolean)));
            if (validIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/org-logos?ids=${encodeURIComponent(validIds.join(","))}`);
                if (!res.ok) throw new Error("Failed to fetch org logos");
                const data = await res.json();
                
                const logoMap: Record<string, OrgLogo> = {};
                for (const logo of data.logos) {
                    logoMap[logo.publicId] = logo;
                }
                setLogos(prev => ({ ...prev, ...logoMap }));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(ids)]);

    return { logos, loading };
}

'use client';

import { useEffect, useState } from "react";
import OpportunityHero from "@/app/components/OpportunityHero";
import FeaturedCard from "@/app/components/FeaturedCard";
import InfoCard from "@/app/components/InfoCard";

export default function CerebrumPage() {
    const [visibleCards, setVisibleCards] = useState<number[]>([]);

    useEffect(() => {
        // Stagger card animations
        const timers = [
            setTimeout(() => setVisibleCards([0]), 100),
            setTimeout(() => setVisibleCards([0, 1]), 300),
            setTimeout(() => setVisibleCards([0, 1, 2]), 500),
            setTimeout(() => setVisibleCards([0, 1, 2, 3]), 700),
            setTimeout(() => setVisibleCards([0, 1, 2, 3, 4]), 900),
        ];
        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    return (
        <div className="min-h-screen" style={{ background: 'radial-gradient(circle at top center, #f5f5f5 0%, #ffffff 50%, #fafafa 100%)' }}>
            {/* Hero Section */}
            <OpportunityHero
                title="Cerebrum"
                description="Explore comprehensive materials, insights, and resources to make your impact on the future of technology."
            />

            {/* Featured Card - Live Website */}
            <FeaturedCard
                href="/Level-up-team-collaboration-October.pdf"
                image="/hyspacdataaaaa.png"
                title="Information Memorandum"
                description="Full project details for strategic review."
                isVisible={visibleCards.includes(0)}
                isLive={false}
                badge="Form Review"
                linkText="View Details"
            />

               {/* Featured Card - Live Website */}
            <FeaturedCard
                href="/investors-loadlink_INVESTOR-SUMMARY.pdf"
                image="/hyspacdata .png"
                title="Master Plan"
                description="Full project details for strategic review."
                isVisible={visibleCards.includes(0)}
                isLive={false}
                badge="Form Review"
                linkText="Review Details"
            />
        </div>
    );
}

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
                title=" AJK Powertrains"
                description="Explore comprehensive materials, insights, and resources to make your impact on the future of logistics."
            />

            {/* Featured Card - Live Website */}
            <FeaturedCard
                href="https://investors.loadlink.com.au/wp-content/uploads/2025/10/AJK-Powertrains-Pitch.pdf"
                image="/Powertrain2.png"
                title="Information Memorandum"
                description="Full project details for strategic review."
                isVisible={visibleCards.includes(0)}
                isLive={false}
                badge="Form Review"
                linkText="Review Details"
            />

            {/* Featured Card - Live Website */}
            <FeaturedCard
                href="https://ajkpowertrains.com/"
                image="/hd_powertrain.png"
                title="AJK Powertrains"
                description="Learn more and register your interest in the future of Heavy Transport"
                isVisible={visibleCards.includes(0)}
                isLive={true}
                badge="Live site"
                linkText="View Site"
            />

            {/* Grid of Cards */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Card 1 - Information Memorandum */}
                    <InfoCard
                        href="https://ajkengines.com.au/"
                        image="/ajk-engines-logo.png"
                        title="AJK Engines Online Superstore"
                        description="Re-Power your truck with New, Remanufactured Engines and Parts."
                        isVisible={visibleCards.includes(1)}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        }
                    />

                    <InfoCard
                        href="https://investors.loadlink.com.au/booking-calendar"
                        image="/Google Meett.jpg"
                        title="Book an Online Meeting"
                        description="Schedule a direct conversation with our team."
                        isVisible={visibleCards.includes(4)}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
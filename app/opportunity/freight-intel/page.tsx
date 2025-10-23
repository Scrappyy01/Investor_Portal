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
        title="Freight Intelligence"
        description="Explore comprehensive materials, insights, and resources to make your impact on the future of technology."
      />

      {/* Featured Card - Live Website */}
         <FeaturedCard
           href="https://www.loadlink.com.au/"
           image="/live-website5.png"
           title="Loadlink"
           description="Discover the Future of Australian Haulage."
           isVisible={visibleCards.includes(0)}
           isLive={true}
           badge="Live Platform"
           linkText="View Now"
         />

      {/* Grid of Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 - Information Memorandum */}
          <InfoCard
            href="/Level-up-team-collaboration-October.pdf"
            image="/opportunity_.png"
            title="Information Memorandum"
            description="Full project details for strategic review."
            isVisible={visibleCards.includes(1)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          {/* Card 2 - Investor Summary */}
          <InfoCard
            href="/investors-loadlink_INVESTOR-SUMMARY.pdf"
            image="/Investor-hands.png"
            title="Investor Summary"
            description="Quick overview of key investor insights."
            isVisible={visibleCards.includes(2)}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />

          {/* Demo Video */}
          <div className={`md:col-span-2 transition-all duration-700 ${visibleCards.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative group bg-white rounded-2xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500">
              {/* Optional Title/Label Section */}
              <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-light text-white tracking-wide">Platform Demo</h3>
                </div>
              </div>
              
              {/* Video */}
              <video
                src="/Demo-Video_1080p.mp4"
                controls
                className="w-full aspect-video object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Card 3 - Book an Online Meeting */}
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
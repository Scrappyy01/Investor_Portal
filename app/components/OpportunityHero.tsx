'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OpportunityHeroProps {
  badge?: string;
  title: string;
  description: string;
}

export default function OpportunityHero({ badge = "Investment Opportunity", title, description }: OpportunityHeroProps) {
  const router = useRouter();
  const [showBadge, setShowBadge] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowBadge(true), 100),
      setTimeout(() => setShowTitle(true), 400),
      setTimeout(() => setShowDesc(true), 700),
    ];
    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
  <div className="pt-40 pb-16 px-6">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
  <div className="flex flex-col md:flex-row items-center justify-between w-full mb-4 gap-2 md:gap-0">
          <button
            onClick={() => router.back()}
            className={`hidden md:flex group items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${showBadge ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-light tracking-wide text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Back</span>
          </button>
          
          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 transition-all duration-700 ${showBadge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} mx-auto md:mx-0`}> 
            <span className="text-sm font-light tracking-widest uppercase" style={{ color: '#bb964c', letterSpacing: '0.15em' }}>
              {badge}
            </span>
          </div>
          
          <div className="hidden md:block w-[100px]"></div> {/* Spacer for symmetry */}
        </div>
        
        <h1 
          className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-widest uppercase mb-6 transition-all duration-700 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ 
            color: '#bb964c',
            letterSpacing: '0.18em',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300
          }}
        >
          {title}
        </h1>
        <p className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed transition-all duration-700 ${showDesc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

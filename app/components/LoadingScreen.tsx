'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in the logo
    const timer = setTimeout(() => setOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {/* Logo with fade-in animation */}
        <div
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity }}
        >
          <Image
            src="/kosseris_synergy_logo_gold.png"
            alt="Kosseris Synergy"
            width={200}
            height={200}
            className="mx-auto animate-pulse"
            priority
          />
        </div>
        
        {/* Optional: Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, #bb964c, transparent)',
                width: '50%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

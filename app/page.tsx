'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger each card to appear one at a time with a delay
    const timers = [
      setTimeout(() => setVisibleCards([0]), 200),
      setTimeout(() => setVisibleCards([0, 1]), 500),
      setTimeout(() => setVisibleCards([0, 1, 2]), 800),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    if (isTransitioning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30; // -15 to 15
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30; // -15 to 15
    setMousePosition({ x, y });
    setHoveredCard(cardIndex);
  };

  const handleMouseLeave = () => {
    if (isTransitioning) return;
    setMousePosition({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  const handleCardClick = (e: React.MouseEvent, cardIndex: number) => {
    e.preventDefault();
    setIsTransitioning(true);
    setClickedCard(cardIndex);
    
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/login');
    }, 1800);
  };

  return (
    <div className="bg-white">
      {/* Fixed Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[100] bg-black border-b shadow-sm transition-all duration-500 ${isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/top_logo.png"
              alt="Logo"
              width={270}
              height={105}
              className="h-16 sm:h-20 w-auto"
              priority
              quality={100}
              unoptimized
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center px-2">
            <div className="text-base sm:text-xl font-bold whitespace-nowrap" style={{ color: '#bb964c' }}>
              Investor Opportunities
            </div>
          </div>

          {/* Right: Welcome */}
          <div className="flex-shrink-0 text-right">
            <div className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: '#bb964c', fontWeight: 'bold' }}>
              Welcome, Anthony
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24 sm:h-[140px]"></div>

      {/* Banner Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 py-16 max-w-7xl mx-auto relative">
        {/* Opportunity 1 */}
        <div 
          className="block cursor-pointer"
          onClick={(e) => handleCardClick(e, 0)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 0 
                ? 'duration-[800ms] translate-x-[calc(100%+2.5rem)] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(0) 
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 -translate-y-20 duration-1000'
            } ${clickedCard === 0 ? 'animate-fade-scale' : ''}`}
            style={clickedCard === 0 ? {
              animation: 'moveToCenter 800ms ease-out forwards, fadeAndScale 1000ms 800ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              onMouseMove={(e) => handleMouseMove(e, 0)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="absolute top-0 left-0 right-0 bottom-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/Freight-Intel.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 0 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)` 
                    : 'translate(0px, 0px) scale(1)',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Opportunity 2 */}
        <div 
          className="block cursor-pointer"
          onClick={(e) => handleCardClick(e, 1)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 1 
                ? 'duration-[800ms] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(1) 
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 -translate-y-20 duration-1000'
            }`}
            style={clickedCard === 1 ? {
              animation: 'fadeAndScale 1000ms 800ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="absolute top-0 left-0 right-0 bottom-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/Cerebrum-Image.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 1 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)` 
                    : 'translate(0px, 0px) scale(1)',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Opportunity 3 */}
        <div 
          className="block cursor-pointer"
          onClick={(e) => handleCardClick(e, 2)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 2 
                ? 'duration-[800ms] -translate-x-[calc(100%+2.5rem)] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(2) 
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 -translate-y-20 duration-1000'
            }`}
            style={clickedCard === 2 ? {
              animation: 'moveToCenter 800ms ease-out forwards, fadeAndScale 1000ms 800ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className="absolute top-0 left-0 right-0 bottom-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/Powertrain.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 2 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)` 
                    : 'translate(0px, 0px) scale(1)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      {/* Copyright Footer */}
      <footer className={`w-full flex justify-end px-4 pb-4 pt-8 sm:pt-0 sm:pb-2 sm:fixed sm:bottom-2 sm:right-4 sm:w-auto z-[101] items-center gap-2 text-xs sm:text-sm transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ color: '#bb964c' }}>
        <span className="material-icons" style={{ fontSize: '1.1em', verticalAlign: 'middle' }}>&copy;</span>
        Kosseris Synergy © 2025
      </footer>
    </div>
  );
}

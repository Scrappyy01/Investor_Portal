'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollVisibleCards, setScrollVisibleCards] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check onboarding status and redirect if not complete
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch('/api/onboarding');
          const data = await response.json();
          
          if (!data.onboardingComplete) {
            router.push('/onboarding');
          } else {
            setIsCheckingOnboarding(false);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setIsCheckingOnboarding(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [status, session, router]);

  useEffect(() => {
    // Check if we're on mobile (viewport width < 768px)
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
      // Desktop: Trigger each card to appear one at a time with a delay
      const timers = [
        setTimeout(() => setVisibleCards([0]), 200),
        setTimeout(() => setVisibleCards([0, 1]), 500),
        setTimeout(() => setVisibleCards([0, 1, 2]), 800),
      ];
      return () => timers.forEach(timer => clearTimeout(timer));
    } else {
      // Mobile: Stagger the cards appearing with fade-in and slide-up
      const timers = [
        setTimeout(() => setScrollVisibleCards([0]), 300),
        setTimeout(() => setScrollVisibleCards([0, 1]), 600),
        setTimeout(() => setScrollVisibleCards([0, 1, 2]), 900),
      ];
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, []);

  // Intersection Observer for mobile scroll animations (now disabled)
  useEffect(() => {
    // Scroll observer disabled - cards now animate on page load
    return;
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

    // Determine route for each card
    let route = '/';
    if (cardIndex === 0) route = '/opportunity/freight-intel';
    else if (cardIndex === 1) route = '/opportunity/cerebrum';
    else if (cardIndex === 2) route = '/opportunity/powertrain';

    // Trigger header slide up animation
    document.dispatchEvent(new Event('page-transition-start'));

    // Navigate after animation completes
    setTimeout(() => {
      router.push(route);
      document.dispatchEvent(new Event('page-transition-end'));
    }, 1800);
  };

  // Show loading state while checking authentication
  if (status === "loading" || isCheckingOnboarding) {
    return <LoadingScreen />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #ffffff 100%)' }}>
      {/* Animated Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-tl from-amber-50 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      {/* Fixed Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-lg border-b border-gray-800/50 shadow-2xl ${isTransitioning ? 'animate-headerSlideUp' : ''}`}
        style={isTransitioning ? { animation: 'headerSlideUp 500ms ease-in forwards' } : {}}>
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 py-4 sm:py-6 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/top_logo.png"
              alt="Logo"
              width={270}
              height={105}
              className="h-20 w-auto"
              priority
              quality={100}
              unoptimized
            />
          </div>

          {/* Center: Title */}
          <div className="flex-1 text-center px-2">
            <div
              className="text-[1.6rem] md:text-3xl lg:text-4xl font-light tracking-widest uppercase whitespace-nowrap"
              style={{
                color: '#bb964c',
                fontFamily: 'var(--font-dm-sans)',
                letterSpacing: '0.18em',
                fontWeight: 300,
                textShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              Investor Opportunities
            </div>
          </div>

          {/* Right: Welcome */}
          <div className="flex-shrink-0 text-right flex items-center gap-3">
            <div
              className="text-xs md:text-sm font-light tracking-widest uppercase whitespace-nowrap"
              style={{
                color: '#bb964c',
                fontFamily: 'var(--font-dm-sans)',
                letterSpacing: '0.14em',
                fontWeight: 300
              }}
            >
              Welcome, {session.user?.name || 'Investor'}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm px-3 py-1.5 rounded-md border transition-colors"
              style={{ 
                color: '#bb964c', 
                borderColor: '#bb964c',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#bb964c';
                e.currentTarget.style.color = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#bb964c';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/top_logo.png"
                alt="Logo"
                width={120}
                height={46}
                className="h-10 w-auto"
                priority
                quality={100}
                unoptimized
              />
            </div>
            
            {/* Title */}
            <div className="flex-1 text-center px-2">
              <div
                className="text-base sm:text-lg font-light tracking-widest uppercase"
                style={{
                  color: '#bb964c',
                  fontFamily: 'var(--font-dm-sans)',
                  letterSpacing: '0.14em',
                  fontWeight: 300
                }}
              >
                Investor Opportunities
              </div>
            </div>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex-shrink-0 p-2 rounded-md transition-colors"
              style={{ color: '#bb964c' }}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div 
              className="border-t border-gray-800 bg-black px-4 py-4 space-y-4"
              style={{ 
                animation: 'slideDown 300ms ease-out'
              }}
            >

                {/* Navigation Links */}
              <div className="space-y-2 pb-3 border-b border-gray-800">
                {/* Freight Intelligence */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/freight-intel');
                    }}
                    className="flex-1 text-left text-sm px-4 py-2.5 rounded-md transition-colors"
                    style={{ 
                      color: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(187, 150, 76, 0.1)';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }, 150);
                    }}
                  >
                    Freight Intelligence
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/freight-intel');
                    }}
                    className="text-sm px-4 py-2.5 rounded-md border transition-colors"
                    style={{ 
                      color: '#bb964c', 
                      borderColor: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = '#bb964c';
                      e.currentTarget.style.color = '#000';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#bb964c';
                      }, 150);
                    }}
                  >
                    Visit
                  </button>
                </div>
                {/* Cerebrum */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/cerebrum');
                    }}
                    className="flex-1 text-left text-sm px-4 py-2.5 rounded-md transition-colors"
                    style={{ 
                      color: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(187, 150, 76, 0.1)';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }, 150);
                    }}
                  >
                    Cerebrum
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/cerebrum');
                    }}
                    className="text-sm px-4 py-2.5 rounded-md border transition-colors"
                    style={{ 
                      color: '#bb964c', 
                      borderColor: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = '#bb964c';
                      e.currentTarget.style.color = '#000';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#bb964c';
                      }, 150);
                    }}
                  >
                    Visit
                  </button>
                </div>
                {/* AJK Powertrains */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/powertrain');
                    }}
                    className="flex-1 text-left text-sm px-4 py-2.5 rounded-md transition-colors"
                    style={{ 
                      color: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(187, 150, 76, 0.1)';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }, 150);
                    }}
                  >
                    AJK Powertrains
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/opportunity/powertrain');
                    }}
                    className="text-sm px-4 py-2.5 rounded-md border transition-colors"
                    style={{ 
                      color: '#bb964c', 
                      borderColor: '#bb964c',
                      backgroundColor: 'transparent'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.backgroundColor = '#bb964c';
                      e.currentTarget.style.color = '#000';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#bb964c';
                      }, 150);
                    }}
                  >
                    Visit
                  </button>
                </div>
              </div>


              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span
                  className="text-xs font-light tracking-widest uppercase"
                  style={{
                    color: '#bb964c',
                    fontFamily: 'var(--font-dm-sans)',
                    letterSpacing: '0.14em',
                    fontWeight: 300
                  }}
                >
                  Logged in as:
                </span>
                <span
                  className="text-xs font-light tracking-widest uppercase"
                  style={{
                    color: '#bb964c',
                    fontFamily: 'var(--font-dm-sans)',
                    letterSpacing: '0.14em',
                    fontWeight: 300
                  }}
                >
                  {session.user?.name || 'Investor'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span
                  className="text-xs font-light tracking-widest uppercase"
                  style={{
                    color: '#bb964c',
                    fontFamily: 'var(--font-dm-sans)',
                    letterSpacing: '0.14em',
                    fontWeight: 300
                  }}
                >
                  Email:
                </span>
                <span
                  className="text-xs font-light tracking-widest uppercase"
                  style={{
                    color: '#bb964c',
                    fontFamily: 'var(--font-dm-sans)',
                    letterSpacing: '0.14em',
                    fontWeight: 300
                  }}
                >
                  {session.user?.email || ''}
                </span>
              </div>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/login' });
                }}
                className="w-full text-sm px-4 py-2.5 rounded-md border transition-colors"
                style={{ 
                  color: '#bb964c', 
                  borderColor: '#bb964c',
                  backgroundColor: 'transparent'
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.backgroundColor = '#bb964c';
                  e.currentTarget.style.color = '#000';
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#bb964c';
                  }, 150);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[64px] md:h-[140px]"></div>

      {/* Banner Grid */}
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6 py-16 md:py-24 max-w-7xl mx-auto relative">
        {/* Opportunity 1 */}
        <div 
          ref={(el) => { cardRefs.current[0] = el; }}
          className="block cursor-pointer transform-gpu"
          onClick={(e) => handleCardClick(e, 0)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 0 
                ? 'duration-[800ms] md:translate-x-[calc(100%+3rem)] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(0) || scrollVisibleCards.includes(0)
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 translate-y-20 duration-1000'
            } ${clickedCard === 0 ? 'md:animate-fade-scale' : ''}`}
            style={clickedCard === 0 ? {
              animation: window.innerWidth >= 768 
                ? 'moveToCenter 800ms ease-out forwards, fadeAndScale 1000ms 800ms ease-out forwards'
                : 'simpleFadeScale 1000ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-3xl overflow-hidden group transition-all duration-500"
              style={{
                boxShadow: hoveredCard === 0 
                  ? '0 30px 80px rgba(187, 150, 76, 0.3), 0 0 60px rgba(187, 150, 76, 0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.15)',
                transform: hoveredCard === 0 ? 'translateY(-8px)' : 'translateY(0)',
              }}
              onMouseMove={(e) => handleMouseMove(e, 0)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:from-black/60"></div>
              
              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>

              {/* Background Image */}
              <div
                className="absolute inset-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/freight_intel2.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 0 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.15)` 
                    : 'translate(0px, 0px) scale(1.05)',
                  filter: hoveredCard === 0 ? 'brightness(1.1)' : 'brightness(1)',
                }}
              ></div>

              {/* Card Label */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-amber-400 to-transparent transition-all duration-500 group-hover:w-20"></div>
                  <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-light">Opportunity</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-2 transition-all duration-500 group-hover:tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Freight Intelligence
                </h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Transforming logistics through data-driven insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity 2 */}
        <div 
          ref={(el) => { cardRefs.current[1] = el; }}
          className="block cursor-pointer transform-gpu"
          onClick={(e) => handleCardClick(e, 1)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 1 
                ? 'duration-[800ms] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(1) || scrollVisibleCards.includes(1)
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 translate-y-20 duration-1000'
            }`}
            style={clickedCard === 1 ? {
              animation: window.innerWidth >= 768
                ? 'fadeAndScale 1000ms 800ms ease-out forwards'
                : 'simpleFadeScale 1000ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-3xl overflow-hidden group transition-all duration-500"
              style={{
                boxShadow: hoveredCard === 1 
                  ? '0 30px 80px rgba(187, 150, 76, 0.3), 0 0 60px rgba(187, 150, 76, 0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.15)',
                transform: hoveredCard === 1 ? 'translateY(-8px)' : 'translateY(0)',
              }}
              onMouseMove={(e) => handleMouseMove(e, 1)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:from-black/60"></div>
              
              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>

              {/* Background Image */}
              <div
                className="absolute inset-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/Cerebrum-Image-notext.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 1 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.15)` 
                    : 'translate(0px, 0px) scale(1.05)',
                  filter: hoveredCard === 1 ? 'brightness(1.1)' : 'brightness(1)',
                }}
              ></div>

              {/* Card Label */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-amber-400 to-transparent transition-all duration-500 group-hover:w-20"></div>
                  <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-light">Opportunity</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-2 transition-all duration-500 group-hover:tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Cerebrum
                </h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Next-generation intelligence solutions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity 3 */}
        <div 
          ref={(el) => { cardRefs.current[2] = el; }}
          className="block cursor-pointer transform-gpu"
          onClick={(e) => handleCardClick(e, 2)}
        >
          <div 
            className={`flex flex-col transition-all ${
              clickedCard === 2 
                ? 'duration-[800ms] md:-translate-x-[calc(100%+3rem)] scale-110 z-50' 
                : clickedCard !== null 
                ? 'duration-400 opacity-0 scale-75' 
                : visibleCards.includes(2) || scrollVisibleCards.includes(2)
                ? 'opacity-100 translate-y-0 duration-1000' 
                : 'opacity-0 translate-y-20 duration-1000'
            }`}
            style={clickedCard === 2 ? {
              animation: window.innerWidth >= 768
                ? 'moveToCenter 800ms ease-out forwards, fadeAndScale 1000ms 800ms ease-out forwards'
                : 'simpleFadeScale 1000ms ease-out forwards'
            } : {}}
          >
            <div 
              className="relative h-[600px] w-full rounded-3xl overflow-hidden group transition-all duration-500"
              style={{
                boxShadow: hoveredCard === 2 
                  ? '0 30px 80px rgba(187, 150, 76, 0.3), 0 0 60px rgba(187, 150, 76, 0.1)' 
                  : '0 10px 40px rgba(0,0,0,0.15)',
                transform: hoveredCard === 2 ? 'translateY(-8px)' : 'translateY(0)',
              }}
              onMouseMove={(e) => handleMouseMove(e, 2)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity duration-500 group-hover:from-black/60"></div>
              
              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>

              {/* Background Image */}
              <div
                className="absolute inset-0 h-full w-full transition-all duration-700 ease-out"
                style={{
                  backgroundImage: 'url("/Powertrain3.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  transform: hoveredCard === 2 
                    ? `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.15)` 
                    : 'translate(0px, 0px) scale(1.05)',
                  filter: hoveredCard === 2 ? 'brightness(1.1)' : 'brightness(1)',
                }}
              ></div>

              {/* Card Label */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-30 transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-[2px] bg-gradient-to-r from-amber-400 to-transparent transition-all duration-500 group-hover:w-20"></div>
                  <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-light">Opportunity</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-2 transition-all duration-500 group-hover:tracking-wider" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  AJK Powertrains
                </h3>
                <p className="text-gray-300 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  Pioneering the future of heavy transport
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

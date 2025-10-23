"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AnimatedHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen for page transition events ONLY
  useEffect(() => {
    const handleTransitionStart = () => setIsVisible(false);
    const handleTransitionEnd = () => setIsVisible(true);

    document.addEventListener("page-transition-start", handleTransitionStart);
    document.addEventListener("page-transition-end", handleTransitionEnd);

    // On initial mount, fade in header
    setIsVisible(true);

    return () => {
      document.removeEventListener("page-transition-start", handleTransitionStart);
      document.removeEventListener("page-transition-end", handleTransitionEnd);
    };
  }, []);

  // Don't show header on login page
  if (pathname === "/login") {
    return null;
  }

  // Dynamic header title based on route
  let headerTitle = "Investor Opportunities";
  if (pathname.startsWith("/opportunity/freight-intel")) headerTitle = "Freight Intel Opportunity";
  else if (pathname.startsWith("/opportunity/cerebrum")) headerTitle = "Cerebrum Opportunity";
  else if (pathname.startsWith("/opportunity/powertrain")) headerTitle = "Powertrain Opportunity";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] bg-black border-b shadow-sm transition-all duration-500 ease-in-out
          ${isVisible ? "translate-y-0 opacity-100 pointer-events-auto visible" : "-translate-y-full opacity-0 pointer-events-none invisible"}`}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 py-4 sm:py-6 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" style={{cursor:'pointer'}} onClick={() => router.push("/") }>
            <img
              src="/top_logo.png"
              alt="Logo"
              width={270}
              height={105}
              className="h-20 w-auto"
            />
          </div>
          {/* Center: Title */}
          <div className="flex-1 text-center px-2">
            <div
              className="text-[1.6rem] md:text-3xl lg:text-4xl font-light tracking-widest uppercase whitespace-nowrap"
              style={{
                color: "#bb964c",
                fontFamily: "var(--font-dm-sans)",
                letterSpacing: "0.18em",
                fontWeight: 300,
                textShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              {headerTitle}
            </div>
          </div>
          {/* Right: Welcome */}
          <div className="flex-shrink-0 text-right flex items-center gap-3">
            {session && (
              <>
                <div
                  className="text-xs md:text-sm font-light tracking-widest uppercase whitespace-nowrap"
                  style={{
                    color: "#bb964c",
                    fontFamily: "var(--font-dm-sans)",
                    letterSpacing: "0.14em",
                    fontWeight: 300
                  }}
                >
                  Welcome, {session.user?.name || "Investor"}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm px-3 py-1.5 rounded-md border transition-colors cursor-pointer"
                  style={{
                    color: "#bb964c",
                    borderColor: "#bb964c",
                    backgroundColor: "transparent",
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#bb964c";
                    e.currentTarget.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bb964c";
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" style={{cursor:'pointer'}} onClick={() => router.push("/") }>
              <img
                src="/top_logo.png"
                alt="Logo"
                width={120}
                height={46}
                className="h-10 w-auto"
              />
            </div>
            {/* Title */}
            <div className="flex-1 text-center px-2">
              <div
                className="text-base sm:text-lg font-light tracking-widest uppercase"
                style={{
                  color: "#bb964c",
                  fontFamily: "var(--font-dm-sans)",
                  letterSpacing: "0.14em",
                  fontWeight: 300
                }}
              >
                {headerTitle}
              </div>
            </div>
            {/* Hamburger Menu Button */}
            {session && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex-shrink-0 p-2 rounded-md transition-colors cursor-pointer"
                style={{ color: "#bb964c", cursor: 'pointer' }}
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
            )}
          </div>
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && session && (
            <div
              className="border-t border-gray-800 bg-black px-4 py-4 space-y-4"
              style={{
                animation: "slideDown 300ms ease-out"
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
                <span className="text-sm" style={{ color: "#bb964c" }}>Logged in as:</span>
                <span
                  className="text-xs font-light tracking-widest uppercase"
                  style={{
                    color: "#bb964c",
                    fontFamily: "var(--font-dm-sans)",
                    letterSpacing: "0.14em",
                    fontWeight: 300
                  }}
                >
                  {session.user?.name || "Investor"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-sm" style={{ color: "#bb964c" }}>Email:</span>
                <span className="text-xs" style={{ color: "#bb964c" }}>
                  {session.user?.email || ""}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="w-full text-sm px-4 py-2.5 rounded-md border transition-colors cursor-pointer"
                style={{
                  color: "#bb964c",
                  borderColor: "#bb964c",
                  backgroundColor: "transparent",
                  cursor: 'pointer'
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.backgroundColor = "#bb964c";
                  e.currentTarget.style.color = "#000";
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bb964c";
                  }, 150);
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

import Link from "next/link";

interface FeaturedCardProps {
  href: string;
  image: string;
  badge?: string;
  title: string;
  description: string;
  linkText?: string;
  isLive?: boolean;
  isVisible?: boolean;
}

export default function FeaturedCard({ 
  href, 
  image, 
  badge = "Live Platform",
  title, 
  description, 
  linkText = "Visit Platform",
  isLive = true,
  isVisible = true
}: FeaturedCardProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-16">
      <Link 
        href={href}
        className={`block group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <div className="flex items-center gap-3 mb-4">
              {isLive && <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>}
              <span className="text-sm font-light tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>{badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 tracking-wide">{title}</h2>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl">
              {description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-light tracking-widest uppercase transition-all group-hover:gap-4" style={{ letterSpacing: '0.15em' }}>
              <span>{linkText}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

import Link from "next/link";

interface InfoCardProps {
  href: string;
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isVisible?: boolean;
  isLive?: boolean;
}

export default function InfoCard({ 
  href, 
  image, 
  icon, 
  title, 
  description, 
  isVisible = true,
  isLive = false
}: InfoCardProps) {
  return (
    <Link 
      href={href}
      className={`block group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 bg-white">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
          {isLive && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs font-light tracking-widest uppercase text-white" style={{ letterSpacing: '0.1em' }}>Live Platform</span>
            </div>
          )}
        </div>
        <div className="relative h-full flex flex-col justify-end p-8 text-white">
          <div className="mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 mb-2">
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-light mb-2 tracking-wide">{title}</h3>
          <p className="text-sm text-gray-200 font-light">{description}</p>
        </div>
      </div>
    </Link>
  );
}

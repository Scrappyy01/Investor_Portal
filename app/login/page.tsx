'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCardVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Background with blur */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 backdrop-blur-md bg-white/30"></div>
      </div>

      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className={`flex w-full max-w-4xl min-h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 transition-all duration-1000 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}> 
          
          {/* Image Column (Left) */}
          <div className="relative hidden md:block md:w-[62%]">
            <Image
              src="/kosseris-group-building-bg.jpg"
              alt="Kosseris Building"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-80"></div>
            <div className="relative z-10 flex items-center justify-center h-full px-6 text-white text-center">
              <Image
                src="/kosseris_synergy_logo_gold.png"
                alt="Kosseris Synergy Logo"
                width={224}
                height={224}
                className="mx-auto mb-4"
                priority
              />
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="w-full md:w-[38%] p-6 sm:p-8 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome!</h1>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Please log in with your Investor Email to continue.
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="investor-id" className="block text-base font-medium text-gray-700 mb-2">
                    Investor Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="investor-id"
                    name="investor-id"
                    type="email"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-gray-500">
                      Remember me
                    </label>
                  </div>

                  <div>
                    <a href="#" className="text-blue-600 hover:text-blue-500">
                      Forgotten your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-150 ease-in-out"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

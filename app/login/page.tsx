'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [cardVisible, setCardVisible] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCardVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('investor-id') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen" style={{ background: 'radial-gradient(circle at top right, #ffffff 0%, #f7f6f2 100%)' }}>
      {/* Slightly blurred background image */}


      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className={`flex w-full max-w-4xl min-h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 transition-all duration-1000 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'}`}> 
          
          {/* Image Column (Left) */}
          <div className="relative hidden md:block md:w-[62%]">
            <Image
              src="/White and Violet Professional Modern Technology Pitch Deck Presentation.png"
              alt="Kosseris Building"
              fill
              className="object-cover"
              priority
            />
            <div className=""></div>
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
          <div className="w-full md:w-[38%] flex flex-col bg-black-00">
            {/* Mobile logo header - full width black section */}
            <div className="block md:hidden bg-black text-white p-8 text-center">
              <Image
                src="/top_logo.png"
                alt="Kosseris Synergy Logo"
                width={200}
                height={80}
                className="mx-auto"
                priority
              />
            </div>

            {/* Form content */}
            <div className="w-full max-w-sm mx-auto p-6 sm:p-8 flex-1 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome!</h1>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Please log in with your Investor Email to continue.
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="investor-id" className="block text-base font-medium text-gray-700 mb-2">
                    Investor Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="investor-id"
                    name="investor-id"
                    type="email"
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-black"
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
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-black"
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

                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <span className="inline-block w-6 h-6 mr-2 align-middle">
                          <svg className="animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="#fff" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                        </span>
                        <span className="align-middle">Logging in...</span>
                      </span>
                    ) : (
                      'Login'
                    )}
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

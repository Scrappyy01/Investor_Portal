'use client';

import { useState, useRef, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// Step components
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-12">
      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  index + 1 < currentStep ? 'bg-amber-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Two Rows */}
      <div className="md:hidden space-y-4">
        {/* First row: Steps 1-3 */}
        <div className="flex items-center justify-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div
                  className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    index + 1 < currentStep ? 'bg-amber-400' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Second row: Steps 4-6 */}
        <div className="flex items-center justify-center">
          {Array.from({ length: 3 }).map((_, index) => {
            const stepNumber = index + 4;
            return (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all duration-300 ${
                    stepNumber <= currentStep
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all duration-300 ${
                      stepNumber < currentStep ? 'bg-amber-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: '',
    acn: '',
    
    // Step 2: Address
    street: '',
    state: '',
    postcode: '',
    
    // Step 3: Representative Details
    repName: '',
    email: session?.user?.email || '',
    
    // Step 4: Terms accepted
    termsAccepted: false,
    
    // Step 5: Signature
    signature: '',
  });

  const totalSteps = 6;

  // Check if onboarding is already complete
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/onboarding');
          const data = await response.json();
          
          if (data.onboardingComplete) {
            // Already completed, redirect to main page
            router.push('/');
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setIsLoading(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [session, router]);

  // Update form data
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Navigation
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Validation
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) {
          setError('Company name is required');
          return false;
        }
        if (!formData.acn.trim() || formData.acn.replace(/\s/g, '').length !== 9) {
          setError('ACN must be 9 digits');
          return false;
        }
        return true;
      case 2:
        if (!formData.street.trim()) {
          setError('Street address is required');
          return false;
        }
        if (!formData.state.trim()) {
          setError('State is required');
          return false;
        }
        if (!formData.postcode.trim() || !/^\d{4}$/.test(formData.postcode)) {
          setError('Valid postcode (4 digits) is required');
          return false;
        }
        return true;
      case 3:
        if (!formData.repName.trim()) {
          setError('Representative name is required');
          return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Valid email is required');
          return false;
        }
        return true;
      case 4:
        if (!formData.termsAccepted) {
          setError('You must accept the terms to continue');
          return false;
        }
        return true;
      case 5:
        if (!formData.signature.trim()) {
          setError('Signature is required');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit onboarding form');
      }

      // Redirect to main page
      router.push('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Format ACN with spaces
  const formatACN = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  // Show loading while checking status
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 pt-16 md:pt-28">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-8 text-center">
          <Image
            src="/top_logo.png"
            alt="Logo"
            width={200}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-light tracking-wide" style={{ fontFamily: 'var(--font-dm-sans)', color: '#bb964c' }}>
            Investor Onboarding
          </h1>
          <p className="text-gray-300 mt-2 font-light">Complete your confidentiality agreement</p>
        </div>

        {/* Step Indicator */}
        <div className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Company Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ACN (Australian Company Number) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.acn}
                  onChange={(e) => updateFormData('acn', formatACN(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="XXX XXX XXX"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-1">9 digits, formatted as XXX XXX XXX</p>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Company Address</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateFormData('street', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  >
                    <option value="">Select state</option>
                    <option value="QLD">Queensland</option>
                    <option value="NSW">New South Wales</option>
                    <option value="VIC">Victoria</option>
                    <option value="SA">South Australia</option>
                    <option value="WA">Western Australia</option>
                    <option value="TAS">Tasmania</option>
                    <option value="ACT">Australian Capital Territory</option>
                    <option value="NT">Northern Territory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postcode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) => updateFormData('postcode', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                    placeholder="XXXX"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Representative Details */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Representative Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.repName}
                  onChange={(e) => updateFormData('repName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter representative name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          )}

          {/* Step 4: Terms & Conditions */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Confidentiality Deed</h2>
              
              <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-6 bg-gray-50 text-sm text-gray-700 leading-relaxed">
                <h3 className="font-bold text-lg mb-4">CONFIDENTIALITY DEED</h3>
                <p className="mb-4">Between Load Link Australia Pty Limited and {formData.companyName || '[Your Company]'}</p>
                
                <h4 className="font-bold mt-6 mb-2">WHEREAS:</h4>
                <p className="mb-2">A. The Disclosing Party and the Recipient wish to pursue discussions concerning possible transactions between them and to that end it is necessary for the Disclosing Party to provide certain Confidential Information to the Recipient.</p>
                <p className="mb-2">B. The Confidential Information is of significant commercial value to the Disclosing Party.</p>
                <p className="mb-4">C. The Disclosing Party proposes to make the Confidential Information available to the Recipient for the Permitted Purpose subject to and in consideration of the Recipient entering into this Deed.</p>

                <h4 className="font-bold mt-6 mb-2">1. DEFINITIONS AND INTERPRETATIONS</h4>
                <p className="mb-2"><strong>1.1 Definitions</strong></p>
                <p className="mb-2">"Confidential Information" means all commercial, financial, legal and technical information and know-how directly or indirectly related to the business or affairs of the Disclosing Party which is disclosed by or on behalf of the Disclosing Party to the Recipient.</p>
                
                <h4 className="font-bold mt-6 mb-2">3. CONFIDENTIALITY</h4>
                <p className="mb-2">3.1 The Recipient undertakes to:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li>Keep all Confidential Information strictly confidential</li>
                  <li>Not disclose or permit disclosure of any Confidential Information except as permitted</li>
                  <li>Take all reasonable steps to maintain confidentiality</li>
                  <li>Not use the Confidential Information except for the Permitted Purpose</li>
                </ul>

                <p className="text-xs text-gray-500 mt-8 italic">
                  This is an abbreviated version. The full confidentiality deed will be generated upon completion.
                </p>
              </div>

              <div className="flex items-start mt-6">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                  className="mt-1 h-5 w-5 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="termsAccepted" className="ml-3 text-sm text-gray-700 cursor-pointer">
                  I have read and agree to the terms of the Confidentiality Deed <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 5: Digital Signature */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Digital Signature</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type your full name to sign <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.signature}
                  onChange={(e) => updateFormData('signature', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Type your full name"
                />
                
                {formData.signature && (
                  <div className="mt-6 p-6 border-2 border-gray-300 rounded-lg bg-white">
                    <p className="text-xs text-gray-500 mb-2">Signature Preview:</p>
                    <p className="text-4xl font-light italic text-gray-800" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                      {formData.signature}
                    </p>
                    <p className="text-xs text-gray-500 mt-4">Date: {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">Review Your Information</h2>
              
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Company Name</p>
                    <p className="font-medium text-gray-800">{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ACN</p>
                    <p className="font-medium text-gray-800">{formData.acn}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {formData.street}, {formData.state} {formData.postcode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Representative</p>
                    <p className="font-medium text-gray-800">{formData.repName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{formData.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Signature</p>
                    <p className="text-2xl font-light italic text-gray-800" style={{ fontFamily: 'Brush Script MT, cursive' }}>
                      {formData.signature}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">Ready to submit?</p>
                <p>By clicking "Complete Onboarding" you confirm that all information provided is accurate and you agree to the terms of the Confidentiality Deed.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            {currentStep > 1 && (
              <button
                onClick={goToPreviousStep}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                onClick={goToNextStep}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import Image from "next/image";
import ConfidentialityDeed from "../components/ConfidentialityDeed";

// Step components
const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="mb-12">
      {/* Desktop: Horizontal */}
      <div className="hidden md:flex items-center justify-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-light transition-all duration-300 ${
                index + 1 <= currentStep
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  index + 1 < currentStep ? "bg-amber-400" : "bg-gray-200"
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
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              {index < 2 && (
                <div
                  className={`w-12 h-1 mx-2 transition-all duration-300 ${
                    index + 1 < currentStep ? "bg-amber-400" : "bg-gray-200"
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
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {stepNumber}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all duration-300 ${
                      stepNumber < currentStep ? "bg-amber-400" : "bg-gray-200"
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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  const today = format(new Date(), "dd MMMM yyyy");

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: "",
    acn: "",

    // Step 2: Address
    street: "",
    state: "",
    postcode: "",

    // Step 3: Representative Details
    repName: "",
    email: session?.user?.email || "",

    // Step 4: Terms accepted
    termsAccepted: false,

    // Step 5: Signature
    signature: "",
  });

  const totalSteps = 5;

  // Check if onboarding is already complete
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/onboarding");
          const data = await response.json();

          if (data.onboardingComplete) {
            // Already completed, redirect to main page
            router.push("/");
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setIsLoading(false);
        }
      }
    };

    checkOnboardingStatus();
  }, [session, router]);

  // Update form data
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // Navigation
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Validation
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.companyName.trim()) {
          setError("Company name is required");
          return false;
        }
        if (
          !formData.acn.trim() ||
          formData.acn.replace(/\s/g, "").length !== 9
        ) {
          setError("ACN must be 9 digits");
          return false;
        }
        return true;
      case 2:
        if (!formData.street.trim()) {
          setError("Street address is required");
          return false;
        }
        if (!formData.state.trim()) {
          setError("State is required");
          return false;
        }
        if (!formData.postcode.trim() || !/^\d{4}$/.test(formData.postcode)) {
          setError("Valid postcode (4 digits) is required");
          return false;
        }
        return true;
      case 3:
        if (!formData.repName.trim()) {
          setError("Representative name is required");
          return false;
        }
        if (
          !formData.email.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          setError("Valid email is required");
          return false;
        }
        return true;
      case 4:
        if (!formData.termsAccepted) {
          setError("You must accept the terms to continue");
          return false;
        }
        if (!signatureSaved) {
          setError("You must save your signature to continue");
          return false;
        }
        return true;
      case 5:
        if (!formData.signature) {
          setError("Signature is required");
          return false;
        }
        return true;
    }
  };

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit onboarding form");
      }

      // Redirect to main page
      router.push("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Format ACN with spaces
  const formatACN = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
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
          <h1
            className="text-3xl font-light tracking-wide"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#bb964c" }}
          >
            Investor Onboarding
          </h1>
          <p className="text-gray-300 mt-2 font-light">
            Complete your confidentiality agreement
          </p>
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
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Company Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    updateFormData("companyName", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ACN (Australian Company Number){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.acn}
                  onChange={(e) =>
                    updateFormData("acn", formatACN(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="XXX XXX XXX"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-1">
                  9 digits, formatted as XXX XXX XXX
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Company Address
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => updateFormData("street", e.target.value)}
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
                    onChange={(e) => updateFormData("state", e.target.value)}
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
                    onChange={(e) =>
                      updateFormData(
                        "postcode",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
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
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Representative Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.repName}
                  onChange={(e) => updateFormData("repName", e.target.value)}
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
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-black"
                  placeholder="Enter email address"
                />
              </div>
            </div>
          )}

          {/* Step 4: Confidentiality Deed */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Confidentiality Deed
              </h2>

              <ConfidentialityDeed
                companyName={formData.companyName}
                acn={formData.acn}
                street={formData.street}
                state={formData.state}
                postcode={formData.postcode}
                repName={formData.repName}
                email={formData.email}
                today={today}
              />

              <div className={`flex items-start mt-6 p-4 rounded-lg transition-all ${
                error === "You must accept the terms to continue" 
                  ? "bg-red-50 border border-red-200" 
                  : "bg-gray-50 border border-gray-200"
              }`}>
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    updateFormData("termsAccepted", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                />
                <div className="ml-3">
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm text-gray-700 cursor-pointer block"
                  >
                    I have read and agree to the terms of the Confidentiality Deed{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {error === "You must accept the terms to continue" && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      ✓ Please tick this box to continue
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-10 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorised Signature <span className="text-red-500">*</span>
                </label>

                <div className="border border-gray-300 rounded-lg bg-white p-4 w-[520px]">
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="black"
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "w-full h-48",
                    }}
                    backgroundColor="#fff"
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2 italic">
                  Must be signed by a person duly authorised by the sender.
                </p>

                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => signatureRef.current?.clear()}
                    className="px-4 py-2 text-sm bg-gray-100 text-black border border-gray-300 rounded hover:bg-gray-200"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dataURL = signatureRef.current
                        ?.getTrimmedCanvas()
                        .toDataURL("image/png");
                      updateFormData("signature", dataURL || "");
                      setSignatureSaved(true);
                    }}
                    className="px-4 py-2 text-sm bg-amber-500 text-white rounded hover:bg-amber-600"
                  >
                    Save Signature
                  </button>
                </div>

                {formData.signature && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={formData.signature}
                      alt="Signature Preview"
                      className="border rounded"
                      style={{
                        width: "180px",
                        height: "60px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn text-center">
              <h2 className="text-2xl font-light text-gray-800 mb-4">
                Terms Accepted
              </h2>
              <p className="text-gray-700 text-sm mb-6">
                You have successfully accepted the Confidentiality Deed. You can
                now download a copy for your records.
              </p>

              <button
                onClick={async () => {
                  setIsPdfGenerating(true);
                  const payload = {
                    companyName: formData.companyName,
                    acn: formData.acn,
                    street: formData.street,
                    state: formData.state,
                    postcode: formData.postcode,
                    repName: formData.repName,
                    email: formData.email,
                    deedDate: new Date().toLocaleDateString("en-AU", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }),
                    signatureBase64: formData.signature,
                  };

                  const missing = [
                    "companyName",
                    "acn",
                    "street",
                    "state",
                    "postcode",
                    "repName",
                    "email",
                    "signatureBase64",
                  ].filter((key) => {
                    const value = payload[key as keyof typeof payload];
                    if (typeof value !== "string") return true;
                    if (key === "signatureBase64")
                      return !value.startsWith("data:image");
                    return value.trim() === "";
                  });

                  if (missing.length > 0) {
                    alert("Missing or invalid value. Please check the form.");
                    setIsPdfGenerating(false);
                    return;
                  }

                  try {
                    const res = await fetch("/api/onboarding/generate-pdf", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    if (!res.ok) throw new Error("PDF generation failed");

                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "confidentiality-deed.pdf";
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                    setPdfDownloaded(true);
                  } catch (err) {
                    alert("There was a problem generating the PDF.");
                    console.error(err);
                  } finally {
                    setIsPdfGenerating(false);
                  }
                }}
                disabled={isPdfGenerating}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPdfGenerating ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <span>Download Confidentiality Deed</span>
                )}
              </button>
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
              <div className="flex flex-col items-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !pdfDownloaded}
                  className={`px-8 py-3 rounded-lg transition-all shadow-lg ${
                    isSubmitting || !pdfDownloaded
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
                  }`}
                >
                  {isSubmitting ? "Redirecting..." : "Complete Onboarding"}
                </button>
                {!pdfDownloaded && (
                  <p className="text-sm text-gray-600 mt-2">
                    Please download deed before continuing
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

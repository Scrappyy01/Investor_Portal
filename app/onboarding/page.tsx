"use client";

import { useState, useRef, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignatureCanvas from "react-signature-canvas";
import { format } from "date-fns";
import Image from "next/image";

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
                  Company Name <span className="text-red-500">*</span>
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

          {/* Step 4: Terms & Conditions */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-light text-gray-800 mb-6">
                Confidentiality Deed
              </h2>

              <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-6 bg-gray-50 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                <h3 className="font-bold text-lg mb-4">CONFIDENTIALITY DEED</h3>
                <p className="mb-4">THIS DEED is made the day of {today}</p>
                <p className="mb-4">
                  BETWEEN: LOAD LINK AUSTRALIA PTY LIMITED (ACN 661 824 175) of
                  Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216
                  (“Disclosing Party”); and{" "}
                  {formData.companyName || "[Your Company]"} (ACN{" "}
                  {formData.acn || "___"}) of {formData.street || "___"},{" "}
                  {formData.state || "___"} {formData.postcode || "___"}{" "}
                  (“Recipient”).
                </p>

                <h4 className="font-bold mt-6 mb-2">WHEREAS:</h4>
                <p className="mb-2">
                  A. The Disclosing Party and the Recipient wish to pursue
                  discussions concerning possible transactions between them and
                  to that end it is necessary for the Disclosing Party to
                  provide certain Confidential Information to the Recipient.
                </p>
                <p className="mb-2">
                  B. The Confidential Information is of significant commercial
                  value to the Disclosing Party.
                </p>
                <p className="mb-4">
                  C. The Disclosing Party proposes to make the Confidential
                  Information available to the Recipient for the Permitted
                  Purpose subject to and in consideration of the Recipient
                  entering into this Deed.
                </p>

                <h4 className="font-bold mt-6 mb-2">
                  NOW THIS DEED WITNESSES as follows:
                </h4>
                <h5 className="font-semibold mt-4 mb-2">
                  1. DEFINITIONS AND INTERPRETATIONS
                </h5>
                <p className="mb-2">
                  <strong>1.1 Definitions</strong>
                </p>
                <p className="mb-2">
                  “Beneficiaries” means the Disclosing Party and each of its
                  Related Bodies Corporate who have an interest in, or who are
                  the subject of, any of the Confidential Information.
                </p>
                <p className="mb-2">“Confidential Information” means:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    All commercial, financial, legal and technical information
                    and know-how directly or indirectly related to the business
                    or affairs of the Disclosing Party or its Related Bodies
                    Corporate which is disclosed (whether orally,
                    electronically, in writing or any other form or media
                    whatsoever) by or on behalf of the Disclosing Party to the
                    Recipient or any of its Representatives and includes,
                    without limitation, all documents at any time contained in
                    any Data Room;
                  </li>
                  <li>
                    The contents of any discussions or agreements between the
                    parties and/or their Related Bodies Corporate relating to a
                    Permitted Transaction;
                  </li>
                  <li>Derived Information;</li>
                  <li>The terms and conditions and existence of this Deed;</li>
                  <li>
                    The fact that discussions have already occurred between the
                    parties in relation to a possible Permitted Transaction and
                    that further such discussions may occur in the future;
                  </li>
                  <li>
                    The fact that the Disclosing Party has disclosed or may
                    disclose information to the Recipient pursuant to this Deed;
                  </li>
                </ul>
                <p className="mb-2">But does not include information:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Which at the time of first disclosure to the Recipient is in
                    the public domain;
                  </li>
                  <li>
                    Which after disclosure to the Recipient comes into the
                    public domain otherwise than by disclosure in breach of the
                    terms of this Deed;
                  </li>
                  <li>
                    Which was known to or by the Recipient at the time of first
                    disclosure to it and was not acquired directly or indirectly
                    from the Disclosing Party;
                  </li>
                  <li>
                    Which the Recipient receives from a third party, provided
                    that as far as the Recipient is aware (without the need for
                    enquiry) the information was not obtained directly or
                    indirectly from the Disclosing Party in breach of an
                    obligation of confidence owed by the third party to the
                    Disclosing Party or any other person.
                  </li>
                </ul>
                <p className="mb-2">
                  “Derived Information” means any note, calculation, conclusion,
                  summary or other material derived or produced partly or wholly
                  from any Confidential Information.
                </p>
                <p className="mb-2">
                  “document” has the meaning given to it in Section 9 of the
                  Corporations Law.
                </p>
                <p className="mb-2">
                  “Related Bodies Corporate” has the meaning given to it in
                  Section 50 of the Corporations Law.
                </p>
                <p className="mb-2">
                  “Representatives” means any directors, officers, employees,
                  legal, financial and other expert advisers and agents of the
                  Recipient.
                </p>
                <p className="mb-2">
                  “Permitted Purpose” means the purpose of assessing whether or
                  not the Recipient will pursue a Permitted Transaction.
                </p>
                <p className="mb-2">
                  “Permitted Transaction” means any transaction agreed between
                  the Disclosing Party and the Recipient and/or their respective
                  Bodies Corporate pursuant to which the Recipient or any of its
                  Related Bodies Corporate lends monies to or participates in
                  any commercial transaction with the Disclosing Party or any of
                  its Related Bodies Corporate.
                </p>
                <p className="mb-2">
                  <strong>1.2 Interpretation</strong>
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Headings are for convenience only and do not affect
                    interpretation;
                  </li>
                  <li>The singular includes the plural and vice versa;</li>
                  <li>
                    If a word or phrase is defined, its other grammatical forms
                    have a corresponding meaning;
                  </li>
                  <li>
                    A reference to a party to this Deed includes the party’s
                    successors and assigns;
                  </li>
                  <li>
                    A reference to legislation or to a provision of legislation
                    includes a modification or re-enactment of it, a legislative
                    provision substituted for it and a regulation or statutory
                    instrument issued under it.
                  </li>
                </ul>

                <p className="mb-2">
                  <strong>1.3 Consents and approvals</strong>
                </p>
                <p className="mb-4">
                  Except as expressly provided in this Deed, if the doing of any
                  act, matter or thing under this Deed is dependent on the
                  consent or approval of a party or is within the discretion of
                  a party, such consent or approval may be given or such
                  discretion may be exercised conditionally or unconditionally
                  or withheld by the party in its absolute discretion.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  2. PROVISION OF CONFIDENTIAL INFORMATION
                </h5>
                <p className="mb-4">
                  Subject to this Deed, the Disclosing Party may, but shall not
                  be obliged to, provide any Confidential Information to the
                  Recipient.
                </p>

                <h5 className="font-semibold mt-4 mb-2">3. CONFIDENTIALITY</h5>
                <p className="mb-2">
                  <strong>
                    3.1 The Recipient undertakes and covenants (on its own
                    behalf and on behalf of all its Representatives):
                  </strong>
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    To keep and hold all Confidential Information strictly
                    confidential and, subject to Clause 4, not to disclose or
                    permit the disclosure, publication or communication of any
                    of the Confidential Information to any person except in
                    accordance with the terms of this Deed or unless it obtains
                    the Disclosing Party’s prior written consent;
                  </li>
                  <li>
                    To take all reasonable steps and do all things that are
                    necessary, prudent or desirable to maintain and preserve the
                    confidentiality of the Confidential Information;
                  </li>
                  <li>
                    Not to reproduce or record in any form or use any of the
                    Confidential Information except for the Permitted Purpose;
                  </li>
                  <li>
                    Not to permit or cause any of the Confidential Information
                    to be entered into any computer or database which is not
                    solely operated and controlled by the Recipient, without the
                    prior written consent of the Disclosing Party;
                  </li>
                  <li>
                    Not to use or appropriate any of the Confidential
                    Information for its own benefit or gain or for any purpose
                    except for the Permitted Purpose, and not to make any use of
                    the Confidential Information or any part of it to the
                    competitive disadvantage of the Disclosing Party or any of
                    its Related Bodies Corporate;
                  </li>
                  <li>
                    To ensure that its Representatives are aware that they are
                    obliged to treat any Confidential Information received by
                    them in the same manner as if they were a party to this
                    Deed;
                  </li>
                  <li>
                    To ensure that its Representatives and Related Bodies
                    Corporate comply with the Recipient’s obligations under this
                    Deed as if each Representative and Related Body Corporate
                    were a party to this Deed;
                  </li>
                  <li>
                    To notify the Disclosing Party immediately it suspects or
                    becomes aware of any breach of this Deed;
                  </li>
                  <li>
                    To promptly take all reasonable steps, at its own expense,
                    to prevent or stop any actual or suspected breach of this
                    Deed.
                  </li>
                </ul>

                <p className="mb-2">
                  <strong>3.2 Prohibition on discussions</strong>
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Not, without the prior consent of the Disclosing Party,
                    directly or indirectly make any enquiries of or discuss with
                    any financier, customer, supplier, landlord, tenant or
                    creditor of the Disclosing Party or any of its Related
                    Bodies Corporate, any matters concerning the Confidential
                    Information;
                  </li>
                  <li>
                    Not make any enquiries of or discuss with any officer,
                    employee or agent of the Disclosing Party or any of its
                    Related Bodies Corporate, any matters concerning the
                    Confidential Information;
                  </li>
                  <li>
                    Not disclose, publish or permit the disclosure or
                    publication of the Permitted Purpose or the fact that any
                    discussions are taking place or have taken place in relation
                    to the Permitted Purpose to any person (other than in
                    accordance with this Deed).
                  </li>
                </ul>
                <h5 className="font-semibold mt-4 mb-2">
                  4. PERMITTED DISCLOSURE
                </h5>
                <p className="mb-4">
                  The Recipient may disclose Confidential Information to such of
                  its Representatives or Related Bodies Corporate who reasonably
                  require access to the Confidential Information in order for
                  the Recipient to undertake the Permitted Purpose.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  5. MANDATORY DISCLOSURE
                </h5>
                <p className="mb-4">
                  Nothing in this Deed prohibits the Recipient from disclosing
                  any Confidential Information which is required to be disclosed
                  by law, an order of a court, tribunal, government or
                  regulatory body or competent jurisdiction or the Listing Rules
                  of the Australian Stock Exchange Limited, provided that where
                  disclosure is so required, the Recipient must notify the
                  Disclosing Party as soon as reasonably practicable and must
                  provide all reasonable assistance and co-operation to enable
                  the Disclosing Party to seek a protective order or other
                  relief from or to minimise the disclosure.
                </p>

                <h5 className="font-semibold mt-4 mb-2">6. DISCLAIMER</h5>
                <p className="mb-2">
                  <strong>6.1 Disclosing Party not liable</strong>
                </p>
                <p className="mb-2">
                  The Recipient acknowledges that it is making an independent
                  assessment of the Confidential Information and will verify all
                  information on which it intends to rely to its own
                  satisfaction and that, subject to the Confidential Information
                  being provided in good faith, the Disclosing Party does not
                  and will not give any warranty as to the truth, accuracy,
                  relevance or usefulness of any of the Confidential Information
                  and does not accept any responsibility for any falsity,
                  inaccuracy or misleading information in, or for any omission
                  from, the Confidential Information, except to the extent
                  expressly provided for in any agreement binding upon the
                  Disclosing Party.
                </p>
                <p className="mb-2">
                  <strong>6.2 Recipient’s conclusions its own</strong>
                </p>
                <p className="mb-2">
                  The Disclosing Party accepts no responsibility for any
                  interpretation, opinion or conclusion that the Recipient may
                  form as a result of examining the Confidential Information.
                </p>
                <p className="mb-2">
                  <strong>6.3 Opinions expressed may change</strong>
                </p>
                <p className="mb-2">
                  The Recipient acknowledges that any opinions expressed in the
                  Confidential Information are based on the knowledge and
                  approach of the persons forming the opinion at the date that
                  the opinion was formed and may have ceased or may in the
                  future cease to be appropriate in the light of subsequent
                  knowledge or attitudes.
                </p>
                <p className="mb-2">
                  <strong>6.4 The Disclosing Party’s rights</strong>
                </p>
                <p className="mb-4">
                  The Disclosing Party reserves all rights in the Confidential
                  Information and no rights or obligations other than those
                  expressly contained in this Deed are granted or to be implied
                  from this Deed. In particular, no licence is granted directly
                  or indirectly under any patent, invention, discovery,
                  copyright or other intellectual property right now or in the
                  future held, made, obtained or licensable by the Disclosing
                  Party. The Recipient acknowledges that the Confidential
                  Information and all intellectual property rights in the
                  Confidential Information (including copyright, design and
                  patent rights) will, to the extent owned prior to disclosure,
                  remain the exclusive property of the Disclosing Party.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  7. RETURN OF CONFIDENTIAL INFORMATION
                </h5>
                <p className="mb-2">
                  <strong>7.1</strong> Upon the earlier of completion or
                  discontinuance of the Permitted Purpose or request by the
                  Disclosing Party, the Recipient must promptly return to the
                  Disclosing Party (or destroy if the Disclosing Party so
                  directs) all documents and other materials (whether originals,
                  copies or in electronic form) within the custody, power or
                  control of the Recipient which contain any Confidential
                  Information.
                </p>
                <p className="mb-2">
                  Notwithstanding the foregoing, the Recipient may, in its
                  discretion:
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>Deliver or destroy Derived Information;</li>
                  <li>
                    Retain minutes of meeting of its directors, together with
                    such supporting documentation as is customarily retained by
                    the Recipient in relation to such minutes, relating to any
                    determination by the directors to pursue a Permitted
                    Transaction.
                  </li>
                </ul>
                <p className="mb-4">
                  <strong>7.2</strong> Return, destruction or retention of
                  Confidential Information in accordance with this Clause 7 does
                  not release the Recipient from its obligations under this
                  Deed.
                </p>

                <h5 className="font-semibold mt-4 mb-2">8. THIRD PARTIES</h5>
                <p className="mb-4">
                  The Recipient acknowledges that the Disclosing Party is free
                  to disclose any Confidential Information to any other person
                  and is not obliged to notify the Recipient if it does so.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  9. CONTINUING OBLIGATION
                </h5>
                <p className="mb-4">
                  The Recipient acknowledges and agrees that the terms,
                  conditions and obligations under this Deed do not cease on the
                  termination or cessation of this Deed or on the completion,
                  postponement or discontinuance of the Permitted Purpose, but
                  will continue indefinitely.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  10. BENEFIT OF AGREEMENT
                </h5>
                <p className="mb-4">
                  The Disclosing Party enters into this Deed for and on behalf
                  of itself and the other Beneficiaries. The Recipient
                  acknowledges that the Disclosing Party may enforce this Deed
                  on behalf of itself and the other Beneficiaries.
                </p>

                <h5 className="font-semibold mt-4 mb-2">11. INDEMNITY</h5>
                <p className="mb-2">
                  <strong>11.1</strong> The Recipient indemnifies and must keep
                  indemnified each of the Beneficiaries from and against all
                  claims, costs, expenses, losses and liabilities (including
                  legal costs on a solicitor and own client basis) suffered or
                  incurred by any of them (including, without limitation, in
                  connection with the enforcement of this Deed) as a result of
                  or in connection with:
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>Any breach of this Deed by the Recipient;</li>
                  <li>
                    Any act or omission by any of its Representatives which, if
                    done or omitted to be done by the Recipient would constitute
                    a breach of the Recipient’s obligations under this Deed.
                  </li>
                </ul>
                <p className="mb-2">
                  <strong>11.2</strong> The indemnity given by the Recipient in
                  this Clause 11:
                </p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Is for the benefit of each of the Beneficiaries. The
                    indemnity may be enforced by the Disclosing Party on behalf
                    of itself and the other Beneficiaries or by any Beneficiary
                    on its own behalf;
                  </li>
                  <li>Shall survive the termination of this Deed.</li>
                </ul>

                <h5 className="font-semibold mt-4 mb-2">12. REMEDIES</h5>
                <p className="mb-4">
                  The Recipient acknowledges that damages is an inadequate
                  remedy for any breach of this Deed and that subject to the
                  court’s discretion (and in addition to any other remedies
                  available at law or in equity), the Disclosing Party is
                  entitled to specific performance or injunctive relief (as
                  appropriate) in respect of any conduct or proposed conduct by
                  the Recipient or any Representative which is or will
                  constitute a breach of this Deed.
                </p>

                <h5 className="font-semibold mt-4 mb-2">13. NOTICES</h5>
                <p className="mb-2">Any notice given under this Deed:</p>
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Must be in writing addressed to the intended recipient at
                    the address shown below or the address last notified by the
                    intended recipient to the sender:
                  </li>
                </ul>

                <p className="mb-2 font-semibold">Disclosing Party</p>
                <p className="mb-1">
                  Load Link Australia Pty Limited & Fortis Fundamenta Pty Ltd
                  atf the Fortis Fundamenta Trust
                </p>
                <p className="mb-1">
                  Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216
                </p>
                <p className="mb-1">Attention: Mr Anthony Kosseris</p>
                <p className="mb-4">Email: anthony@loadlink.com.au</p>

                <p className="mb-2 font-semibold">Recipient</p>
                <p className="mb-1">
                  {formData.companyName || "[Your Company]"}
                </p>
                <p className="mb-1">
                  {formData.street || "___"}, {formData.state || "___"}{" "}
                  {formData.postcode || "___"}
                </p>
                <p className="mb-1">Attention: {formData.repName || "___"}</p>
                <p className="mb-4">Email: {formData.email || "___"}</p>

                <ul className="list-disc ml-6 mb-4">
                  <li>
                    Must be signed by a person duly authorised by the sender;
                  </li>
                  <li>
                    Will be taken to have been given when delivered, received or
                    left at the above address. If delivery or receipt occurs on
                    a day when business is not generally carried on in the place
                    to which the notice is sent, or is later than 4.00 pm (local
                    time), it will be taken to have been duly given at the
                    commencement of business on the next day when business is
                    generally carried on in that place.
                  </li>
                </ul>
                <h5 className="font-semibold mt-4 mb-2">14. AMENDMENT</h5>
                <p className="mb-4">
                  This Deed may be amended only by another deed executed by all
                  parties.
                </p>

                <h5 className="font-semibold mt-4 mb-2">15. NO WAIVER</h5>
                <p className="mb-4">
                  No failure to exercise and no delay in exercising any right,
                  power or remedy under this Deed will operate as a waiver. Nor
                  will any single or partial exercise of any right, power or
                  remedy preclude any other or further exercise of that or any
                  other right, power or remedy.
                </p>

                <h5 className="font-semibold mt-4 mb-2">
                  16. STAMP DUTY AND COSTS
                </h5>
                <p className="mb-4">
                  Each party shall bear its own costs arising out of the
                  preparation of this Deed. All stamp duty chargeable on this
                  Deed shall be borne by the Recipient. The Recipient shall
                  indemnify the Disclosing Party on demand against any liability
                  for that stamp duty.
                </p>

                <h5 className="font-semibold mt-4 mb-2">17. GOVERNING LAW</h5>
                <p className="mb-4">
                  This Deed is governed by the laws in force in Queensland. Each
                  party irrevocably and unconditionally submits to the
                  non-exclusive jurisdiction of the courts exercising
                  jurisdiction there.
                </p>

                <h5 className="font-semibold mt-4 mb-2">18. COUNTERPARTS</h5>
                <p className="mb-4">
                  This Deed may be executed in any number of counterparts. All
                  counterparts taken together will be taken to constitute one
                  instrument.
                </p>

                <p className="text-xs text-gray-500 mt-8 italic">
                  This deed is generated dynamically based on your onboarding
                  details and reflects the full legal agreement between parties.
                  Please ensure all fields are accurate before signing.
                </p>
              </div>
              <div className="flex items-start mt-6">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    updateFormData("termsAccepted", e.target.checked)
                  }
                  className="mt-1 h-5 w-5 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="termsAccepted"
                  className="ml-3 text-sm text-gray-700 cursor-pointer"
                >
                  I have read and agree to the terms of the Confidentiality Deed{" "}
                  <span className="text-red-500">*</span>
                </label>
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
                    className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
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
                    const value = payload[key];
                    if (typeof value !== "string") return true;
                    if (key === "signatureBase64")
                      return !value.startsWith("data:image");
                    return value.trim() === "";
                  });

                  if (missing.length > 0) {
                    alert("Missing or invalid value. Please check the form.");
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
                  } catch (err) {
                    alert("There was a problem generating the PDF.");
                    console.error(err);
                  }
                }}
                className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-md"
              >
                Download Confidentiality Deed
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
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`ml-auto px-8 py-3 rounded-lg transition-all shadow-lg ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600"
                }`}
              >
                {isSubmitting ? "Redirecting..." : "Complete Onboarding"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

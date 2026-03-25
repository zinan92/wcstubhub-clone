'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function CompanyProfilePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Company Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Company Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">SAE-A Trading</h2>
              <p className="text-sm text-gray-500">International Trade & Commerce</p>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Us</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              SAE-A Trading is a comprehensive international trading company specializing in 
              sports merchandise, event tickets, and entertainment services. With a global 
              presence and decades of experience, we connect fans worldwide with their 
              favorite teams, athletes, and performers.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our business spans multiple sectors including apparel and textiles manufacturing, 
              sports memorabilia distribution, and live event ticket sales. We operate in over 
              40 countries, serving millions of customers annually with authentic products and 
              unforgettable experiences.
            </p>
          </div>

          {/* Industry Focus */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Industry Focus</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></span>
                <p className="text-gray-700">
                  <span className="font-medium">Apparel & Textiles:</span> Official sports jerseys, 
                  team merchandise, and premium athletic wear from leading brands.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></span>
                <p className="text-gray-700">
                  <span className="font-medium">Event Tickets:</span> Exclusive access to football 
                  matches, basketball games, concerts, and major sporting events worldwide.
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2"></span>
                <p className="text-gray-700">
                  <span className="font-medium">Sports Memorabilia:</span> Authenticated collectibles, 
                  limited edition items, and exclusive merchandise from iconic athletes.
                </p>
              </li>
            </ul>
          </div>

          {/* Quality Philosophy */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Quality Philosophy</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              At SAE-A Trading, quality is not just a commitment—it's our foundation. We believe 
              that every product we deliver and every experience we create should exceed customer 
              expectations. Our quality philosophy is built on three core principles:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="text-gray-700">
                <span className="font-medium text-blue-600">• Authenticity:</span> Every product is 
                guaranteed genuine, sourced directly from official manufacturers and rights holders.
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-blue-600">• Excellence:</span> We maintain rigorous 
                quality control standards across our entire supply chain, from sourcing to delivery.
              </li>
              <li className="text-gray-700">
                <span className="font-medium text-blue-600">• Customer Trust:</span> Building long-term 
                relationships through transparency, reliability, and exceptional service.
              </li>
            </ul>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              SAE-A Trading © 2026 • Connecting fans with unforgettable experiences worldwide
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

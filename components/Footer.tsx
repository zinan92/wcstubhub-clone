import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pb-16 pt-8">
      <div className="max-w-[600px] mx-auto px-4 space-y-8">
        {/* Company Info Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WC</span>
            </div>
            <span className="font-bold text-lg text-gray-900">WCStubHub</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your trusted marketplace for sports merchandise and event tickets. 
            Buy and sell with confidence.
          </p>
          <p className="text-xs text-gray-500">
            © {currentYear} WCStubHub. All rights reserved.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="#about"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              About
            </Link>
            <Link
              href="#help"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              Help Center
            </Link>
            <Link
              href="#contact"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Legal Links Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Legal</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="#terms"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              Terms of Service
            </Link>
            <Link
              href="#privacy"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              Privacy Policy
            </Link>
            <Link
              href="#cookies"
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors py-2 min-h-[44px] flex items-center"
            >
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Fan Protect Guarantee Trust Banner */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-sm text-gray-900">Fan Protect Guarantee</h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Every purchase is 100% protected. Valid tickets or your money back. 
            Secure transactions backed by our buyer protection guarantee.
          </p>
        </div>
      </div>
    </footer>
  );
}

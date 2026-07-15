import { Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-700 bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">

        <h2 className="text-2xl font-bold text-white">
          WishLedger
        </h2>

        <p className="mt-2 text-gray-400">
          Smart Wishlist Management
        </p>

        <div className="mt-6 flex justify-center gap-8">

          <a
            href="#"
            className="text-gray-300 hover:text-yellow-400"
          >
            About
          </a>

          <a
            href="mailto:hello@wishledger.com"
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-400"
          >
            <Mail size={16} />
            Contact
          </a>

          <a
            href="https://github.com/ChandraHasyatha/storefront"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-400"
          >
            <Globe size={16} />
            GitHub
          </a>

        </div>

        <p className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} WishLedger. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
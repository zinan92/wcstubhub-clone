'use client';

import { signOut } from 'next-auth/react';

export default function MyPage() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <main className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        My Profile
      </h1>
      <p className="text-gray-600 mb-6">
        User profile coming soon...
      </p>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Log out
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from "next/image";

interface UserData {
  name: string;
  id: string;
  info?: string;
  photoUrl?: string;
}

export default function BarcodeDetailPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    try {
      const encodedData = searchParams.get('data');
      if (!encodedData) {
        setError('Data tidak ditemukan');
        setIsLoading(false);
        return;
      }

      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      setUserData({
        name: decodedData.name,
        id: decodedData.id,
        info: decodedData.info,
        photoUrl: decodedData.photoUrl
      });
      setIsLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat memproses data');
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
          <div className="text-red-500 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
          <div className="text-white">
            <div className="text-sm font-medium opacity-80">ID Pengguna</div>
            <div className="text-2xl font-bold mt-1">{userData.id}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Section */}
          {userData.photoUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Gambar
              </label>
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100">
                <Image 
                  src={userData.photoUrl} 
                  alt="Uploaded Image"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Nama
              </label>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {userData.name}
              </div>
            </div>

            {userData.info && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Informasi Tambahan
                </label>
                <div className="mt-1 text-gray-700 dark:text-gray-300">
                  {userData.info}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Data ini dihasilkan melalui QR Code Scanner. 
              Silakan verifikasi informasi ini dengan sistem utama jika diperlukan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
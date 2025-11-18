"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductNotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoProducts = () => {
    router.push('/san-pham');
  };

  return (
    <div className="min-h-screen bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-16 h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Sản phẩm không tồn tại</h1>
          <h2 className="text-xl text-gray-700 mb-4">Rất tiếc, chúng tôi không thể tìm thấy sản phẩm này</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Sản phẩm bạn đang tìm kiếm có thể đã hết hàng, ngừng kinh doanh hoặc đường link không chính xác.<br/>
            Hãy khám phá các sản phẩm khác tại Kitchen Care hoặc quay về trang chủ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoProducts}
            className="bg-orange-600 text-white py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Xem tất cả sản phẩm
          </button>
          
          <button
            onClick={handleGoHome}
            className="bg-gray-100 text-gray-700 py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Tự động chuyển hướng về trang chủ sau <span className="font-medium text-orange-600">{countdown} giây</span>
          </p>
          
          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-4">
              Có thể bạn quan tâm:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/san-pham-dac-biet" className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                Sản phẩm đặc biệt
              </Link>
              <Link href="/showrooms" className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                Showroom
              </Link>
              <Link href="/ban-tin" className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-orange-100 hover:text-orange-600 transition-colors">
                Tin tức
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

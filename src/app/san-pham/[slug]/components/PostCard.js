"use client";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/apiServices/constants";

export default function PostCard({ post }) {
  const { title, slug, coverImage, createdAt } = post;

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <Link href={`/ban-tin/${slug}`} className="block">
        <div className="flex items-center">
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={new URL(coverImage, API_BASE_URL).href}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-2 flex-1 ml-2">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

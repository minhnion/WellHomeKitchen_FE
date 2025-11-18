"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import { NewsCard } from "@/components/News/NewsCard/NewsCard";

export default function PostCategoryClient({
  initialPosts,
  initialPagination,
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [paginationInfo, setPaginationInfo] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    setPosts(initialPosts);
    setPaginationInfo(initialPagination);
  }, [initialPosts, initialPagination]);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {posts.map((post) => {
            const categoryPath = post.categoryHierarchy
              .map((cat) => cat.slug)
              .join("/");

            const fullPostUrl = `/ban-tin/${categoryPath}/${post.slug}`;

            return (
              <Link href={fullPostUrl} key={post._id}>
                <NewsCard
                  coverImage={post.coverImage}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.createdAt}
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          Chưa có bài viết nào trong danh mục này.
        </p>
      )}

      {paginationInfo && paginationInfo.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationInfo.totalPages}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

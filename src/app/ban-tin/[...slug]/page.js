import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/apiServices/posts";
import { getPostCategoryBySlug } from "@/apiServices/postCategory";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { API_BASE_URL } from "@/apiServices/constants";

import PostContentRenderer from "@/app/ban-tin/PostContentRenderer/PostContentRenderer";
import PostCategoryClient from "../PostCategoryClient/PostCategoryClient";

export async function generateMetadata({ params }) {
  const lastSlug = params.slug[params.slug.length - 1];

  const post = await getPostBySlug(lastSlug);

  if (post) {
    const title = `${post.title} - Kitchen care`;
    const description = post.excerpt;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: `${API_BASE_URL}${post.coverImage}` }],
        type: "article",
      },
    };
  }

  const category = await getPostCategoryBySlug(lastSlug);
  if (category) {
    const title = `Các bài viết trong danh mục ${category.name} - Kitchen care`;
    const description = `Danh sách các bài viết, tin tức thuộc danh mục ${category.name}.`;
    return {
      title,
      description,
      openGraph: { title, description },
    };
  }

  return {
    title: "Không tìm thấy trang",
  };
}

export const dynamic = "force-dynamic";

export default async function SlugPage({ params, searchParams }) {
  const lastSlug = params.slug[params.slug.length - 1];

  const post = await getPostBySlug(lastSlug);

  if (post) {
    const publishedDate = format(
      new Date(post.createdAt),
      "dd 'tháng' MM, yyyy",
      { locale: vi }
    );

    const breadcrumbItems = post.categoryHierarchy || [];

    return (
      <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Trang chủ
              </Link>
            </li>
            {breadcrumbItems.map((item, index) => (
              <li key={item._id} className="flex items-center">
                <span className="mr-2">/</span>
                <Link
                  href={`/ban-tin/${breadcrumbItems
                    .slice(0, index + 1)
                    .map((i) => i.slug)
                    .join("/")}`}
                  className="hover:text-primary-600"
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <span className="mr-2">/</span>
              <span className="text-gray-800">{post.title}</span>
            </li>
          </ol>
        </nav>
        <article className="max-w-5xl my-6 bg-white p-6 md:p-10 rounded-lg shadow-lg">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <span>Viết bởi {post.author.name}</span>
              <span className="mx-2">•</span>
              <span>{publishedDate}</span>
            </div>
          </header>
          <figure className="mb-8">
            <Image
              src={`${API_BASE_URL}${post.coverImage}`}
              alt={`Ảnh bìa cho bài viết ${post.title}`}
              width={1200}
              height={675}
              priority
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </figure>
          <div className="post-content">
            <PostContentRenderer content={post.content} />
          </div>
          {post.tags && post.tags.length > 0 && (
            <footer className="mt-10 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="font-semibold">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>
      </div>
    );
  }

  const categoryData = await getPostCategoryBySlug(lastSlug);

  if (categoryData) {
    const currentPage = Number(searchParams.page) || 1;
    const postsResponse = await getAllPosts(
      currentPage,
      12,
      "published",
      categoryData._id
    );
    const postsList = postsResponse ? postsResponse.data : [];
    const pagination = postsResponse ? postsResponse.pagination : null;

    const breadcrumbSource = postsList[0]?.categoryHierarchy ||
      (await getPostCategoryBySlug(lastSlug))?.categoryHierarchy || [
        {
          name: categoryData.name,
          slug: categoryData.slug,
          _id: categoryData._id,
        },
      ];
    const urlSlugs = params.slug;
    const breadcrumbItems = breadcrumbSource.filter((item) =>
      urlSlugs.includes(item.slug)
    );

    return (
      <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Trang chủ
              </Link>
            </li>
            {breadcrumbItems.map((item, index) => (
              <li key={item._id} className="flex items-center">
                <span className="mr-2">/</span>
                <Link
                  href={`/ban-tin/${urlSlugs.slice(0, index + 1).join("/")}`}
                  className={
                    index === breadcrumbItems.length - 1
                      ? "text-gray-800"
                      : "hover:text-primary-600"
                  }
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-3xl font-bold mb-8 border-b pb-4">
          {categoryData.name}
        </h1>
        <PostCategoryClient
          initialPosts={postsList}
          initialPagination={pagination}
          categoryId={categoryData._id}
        />
      </div>
    );
  }

  notFound();
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSaleProducts, getAllSaleProducts } from "@/apiServices/saleOccasion";
import SaleProductsClient from "../components/SaleProductClient/SaleProductClient";

export default async function SaleOccasionPage(props) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const { slugSaleOccasion } = params;

    //  nếu user vào /sales thì chuyển sang /sales/all
    if (!slugSaleOccasion) {
        redirect("/sales/all");
    }

    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const limit = 20;
    const now = new Date().toISOString();

    let res;

    if (slugSaleOccasion === "all") {
        res = await getAllSaleProducts({
            time: now,
            category: null,
            limit,
            page,
        });
    } else {
        res = await getSaleProducts({
            time: now,
            category: null,
            limit,
            page,
        });
    }

    if (!res?.data?.sale) notFound();

    const { sale, products } = res.data;

    //  chỉ check slug khi KHÔNG phải all
    if (slugSaleOccasion !== "all" && sale.slug !== slugSaleOccasion) {
        notFound();
    }

    const breadcrumbItems = [
        { href: "/", label: "Trang chủ" },
        {
            href:
                slugSaleOccasion === "all"
                    ? "/sales/all"
                    : `/sales/${sale.slug}`,
            label:
                slugSaleOccasion === "all"
                    ? "Tất cả sản phẩm ưu đãi"
                    : sale.name,
        },
    ];

    return (
        <div className="bg-secondary px-4 sm:px-6 md:px-10 lg:px-20 py-6">
            {/* ================= BREADCRUMB ================= */}
            <nav className="flex flex-wrap items-center mb-6 text-sm">
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <div key={item.href} className="flex items-center">
                            {isLast ? (
                                <span className="font-medium text-gray-800">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="text-gray-500 hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            )}
                            {!isLast && (
                                <span className="mx-2 text-gray-400">/</span>
                            )}
                        </div>
                    );
                })}
            </nav>

            <SaleProductsClient
                sale={sale}
                initialProducts={products}
                totalProducts={res.pagination?.total || 0}
            />
        </div>
    );
}

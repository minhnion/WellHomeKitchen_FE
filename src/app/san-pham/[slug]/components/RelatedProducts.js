
import { getAllProducts } from "@/apiServices/products";
import ProductCard from "@/components/ProductCard/ProductCard";

export default async function RelatedProducts({
    currentProductId,
    categoryId,
    brand
}) {
    if (!categoryId) return null;

    let relatedProducts = [];

    try {
        const allProducts = await getAllProducts(1, 20, categoryId);

        if (allProducts?.data && allProducts.data.length > 1) {
            // Filter ra sản phẩm cùng category nhưng khác sản phẩm hiện tại
            const filtered = allProducts.data.filter(
                product => product._id !== currentProductId
            );

            // Ưu tiên cùng brand
            const sortedProducts = filtered.sort((a, b) => {
                if (brand && a.brand?._id === brand._id && b.brand?._id !== brand._id) return -1;
                if (brand && b.brand?._id === brand._id && a.brand?._id !== brand._id) return 1;
                return 0;
            });

            relatedProducts = sortedProducts.slice(0, 5); // Lấy 5 sản phẩm
        }
    } catch (error) {
        console.error("Error fetching related products:", error);
        return null;
    }

    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-6">

            <h2 className="text-xl font-bold text-blue-800 mb-6">
                Sản phẩm liên quan
            </h2>

            {/* Grid 5 cột trên desktop, responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts.map((product) => (
                    <ProductCard key={product._id} {...product} />
                ))}
            </div>
        </div>
    );
}
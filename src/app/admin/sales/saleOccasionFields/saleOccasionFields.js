import { getAllProducts } from "@/apiServices/products";

export const saleOccasionFields = [
    {
        name: "name",
        label: "Tên đợt sale",
        type: "text",
        required: true,
    },
    {
        name: "startAt",
        label: "Thời gian bắt đầu",
        type: "date",
        required: true,
    },
    {
        name: "endAt",
        label: "Thời gian kết thúc",
        type: "date",
        required: true,
    },

    {
        name: "sales",
        label: "Sản phẩm áp dụng",
        type: "custom",
        required: true,
        subFields: [
            {
                name: "productId",
                label: "Sản phẩm",
                type: "async-select",
                loadOptions: async (search, loadedOptions, { page = 1 }) => {
                    const res = await getAllProducts(
                        page,
                        1000000,
                        null,
                        null,
                        null,
                        search
                    );

                    return {
                        options: res.data.map((p) => ({
                            value: p._id,
                            label: p.name,
                            price: p.price,
                        })),
                        hasMore: page * 10 < res.pagination.total,
                        additional: { page: page + 1 },
                    };
                },
            },
            {
                name: "salePrice",
                label: "Giá bán",
                type: "number",
                required: true,
                min: 0,
            },
            {
                name: "saleQuantity",
                label: "Số lượng sale",
                type: "number",
                required: true,
                min: 1,
            },
        ],
    },
];

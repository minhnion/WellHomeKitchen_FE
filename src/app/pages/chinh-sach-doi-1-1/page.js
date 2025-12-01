
import Link from 'next/link';
import React from 'react';



export default function ChinhSachDoi1Page() {
    return (

        <div className="max-w-4xl mx-auto px-4 my-6">
            {/* Breadcrumb */}
            <div className="my-6 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
                <span className="mx-2">/</span>
                <span>Chính sách đổi 1-1</span>
            </div>

            {/* Khung nội dung trắng */}
            <div className="bg-white rounded-lg shadow-sm p-8">
                {/* Tiêu đề chính */}
                <h1 className="text-2xl font-bold text-blue-900 mb-8">
                    Chính sách đổi 1-1
                </h1>

                {/* Nội dung chính sách */}
                <div className="text-gray-900 leading-relaxed">
                    {/* Phạm vi và thời gian áp dụng */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">
                            Phạm vi và thời gian áp dụng
                        </h2>

                        <p className="mb-4 ">
                            <strong>Phạm vi:</strong>
                        </p>

                        <div className="mb-4">
                            <strong className="text-red-500">Bosch</strong>

                            <ul className="mt-2 list-disc ml-6">
                                <li>Đối với mặt hàng Bosch: 1 đối 1 trong vòng 07 ngày miễn phí nếu có bất kỳ lỗi kỹ thuật nào từ nhà sản xuất.</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <strong className="text-red-500">Tefal</strong>
                            <ul className="mt-2 list-disc ml-6">
                                <li>Đối với mặt hàng Tefal: 1 đối 1 trong vòng 30 ngày miễn phí nếu có bất kỳ lỗi kỹ thuật nào từ nhà sản xuất (chỉ áp dụng 1 lần)</li>
                            </ul>

                        </div>

                        <div className="mb-6">
                            <strong className="text-red-500">SMEG, PHILIPS, WMF, ECOVACS, TINECO</strong>
                            <ul className="mt-2 list-disc ml-6">
                                <li >Đối với mặt hàng thuộc các hãng này: 1 đối 1 trong vòng 30 ngày miễn phí nếu có bất kỳ lỗi kỹ thuật nào từ nhà sản xuất (chỉ áp dụng 1 lần)</li>
                            </ul>
                        </div>

                        <div>
                            <strong>Thời gian áp dụng:</strong>
                            <ul className="mt-2 list-disc ml-6">
                                <li >Tính từ ngày mua hàng hoặc ngày giao/ lắp đặt xong và với điều kiện sử dụng thông thường (không dùng cho mục đích thương mại như: nhà hàng, khách sạn, quán ăn, tiệm giặt ủi...)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Điều kiện đổi sản phẩm */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">
                            Điều kiện đổi sản phẩm
                        </h2>
                        <ul className="mt-2 list-disc ml-6">
                            <li className="ml-4">Sản phẩm đổi phải đủ điều kiện bảo hành của hãng.</li>
                            <li className="ml-4">Sản phẩm chỉ dùng cho mục đích sử dụng cá nhân, không áp dụng việc sử dụng sản phẩm cho mục đích thương mại.</li>
                            <li className="ml-4">Sản phẩm phải còn đầy đủ thùng, sách hướng dẫn, phụ kiện.</li>
                            <li className="ml-4">Số seri/ imei của sản phẩm phải trùng khớp với thông tin ghi trên phiếu bảo hành.</li>
                            <li className="ml-4">Sản phẩm được lắp đặt, sử dụng đúng theo hướng dẫn của Nhà sản xuất và không bị thay đổi, can thiệp sửa chữa bởi Kỹ thuật viên không phải của WellHome hoặc của hãng.</li>
                        </ul>
                    </section>

                    {/* Quy định đổi sản phẩm */}
                    <section className="mb-8">
                        <h2 className="text-xl font-bold text-blue-900 mb-4">
                            Quy định đổi sản phẩm
                        </h2>

                        <div className="mb-4">
                            <strong>Thực hiện 1 đổi 1</strong>
                            <ul className="mt-2 list-disc ml-6">
                                <li className="ml-4">Đổi sản phẩm cùng loại, thương hiệu, model.</li>
                                <li className="ml-4">Trường hợp không có sản phẩm để đổi, khách hàng được quyền đổi sang sản phẩm khác và bù tiền chênh lệch (nếu có).</li>
                                <li className="ml-4">Không đổi sản phẩm có giá trị thấp hơn sản phẩm ban đầu.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
}
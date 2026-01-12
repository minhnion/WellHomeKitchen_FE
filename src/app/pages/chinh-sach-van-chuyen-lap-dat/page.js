// src/app/pages/chinh-sach-van-chuyen-lap-dat/page.js
import Link from 'next/link';

export default function ChinhSachVanChuyenLapDat() {
    return (
        <div className="min-h-screen py-8">
            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 md:px-20 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                    <Link
                        href="/"
                        className="text-gray-600 font-medium"
                    >
                        Trang chủ
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">Chính sách vận chuyển, kiểm hàng, lắp đặt</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-20">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-8 ">
                        Chính sách vận chuyển, kiểm hàng, lắp đặt
                    </h1>

                    {/* Chính sách vận chuyển */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">
                            Chính sách vận chuyển
                        </h2>
                        <ul className="space-y-3 ml-4 list-disc text-gray-700">
                            <li>
                                Bepanphu áp dụng miễn phí vận chuyển cho tất cả các mặt hàng (giao tận nhà, đặt sản phẩm đến đúng vị trí khách hàng mong muốn)
                            </li>
                        </ul>
                        <h3 className="my-3">
                            Lưu ý: Trong trường hợp khách hàng ở tầng cao cần ghi chú rõ địa chỉ tầng và số căn hộ để chúng tôi phân công nhân lực phù hợp.
                        </h3>
                        <ul className="space-y-3 ml-4 list-disc text-gray-700">
                            <li>
                                Đơn vị vận chuyển chỉ thực hiện việc giao hàng, sau đó bộ phận lắp đặt sẽ liên hệ với khách hàng về việc lắp đặt.
                            </li>
                            <li>
                                Phía vận chuyển sẽ liên lạc với khách hàng trước khi giao.
                            </li>
                            <li>
                                Thời gian giao hàng cụ thể như sau:
                            </li>
                        </ul>

                        {/* Bảng thời gian giao hàng */}
                        <div className="mt-6">

                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Khu vực</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Giao hàng thông thường</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Giao hàng hoả tốc 4h (chỉ áp dụng cho sản phẩm gia dụng nhỏ)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Nội thành Hồ Chí Minh</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                2-4 ngày làm việc (Gia dụng nhỏ)<br />
                                                4-7 ngày làm việc (Gia dụng lớn)
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">Có áp dụng</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 px-4 py-2">Các tỉnh thành phố khác</td>
                                            <td className="border border-gray-300 px-4 py-2">3-7 ngày làm việc</td>
                                            <td className="border border-gray-300 px-4 py-2">Không áp dụng</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Lưu ý */}
                        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h4>
                            <h3>Hoả tốc 4h đối với 1 vài sản phẩm (nội thành HCM - áp dụng đối với 1 vài sản phẩm)</h3>
                            <h3>Trong một vài trường hợp đặc biệt việc giao hàng có thể kéo dài hơn dự kiến với những lí do dưới đây:</h3>
                            <ul className="space-y-2 text-yellow-700 ml-4 list-disc">

                                <ul className="ml-6 list-disc">
                                    <li>Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể xác nhận đơn hàng.</li>
                                    <li>Địa chỉ giao hàng ban cung cấp không chính xác hoặc khó tìm.</li>
                                    <li>Số lượng đơn hàng của website tăng đột biến khiến việc xử lý đơn hàng bị chậm.</li>
                                    <li>Đối tác cung cấp hàng chúng tôi chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm.</li>
                                    <li>Đối tác vận chuyển hàng hóa cho chúng tôi bị chậm trễ trong việc xử lý giao nhận.</li>
                                </ul>
                            </ul>
                        </div>
                    </div>

                    {/* Chính sách kiểm hàng */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">
                            Chính sách kiểm hàng
                        </h2>
                        <div className="space-y-4 text-gray-700">
                            <p>
                                Quý Khách hàng có thể kiểm tra tình trạng ngoại quan kiện hàng và có thể trả lại hàng ngay tại thời điểm giao/nhận hàng (với điều kiện chưa khui hàng) hoặc phải yêu cầu đối trả trong vòng 03 ngày kể từ ngày nhận hàng. Khách hàng được phép yêu cầu đối trả trong những trường hợp sau:
                            </p>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.</li>
                                <li>Không đủ số lượng, không đủ bộ như trong đơn hàng.</li>
                                <li>Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ,..</li>
                            </ul>
                            <p>
                                Khách hàng có trách nhiệm trình giấy tờ liên quan, hình ảnh, clip chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đối trả hàng hóa.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-700 font-medium">
                                    *Lưu ý: chúng tôi khuyến khích khách hàng nên quay video khi khui đơn hàng để làm căn cứ hỗ trợ cho việc đối trả được nhanh chóng.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chính sách lắp đặt */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">
                            Chính sách lắp đặt
                        </h2>
                        <ul className="space-y-3 ml-4 list-disc text-gray-700">
                            <li>Bepanphu áp dụng miễn phí công lắp đặt cơ bản (đặt sản phẩm đến vị trí khách hàng mong muốn, khởi động thiết bị).</li>
                            <li>Nếu khách hàng ở các lầu cao thuộc chung cư, vui lòng thông báo cho Bepanphu để chuẩn bị trước cho việc lắp đặt.</li>
                            <li>Tuy nhiên trong một vài trường hợp cần thi công phức tạp, theo thực trạng thi công sẽ được thông báo và thỏa thuận trực tiếp giữa khách hàng và kỹ thuật viên. Khách hàng sẽ thanh toán trực tiếp chi phí phát sinh cho kỹ thuật viên sau khi việc lắp đặt hoàn thành.</li>
                            <li>Đối với tủ lạnh: Khách hàng khi nhận chỉ cần để tủ lạnh trong 4 tiếng, sau đó cắm điện dùng bình thường mà không cần lắp đặt.</li>
                            <li>Thời gian bộ phận lắp đặt liên hệ (không bao gồm thời gian lắp đặt): Trong vòng 24H kể từ khi nhận hàng (trừ cuối tuần và các ngày lễ).</li>
                            <li>
                                Trong trường hợp khách hàng chưa được liên hệ lắp đặt sau thời gian nêu trên, vui lòng liên hệ qua phần chat hoặc gọi đến hotline{' '}
                                <a className="text-blue-800">
                                    028 888 75668
                                </a>{' '}
                                để được hỗ trợ nhanh nhất có thể.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
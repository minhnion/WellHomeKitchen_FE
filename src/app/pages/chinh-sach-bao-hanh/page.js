
import Link from 'next/link';
import { Pin } from "lucide-react";
import Image from "next/image";
import { CheckCircle } from 'lucide-react';

export default function ChinhSachBaoHanh() {
    return (
        <div className="min-h-screen py-8">
            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                    <Link
                        href="/"
                        className="text-gray-600 font-medium"
                    >
                        Trang chủ
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium">Chính sách bảo hành</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-blue-800 mb-8 ">
                        Chính sách bảo hành
                    </h1>

                    {/* Bosch Policy */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            1. Chính sách và điều kiện bảo hành của Bosch
                        </h2>

                        {/* 1.1 Chính sách bảo hành */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                1.1. Chính sách bảo hành
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    Quý khách hàng sẽ có trách nhiệm đăng ký bảo hành này với trung tâm dịch vụ khách hàng/trung tâm liên lạc của chúng tôi hoặc trên trang web của chúng tôi tùy theo trường hợp áp dụng.
                                </p>
                                <p className="text-gray-700 mb-2">
                                    Trường hợp khách hàng kích hoạt bảo hành trong vòng 7 ngày kể từ ngày nhận hàng thành công: hạn bảo hành tính từ ngày kích hoạt + 36 tháng (3 năm) bảo hành áp dụng cho sản phẩm gia dụng lớn, 24 tháng (2 năm) bảo hành áp dụng cho sản phẩm gia dụng nhỏ.
                                </p>
                                <p className="text-gray-700 mb-2">
                                    Trường hợp khách hàng kích hoạt bảo hành sau 7 ngày kể từ ngày nhận hàng thanh công: hạn bảo hành tính từ ngày mua hàng tại đối tác phân phối + 36 tháng (3 năm) bảo hành áp dụng cho sản phẩm gia dụng lớn, 24 tháng (2 năm) bảo hành áp dụng cho sản phẩm gia dụng nhỏ.
                                </p>


                            </div>
                        </div>

                        {/* 1.2 Điều kiện bảo hành */}
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                1.2. Điều kiện bảo hành
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <p className="font-medium">
                                    Sản phẩm còn trong thời hạn bảo hành và sản phẩm bị hư hỏng do lỗi của nhà sản xuất;
                                </p>

                                <ul className="space-y-3 list-disc ml-6">
                                    <li>Bảo hành được áp dụng khi khách hàng xuất trình được thông tin rõ ràng, tem bảo hành còn nguyên vẹn không có vết tẩy xóa, rách;</li>
                                    <li>Trong thời gian bảo hành, các linh kiện hư hỏng do lỗi của nhà sản xuất sẽ được sửa chữa hoặc thay thế phụ tùng, linh kiện và nhân công sửa chữa miễn phí tại nơi đang sử dụng sản phẩm hoặc tại trung tâm bảo hành của công ty;</li>
                                    <li>Khách hàng được khuyến khích quay video quá trình mở hàng và sử dụng để đảm bảo quyền lợi ở mức cao nhất;</li>
                                    <li>Sản phẩm chỉ được đổi trả sau khi kỹ thuật viên kiểm định lại sản phẩm và xác nhận sản phẩm bị lỗi là từ nhà sản xuất.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 1.3 Phạm vi ngoài bảo hành */}
                        <div>
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                1.3. Phạm vi ngoài bảo hành
                            </h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-start">
                                    <span>Trường hợp sửa, móp, vỡ, biến dạng do lắp đặt, bảo quản, vệ sinh không đúng quy cách hoặc không tuân thủ theo hướng dẫn của nhà sản xuất kèm theo của sản phẩm;</span>
                                </div>
                                <div className="flex items-start">
                                    <span>Trường hợp hư hỏng do tự ý sửa chữa, thay thế linh kiện không chính hãng hoặc thay đổi cấu trúc sản phẩm của nhà sản xuất;</span>
                                </div>
                                <div className="flex items-start">
                                    <span>Trường hợp hỏng do sử dụng thiết bị trong môi trường đặc biệt như nguồn điện không ổn định hoặc do dao động quá khả năng cho phép 220V – 230V/50hz-60hz, hỏng do các nguyên nhân : hỏa hoạn, thiên tai gây ra như (sét đánh, ngập nước, cháy nổ....);</span>
                                </div>
                                <div className="flex items-start">
                                    <span>Trường hợp mất, hỏng các phụ kiện đi kèm như : bóng đèn, mặt kính, bộ lọc, thanh trượt, giá xếp bát đĩa, khay tủ lạnh, ví nướng,... Hoặc hình thức bên ngoài của sản phẩm bị móp méo, trầy xước, ố vàng, han gỉ... trong quá trình sử dụng;</span>
                                </div>
                                <div className="flex items-start">
                                    <span>Trường hợp hư hỏng do côn trùng xâm nhập gây ra như (chuột, gián, mối, côn trùng...);</span>
                                </div>
                                <div className="flex items-start">
                                    <span>Trường hợp tem bảo hành bị rách, tẩy xóa, hoặc bị tháo gỡ ra khỏi sản phẩm.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tefal, Supor, Asiavina Policy */}
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            2. Chính sách và điều kiện bảo hành của TEFAL, SUPOR, Quạt ASIAvina
                        </h2>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                2.1. Thời hạn bảo hành
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <ul className="space-y-3 list-disc ml-6">
                                    <li>Sản phẩm TEFAL & Quạt ASIAvina được bảo hành 24 tháng dựa theo chứng từ mua hàng hoặc được thể hiện trên tem bảo hành hoặc phiếu bảo hành kèm theo sản phẩm. Nhưng không vượt quá 36 tháng căn cứ theo ngày sản xuất sản phẩm.</li>
                                    <li>Sản phẩm Điện gia dụng SUPOR được bảo hành 12 tháng dựa theo chứng từ mua hàng hoặc được thể hiện trên tem bảo hành hoặc phiếu bảo hành kèm theo sản phẩm. Nhưng không vượt quá 24 tháng căn cứ theo ngày sản xuất sản phẩm.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                2.2. Hình thức bảo hành
                            </h3>
                            <p className="font-medium">
                                Để được bảo hành sửa chữa sản phẩm, khách hàng mang sản phẩm đến các Trung tâm bảo hành ủy quyền của Công ty Quạt Việt Nam trên toàn quốc.
                            </p>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                2.3. Điều kiện sản phẩm trong bảo hành
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Sản phẩm còn trong hạn bảo hành tại thời điểm khách hàng yêu cầu, áp dụng như mục 2.1.</li>
                                <li>Sản phẩm bị hư hỏng do chất lượng linh kiện hay do lỗi kỹ thuật từ quá trình sản xuất.</li>
                                <li>Có phiếu bảo hành với đầy đủ thông tin. Số sê ri, kiểu máy, tháng mua hàng, tháng sản xuất trên sản phẩm phải còn nguyên vẹn, không bị cạo sửa, chắp vá, hay bị dán đè lên bằng bất kỳ vật nào khác.</li>
                                <li>Trong trường hợp cần thiết, khách hàng phải xuất trình hóa đơn mua hàng.</li>
                                <li>Một số linh phụ kiện đi kèm sản phẩm chỉ áp dụng thời gian bảo hành riêng theo quy định của nhà cung cấp linh phụ kiện như: bình ắc quy, pin, điều khiển từ xa...</li>
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                2.4. Điều kiện sản phẩm ngoài bảo hành
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Sản phẩm đã hết hạn bảo hành như mục 2.1.</li>
                                <li>Sản phẩm bị hư do thiên tai, hỏa hoạn, lụt lội, sét đánh, côn trùng vào, đặt máy nơi bụi bẩn, ẩm ướt và nhiệt độ cao, có vết mốc, rỉ sét, oxy hóa hay dùng sai điện thế chỉ định</li>
                                <li>Sản phẩm bị hư hỏng do lỗi sử dụng, lắp đặt bảo trì, sử dụng không đúng mục đích thiết kế, sản phẩm gia dụng nhưng được sử dụng chuyên nghiệp hoặc thương mại.</li>
                                <li>Khách hàng gây nên những khuyết tật như biến dạng, nứt vỡ, trầy xước, gãy...</li>
                                <li>Sản phẩm có dấu hiệu đã tháo lắp, sửa chữa thay thế linh kiện ở những nơi khác không thuộc hệ thống Trung tâm ủy quyền chính thức của Công ty Quạt Việt Nam.</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            3. Chính sách và điều kiện bảo hành của Philips Massager
                        </h2>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-black-800 mb-4">
                                3.1. Thời hạn bảo hành
                            </h3>
                            <div className="space-y-4 text-gray-700">
                                <p className="font-medium">
                                    Chính sách bảo hành Philips Massager:
                                </p>

                                <ul className="space-y-3 list-disc ml-6">
                                    <li>Bảo hàng 24 tháng</li>
                                    <li>1 đổi 1 trong vòng 30 ngày nếu lỗi do nhà sản xuất</li>
                                </ul>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <p className="font-medium">
                                    Trung tâm bảo hành
                                </p>

                                <ul className="space-y-3 list-disc ml-6">
                                    <li>Địa chỉ: 21-23 Chánh Hưng, KDC Đại Phúc Green Villas, xã Bình Hưng, Bình Chánh</li>
                                    <li>SĐT liên hệ: 0902541431</li>
                                </ul>
                            </div>
                            <div className="text-gray-700 flex items-start gap-2">
                                <Pin size={16} className="text-red-600 mt-0.5" />
                                Quý khách vui lòng thanh toán phí vận chuyển 1 chiều gửi đi bảo hành...
                            </div>
                            <Image
                                src="/images/bao-hanh-san-pham.png"
                                alt="Bảo hành sản phẩm"
                                width={480}
                                height={480}
                            />
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                3.2. Điều kiện bảo hành áp dụng cho thân máy và phụ kiện
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Tình trạng sản phẩm tại thời điểm bảo hành không có dấu hiệu móp méo, rơi vỡ, nứt, va đập, chập chấy, sản phẩm bị ngâm trong nước hoặc bị nước tác động vào, ẩm mốc do hóa chất…</li>
                                <li>Sẩn phẩm bị hỏng hóc do lỗi nhà sản xuất trong điều kiện sử dụng bình thường.</li>
                                <li>Sản phẩm phát sinh lỗi kỹ thuật ảnh hưởng đến khả năng hoạt động và tình trạng của thiết bị. Lỗi kỹ thuật là do lỗi do quy trình sản xuất sản phẩm từ nhà sản xuất, không bao gồm các lỗi phát sinh do quá trình sử dụng sai quy cách, lỗi phần mềm hoặc do chập cháy, thiên tai, tai nạn,vv…</li>
                                <li>Không có dấu hiệu tự ý mở hoặc sửa chữa tại đơn vị không được ủy quyền.</li>
                                <li>Màn hình không nứt vỡ, bị chảy mực có màu xanh, có điểm chết màn hình kích thước từ 1mm hoặc 2 điểm chết trở lên, màn hình không bị bụi bẩn trong màn hình, màn hình bị lỏng lẻo.</li>
                                <li>Phụ kiện còn nguyên vẹn không đứt gãy, móp méo hay rơi vỡ.</li>
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                3.3. Các trường hợp không được bảo hành
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Không được bảo hành nếu không có “Hóa đơn mua hàng”, “Phiếu bảo hành” hay “Thông tin mua hàng”.</li>
                                <li>Model sản phẩm, số serial, ngày sản xuất trên sản phẩm đã bị thay đổi, xóa hoặc không đọc được.</li>
                                <li>Sản phẩm được mua dưới dạng hàng lỗi.</li>
                                <li>Sản phẩm bị thay đổi, điều chỉnh bởi bên thứ ba không thuộc hệ thống trung tâm bảo hành Philips.</li>
                                <li>Không bảo hành tất cả các trường hợp có dấu hiệu han rỉ, ẩm mốc , vào nước, quỳ tím bị mất hoặc đổi màu đỏ; áp dụng với tất cả các sản phẩm kể cả có tính năng chống nước.</li>
                                <li>Không bảo hành với màn hình: bị chảy mực, loang màu, có bằng hoặc nhỏ hơn 3 điểm chết.</li>
                                <li>Không bảo hành gẫy, cong chân sạc, chân usb trong mọi trường hợp.</li>
                                <li>Các bộ phận có thể tiêu hao trong quá trình sử dụng, chẳng hạn như pin hoặc lớp bảo vệ được thiết kế để hao mòn theo thời gian, trừ khi xảy ra sự cố do lỗi về vật liệu hoặc gia công.</li>
                                <li>Hư hại do tai nạn, lạm dụng, sử dụng sai, hỏa hoạn, động đất hoặc nguyên nhân bên ngoài khác.</li>
                                <li>Hư hỏng do tác động cơ học (rơi, vỡ, va đập, trầy xước, sứt viền, móp méo, màn hình chảy mực, cong khung…), ẩm mốc, hoen rỉ, ngấm nước hoặc do hỏa hoạn, chập cháy, thiên tai gây nên….</li>
                                <li>Sản phẩm, thiết bị đi kèm, hoặc bao bì có thay đổi về hình dạng, kích thước, quy cách do quy trình sản xuất của nhà sản xuất không thuộc phạm vi bảo hành của công ty</li>
                            </ul>

                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                3.4. Sản phẩm bảo hành
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Đối với sản phẩm còn trong thời gian đổi trả (30 ngày đầu): Khách hàng được đổi sản phẩm mới 100%, không bao gồm các phụ kiện bị khấu hao.</li>
                                <li>Đối với sản phẩm hết thời gian đổi trả (còn thời gian bảo hành): Đổi sản phẩm tương đương sản phẩm khác hoặc thay thế sửa chữa các bộ phận hư hỏng.</li>
                            </ul>
                            <div className="text-xl font-semibold text-blue-800 mb-4">Hình thức bảo hành</div>
                            <p>Quý khách hàng có thể liên hệ tổng đài chăm sóc khách hàng để thực hiện bảo hành sửa chữa sản phẩm thông qua số Hotline 028 8887 5668 nếu sản phẩm có lỗi kỹ thuật.</p>
                        </div>

                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            4. Chính sách và điều kiện bảo hành của Toshiba
                        </h2>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                4.1. Thời hạn bảo hành
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-800">
                                <li><strong>Tủ lạnh:</strong> 24 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Máy giặt và Máy giặt sấy:</strong> 24 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Máy sấy:</strong> 24 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Điều hòa không khí:</strong> 36 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Bình tắm nước nóng:</strong> 24 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Máy nước nóng lạnh:</strong> 12 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Máy lọc nước:</strong> 12 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Dòng máy lọc nước OriginPure:</strong> 24 tháng kể từ ngày mua hàng.</li>
                                <li><strong>Điện gia dụng nhỏ</strong> (Nồi cơm điện, Phích điện, Lò vi sóng, Máy hút bụi, Quạt điện, v.v.): 12 tháng kể từ ngày mua hàng.</li>
                            </ul>

                            <p className="mt-3 font-semibold">
                                Lưu ý: Khách hàng cần kích hoạt bảo hành trong vòng 14 ngày sau khi mua hàng để đảm bảo quyền lợi bảo hành.
                            </p>

                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                4.2. Hướng dẫn kích hoạt bảo hành
                            </h3>
                            <ul className="list-disc pl-6 space-y-2 text-gray-800">
                                <li>
                                    Đăng ký trực tuyến tại:{" "}
                                    <a
                                        href="https://www.toshiba-lifestyle.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black-600 hover:text-red-500 active:text-red-600 transition-colors underline"
                                    >
                                        https://www.toshiba-lifestyle.com
                                    </a>
                                </li>

                                <li>
                                    Gọi điện đến tổng đài miễn phí:{" "}
                                    <span className="font-semibold text-gray-900">18001529</span>
                                </li>

                                <li>
                                    Đăng ký qua kênh Zalo chính thức:{" "}
                                    <span className="font-semibold text-gray-900">
                                        "Bảo hành Toshiba Lifestyle Việt Nam"
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                4.3. Địa điểm bảo hành
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Tủ lạnh, Máy giặt, Điều hòa không khí và Thiết bị nước được bảo hành tại các trung tâm bảo hành ủy quyền của Toshiba hoặc tại nhà nếu địa chỉ khách hàng trong phạm vi 50 km từ trung tâm tỉnh/thành phố trực thuộc trung ương.​</li>
                                <li>Hàng điện gia dụng nhỏ và Sản phẩm thay thế chỉ được bảo hành tại các trung tâm bảo hành ủy quyền của Toshiba.</li>
                            </ul>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                4.4. Các hình thức và điều kiện bảo hành
                            </h3>
                            <h4>Sửa chữa hoặc thay thế phụ tùng, linh kiện miễn phí nếu khách hàng đáp ứng đầy đủ các điều kiện sau:</h4>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Sản phẩm còn trong Thời Hạn Bảo Hành.​</li>
                                <li>Sản phẩm được sử dụng đúng mục đích, công năng và theo cách thức phù hợp với hướng dẫn của nhà sản xuất.</li>
                                <li>Những hư hỏng, lỗi của sản phẩm được kết luận là do hư hỏng hoặc lỗi linh kiện hoặc do lỗi kỹ thuật từ nhà sản xuất.</li>
                                <li>Số máy và tem niêm phong trên sản phẩm phải còn nguyên vẹn không bị rách, cạo sửa hoặc mất đi.</li>
                                <li>Đối với máy điều hòa không khí, vị trí lắp đặt thiết bị trong nhà, vị trí lắp đặt thiết bị ngoài trời phải đảm bảo đúng kỹ thuật và an toàn, không lắp đặt ở vị trí nguy hiểm cho việc sử dụng và bảo dưỡng. Trong trường hợp khó tiếp cận thiết bị để thực hiện việc bảo trì bảo dưỡng, khách hàng vui lòng thuê các dụng cụ an toàn và chịu các chi phí phát sinh đảm bảo an toàn cho nhân viên kỹ thuật.</li>
                            </ul>
                            <h4>Đổi sản phẩm mới tương tự cho khách hàng trong các trường hợp sau:</h4>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Hết thời gian thực hiện việc bảo hành mà không sửa chữa được hoặc không khắc phục được lỗi của sản phẩm.​</li>
                                <li>Đã thực hiện bảo hành nhiều lần trong Thời Hạn Bảo Hành mà vẫn không khắc phục được lỗi. Việc xác định số lần bảo hành đã thực hiện làm căn cứ đổi sản phẩm mới tương tự sẽ được các bên thỏa thuận tùy theo từng trường hợp cụ thể.</li>
                                <li>Hình thức đổi sản phẩm mới: đổi sản phẩm cùng loại và có tính năng tương tự hoặc đổi sản phẩm cùng loại nhưng có tính năng cao cấp hơn. Tùy theo tình hình thực tế, các bên sẽ thỏa thuận về giá trị còn lại của sản phẩm hư hỏng bị thay thế để làm căn cứ đổi sản phẩm mới tương tự theo điều này. Theo đó, các bên sẽ thống nhất số tiền chênh lệch giữa giá của sản phẩm mới thay thế và sản phẩm lỗi bị thay thế mà một bên cần thanh toán lại cho bên kia tại thời điểm đổi sản phẩm.</li>
                            </ul>
                            <h4>Tất cả các phụ tùng, linh kiện hoặc sản phẩm bị lỗi, hư hỏng hoặc khuyết tật bị thay thế theo điều khoản bảo hành này sẽ trở thành tài sản của TVCP.</h4>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">
                                4.5. Các trường hợp không được bảo hành:
                            </h3>
                            <ul className="space-y-3 list-disc ml-6">
                                <li>Sản phẩm không còn trong Thời Hạn Bảo Hành.​</li>
                                <li>Sản phẩm không được sử dụng đúng mục đích, công năng và theo cách thức phù hợp với hướng dẫn của nhà sản xuất.</li>
                                <li>Sản phẩm sử dụng cho mục đích kinh doanh hoặc quá định mức thiết kế của nhà sản xuất.</li>
                                <li>Vỏ máy và các phụ kiện kèm theo của sản phẩm bảo hành không nằm trong danh mục được bảo hành miễn phí.</li>
                                <li>Sản phẩm hư hỏng do sự tác động của các yếu tố bên ngoài như: thiên tai, lũ lụt, sấm sét, hỏa hoạn, tai nạn, sử dụng sai hướng dẫn, nguồn điện không thích hợp, nứt bể hay va chạm do vận chuyển, bảo quản sản phẩm không tốt.</li>
                                <li>Sản phẩm có dấu hiệu sửa chữa trước ở những nơi không nằm trong hệ thống bảo hành do TVCP ủy quyền.</li>
                                <li>Hư hỏng do quá trình lắp đặt và sử dụng không đúng tiêu chuẩn kỹ thuật, quy định an toàn của sản phẩm.</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            6. Chính sách và điều kiện bảo hành của Halio
                        </h2>

                        <div className="mb-6">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    6.1. Thời hạn bảo hành:
                                </h3>
                                <p className="text-gray-700">
                                    12 tháng kể từ ngày mua hàng.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    6.2. Chính sách bảo hành:
                                </h3>
                                <p className="text-gray-700">
                                    Trong thời gian bảo hành, nếu sản phẩm gặp lỗi do nhà sản xuất, khách hàng sẽ được đổi mới sản phẩm.
                                </p>
                            </div>
                        </div>


                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                6.3. Hướng dẫn kích hoạt bảo hành
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>
                                    Đăng ký trực tuyến tại:{" "}
                                    <a
                                        href="https://hallo-sonic.com/pages/warranty-registration"
                                        className="text-black-600 hover:text-red-800"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://hallo-sonic.com/pages/warranty-registration
                                    </a>
                                </li>
                                <li>Hướng dẫn yêu cầu bảo hành:</li>
                                <ul className="ml-6 list-disc">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                        <span>
                                            Điền thông tin yêu cầu tại:{" "}
                                            <a
                                                href="https://hallo-sonic.com/pages/warranty-request"
                                                className="text-black-600 hover:text-red-800"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                https://hallo-sonic.com/pages/warranty-request
                                            </a>
                                        </span>
                                    </li>
                                </ul>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            7. Chính sách và điều kiện bảo hành của Philips
                        </h2>
                        <div className="mb-6">
                            <div className="flex flex-wrap items-baseline gap-2">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    7.1. Thời hạn bảo hành:
                                </h3>
                                <p className="text-gray-700">
                                    24 tháng kể từ ngày mua hàng.
                                </p>
                            </div>
                        </div>


                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                7.2. Hướng dẫn đăng ký bảo hành
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>
                                    Đăng ký sản phẩm tại:{" "}
                                    <a
                                        href="https://www.philips.com.vn/myphilips/register-your-product"
                                        className="text-black-600 hover:text-red-800"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://www.philips.com.vn/myphilips/register-your-product
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                7.3. Thông tin trung tâm bảo hành
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>
                                    Danh sách trung tâm bảo hành cập nhật tại:{" "}
                                    <a
                                        href="https://www.philips.com/c-dam/b2c/suj/vn/supporthome/Danh-sach-trung-tam-bao-hanh-Philips-Cap-nhat-20191121.pdf"
                                        className="text-black-600 hover:text-red-800"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        https://www.philips.com/c-dam/b2c/suj/vn/supporthome/Danh-sach-trung-tam-bao-hanh-Philips-Cap-nhat-20191121.pdf
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                7.4. Sản phẩm và thời gian bảo hành
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>Bảo hành 2 năm kể từ ngày mua nhưng không quá 36 tháng từ ngày sản xuất cho các sản phẩm điện gia dụng, chăm sóc cá nhân, chăm sóc Mẹ và Bé.</li>
                                <li>Sản phẩm còn trong Hạn Bảo Hành tính từ Ngày Mua (Nếu không ghi ngày mua thì tính theo ngày sản xuất)</li>
                                <li>Phiếu Bảo Hành được điền đầy đủ thông tin yêu cầu: Tên sản phẩm, số máy, điện thoại, người mua hàng, nơi mua hàng và phiếu mua hàng (hóa đơn).</li>
                                <li>Lỗi sản phẩm do linh kiện hoặc lỗi sản xuất.</li>
                                <li>Bảo hành tại nhà đối với bàn ủi hệ thống GC7035, GC9247, GC9642 (áp dụng đối với khu vực nội thành TP.HCM, Hà Nội). Liên hệ tổng đài: 1800 5999 88.</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                7.5. Điều khoản từ chối bảo hành
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>Rách hoặc mài mòn, sử dụng hao mòn theo thời gian.</li>
                                <li>Sản phẩm hư hại do thiên tai hoặc trong trường hợp bất khả kháng; hỏa hoạn, lụt bão, sét đánh, động đất...</li>
                                <li>Sản phẩm hư hỏng do vận chuyển, sử dụng sai nguồn điện, các mối tiếp điện không tốt, nguồn nước bị ô nhiễm hoặc dơ bẩn, làm rơi, va chạm, bảo quản không tốt như để nước, bụi, cặn bẩn, động vật, côn trùng, vật lạ...vào máy.</li>
                                <li>Sản phẩm được lắp đặt, duy trì, hoạt động vượt mức qui định của tài liệu hướng dẫn sử dụng của Philips gây ra hư hỏng.</li>
                                <li>Sản phẩm bị thay đổi, điều chỉnh sửa chữa bởi bên thứ ba không thuộc hệ thống ủy quyền của Philips.</li>
                                <li>Khách hàng gây nên những khuyết tật như biến dạng, nứt vỡ, trầy xước.</li>
                                <li>Sản phẩm hết hạn bảo hành (24 tháng hoặc 36 tháng từ ngày sản xuất tùy theo điều kiện nào đến trước).</li>
                                <li>Các phụ kiện kèm theo sản phẩm, phụ kiện điện gia dụng.</li>
                                <li>Không điền đầy đủ thông tin vào phiếu bảo hành hoặc phiếu bảo hành không còn 3 phiếu sửa chữa trong lần đầu tiên hoặc bị cạo sửa, xóa mất.</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                7.6. Chương trình 1 đối 1
                            </h3>
                            <ul className="space-y-2 ml-4 list-disc">
                                <li>Chương trình 1 đối 1: áp dụng cho tất cả model do Philips phân phối tại Việt Nam</li>
                                <li>Nồi cơm điện: kéo dài đến khi nào có thông báo mới</li>
                                <ul className="ml-6 list-disc">
                                    <li>Đổi mới trong năm đầu tiên nếu bị lỗi kỹ thuật</li>
                                    <li>Năm thứ 2 sẽ được bảo hành theo chính sách Philips</li>
                                </ul>
                                <li>Máy sấy tóc: áp dụng cho tất cả model do Philips phân phối tại Việt Nam</li>
                                <ul className="ml-6 list-disc">
                                    <li>Trong thời gian bảo hành 2 năm kể từ ngày mua. Nếu sản phẩm bị lỗi kỹ thuật sẽ được đổi ngay sản phẩm mới hoặc model tương đương.</li>
                                </ul>
                            </ul>

                            <h4 className="mt-3">Điều kiện đổi sản phẩm: Sản phẩm phải có Phiếu Bảo Hành chính hãng được điền đầy đủ thông tin khách hàng và kèm theo Hóa đơn/phiếu mua hàng</h4>


                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-blue-800 mb-6">
                            8. Chính sách và điều kiện bảo hành của LARQ, SKULLCANDY, SATECHI, MATADOR, THERABODY
                        </h2>
                        <ul className="space-y-2 ml-4 list-disc">
                            <li>Bảo hành 1 đối 1 trong vòng 12 tháng nếu có lỗi từ nhà sản xuất.</li>
                            <li>Hình thức bảo hành gồm: sửa chữa, thay thế linh kiện, đổi mới không tính phí.</li>
                            <li>Trong trường hợp đổi sản phẩm, tùy theo điều kiện tồn kho, phía Hằng có thể đổi sản phẩm cùng model hoặc tương đương về tính năng.</li>
                            <li>Trước khi mang sản phẩm đến, khách hàng phải gỡ bỏ tất cả các linh kiện, phụ kiện, thiết bị gắn thêm không được cung cấp hoặc bảo hành theo sản phẩm. Phía Hằng sẽ không chịu trách nhiệm về sự hư hỏng hoặc mất mát của chúng (nếu có) trong quá trình sửa chữa.</li>
                            <li>Các sản phẩm không đủ điều kiện bảo hành hoặc hết hạn bảo hành sẽ được sửa chữa dạng tính phí.</li>
                            <li>Sản phẩm sau khi hoàn trả lại khách hàng mà không phải sửa chữa gì có thể sẽ phải chịu phí kiểm tra.</li>
                        </ul>

                        <div className="mt-6">
                            <h3 className="text-xl font-semibold text-black-600 mb-4">
                                CÁC ĐIỀU KHOẢN TỪ CHỐI BẢO HÀNH
                            </h3>
                            <ol className="space-y-3 ml-4 list-decimal">
                                <li>Sản phẩm hết hạn bảo hành.</li>
                                <li>Sản phẩm bị thay đổi hoặc sửa chữa tại các nơi không được chỉ định bởi Hằng</li>
                                <li>Hư hỏng do thiên tai, tai nạn hoặc lắp đặt, sử dụng sai hướng dẫn của nhà sản xuất. (Ví dụ: Có vết sét đánh, đánh rơi điện hoặc chất lỏng vào bên trong sản phẩm; Sản phẩm bị nứt vỡ; Vận chuyển hoặc bảo dưỡng sản phẩm sai hướng dẫn; Sử dụng sản phẩm trong môi trường quá bẩn, ẩm ướt, nhiệt độ cao hoặc vượt quá giới hạn IP liên quan; Có vết mốc, rỉ sét, ăn mòn, oxy hóa...).</li>
                                <li>Hư hỏng do các loại động vật chui vào trong sản phẩm.</li>
                                <li>Hư hỏng sản phẩm phát sinh do việc dùng kết hợp với các phụ kiện, sản phẩm, phần mềm, thiết bị phụ thuộc, thiết bị ngoại vi khác không chính hãng.</li>
                                <li>Sản phẩm bị hỏng do sử dụng không đúng điện áp hoặc nguồn điện áp địa phương thay đổi bất thường. Từ chối các bảo hành các phụ kiện bên ngoài hoặc dùng sai hướng dẫn sử dụng...</li>
                                <li>Sản phẩm không có dữ liệu bảo hành trên hệ thống dữ liệu chúng tôi; không có Phiếu bảo hành; hoặc có Phiếu bảo hành nhưng không hợp lệ (Ví dụ: Thông tin trên phiếu không được điền đầy đủ, bị tẩy xóa hoặc sửa lại).</li>
                                <li>Nhãn ghi model, số seri/ IMEI của sản phẩm bị rách và/hoặc không đọc được, hoặc bị cạo sửa, thay đổi, tẩy sửa.</li>
                                <li>Tem niêm phong trên sản phẩm (với các sản phẩm có tem niêm phong) bị rách, vỡ.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
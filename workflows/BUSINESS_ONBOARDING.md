# Thiết lập workflow cho một doanh nghiệp

## Mô hình sử dụng

Workflow và skills dùng chung, còn dữ liệu và cấu hình thuộc từng doanh nghiệp. TinaCRM là nền tảng CRM hiện được định hướng tích hợp, không phải tên doanh nghiệp sử dụng workflow.

Ở phiên bản hiện tại, mỗi doanh nghiệp dùng một bản clone/thư mục riêng và một Claude Project riêng. Không dùng chung `product-marketing.md`, inputs, outputs hoặc cấu hình kết nối giữa các doanh nghiệp. Đây chưa phải ứng dụng nhiều tenant dùng chung một runtime.

## Cách Claude thiết lập

Áp dụng `rules/nontechnical_user_experience.md`: danh sách bên dưới là checklist nội bộ cho Claude, không phải biểu mẫu đưa nguyên cho người dùng. Hỏi lần lượt một việc, dùng lựa chọn đánh số; Claude chuyển câu trả lời đơn giản thành cấu hình bằng công cụ có sẵn. Khi cần kết nối kỹ thuật, hướng dẫn từng thao tác hoặc giúp chuyển yêu cầu cho người hỗ trợ thiết lập.

1. Xác định doanh nghiệp đang được phục vụ, nhận tài liệu công ty, sản phẩm và case study. Chỉ hỏi phần chưa có trong tài liệu.
2. Tổng hợp `product-marketing.md`, đề xuất thị trường/ngách và ICP; xác nhận sản phẩm trọng tâm với người dùng.
3. Sao chép `config/business.example.json` thành `config/business.json` qua công cụ đọc/ghi file nếu đã kết nối; nếu chưa có, cung cấp cấu hình để người dùng lưu. `null` và danh sách rỗng là thông tin chưa được thiết lập, không phải giá trị hợp lệ để chạy tác vụ tương ứng.
4. Hỏi mục tiêu lead/ngày, nguồn tìm kiếm và quyền truy cập công cụ khi thiết lập thu thập lead.
5. Hỏi địa chỉ TinaCRM, ưu tiên kết nối MCP native theo `TINACRM_CONNECTION.md`. Hướng dẫn đăng nhập/cấp quyền hoặc nhờ người hỗ trợ cấu hình API key có Role và thời hạn. REST/MCP xác định workspace từ token/ngữ cảnh đã xác thực; không yêu cầu nhập workspace ID riêng. Khám phá và ánh xạ trường theo schema thực tế. Tham chiếu credential, không lưu secret trong hồ sơ.
6. Hỏi hộp thư gửi/nhận, giọng điệu, số email, khoảng cách từng lần gửi và thời gian chờ cuối chuỗi. Mỗi bước trong `email.sequence_steps` cần có `step` và `delay_days` (khoảng cách so với bước trước; bước đầu tính từ lúc bắt đầu chăm sóc). Các chuỗi 3 hoặc 4 email trong tài liệu chỉ là ví dụ.
7. Hỏi lịch chạy, múi giờ và phương thức thực thi cục bộ thực sự hỗ trợ. Hỏi người nhận báo cáo, ngày và giờ gửi. Không mặc định người nhận hoặc lịch từ doanh nghiệp khác.
8. Kiểm tra kết nối và các tham số cần thiết cho bước sắp chạy; lưu câu trả lời và tiếp tục các bước độc lập khi có thể. Chỉ ghi hoàn tất thao tác khi công cụ trả kết quả thực tế.

## Quy tắc dữ liệu

- Mục tiêu số lượng, thị trường, ICP, ngôn ngữ/giọng điệu, số email và người nhận báo cáo phải theo doanh nghiệp/chiến dịch hiện tại.
- `product-marketing.md` cần xác định tên doanh nghiệp và nguồn tài liệu. Không dùng thông tin của doanh nghiệp khác để bổ sung dữ liệu thiếu.
- Trước thao tác CRM/email, đối chiếu doanh nghiệp hiện tại, workspace và hộp thư được cấu hình. Nếu không rõ thì hỏi trước khi thực hiện.
- Ánh xạ trường do schema workspace quyết định; không coi mọi khách hàng TinaCRM có cùng custom fields.
- File cấu hình hiện là hợp đồng thiết lập cho Claude/connector sẽ triển khai, chưa được các script mẫu tự động đọc.

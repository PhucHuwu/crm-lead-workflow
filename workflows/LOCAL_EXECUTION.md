# Kiến trúc thực thi cục bộ với Claude Desktop

## Phạm vi đã chốt

- Giao diện là Claude Code trong Desktop, tab Code → Local → thư mục workflow. Claude đọc/ghi và chạy lệnh theo quyền/công cụ thực tế; người dùng xử lý đăng nhập và thao tác ngoài quyền. Filesystem MCP không bắt buộc cho đọc project Local.

- Người dùng sử dụng Claude Desktop để thiết lập, điều phối và thực hiện quy trình BD cho doanh nghiệp của mình. Workflow/skills dùng chung; kiến thức và cấu hình được thiết lập riêng theo `BUSINESS_ONBOARDING.md`.
- Các MCP server, connector và công cụ thực thi chạy trực tiếp trên máy người dùng. TinaCRM và dịch vụ email được truy cập qua kết nối hiện có.
- Không yêu cầu triển khai thêm server automation, n8n cloud hoặc dịch vụ AI chạy nền trên server.
- Không xử lý yêu cầu hoạt động khi máy người dùng tắt.
- Các tham số chưa biết được Claude hỏi trong bước thiết lập tương ứng và lưu lại để tránh hỏi lặp. Không yêu cầu secret trong chat.

## Các thành phần

```text
Claude Desktop: kiến thức doanh nghiệp + kiến thức TinaCRM + skills + workflow
                         |
                 MCP / connector cục bộ
                         |
          +--------------+----------------+
          |              |                |
    Nguồn tìm lead    TinaCRM        Gửi và đọc email
          |              |                |
          +--------------+----------------+
                         |
               Báo cáo + trạng thái tác vụ
```

Claude cần kiểm tra công cụ thực sự được kết nối trước khi thực hiện. Project Knowledge không tự đọc thư mục trên máy; cần upload tài liệu hoặc connector đọc file hỗ trợ định dạng tương ứng. File mô tả vai trò không tự tạo subagent; chỉ gọi subagent khi môi trường có công cụ hỗ trợ, nếu không thì xử lý tuần tự theo vai trò.

## Hai hình thức thực thi

1. **Trong phiên chat:** người dùng yêu cầu chạy quy trình; Claude gọi các công cụ cục bộ và báo kết quả thực tế.
2. **Theo lịch cục bộ:** cấu hình cơ chế scheduled tasks mà phiên bản/chế độ Claude Desktop hỗ trợ, hoặc bộ lập lịch trên máy gọi công cụ thực thi đã được triển khai. Cần kiểm tra khả năng kích hoạt và kết nối công cụ trước khi cam kết tự chạy.

Không coi việc thêm ngày giờ vào prompt, cài MCP hay import SKILL.md là đã tạo lịch tự động. Bộ lập lịch hệ điều hành không tự điều khiển một phiên chat Claude Desktop. Nếu tác vụ theo lịch cần suy luận AI, phải xác định cơ chế thực thi AI thực tế; không mặc định có API hay có thể dùng gói Desktop để gọi API.

## Luồng nghiệp vụ

1. Đọc tài liệu doanh nghiệp, sản phẩm/dịch vụ và case study; đối chiếu kiến thức/schema workspace TinaCRM được cấu hình.
2. Đề xuất thị trường/ngách, chốt ICP và tiêu chí loại trừ với người dùng.
3. Mục tiêu mỗi ngày lấy từ cấu hình chiến dịch: lead mới đạt chuẩn, có nguồn, đã lọc trùng; báo số thực tế nếu không đủ.
4. Nhập/cập nhật lead theo schema TinaCRM; lưu ID bản ghi để đọc lại và theo dõi.
5. Đọc lead từ TinaCRM, xây chuỗi email theo cấu hình chiến dịch. Số email, khoảng cách gửi, hộp thư và múi giờ được hỏi khi thiết lập; chuỗi 3 hoặc 4 email chỉ là ví dụ.
6. Đọc hộp thư phản hồi bằng connector. Lưu Message-ID/thread ID khi gửi và ID email nhận đã xử lý. Phản hồi thật dừng chuỗi và tạo task; trả lời tự động, bounce và yêu cầu ngừng liên hệ được xử lý riêng.
7. Chỉ đánh dấu không phản hồi khi hết chuỗi và thời gian chờ. Tránh gửi trùng và tạo task trùng khi chạy lại.
8. Tổng hợp báo cáo tuần cho danh sách người nhận trong cấu hình doanh nghiệp; hỏi người nhận, ngày, giờ và múi giờ gửi. Không tự tạo số liệu chưa đo được.

## Trạng thái triển khai

Đây là đặc tả kiến trúc, chưa phải bộ thực thi hoàn chỉnh. Cấu hình MCP hiện tại chỉ có filesystem và fetch; chưa cung cấp connector TinaCRM, gửi/đọc email hay bộ chạy lịch. Script thu thập hiện tại sinh dữ liệu demo, không dùng để nhập lead thật. Skills hướng dẫn nghiệp vụ không thay thế các connector đó.

## Thứ tự triển khai

1. Kiểm tra schema/API TinaCRM và phiên bản/chế độ Claude Desktop khách sử dụng.
2. Xây connector cục bộ cho TinaCRM, nguồn lead và email hai chiều.
3. Kiểm chứng một luồng trong chat: tìm lead → nhập/đọc TinaCRM → gửi thử → nhận phản hồi → tạo task.
4. Thiết lập và kiểm chứng lịch chạy cục bộ, lưu trạng thái và xử lý chạy lại.
5. Đóng gói hướng dẫn cài đặt, skills và workflow cho khách.

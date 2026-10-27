# Kiến trúc thực thi cục bộ với trợ lý AI (Claude Code / Codex)

## Phạm vi đã chốt

- Giao diện là trợ lý chạy trên máy trong thư mục workflow: Claude Code (Claude Desktop → Code → This computer) hoặc Codex (ChatGPT desktop app → Codex → Local), theo `ASSISTANT_SETUP.md`. Trợ lý đọc/ghi và chạy lệnh theo quyền/công cụ thực tế; người dùng xử lý đăng nhập và thao tác ngoài quyền. Filesystem MCP không bắt buộc cho đọc project Local.

- Người dùng sử dụng Claude Desktop hoặc ChatGPT desktop app để thiết lập, điều phối và thực hiện quy trình BD cho doanh nghiệp của mình. Workflow/skills dùng chung; kiến thức và cấu hình được thiết lập riêng theo `BUSINESS_ONBOARDING.md`.
- Các MCP server, connector và công cụ thực thi chạy trực tiếp trên máy người dùng. TinaCRM được truy cập qua REST API (`scripts/tinacrm_rest.py`), dịch vụ email qua connector (Claude) hoặc plugin (ChatGPT/Codex) hiện có.
- Không yêu cầu triển khai thêm server automation, n8n cloud hoặc dịch vụ AI chạy nền trên server.
- Không xử lý yêu cầu hoạt động khi máy người dùng tắt.
- Các tham số chưa biết được trợ lý hỏi trong bước thiết lập tương ứng và lưu lại để tránh hỏi lặp. Không yêu cầu secret trong chat.

## Các thành phần

```text
Trợ lý (Claude Code / Codex): kiến thức doanh nghiệp + kiến thức TinaCRM + skills + workflow
                         |
            MCP / connector / plugin cục bộ
                         |
          +--------------+----------------+
          |              |                |
    Nguồn tìm lead    TinaCRM        Gửi và đọc email
          |              |                |
          +--------------+----------------+
                         |
               Báo cáo + trạng thái tác vụ
```

Trợ lý cần kiểm tra công cụ thực sự được kết nối trước khi thực hiện. Trợ lý đọc trực tiếp thư mục đã chọn; PDF quét, Word, slide có thể cần công cụ trích xuất riêng. File mô tả vai trò không tự tạo subagent; Claude Code có thể giao vai trò cho subagent khi môi trường hỗ trợ; Codex chỉ tạo subagent khi người dùng yêu cầu. Mặc định xử lý tuần tự theo vai trò.

## Hai hình thức thực thi

1. **Trong phiên chat:** người dùng yêu cầu chạy quy trình; trợ lý gọi các công cụ cục bộ và báo kết quả thực tế.
2. **Theo lịch cục bộ:** trợ lý tự tạo lịch cục bộ trong phiên (scheduled task của Claude Desktop hoặc Scheduled của ChatGPT desktop app) theo `workflows/SCHEDULING.md`. Chỉ báo đã đặt lịch khi công cụ trả về thành công.

Không coi việc thêm ngày giờ vào prompt, cài MCP hay import SKILL.md là đã tạo lịch tự động. Bộ lập lịch hệ điều hành không tự điều khiển một phiên của ứng dụng trợ lý. Nếu tác vụ theo lịch cần suy luận AI, phải xác định cơ chế thực thi AI thực tế; không mặc định có API hay có thể dùng gói ứng dụng desktop để gọi API.

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

Đây là đặc tả kiến trúc, chưa phải bộ thực thi hoàn chỉnh. Cấu hình MCP hiện tại chỉ có filesystem và fetch; TinaCRM dùng REST qua `scripts/tinacrm_rest.py`; chưa có gửi/đọc email hay bộ chạy lịch. Script thu thập hiện tại sinh dữ liệu demo, không dùng để nhập lead thật. Skills hướng dẫn nghiệp vụ không thay thế các connector đó.

## Thứ tự triển khai

1. Kiểm tra schema/API TinaCRM và ứng dụng trợ lý (Claude Desktop hoặc ChatGPT desktop app) và phiên bản khách sử dụng.
2. Xây connector cục bộ cho TinaCRM, nguồn lead và email hai chiều.
3. Kiểm chứng một luồng trong chat: tìm lead → nhập/đọc TinaCRM → gửi thử → nhận phản hồi → tạo task.
4. Thiết lập và kiểm chứng lịch chạy cục bộ, lưu trạng thái và xử lý chạy lại.
5. Đóng gói hướng dẫn cài đặt, skills và workflow cho khách.

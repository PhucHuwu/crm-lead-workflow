# HỆ THỐNG QUẢN TRỊ & CHĂM SÓC KHÁCH HÀNG TỰ ĐỘNG (CRM LEAD WORKFLOW)

Quy trình tự động hóa 13 bước từ dữ liệu doanh nghiệp thô đến Lead Generation, Webhook CRM, Email Nurturing và Báo cáo tuần. Được tối ưu hóa cho **Claude Desktop (Projects)** với cơ chế **Chủ động tương tác & hỏi người dùng**.

## Web hướng dẫn cho người dùng

Website tài liệu Next.js nằm tại [`web-docs/`](web-docs/README.md), gồm hướng dẫn Claude Desktop và workflow bằng tiếng Việt, tìm kiếm, câu mẫu sao chép và checklist lưu tiến độ. Xem README trong thư mục đó để chạy local.

## Kiến trúc và trải nghiệm

**TinaCRM:** đã khảo sát source và có native MCP. Xem [`workflows/TINACRM_CONNECTION.md`](workflows/TINACRM_CONNECTION.md) để thiết lập xác thực đúng, phân biệt data API, workflow trigger và webhook thông báo. Không dùng workspace ID thay token. Cần kiểm chứng trên instance thực tế trước khi báo đã kết nối.

### Trải nghiệm cho người dùng ít quen công nghệ

Claude chủ động hỏi từng câu, dùng từ dễ hiểu và lựa chọn đánh số. Người dùng có thể gửi tài liệu, website hoặc để Claude hỏi từng câu về doanh nghiệp; không cần biết tên skill hay chủ động đặt câu hỏi. Thông tin kỹ thuật do Claude chuyển thành cấu hình và hướng dẫn kết nối theo từng thao tác. Xem `rules/nontechnical_user_experience.md`.

**Lưu ý triển khai:** cài MCP/connector lần đầu hiện vẫn cần người hỗ trợ kỹ thuật; dự án chưa có bộ cài một lần bằng giao diện. Sau khi công cụ được kết nối, người dùng làm việc chủ yếu qua hội thoại dẫn dắt.

**Browser backend:** [CloakBrowser qua MCP cục bộ](workflows/CLOAKBROWSER.md). Dùng server `scripts/cloakbrowser_mcp.py` và cấu hình mẫu `config/cloakbrowser_mcp.template.json` để Claude Desktop điều khiển browser này. Cần cài dependencies, kết nối MCP và kiểm tra trên máy người dùng.

Người dùng điều hành bằng **Claude Desktop**, với MCP/connector và công cụ thực thi chạy **trực tiếp trên máy người dùng**. TinaCRM lưu dữ liệu và trạng thái lead. Không yêu cầu server automation riêng; hoạt động khi máy tắt nằm ngoài phạm vi.

Workflow dùng chung cho nhiều doanh nghiệp. Mỗi doanh nghiệp dùng một bản clone/thư mục và Claude Project riêng; Claude hỏi và lưu các tham số riêng vào `config/business.json` từ mẫu `config/business.example.json`. Mục tiêu lead/ngày, số email và người nhận báo cáo không được cố định theo một doanh nghiệp.

Xem [thiết lập doanh nghiệp](workflows/BUSINESS_ONBOARDING.md) và [kiến trúc thực thi cục bộ](workflows/LOCAL_EXECUTION.md) về cấu hình, lịch chạy và connector. Các tài liệu này được ưu tiên khi các ví dụ cũ khác với phạm vi đã chốt.

**Trạng thái hiện tại:** bộ hướng dẫn và các script mẫu; chưa có connector TinaCRM/email hoặc lịch chạy hoàn chỉnh. Import Project Knowledge hay đặt file vào `.claude/skills/` không tự cấp các khả năng đó cho Claude Desktop.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
crm-lead-workflow/
├── CLAUDE_PROJECT_INSTRUCTIONS.md      # 👉 Copy toàn bộ vào Custom Instructions của Claude Project
├── README.md                           # Hướng dẫn chi tiết này
├── product-marketing.template.md       # Mẫu hồ sơ ngữ cảnh trung tâm (Single Source of Truth)
├── workflows/
│   └── MASTER_WORKFLOW.md              # Sơ đồ & logic chi tiết 13 bước
├── skills/                             # ⚡ BỘ KỸ NĂNG CHUẨN HOÁ (AGENT SKILLS SPEC)
│   ├── product-marketing/SKILL.md      # B2-B5: Đúc kết hồ sơ công ty & sản phẩm
│   ├── icp-criteria/SKILL.md           # B6: Xây dựng tiêu chí khách hàng mục tiêu & Lead Scoring
│   ├── prospecting/SKILL.md            # B7-B8: Tìm kiếm lead an toàn đa kênh (SaaS, B2B, Local)
│   ├── cold-email/SKILL.md             # B10-B11: Chuỗi email 4 chạm, chống văn phong AI
│   ├── revops-crm/SKILL.md             # B9, B12: Quản lý vòng đời lead, gọi Webhook CRM & Triage Task
│   └── weekly-reporting/SKILL.md       # B13: Báo cáo tuần & đo lường chuyển đổi
├── subagents/                          # Tài liệu mô tả tính cách & vai trò chuyên môn của từng agent
├── rules/
│   ├── interactive_interview_rules.md  # Nguyên tắc Claude dừng lại hỏi người dùng
│   ├── security_credentials_rules.md   # Bảo mật tài khoản & Webhook token
│   └── data_schemas.md                 # Định dạng JSON chuẩn cho Lead, ICP, Webhook
├── inputs/
│   ├── 01_company_info/                # 📂 Thả file giới thiệu công ty vào đây (PDF, DOCX, Slide)
│   └── 02_marketing_materials/         # 📂 Thả file giới thiệu sản phẩm/dịch vụ vào đây
├── outputs/
│   ├── 01_icp_criteria/                # Tiêu chí ICP & Lead scoring xuất ra
│   ├── 02_crawled_leads/               # Danh sách lead cào được
│   ├── 03_email_cadence/               # Chuỗi email chăm sóc cá nhân hóa
│   └── 04_weekly_reports/              # Báo cáo hiệu quả hàng tuần
├── config/
│   ├── config.example.env              # Mẫu cấu hình biến môi trường
│   └── claude_desktop_config.template.json # Cấu hình MCP Server (nếu dùng)
└── scripts/
    ├── send_webhook.py                 # Script mẫu bắn webhook sang CRM
    └── lead_scraper_template.py        # Template mẫu cào dữ liệu an toàn
```

---

## 🚀 HƯỚNG DẪN IMPORT VÀO CLAUDE DESKTOP (3 BƯỚC)

### Bước 1: Tạo Claude Project mới
1. Mở ứng dụng **Claude Desktop** (hoặc truy cập [claude.ai](https://claude.ai)).
2. Nhấp vào mục **Projects** trên thanh menu bên trái ➔ Chọn **Create Project**.
3. Đặt tên dự án: `CRM & Lead Automation Pipeline`.

### Bước 2: Thiết lập Project Instructions
1. Mở file `CLAUDE_PROJECT_INSTRUCTIONS.md` trong thư mục này.
2. Sao chép (Copy) toàn bộ nội dung file.
3. Dán (Paste) vào phần **"Set Custom Instructions"** của Project trong Claude.

### Bước 3: Nạp tài liệu vào Project Knowledge
1. Thêm các file hướng dẫn trong thư mục `workflows/`, `subagents/`, `rules/` vào **Project Knowledge**.
2. Tải các tài liệu thực tế của doanh nghiệp bạn vào:
   - Tài liệu công ty (Slide, Profile, PDF) ➔ Tải lên và đặt trong ngữ cảnh `inputs/01_company_info/`.
   - Tài liệu sản phẩm (Brochure, Báo giá) ➔ Tải lên và đặt trong ngữ cảnh `inputs/02_marketing_materials/`.

---

## 💬 CƠ CHẾ HOẠT ĐỘNG: CLAUDE SẼ CHỦ ĐỘNG HỎI GÌ?

Khi bạn bắt đầu với câu: *"Bắt đầu quy trình chăm sóc khách hàng"*, Claude sẽ tự động điều phối qua 13 bước và **chủ động dừng lại phỏng vấn bạn** tại các điểm cốt lõi:

| Bước | Vấn đề Claude sẽ hỏi bạn | Bạn cần cung cấp |
| :--- | :--- | :--- |
| **B3 & B5** | Xác nhận định vị công ty & sản phẩm trọng tâm | Phê duyệt hoặc góp ý chỉnh sửa |
| **B6** | Kiểm tra bộ tiêu chí ICP & Tiêu chuẩn loại trừ | Thêm/bớt tiêu chí ngành nghề, chức danh |
| **B7** | Lựa chọn nguồn cào lead phù hợp | Chọn: LinkedIn, Facebook, Google Maps hay B2B Web |
| **B8** | Phương thức xác thực tài khoản an toàn | Session Cookie (hướng dẫn an toàn qua F12) |
| **B9** | Webhook nhận Lead vào CRM | Gửi link Webhook URL (Lark, HubSpot, Sheet...) |
| **B10** | Lộ trình và thời gian gửi chuỗi email (Routine) | Phê duyệt số ngày cách quãng giữa các mail |
| **B11** | Kênh gửi email (Gmail, SMTP, Resend...) | Chọn phương thức gửi email mong muốn |
| **B12** | Webhook tạo Task CSKH khi khách trả lời | Gửi link Webhook tạo task & Email nhân viên phụ trách |
| **B13** | Thông tin nhận Báo cáo tuần | Email của bạn và khung giờ muốn nhận mail |

---

## 🔒 AN TOÀN VÀ BẢO MẬT
- **Không bao giờ nhập mật khẩu chính chủ trực tiếp vào chat.**
- Khi kết nối mạng xã hội, ưu tiên dùng tài khoản phụ và Session Cookie.
- Các API Key và Secret Webhook có thể cấu hình trong file `config/.env` để lưu trữ an toàn trên máy cục bộ của bạn.

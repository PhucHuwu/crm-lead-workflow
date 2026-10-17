import type { Guide } from "./guides";

export const folderGuide: Guide = {
  slug: "tep-thu-muc", title: "Đặt tài liệu vào đúng thư mục", shortTitle: "Đặt tài liệu đúng chỗ", group: "Chuẩn bị trên máy", minutes: 4,
  description: "Sao chép hồ sơ công ty và tài liệu sản phẩm vào thư mục workflow vừa giải nén. Bước này làm hoàn toàn trên máy, chưa cần mở Claude.",
  sections: [
    { id: "open", title: "Mở thư mục workflow của doanh nghiệp", paragraphs: ["Mở thư mục workflow bạn vừa giải nén ở bước trước. Trên Windows, dùng File Explorer; trên Mac, dùng Finder.", "Bên trong có hai thư mục bạn cần biết: inputs là nơi bạn đặt tài liệu đầu vào; outputs là nơi xem các kết quả đã được lưu. Nếu có nhiều doanh nghiệp, mở đúng thư mục riêng của doanh nghiệp đang làm."], note: { title: "Chưa biết thư mục nằm ở đâu?", body: "Xem lại bài Tải workflow về máy, phần Giải nén. Bạn không cần tự tạo lại cấu trúc thư mục." } },
    { id: "company", title: "Tài liệu công ty đặt ở đâu?", paragraphs: ["Mở lần lượt: crm-lead-workflow → inputs → 01_company_info. Đặt tài liệu giới thiệu doanh nghiệp vào thư mục cuối cùng này."], steps: [
      { title: "Hồ sơ giới thiệu công ty", body: "Ví dụ: ho-so-cong-ty.pdf, slide giới thiệu doanh nghiệp, thông tin lĩnh vực hoạt động và đội ngũ." },
      { title: "Hồ sơ năng lực và kinh nghiệm", body: "Ví dụ: ho-so-nang-luc.pdf, chứng chỉ, dự án đã triển khai và câu chuyện khách hàng thực tế." }
    ], note: { title: "Nhớ đơn giản: công ty là ai → 01_company_info", body: "Nhóm này giúp hiểu doanh nghiệp, năng lực và những điểm mạnh có căn cứ." } },
    { id: "products", title: "Tài liệu sản phẩm và dịch vụ đặt ở đâu?", paragraphs: ["Mở lần lượt: crm-lead-workflow → inputs → 02_marketing_materials. Đặt tài liệu về những gì doanh nghiệp bán vào thư mục này."], steps: [
      { title: "Giới thiệu sản phẩm hoặc dịch vụ", body: "Ví dụ: gioi-thieu-dich-vu.pdf, brochure, slide mô tả giải pháp và tính năng." },
      { title: "Bảng giá và thông tin bán hàng", body: "Ví dụ: bang-gia.xlsx, gói dịch vụ, tài liệu giải thích lợi ích cho khách hàng. Ưu tiên PDF, Word hoặc Excel có chữ, không phải ảnh quét." }
    ], note: { title: "Nhớ đơn giản: công ty bán gì → 02_marketing_materials", body: "Nếu một tài liệu giới thiệu cả công ty lẫn sản phẩm, đặt một bản ở 01_company_info và ghi chú lại để nói khi bắt đầu. Không cần sao chép vào cả hai nơi." } },
    { id: "put-files", title: "Tự đặt tệp vào thư mục trong vài thao tác", steps: [
      { title: "Tìm tài liệu đang có", body: "Mở nơi chứa tài liệu, chẳng hạn Downloads (Tải xuống), Documents (Tài liệu) hoặc Desktop (Màn hình chính)." },
      { title: "Chọn và sao chép", body: "Chọn tệp cần dùng. Windows: nhấn Ctrl + C. Mac: nhấn Command + C. Có thể chọn nhiều tệp. Sao chép giúp giữ nguyên bản gốc." },
      { title: "Mở đúng thư mục nhận", body: "Hồ sơ công ty: mở inputs rồi 01_company_info. Tài liệu sản phẩm/dịch vụ: mở inputs rồi 02_marketing_materials." },
      { title: "Dán và kiểm tra", body: "Windows: nhấn Ctrl + V. Mac: nhấn Command + V. Kiểm tra tên tệp xuất hiện trong thư mục vừa mở. Nếu máy báo có tệp cùng tên, kiểm tra hai bản trước khi chọn thay thế." }
    ], paragraphs: ["Bạn cũng có thể kéo thả nếu đã quen, nhưng sao chép và dán dễ giữ lại tài liệu gốc hơn. Giữ nguyên tên các thư mục workflow; tên tệp nên dễ hiểu, chẳng hạn ho-so-cong-ty-2026.pdf."] },
    { id: "ready", title: "Kiểm tra trước khi sang bước tiếp theo", checks: ["Tôi đã mở đúng thư mục workflow của doanh nghiệp mình.", "Hồ sơ công ty nằm trong inputs/01_company_info.", "Tài liệu sản phẩm và dịch vụ nằm trong inputs/02_marketing_materials, nếu đã có."], paragraphs: ["Thiếu một nhóm tài liệu vẫn có thể tiếp tục; khi làm việc, Claude sẽ hỏi thêm từng câu. Bước tiếp theo: mở thư mục này bằng Claude Code."] }
  ]
};

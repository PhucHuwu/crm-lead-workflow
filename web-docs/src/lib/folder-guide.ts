import type { Guide } from "./guides";

export const folderGuide: Guide = {
  slug: "tep-thu-muc", title: "Đặt tài liệu vào đúng thư mục", shortTitle: "Đặt tài liệu đúng chỗ", group: "Làm quen", minutes: 5,
  description: "Bạn tự đặt tài liệu công ty và sản phẩm vào đúng chỗ trên máy, sau đó yêu cầu Claude đọc.",
  sections: [
    { id: "open", title: "Mở thư mục workflow của doanh nghiệp", paragraphs: ["Mở thư mục crm-lead-workflow mà người hỗ trợ đã chuẩn bị cho doanh nghiệp bạn. Trên Windows, dùng File Explorer; trên Mac, dùng Finder.", "Bên trong có hai thư mục bạn cần biết: inputs là nơi bạn đặt tài liệu đầu vào; outputs là nơi xem các kết quả đã được lưu. Nếu có nhiều doanh nghiệp, mở đúng thư mục riêng của doanh nghiệp đang làm."], note: { title: "Chưa biết thư mục nằm ở đâu?", body: "Nhờ người hỗ trợ gửi vị trí hoặc tạo lối tắt trên màn hình chính. Bạn không cần tự tạo lại toàn bộ cấu trúc thư mục." } },
    { id: "company", title: "Tài liệu công ty đặt ở đâu?", paragraphs: ["Mở lần lượt: crm-lead-workflow → inputs → 01_company_info. Đặt tài liệu giới thiệu doanh nghiệp vào thư mục cuối cùng này."], steps: [
      { title: "Hồ sơ giới thiệu công ty", body: "Ví dụ: ho-so-cong-ty.pdf, slide giới thiệu doanh nghiệp, thông tin lĩnh vực hoạt động và đội ngũ." },
      { title: "Hồ sơ năng lực và kinh nghiệm", body: "Ví dụ: ho-so-nang-luc.pdf, chứng chỉ, dự án đã triển khai và câu chuyện khách hàng thực tế." }
    ], note: { title: "Nhớ đơn giản: công ty là ai → 01_company_info", body: "Nhóm này giúp Claude hiểu doanh nghiệp, năng lực và những điểm mạnh có căn cứ." } },
    { id: "products", title: "Tài liệu sản phẩm và dịch vụ đặt ở đâu?", paragraphs: ["Mở lần lượt: crm-lead-workflow → inputs → 02_marketing_materials. Đặt tài liệu về những gì doanh nghiệp bán vào thư mục này."], steps: [
      { title: "Giới thiệu sản phẩm hoặc dịch vụ", body: "Ví dụ: gioi-thieu-dich-vu.pdf, brochure, slide mô tả giải pháp và tính năng." },
      { title: "Bảng giá và thông tin bán hàng", body: "Ví dụ: bang-gia.xlsx, gói dịch vụ, tài liệu giải thích lợi ích cho khách hàng. Claude chỉ đọc được khi công cụ hỗ trợ định dạng đó." }
    ], note: { title: "Nhớ đơn giản: công ty bán gì → 02_marketing_materials", body: "Nếu một tài liệu giới thiệu cả công ty lẫn sản phẩm, đặt một bản ở 01_company_info và nói với Claude tài liệu có cả hai phần. Không cần sao chép vào cả hai nơi." } },
    { id: "put-files", title: "Tự đặt tệp vào thư mục trong vài thao tác", steps: [
      { title: "Tìm tài liệu đang có", body: "Mở nơi chứa tài liệu, chẳng hạn Downloads (Tải xuống), Documents (Tài liệu) hoặc Desktop (Màn hình chính)." },
      { title: "Chọn và sao chép", body: "Chọn tệp cần dùng. Windows: nhấn Ctrl + C. Mac: nhấn Command + C. Có thể chọn nhiều tệp. Sao chép giúp giữ nguyên bản gốc." },
      { title: "Mở đúng thư mục nhận", body: "Hồ sơ công ty: mở inputs rồi 01_company_info. Tài liệu sản phẩm/dịch vụ: mở inputs rồi 02_marketing_materials." },
      { title: "Dán và kiểm tra", body: "Windows: nhấn Ctrl + V. Mac: nhấn Command + V. Kiểm tra tên tệp xuất hiện trong thư mục vừa mở. Nếu máy báo có tệp cùng tên, kiểm tra hai bản trước khi chọn thay thế." }
    ], paragraphs: ["Bạn cũng có thể kéo thả nếu đã quen, nhưng sao chép và dán dễ giữ lại tài liệu gốc hơn. Giữ nguyên tên các thư mục workflow; tên tệp nên dễ hiểu, chẳng hạn ho-so-cong-ty-2026.pdf."] },
    { id: "read", title: "Đặt xong rồi, yêu cầu Claude đọc", paragraphs: ["Trong Claude Desktop, mở Code, chọn Local rồi Select folder để mở thư mục workflow đã đặt tài liệu. Không cần filesystem MCP chỉ để đọc thư mục Local này.", "Claude phải báo tệp nào đọc được và tệp nào chưa đọc được. Thấy tên tệp chưa có nghĩa đã đọc nội dung; PDF quét, Word, slide hoặc bảng tính có thể cần công cụ đọc phù hợp."], prompt: "Tôi đã đặt hồ sơ công ty vào inputs/01_company_info và tài liệu sản phẩm, dịch vụ vào inputs/02_marketing_materials của thư mục workflow doanh nghiệp. Hãy đọc tài liệu, tóm tắt những gì bạn hiểu và báo tệp nào chưa đọc được. Sau đó hỏi tôi phần còn thiếu, mỗi lần một câu.", note: { title: "Nếu Claude chưa đọc được thư mục", body: "Kiểm tra đang ở tab Code, môi trường Local và đã chọn đúng thư mục gốc. Nếu ứng dụng hỏi quyền đọc hoặc chạy công cụ trích xuất, đọc thao tác rồi cho phép khi phù hợp." } },
    { id: "outputs", title: "Kết quả được lưu ở đâu?", paragraphs: ["Bạn không cần đặt tài liệu công ty vào outputs. Đây là nơi mở để xem kết quả sau khi Claude hoặc công cụ đã thực sự lưu."], steps: [
      { title: "outputs → 01_icp_criteria", body: "Tiêu chí khách hàng phù hợp." },
      { title: "outputs → 02_crawled_leads", body: "Danh sách khách tìm được." },
      { title: "outputs → 03_email_cadence", body: "Kế hoạch chăm sóc và nội dung email mẫu." },
      { title: "outputs → 04_weekly_reports", body: "Báo cáo công việc hằng tuần." }
    ], note: { title: "Kiểm tra tệp thực tế", body: "Nếu thư mục còn trống, hỏi Claude kết quả đã được lưu chưa và lưu ở đâu. Nội dung xuất hiện trong chat không tự trở thành tệp; tệp danh sách chưa đồng nghĩa đã nhập CRM, email mẫu chưa đồng nghĩa đã gửi." } },
    { id: "ready", title: "Kiểm tra trước khi bắt đầu", checks: ["Tôi đã mở đúng thư mục của doanh nghiệp mình.", "Hồ sơ công ty nằm trong inputs/01_company_info.", "Tài liệu sản phẩm và dịch vụ nằm trong inputs/02_marketing_materials, nếu đã có.", "Tôi đã yêu cầu Claude đọc và kiểm tra tệp nào chưa đọc được."], paragraphs: ["Nếu thiếu một nhóm tài liệu, vẫn có thể bắt đầu với phần đang có. Nói cho Claude biết bạn chưa có tài liệu đó để Claude hỏi thêm từng câu."] }
  ]
};

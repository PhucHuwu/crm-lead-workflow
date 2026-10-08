import type { Guide } from "./guides";

export const downloadGuide: Guide = {
  slug: "tai-workflow", title: "Tải workflow về máy", shortTitle: "Tải workflow về máy", group: "Làm quen", minutes: 5,
  description: "Tải bộ thư mục có sẵn, giải nén và đặt ở nơi dễ tìm. Không cần dùng lệnh hoặc biết Git.",
  sections: [
    { id: "download", title: "Tải bộ workflow có sẵn", paragraphs: ["Mở đường dẫn kho workflow do người hỗ trợ cung cấp. Kho của dự án này là https://github.com/PhucHuwu/crm-lead-workflow. Bạn không cần đọc mã nguồn hay tự tạo từng thư mục."], steps: [
      { title: "Mở trang workflow", body: "Bấm nút “Mở trang tải workflow” trong bài này, hoặc dán đường dẫn GitHub vào Chrome hay trình duyệt bạn đang dùng." },
      { title: "Chọn Code → Download ZIP", body: "Trên trang có danh sách tệp, tìm nút Code. Bấm nút đó rồi chọn Download ZIP (Tải ZIP). Giao diện GitHub có thể thay đổi; nếu không thấy, nhờ người hỗ trợ hướng dẫn." },
      { title: "Tìm tệp vừa tải", body: "Mở thư mục Downloads (Tải xuống). Tệp thường có tên crm-lead-workflow-main.zip; tên có thể khác tùy nhánh được tải." }
    ], note: { title: "Trang không mở hoặc báo không tìm thấy?", body: "Kho có thể yêu cầu quyền truy cập hoặc chưa được công bố. Nhờ người hỗ trợ cấp quyền hoặc gửi bản ZIP của workflow. Không cần tự tạo tài khoản GitHub nếu đã được gửi ZIP trực tiếp." } },
    { id: "unzip", title: "Giải nén trước khi dùng", steps: [
      { title: "Trên Windows", body: "Bấm chuột phải vào tệp ZIP → Extract All (Giải nén tất cả) → chọn nơi lưu, chẳng hạn Documents (Tài liệu) → Extract (Giải nén)." },
      { title: "Trên Mac", body: "Bấm đúp tệp ZIP trong Finder. Máy tạo thư mục đã giải nén bên cạnh. Sao chép thư mục đó vào Documents (Tài liệu) nếu muốn cất ở nơi dễ tìm." },
      { title: "Mở thư mục đã giải nén", body: "Không làm việc bên trong tệp ZIP. Mở thư mục mới; bên trong cần thấy README.md, inputs, outputs, skills và workflows. Nếu thấy thêm một thư mục lồng bên trong, mở tiếp đến nơi có các mục này." }
    ], note: { title: "Nếu chưa thấy inputs hoặc outputs", body: "Đừng tự đoán cấu trúc hay tạo thư mục khác tên. Nhờ người hỗ trợ kiểm tra bản ZIP đã đầy đủ chưa hoặc gửi đúng bản workflow." } },
    { id: "location", title: "Đặt ở một chỗ dễ tìm", paragraphs: ["Bạn có thể đổi tên thư mục đã giải nén thành crm-lead-workflow hoặc Workflow - Tên công ty. Giữ nguyên tên các thư mục bên trong.", "Mỗi doanh nghiệp dùng một bản riêng. Khi người hỗ trợ đã kết nối Claude với thư mục này, hạn chế đổi tên hoặc chuyển nó sang chỗ khác; nếu cần chuyển, nhờ cập nhật kết nối."], steps: [
      { title: "Chọn vị trí ổn định", body: "Ví dụ: Documents → Workflow - Công ty của tôi. Tránh chỉ làm việc với bản ZIP trong Downloads." },
      { title: "Tạo lối tắt nếu cần", body: "Nhờ người hỗ trợ tạo lối tắt trên màn hình chính để lần sau mở nhanh." }
    ] },
    { id: "next", title: "Tải xong rồi làm gì?", steps: [
      { title: "Đặt tài liệu của bạn vào đúng chỗ", body: "Hồ sơ công ty: inputs → 01_company_info. Tài liệu sản phẩm/dịch vụ: inputs → 02_marketing_materials. Bài tiếp theo hướng dẫn thao tác sao chép và dán." },
      { title: "Mở trong Claude Code Desktop", body: "Chọn tab Code → Local → Select folder rồi mở thư mục workflow gốc. Claude đọc CLAUDE.md và skills của project; không cần tạo Project Knowledge trong Chat." },
      { title: "Bắt đầu session", body: "Yêu cầu Claude đọc tài liệu và kiểm tra công cụ. Claude có thể hỗ trợ chạy lệnh thiết lập khi bạn cho phép; đăng nhập và OTP do bạn thực hiện." }
    ], note: { title: "Tải workflow chưa phải cài đặt hoàn tất", body: "Giải nén chỉ đưa bộ hướng dẫn và công cụ mẫu về máy. Nó chưa tự kết nối Claude, chưa tự nhập TinaCRM, gửi email hay tạo lịch. Không cần chạy các tệp mã nguồn; chuyển phần cài đặt công cụ cho người hỗ trợ." }, prompt: "Tôi đã tải và giải nén workflow tại [địa chỉ thư mục của tôi]. Nhờ bạn giúp thiết lập dự án Claude Desktop cho doanh nghiệp, kết nối đúng thư mục và kiểm tra công cụ nào đã hoạt động. Hướng dẫn tôi từng bước; phần nào chưa sẵn sàng thì báo rõ." },
    { id: "updates", title: "Khi được thông báo có bản mới", paragraphs: ["Đừng giải nén bản mới đè lên thư mục đang dùng. Tải vào một thư mục riêng rồi nhờ người hỗ trợ cập nhật, giữ lại tài liệu doanh nghiệp, cấu hình kết nối và kết quả đã lưu.", "Khi nhận ZIP từ người hỗ trợ, yêu cầu bản mẫu sạch, không chứa thông tin đăng nhập, tài liệu hay dữ liệu khách hàng của doanh nghiệp khác."] },
    { id: "ready", title: "Kiểm tra đã tải đúng", checks: ["Tôi đã có bản ZIP hoặc tải được từ trang workflow.", "Tôi đã giải nén và mở thư mục, không làm việc trong ZIP.", "Tôi thấy inputs, outputs và các tài liệu hướng dẫn bên trong.", "Tôi biết vị trí thư mục để gửi cho người hỗ trợ thiết lập."] }
  ]
};

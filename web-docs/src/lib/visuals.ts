export type Visual = {
  src: string;
  alt: string;
  caption: string;
  kind: "Ảnh chụp thực tế" | "Ảnh từ tài liệu chính thức" | "Sơ đồ minh họa";
  source?: string;
  markers?: { x: number; y: number; label: string }[];
};

export const visuals: Record<string, Visual[]> = {
  "tai-workflow:download": [{ src: "/illustrations/github-download.png", alt: "Trang GitHub crm-lead-workflow với menu Code đang mở và lựa chọn Download ZIP ở cuối menu", caption: "Bấm Code (1), rồi chọn Download ZIP (2). Ảnh chụp kho workflow; vị trí có thể thay đổi theo kích thước màn hình.", kind: "Ảnh chụp thực tế", source: "https://github.com/PhucHuwu/crm-lead-workflow", markers: [{ x: 73, y: 34, label: "1" }, { x: 53, y: 68, label: "2" }] }],
  "tai-workflow:unzip": [{ src: "/illustrations/unzip.svg", alt: "Sơ đồ giải nén trên Windows bằng Extract All và trên Mac bằng bấm đúp ZIP", caption: "Chọn cột đúng hệ điều hành của bạn. Sau giải nén, mở thư mục có inputs và outputs.", kind: "Sơ đồ minh họa" }],
  "tep-thu-muc:open": [{ src: "/illustrations/folder-map.svg", alt: "Sơ đồ thư mục workflow: inputs gồm 01_company_info cho hồ sơ công ty và 02_marketing_materials cho sản phẩm, outputs chứa kết quả", caption: "Đối chiếu tên thư mục trên máy với sơ đồ này. Tài liệu bạn chuẩn bị đặt trong inputs.", kind: "Sơ đồ minh họa" }],
  "tep-thu-muc:put-files": [{ src: "/illustrations/copy-files.svg", alt: "Sơ đồ sao chép ho-so-cong-ty.pdf từ Downloads và dán vào inputs/01_company_info, với phím tắt Windows và Mac", caption: "Hồ sơ công ty dán vào 01_company_info. Tài liệu sản phẩm dùng cùng thao tác, nhưng dán vào 02_marketing_materials.", kind: "Sơ đồ minh họa" }],
  "claude-desktop:install": [{ src: "/illustrations/claude-download.png", alt: "Trang tải Claude chính thức với nút Download for macOS và khu vực Desktop", caption: "Ảnh chụp trang tải trên Mac. Chọn bản phù hợp với máy bạn; trang Windows có thể hiển thị lựa chọn khác.", kind: "Ảnh chụp thực tế", source: "https://claude.ai/download", markers: [{ x: 61, y: 48, label: "1" }] }],
  "claude-desktop:chat": [{ src: "/illustrations/claude-project-official.png", alt: "Menu của cuộc trò chuyện Claude với lựa chọn Add to project được chỉ bằng mũi tên", caption: "Nếu bắt đầu chat bên ngoài dự án: mở menu cạnh tên chat, chọn Add to project, rồi chọn đúng dự án. Đây là ảnh từ Help Center, không phải ảnh toàn bộ ứng dụng Desktop.", kind: "Ảnh từ tài liệu chính thức", source: "https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects" }],
  "doanh-nghiep:intro": [{ src: "/illustrations/folder-map.svg", alt: "Sơ đồ nơi đặt hồ sơ công ty và tài liệu sản phẩm trong thư mục inputs", caption: "Có tài liệu trên máy? Đặt vào đúng thư mục rồi yêu cầu Claude đọc sau khi đã kết nối.", kind: "Sơ đồ minh họa" }],
  "email:replies": [{ src: "/illustrations/email-flow.svg", alt: "Sơ đồ xử lý phản hồi: trả lời thật dừng chuỗi và tạo task, yêu cầu ngừng thì dừng gửi, chưa trả lời thì tiếp tục kế hoạch", caption: "Dùng sơ đồ để đối chiếu trạng thái trong báo cáo hoặc khi Claude tóm tắt kết quả.", kind: "Sơ đồ minh họa" }],
};

export type Visual = {
  src: string;
  alt: string;
  caption: string;
  kind: "Ảnh chụp thực tế" | "Ảnh từ tài liệu chính thức" | "Sơ đồ minh họa";
  source?: string;
  width?: number;
  markers?: { x: number; y: number; w: number; h: number; label: string; text: string; badge?: "above" | "below" | "right" | "left" }[];
};

export const visuals: Record<string, Visual[]> = {
  "tai-workflow:download": [{ src: "/illustrations/github-download.png", alt: "Trang GitHub crm-lead-workflow với menu Code đang mở và lựa chọn Download ZIP ở cuối menu", caption: "", kind: "Ảnh chụp thực tế", source: "https://github.com/PhucHuwu/crm-lead-workflow", markers: [{ x: 64.2, y: 31.8, w: 9.2, h: 4.8, label: "1", text: "Code", badge: "above" }, { x: 42.4, y: 65.4, w: 30.4, h: 4.8, label: "2", badge: "left", text: "Download ZIP" }] }],
  "dat-tai-lieu:where": [{ src: "/illustrations/folder-map.svg", alt: "Sơ đồ thư mục workflow: inputs gồm 01_company_info cho hồ sơ công ty và 02_marketing_materials cho sản phẩm, outputs chứa kết quả", caption: "", kind: "Sơ đồ minh họa" }],
  "mo-claude-code:overview": [{ src: "/illustrations/claude-code-folder-chosen-full.png", alt: "Toàn bộ cửa sổ Claude Desktop ở tab Code: biểu tượng Code ở góc trên bên trái, thanh lựa chọn nằm ngay dưới ô nhập ở cuối cửa sổ", caption: "", kind: "Ảnh chụp thực tế", markers: [{ x: 10.3, y: 1.1, w: 1.9, h: 2.8, label: "1", text: "Tab Code (biểu tượng </>), góc trên bên trái", badge: "right" }, { x: 36.6, y: 96.3, w: 17.8, h: 2.9, label: "2", text: "Thanh dưới ô nhập: thư mục và quyền chọn ở đây", badge: "above" }] }],
  "mo-claude-code:folder": [{ src: "/illustrations/claude-code-open-folder-zoom.png", alt: "Phần dưới cửa sổ Claude Desktop: nút Choose… dưới ô nhập đang mở menu thư mục, Open folder… ở cuối menu", caption: "", kind: "Ảnh chụp thực tế", markers: [{ x: 26, y: 91.5, w: 9.5, h: 6.2, label: "1", text: "Choose…", badge: "left" }, { x: 26, y: 82.3, w: 33.6, h: 6.4, label: "2", text: "Open folder… → chọn thư mục workflow", badge: "right" }] }],
  "mo-claude-code:permissions": [{ src: "/illustrations/claude-code-permissions-zoom.png", alt: "Phần dưới cửa sổ Claude Desktop: menu Permissions mở từ nút Manual, gồm Auto, Manual, Accept edits, Plan, Bypass permissions", caption: "", kind: "Ảnh chụp thực tế", markers: [{ x: 42.5, y: 91.5, w: 6.3, h: 6.2, label: "1", text: "Bấm vào đây để mở menu quyền", badge: "left" }, { x: 42.7, y: 43.6, w: 34.8, h: 9.6, label: "2", text: "Manual: nên chọn", badge: "right" }, { x: 42.7, y: 75.1, w: 34.8, h: 13.4, label: "3", text: "Bypass permissions: không dùng", badge: "right" }] }],
  "email:replies": [{ src: "/illustrations/email-flow.svg", alt: "Sơ đồ xử lý phản hồi: trả lời thật dừng chuỗi và tạo task, yêu cầu ngừng thì dừng gửi, chưa trả lời thì tiếp tục kế hoạch", caption: "", kind: "Sơ đồ minh họa" }],
};

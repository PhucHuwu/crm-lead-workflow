import { folderGuide } from "./folder-guide";
import { downloadGuide } from "./download-guide";
import { tinaCrmGuide } from "./tinacrm-guide";

export type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  steps?: { title: string; body: string }[];
  note?: { title: string; body: string };
  prompt?: string;
  checks?: string[];
  faqs?: { question: string; answer: string }[];
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  group: string;
  description: string;
  minutes: number;
  sections: Section[];
};

export const guides: Guide[] = [
  {
    slug: "bat-dau", title: "Bắt đầu thật đơn giản", shortTitle: "Bắt đầu ở đây", group: "Làm quen", minutes: 4,
    description: "Không cần biết về AI. Một vài bước nhỏ để có người trợ lý tìm khách và chăm sóc khách cùng bạn.",
    sections: [
      { id: "workflow", title: "Trợ lý này giúp bạn làm gì?", paragraphs: ["Bạn cung cấp thông tin về doanh nghiệp và mục tiêu. Claude sẽ hỏi từng câu để hiểu bạn, đề xuất khách hàng phù hợp, rồi hỗ trợ tìm kiếm và chăm sóc khách.", "TinaCRM là nơi lưu thông tin khách và việc cần xử lý. Claude Desktop là nơi bạn trò chuyện và điều hành công việc. Công cụ kết nối sẽ thực hiện những thao tác mà bạn cho phép."], steps: [
        { title: "Hiểu doanh nghiệp của bạn", body: "Đọc tài liệu, tìm hiểu sản phẩm và đề xuất nhóm khách hàng nên tiếp cận." },
        { title: "Tìm và lưu khách phù hợp", body: "Tìm thông tin có nguồn, lọc trùng và lưu vào TinaCRM khi kết nối đã sẵn sàng." },
        { title: "Liên hệ và theo dõi", body: "Soạn email, gửi theo kế hoạch đã thống nhất, theo dõi phản hồi và tổng hợp báo cáo." }
      ] },
      { id: "prepare", title: "Bạn cần chuẩn bị những gì?", checks: ["Tài khoản Claude và ứng dụng Claude Desktop trên máy.", "Tài liệu giới thiệu công ty hoặc đường dẫn website.", "Tài khoản TinaCRM và hộp thư dùng để liên hệ khách, nếu đã có.", "Người hỗ trợ đã kết nối các công cụ cần dùng."], note: { title: "Chưa có đủ? Bạn vẫn có thể bắt đầu", body: "Claude có thể hỏi từng câu về doanh nghiệp và chuẩn bị kế hoạch trước. Việc gửi email, lưu vào CRM hoặc chạy theo lịch cần công cụ được kết nối thực tế." } },
      { id: "first-message", title: "Tin nhắn đầu tiên của bạn", paragraphs: ["Mở cuộc trò chuyện trong dự án đã được thiết lập. Dán câu dưới đây và gửi. Sau đó, bạn chỉ cần trả lời từng câu ngắn hoặc chọn số."], prompt: "Tôi muốn bắt đầu quy trình tìm và chăm sóc khách hàng cho doanh nghiệp của mình. Hãy hỏi tôi từng câu đơn giản, mỗi lần một việc. Nếu tôi chưa biết, hãy giúp tôi chọn." },
      { id: "next", title: "Bạn không cần nhớ hết quy trình", paragraphs: ["Claude sẽ chủ động hỏi phần còn thiếu và dẫn bạn đến bước tiếp theo. Bạn có thể nói “Tôi chưa hiểu”, “Giải thích đơn giản hơn” hoặc “Để phần này sau” bất cứ lúc nào.", "Tài liệu này dùng chung cho nhiều doanh nghiệp. Số khách cần tìm, số email và người nhận báo cáo đều được chọn riêng cho bạn."] }
    ]
  },
  {
    slug: "claude-desktop", title: "Làm quen với Claude Desktop", shortTitle: "Sử dụng Claude Desktop", group: "Làm quen", minutes: 6,
    description: "Cài ứng dụng, mở cuộc trò chuyện và trao đổi với Claude như với một người đồng nghiệp.",
    sections: [
      { id: "install", title: "Mở Claude trên máy của bạn", steps: [
        { title: "Tải từ trang chính thức", body: "Truy cập claude.ai/download trong trình duyệt. Chọn bản dành cho máy của bạn và làm theo hướng dẫn cài đặt." },
        { title: "Đăng nhập", body: "Mở Claude Desktop và đăng nhập tài khoản của bạn. Nếu đã cài và đăng nhập, bạn có thể bỏ qua hai bước này." },
        { title: "Mở dự án của doanh nghiệp", body: "Tìm mục Projects (Dự án), mở dự án do người hỗ trợ đã chuẩn bị cho bạn. Nếu chưa có, xem bài “Thiết lập lần đầu”." }
      ], note: { title: "Màn hình của bạn có thể khác", body: "Tên nút và vị trí có thể thay đổi theo phiên bản, ngôn ngữ và gói tài khoản. Nếu không thấy mục cần tìm, nhờ người hỗ trợ hoặc gửi ảnh đã che thông tin riêng tư." } },
      { id: "chat", title: "Gửi tin nhắn đầu tiên", steps: [
        { title: "Nhập yêu cầu vào ô trò chuyện", body: "Viết điều bạn muốn làm bằng tiếng Việt bình thường. Không cần chọn skill hoặc gõ lệnh đặc biệt." },
        { title: "Gửi và đọc câu hỏi của Claude", body: "Bấm nút gửi. Nếu Claude đưa các lựa chọn, bạn có thể trả lời “1” hoặc “Tôi muốn tìm khách ở Việt Nam”." },
        { title: "Kiểm tra khi Claude chuẩn bị hành động", body: "Khi ứng dụng hỏi quyền dùng công cụ, đọc tên công cụ và việc sắp làm. Chỉ cho phép nếu đúng công việc bạn yêu cầu." }
      ], prompt: "Hãy kiểm tra tôi đã sẵn sàng sử dụng workflow chưa. Giải thích bằng từ dễ hiểu và hỏi tôi từng bước." },
      { id: "files", title: "Gửi tài liệu cho Claude", paragraphs: ["Dùng nút đính kèm tệp trong cuộc trò chuyện, hoặc phần tài liệu của dự án nếu tài khoản của bạn hỗ trợ. Chọn hồ sơ công ty, brochure hoặc tài liệu dịch vụ.", "Bạn cũng có thể dán đường dẫn website. Chỉ gửi tài liệu mình muốn dùng cho công việc. Claude cần công cụ phù hợp để đọc website hoặc thư mục trên máy; ứng dụng không tự thấy tất cả tệp của bạn."], prompt: "Tôi vừa gửi tài liệu giới thiệu công ty. Hãy tóm tắt những gì bạn hiểu và hỏi tôi phần còn thiếu, mỗi lần một câu." },
      { id: "local-folder", title: "Muốn Claude đọc tài liệu trên máy?", paragraphs: ["Bạn có thể yêu cầu đọc tài liệu trong một thư mục hoặc chuyển tệp vào đúng nơi dùng cho workflow. Trước hết, cần xác định đường dẫn và quyền truy cập. Bài tiếp theo “Tệp & thư mục trên máy” có hướng dẫn cùng câu mẫu cho từng thao tác."], prompt: "Tôi muốn bạn đọc tài liệu từ thư mục trên máy thay vì đính kèm từng tệp. Hãy kiểm tra kết nối đọc tệp và hỏi tôi địa chỉ thư mục, mỗi lần một việc." },
      { id: "habits", title: "Ba câu bạn có thể dùng bất cứ lúc nào", steps: [
        { title: "“Giải thích đơn giản hơn”", body: "Dùng khi câu trả lời có thuật ngữ hoặc quá dài." },
        { title: "“Chúng ta đang ở bước nào?”", body: "Claude sẽ tóm tắt phần đã xong và việc tiếp theo." },
        { title: "“Tạm dừng và tóm tắt giúp tôi”", body: "Lưu lại tiến trình trước khi nghỉ hoặc chuyển cuộc trò chuyện." }
      ] }
    ]
  },
  {
    ...downloadGuide
  },
  {
    ...folderGuide
  },
  {
    slug: "thiet-lap", title: "Thiết lập lần đầu", shortTitle: "Thiết lập lần đầu", group: "Làm quen", minutes: 7,
    description: "Một lần chuẩn bị cùng người hỗ trợ, để sau đó bạn có thể làm việc bằng hội thoại đơn giản.",
    sections: [
      { id: "project", title: "Chuẩn bị một dự án riêng", paragraphs: ["Mỗi doanh nghiệp nên có một dự án Claude riêng và một thư mục workflow riêng. Điều này giúp tài liệu, khách hàng và hộp thư không bị lẫn giữa các doanh nghiệp."], steps: [
        { title: "Tạo hoặc nhận dự án", body: "Người hỗ trợ tạo dự án trong Claude và đặt tên dễ nhớ, chẳng hạn “Tìm khách — Công ty của tôi”." },
        { title: "Thêm hướng dẫn cho trợ lý", body: "Người hỗ trợ thêm chỉ dẫn workflow và các tài liệu hướng dẫn vào dự án. Chỉ tạo dự án mới chưa đủ để Claude biết toàn bộ workflow." },
        { title: "Kết nối công cụ", body: "Người hỗ trợ thiết lập trình duyệt CloakBrowser, kết nối TinaCRM và gửi/đọc email theo các công cụ thực sự có sẵn." }
      ], note: { title: "Đây là bước có thể cần người hỗ trợ", body: "Bộ workflow hiện chưa có bộ cài bằng một nút. Một số kết nối vẫn cần được xây dựng hoặc cấu hình. Bạn không cần tự nhập mã hay chỉnh tệp kỹ thuật." } },
      { id: "verify", title: "Nhờ Claude kiểm tra kết nối", prompt: "Hãy kiểm tra các công cụ hiện có: đọc tài liệu, mở trình duyệt CloakBrowser, kết nối TinaCRM, gửi và đọc email. Nói rõ việc nào đã dùng được, việc nào cần người hỗ trợ thiết lập. Không gửi email thật trong bước kiểm tra này.", paragraphs: ["Claude chỉ nên nói “đã kết nối” sau khi công cụ trả về kết quả. Nếu chưa có công cụ email, bạn vẫn có thể dùng Claude để soạn nội dung trước."] },
      { id: "handoff", title: "Gửi yêu cầu này cho người hỗ trợ", prompt: "Nhờ bạn giúp tôi thiết lập workflow trên Claude Desktop cho doanh nghiệp của tôi: dự án và tài liệu riêng, trình duyệt CloakBrowser, kết nối TinaCRM, hộp thư gửi/nhận và kiểm tra khả năng chạy theo lịch trên máy. Hãy thử từng kết nối và báo phần nào chưa sẵn sàng. Tôi sẽ tự nhập mật khẩu và mã xác minh khi đăng nhập." },
      { id: "ready", title: "Kiểm tra trước khi sử dụng", checks: ["Tôi mở được dự án của doanh nghiệp mình.", "Claude biết tài liệu thuộc đúng doanh nghiệp.", "Người hỗ trợ đã nói rõ công cụ nào hoạt động.", "Hộp thư và tài khoản TinaCRM là tài khoản tôi muốn dùng."] }
    ]
  },
  {
    ...tinaCrmGuide
  },
  {
    slug: "doanh-nghiep", title: "Giới thiệu doanh nghiệp của bạn", shortTitle: "Giới thiệu doanh nghiệp", group: "Thực hiện workflow", minutes: 5,
    description: "Giúp Claude hiểu bạn bán gì, ai nên mua và vì sao họ nên chọn doanh nghiệp của bạn.",
    sections: [
      { id: "intro", title: "Bắt đầu từ thông tin bạn đang có", steps: [
        { title: "Có tài liệu? Hãy gửi tệp", body: "Gửi hồ sơ công ty, tài liệu sản phẩm, dịch vụ hoặc câu chuyện khách hàng thực tế." },
        { title: "Có website? Hãy gửi đường dẫn", body: "Nói cho Claude biết đâu là website chính thức và trang dịch vụ quan trọng nhất." },
        { title: "Chưa có cả hai? Trả lời từng câu", body: "Claude sẽ hỏi tên doanh nghiệp, sản phẩm, nhóm khách thường mua và khu vực bạn muốn bán." }
      ], prompt: "Hãy tìm hiểu doanh nghiệp của tôi để chuẩn bị tìm khách hàng. Tôi sẽ gửi tài liệu hoặc website. Nếu còn thiếu thông tin, hỏi tôi từng câu; không tự tạo số liệu hay thành tích." },
      { id: "confirm", title: "Đọc lại bản tóm tắt của Claude", paragraphs: ["Kiểm tra tên doanh nghiệp, dịch vụ chính, điểm mạnh và các kết quả thực tế. Nếu có chỗ sai, nói thẳng phần cần sửa.", "Nếu doanh nghiệp có nhiều sản phẩm, chọn sản phẩm muốn ưu tiên trong đợt này. Bạn không cần triển khai tất cả cùng lúc."], prompt: "Hãy tóm tắt doanh nghiệp của tôi trong vài dòng: bán gì, giúp khách giải quyết việc gì và có bằng chứng nào. Sau đó hỏi tôi muốn ưu tiên sản phẩm hoặc dịch vụ nào." },
      { id: "complete", title: "Bạn đã sẵn sàng khi…", checks: ["Thông tin doanh nghiệp và dịch vụ đã đúng.", "Tôi đã chọn sản phẩm hoặc dịch vụ ưu tiên.", "Các câu chuyện khách hàng và số liệu đều có nguồn thực tế."], note: { title: "Không cần “huấn luyện AI” bằng thao tác phức tạp", body: "Ở đây, bạn đang cung cấp tài liệu và hướng dẫn để Claude có ngữ cảnh làm việc. Khi sản phẩm thay đổi, gửi tài liệu mới và yêu cầu cập nhật." } }
    ]
  },
  {
    slug: "tim-khach", title: "Tìm đúng khách hàng", shortTitle: "Tìm khách phù hợp", group: "Thực hiện workflow", minutes: 6,
    description: "Chọn nhóm khách, nguồn tìm kiếm và số lượng phù hợp với khả năng chăm sóc của bạn.",
    sections: [
      { id: "criteria", title: "Thống nhất thế nào là khách phù hợp", paragraphs: ["Claude sẽ đề xuất ngành, quy mô, khu vực và người có thể quyết định mua. Bạn chỉ cần xác nhận hoặc nói điều muốn đổi.", "Công ty đúng ngành chưa chắc đang cần mua. Những dấu hiệu thực tế như mở rộng hoạt động hoặc tìm giải pháp sẽ giúp chọn thời điểm tiếp cận."], prompt: "Dựa trên tài liệu doanh nghiệp, hãy đề xuất nhóm khách phù hợp và thị trường nên ưu tiên. Giải thích ngắn lý do, rồi hỏi tôi chọn từng phần. Đừng tìm danh sách trước khi chúng ta thống nhất tiêu chuẩn." },
      { id: "sources", title: "Chọn nơi tìm khách", steps: [
        { title: "Nói công cụ bạn đang có", body: "Ví dụ: tài khoản Apollo, LinkedIn hoặc chỉ có website công khai. Nếu không rõ, hãy trả lời “Giúp tôi chọn”." },
        { title: "Chọn mục tiêu mỗi ngày", body: "Đặt số khách mới phù hợp theo nhu cầu của bạn. Không cần dùng cùng một số lượng cho mọi doanh nghiệp." },
        { title: "Xem một danh sách nhỏ trước", body: "Kiểm tra công ty, thông tin liên hệ, lý do phù hợp và đường dẫn nguồn trước khi triển khai rộng." }
      ], note: { title: "Chất lượng trước số lượng", body: "Nếu chưa tìm đủ khách đạt chuẩn, Claude cần báo số thực tế và lý do. Không tự tạo tên, email hoặc tín hiệu nhu cầu để đủ chỉ tiêu." } },
      { id: "browser", title: "Đăng nhập khi dùng trình duyệt", paragraphs: ["Nếu bước nghiên cứu cần tài khoản, Claude mở cửa sổ CloakBrowser đã được kết nối. Bạn tự đăng nhập và nhập mã xác minh trong cửa sổ đó, rồi báo “Tôi đã đăng nhập”.", "Nếu trang yêu cầu xác minh hoặc chặn truy cập, để Claude báo tình trạng và hướng dẫn bước tiếp theo. CloakBrowser không đảm bảo mọi website đều cho phép truy cập."], prompt: "Hãy tìm một danh sách nhỏ theo tiêu chuẩn đã thống nhất. Với mỗi khách, cho tôi biết vì sao phù hợp và nguồn thông tin. Nếu cần tôi đăng nhập hoặc bị chặn, hướng dẫn tôi từng bước." },
      { id: "save", title: "Lưu vào TinaCRM", paragraphs: ["Khi kết nối TinaCRM đã hoạt động, Claude kiểm tra trùng và nhập thông tin theo các trường của doanh nghiệp bạn. Hãy yêu cầu xem kết quả thực tế: tạo mới, cập nhật, trùng hoặc lỗi.", "Nếu chưa có kết nối, Claude có thể chuẩn bị danh sách để bạn kiểm tra; điều đó chưa đồng nghĩa dữ liệu đã được lưu trên TinaCRM."], prompt: "Hãy kiểm tra trùng với TinaCRM trước khi lưu danh sách này. Sau khi thực hiện, báo cho tôi có bao nhiêu khách tạo mới, cập nhật, bỏ qua và lỗi." }
    ]
  },
  {
    slug: "email", title: "Chăm sóc khách bằng email", shortTitle: "Gửi & theo dõi email", group: "Thực hiện workflow", minutes: 7,
    description: "Chọn hộp thư, duyệt kế hoạch liên hệ và biết hệ thống sẽ làm gì khi khách trả lời.",
    sections: [
      { id: "mailbox", title: "Chọn hộp thư bạn muốn dùng", paragraphs: ["Nói cho Claude bạn dùng Gmail, Outlook hoặc loại khác, rồi cung cấp địa chỉ gửi. Việc đăng nhập và cấp quyền được thực hiện trên màn hình kết nối, không phải bằng cách gửi mật khẩu trong chat.", "Cần kết nối cả gửi và đọc thư để theo dõi phản hồi. Chỉ kết nối gửi thư thì chưa biết được khách đã trả lời."], prompt: "Hãy giúp tôi kết nối hộp thư để gửi và nhận phản hồi từ khách. Hỏi tôi đang dùng loại hộp thư nào trước, rồi hướng dẫn từng thao tác. Không yêu cầu mật khẩu trong chat." },
      { id: "sequence", title: "Thống nhất kế hoạch liên hệ", steps: [
        { title: "Chọn số email và khoảng cách", body: "Claude đề xuất kế hoạch phù hợp. Bạn có thể đồng ý, đổi lịch hoặc để sau. Không có số email bắt buộc cho mọi chiến dịch." },
        { title: "Kiểm tra nội dung mẫu", body: "Đọc tiêu đề, tên người nhận, thông tin cá nhân hóa và lời mời trả lời. Kiểm tra mọi câu chuyện hoặc số liệu được nhắc đến." },
        { title: "Cho phép phạm vi gửi", body: "Chọn gửi thử, chỉnh nội dung hoặc chưa gửi. Nếu muốn tự động, nói rõ danh sách và kế hoạch được phép sử dụng." }
      ], prompt: "Hãy đề xuất chuỗi email chăm sóc cho nhóm khách đã chọn, với nội dung ngắn và tự nhiên. Cho tôi xem kế hoạch, khoảng cách gửi và một email mẫu trước. Chưa gửi email thật đến khi tôi đồng ý." },
      { id: "replies", title: "Khi khách trả lời thì sao?", steps: [
        { title: "Khách trả lời thật", body: "Khi công cụ phát hiện phản hồi, dừng chuỗi email, ghi nhận nội dung và tạo việc cho người phụ trách trong TinaCRM." },
        { title: "Khách yêu cầu ngừng liên hệ", body: "Dừng gửi và ghi rõ không liên hệ tiếp. Phản hồi từ chối không được coi là khách đang quan tâm." },
        { title: "Thư tự động hoặc gửi lỗi", body: "Thư nghỉ phép và thư bị trả lại được xử lý riêng, không coi là phản hồi có nhu cầu." },
        { title: "Khách chưa trả lời", body: "Tiếp tục đúng kế hoạch. Chỉ kết thúc không phản hồi sau toàn bộ chuỗi và thời gian chờ đã thống nhất." }
      ], note: { title: "Kiểm tra phản hồi cần được kích hoạt", body: "Trong chat, bạn có thể yêu cầu kiểm tra ngay. Kiểm tra định kỳ cần công cụ đọc thư và cơ chế chạy theo lịch đã được cấu hình, không tự có chỉ vì bạn đã viết kế hoạch." } }
    ]
  },
  {
    slug: "hang-ngay", title: "Làm việc mỗi ngày", shortTitle: "Công việc hằng ngày", group: "Thực hiện workflow", minutes: 4,
    description: "Một nhịp làm việc rõ ràng: kiểm tra phản hồi, tìm khách mới và xem việc cần bạn xử lý.",
    sections: [
      { id: "routine", title: "Bắt đầu ngày làm việc", prompt: "Tiếp tục chiến dịch hiện tại. Trước tiên kiểm tra phản hồi mới và việc cần tôi xử lý. Sau đó tìm khách mới theo mục tiêu đã chốt và thực hiện các email đến hạn trong phạm vi tôi đã cho phép. Báo rõ phần nào chưa chạy được." },
      { id: "review", title: "Bạn chỉ cần xem ba việc", steps: [
        { title: "Khách nào cần trả lời?", body: "Ưu tiên phản hồi thật và các task cần xử lý. Nhân viên phụ trách tiếp tục tư vấn hoặc đặt lịch với khách." },
        { title: "Danh sách mới có đúng hướng?", body: "Nếu lead lệch ngành hoặc khu vực, yêu cầu chỉnh tiêu chuẩn cho những lượt tiếp theo." },
        { title: "Có bước nào đang chờ?", body: "Có thể cần đăng nhập lại, xử lý xác minh hoặc bổ sung thông tin. Claude cần nói rõ thay vì báo đã hoàn tất." }
      ] },
      { id: "schedule", title: "Nếu bạn muốn chạy theo lịch", paragraphs: ["Nói thời gian và múi giờ mong muốn. Người hỗ trợ kiểm tra khả năng tác vụ định kỳ của phiên bản/chế độ Claude Desktop hoặc cơ chế cục bộ có thể dùng.", "Viết “chạy mỗi sáng” vào chat chưa có nghĩa lịch đã được tạo. Nhờ kiểm tra thời điểm chạy tiếp theo và một lần chạy thử. Trong phạm vi này, công cụ chạy trực tiếp trên máy người dùng; không triển khai yêu cầu chạy khi máy tắt."], prompt: "Tôi muốn thực hiện công việc theo lịch trên máy của mình. Hãy kiểm tra môi trường hiện tại có hỗ trợ không. Nếu cần người hỗ trợ, nói rõ việc cần thiết lập; đừng báo đã tạo lịch khi chưa có công cụ thực hiện." },
      { id: "resume", title: "Trước khi kết thúc phiên", prompt: "Tóm tắt những việc đã làm, kết quả thực tế, việc đang chờ và bước tiếp theo. Nếu có công cụ lưu tiến trình, hãy lưu và cho tôi biết đã lưu ở đâu; nếu chưa có, cho tôi bản tóm tắt để dùng ở phiên sau." }
    ]
  },
  {
    slug: "bao-cao", title: "Đọc báo cáo và cải thiện", shortTitle: "Báo cáo hằng tuần", group: "Thực hiện workflow", minutes: 4,
    description: "Biết hoạt động nào tạo ra cơ hội thật, thay vì chỉ nhìn số khách hoặc số email đã gửi.",
    sections: [
      { id: "setup", title: "Chọn cách nhận báo cáo", paragraphs: ["Claude hỏi địa chỉ email nhận báo cáo, ngày, giờ và múi giờ. Người nhận do doanh nghiệp bạn chọn, không có email cố định.", "Bạn có thể xem bản nháp trong chat trước. Gửi định kỳ cần kết nối email và lịch đã được kiểm tra."], prompt: "Hãy giúp tôi thiết lập báo cáo hằng tuần. Hỏi địa chỉ nhận trước, rồi lần lượt hỏi ngày và giờ. Cho tôi xem mẫu báo cáo dễ đọc trước khi gửi." },
      { id: "metrics", title: "Những số liệu đáng xem", steps: [
        { title: "Khách mới phù hợp", body: "Bao nhiêu khách đạt chuẩn, được nhập vào TinaCRM và đến từ nguồn nào?" },
        { title: "Email và phản hồi", body: "Bao nhiêu email thực sự được gửi, bị trả lại hoặc nhận phản hồi? Bao nhiêu khách thể hiện quan tâm?" },
        { title: "Việc và cơ hội tiếp theo", body: "Những task nào cần xử lý, cuộc hẹn nào đã được ghi nhận và tuần sau nên thay đổi điều gì?" }
      ], note: { title: "Không có dữ liệu thì cần nói rõ", body: "Tỷ lệ mở hoặc click chỉ hiển thị nếu công cụ có dữ liệu tương ứng. Kết quả bán hàng cần được người phụ trách cập nhật. Không tự suy ra doanh thu từ số email." } },
      { id: "improve", title: "Dùng báo cáo để điều chỉnh", prompt: "Hãy xem kết quả tuần này và đề xuất một thay đổi đáng làm nhất cho tuần sau. Giải thích ngắn dựa trên dữ liệu thực tế, rồi hỏi tôi có muốn áp dụng không." }
    ]
  },
  {
    slug: "tro-giup", title: "Khi bạn cần một chút trợ giúp", shortTitle: "Câu hỏi & xử lý vướng mắc", group: "Trợ giúp", minutes: 5,
    description: "Không cần tự đoán lỗi. Dùng những câu dưới đây để Claude hướng dẫn bạn đi tiếp.",
    sections: [
      { id: "help", title: "Bắt đầu bằng câu này", prompt: "Tôi đang bị vướng ở bước này. Hãy hỏi tôi đang thấy gì trên màn hình, mỗi lần một câu. Hướng dẫn từng thao tác đơn giản và nói rõ nếu cần người hỗ trợ." },
      { id: "faq", title: "Những câu hỏi thường gặp", faqs: [
        { question: "Tôi không biết nên nói gì với Claude", answer: "Mở dự án workflow và gửi “Hãy giúp tôi bắt đầu, hỏi tôi từng câu”. Claude sẽ đề nghị gửi tài liệu, website hoặc tự trả lời từng câu về doanh nghiệp." },
        { question: "Claude nói đã làm nhưng tôi không thấy trong TinaCRM", answer: "Yêu cầu Claude kiểm tra lại bằng công cụ và cung cấp kết quả: ID bản ghi, số lượng nhập thành công và lỗi. Nội dung viết trong chat chưa có nghĩa dữ liệu đã được nhập." },
        { question: "Không thấy trình duyệt CloakBrowser mở", answer: "Nhờ Claude kiểm tra công cụ trình duyệt đã được kết nối chưa. Nếu chưa, chuyển cho người hỗ trợ thiết lập lần đầu. Claude không thể thay Chrome chỉ bằng một câu trong prompt." },
        { question: "Trang yêu cầu xác minh hoặc báo chặn", answer: "Dừng lượt truy cập đó. Tự xử lý xác minh trong cửa sổ nếu phù hợp hoặc chọn nguồn khác cùng Claude. Không yêu cầu truy cập lặp lại liên tục." },
        { question: "Tôi có phải gửi mật khẩu cho Claude không?", answer: "Không. Bạn tự nhập mật khẩu và mã xác minh trên màn hình đăng nhập/kết nối. Không gửi cookie, mật khẩu hoặc khóa kết nối trong chat." },
        { question: "Có cần duyệt từng email mãi không?", answer: "Bạn có thể duyệt kế hoạch và cho phép gửi tự động trong phạm vi chiến dịch cụ thể. Claude tiếp tục theo phạm vi đã chốt, đồng thời cần xin xác nhận khi thay đổi phạm vi đó." },
        { question: "Tại sao chưa tự chạy dù tôi đã đặt giờ?", answer: "Cần cơ chế chạy theo lịch thực tế và công cụ tương ứng. Nhờ người hỗ trợ kiểm tra môi trường, lịch và lần chạy thử. Một lời nhắc trong chat không tự tạo tác vụ định kỳ." },
        { question: "Doanh nghiệp khác có thể dùng cùng workflow không?", answer: "Có. Mỗi doanh nghiệp nên có dự án, thư mục, tài liệu và cấu hình kết nối riêng. Không dùng hồ sơ của doanh nghiệp khác làm thông tin mặc định." }
      ] },
      { id: "support", title: "Khi cần chuyển cho người hỗ trợ", paragraphs: ["Gửi bước bạn đang làm, thông báo lỗi và ảnh màn hình nếu cần. Che mật khẩu, mã xác minh và thông tin riêng tư trước khi gửi. Nếu không biết cách che, mô tả bằng lời trước."], prompt: "Hãy tóm tắt vướng mắc hiện tại thành một tin nhắn ngắn để tôi gửi người hỗ trợ. Nêu bước đang làm, lỗi thực tế và việc cần kiểm tra. Không đưa thông tin đăng nhập hoặc dữ liệu riêng tư vào tin nhắn." }
    ]
  }
];

export const groups = ["Làm quen", "Thực hiện workflow", "Trợ giúp"];
export const guideHref = (slug: string) => `/huong-dan/${slug}`;

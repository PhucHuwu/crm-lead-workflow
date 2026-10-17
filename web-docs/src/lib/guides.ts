import { folderGuide } from "./folder-guide";
import { downloadGuide } from "./download-guide";
import { tinaCrmGuide } from "./tinacrm-guide";
import { environmentGuide } from "./environment-guide";
import { codeDesktopGuides } from "./code-desktop-guides";

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

const baseGuides: Guide[] = [
  downloadGuide,
  folderGuide,
  codeDesktopGuides["claude-desktop"],
  codeDesktopGuides["thiet-lap"],
  environmentGuide,
  tinaCrmGuide,
  {
    slug: "doanh-nghiep", title: "Giới thiệu doanh nghiệp của bạn", shortTitle: "Giới thiệu doanh nghiệp", group: "Thực hiện workflow", minutes: 5,
    description: "Giúp Claude hiểu bạn bán gì, ai nên mua và vì sao họ nên chọn doanh nghiệp của bạn.",
    sections: [
      { id: "intro", title: "Bắt đầu từ thông tin bạn đang có", steps: [
        { title: "Đã đặt tài liệu trong inputs? Yêu cầu Claude đọc", body: "Claude đọc hồ sơ công ty trong 01_company_info và tài liệu sản phẩm trong 02_marketing_materials, rồi báo tệp nào chưa đọc được." },
        { title: "Có website? Hãy gửi đường dẫn", body: "Nói cho Claude biết đâu là website chính thức và trang dịch vụ quan trọng nhất." },
        { title: "Chưa có cả hai? Trả lời từng câu", body: "Claude sẽ hỏi tên doanh nghiệp, sản phẩm, nhóm khách thường mua và khu vực bạn muốn bán." }
      ], prompt: "Hãy tìm hiểu doanh nghiệp của tôi để chuẩn bị tìm khách hàng. Tài liệu đã nằm trong thư mục inputs; nếu cần, tôi gửi thêm website. Nếu còn thiếu thông tin, hỏi tôi từng câu; không tự tạo số liệu hay thành tích." },
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
      { id: "outputs", title: "Kết quả được lưu ở đâu?", paragraphs: ["Mở thư mục outputs trong thư mục workflow để xem các tệp Claude đã thực sự lưu."], steps: [
        { title: "outputs → 01_icp_criteria", body: "Tiêu chí khách hàng phù hợp." },
        { title: "outputs → 02_crawled_leads", body: "Danh sách khách tìm được." },
        { title: "outputs → 03_email_cadence", body: "Kế hoạch chăm sóc và nội dung email mẫu." },
        { title: "outputs → 04_weekly_reports", body: "Báo cáo công việc hằng tuần." }
      ], note: { title: "Kiểm tra tệp thực tế", body: "Nếu thư mục còn trống, hỏi Claude kết quả đã được lưu chưa và lưu ở đâu. Nội dung trong chat không tự trở thành tệp; tệp danh sách chưa đồng nghĩa đã nhập CRM, email mẫu chưa đồng nghĩa đã gửi." } },
      { id: "resume", title: "Trước khi kết thúc phiên", prompt: "Tóm tắt những việc đã làm, kết quả thực tế, việc đang chờ và bước tiếp theo. Lưu tiến trình vào config/workflow_progress.md để lần sau tiếp tục." }
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
        { question: "Tôi không biết nên nói gì với Claude", answer: "Mở dự án workflow và gửi “Hãy giúp tôi bắt đầu, hỏi tôi từng câu”. Claude kiểm tra tài liệu bạn đã đặt trong inputs, xem tiến trình lần trước và đề nghị bước tiếp theo bằng lựa chọn đánh số." },
        { question: "Claude nói đã làm nhưng tôi không thấy trong TinaCRM", answer: "Yêu cầu Claude kiểm tra lại bằng công cụ và cung cấp kết quả: ID bản ghi, số lượng nhập thành công và lỗi. Nội dung viết trong chat chưa có nghĩa dữ liệu đã được nhập." },
        { question: "Không thấy trình duyệt CloakBrowser mở", answer: "Nhờ Claude kiểm tra công cụ trình duyệt đã được kết nối chưa. Nếu chưa, chuyển cho người hỗ trợ thiết lập lần đầu. Claude không thể thay Chrome chỉ bằng một câu trong prompt." },
        { question: "Trang yêu cầu xác minh hoặc báo chặn", answer: "Dừng lượt truy cập đó. Tự xử lý xác minh trong cửa sổ nếu phù hợp hoặc chọn nguồn khác cùng Claude. Không yêu cầu truy cập lặp lại liên tục." },
        { question: "Tôi có phải gửi mật khẩu cho Claude không?", answer: "Không. Bạn tự nhập mật khẩu và mã xác minh trên màn hình đăng nhập/kết nối. Không gửi cookie, mật khẩu hoặc khóa kết nối trong chat." },
        { question: "Có cần duyệt từng email mãi không?", answer: "Bạn có thể duyệt kế hoạch và cho phép gửi tự động trong phạm vi chiến dịch cụ thể. Claude tiếp tục theo phạm vi đã chốt, đồng thời cần xin xác nhận khi thay đổi phạm vi đó." },
        { question: "Tại sao chưa tự chạy dù tôi đã đặt giờ?", answer: "Cần cơ chế chạy theo lịch thực tế và công cụ tương ứng. Nhờ người hỗ trợ kiểm tra môi trường, lịch và lần chạy thử. Một lời nhắc trong chat không tự tạo tác vụ định kỳ." },
        { question: "Doanh nghiệp khác có thể dùng cùng workflow không?", answer: "Có. Mỗi doanh nghiệp nên có thư mục workflow, tài liệu và cấu hình kết nối riêng. Không dùng hồ sơ của doanh nghiệp khác làm thông tin mặc định." }
      ] },
      { id: "support", title: "Khi cần chuyển cho người hỗ trợ", paragraphs: ["Gửi bước bạn đang làm, thông báo lỗi và ảnh màn hình nếu cần. Che mật khẩu, mã xác minh và thông tin riêng tư trước khi gửi. Nếu không biết cách che, mô tả bằng lời trước."], prompt: "Hãy tóm tắt vướng mắc hiện tại thành một tin nhắn ngắn để tôi gửi người hỗ trợ. Nêu bước đang làm, lỗi thực tế và việc cần kiểm tra. Không đưa thông tin đăng nhập hoặc dữ liệu riêng tư vào tin nhắn." }
    ]
  }
];

const adaptCodeText = (text: string) => text
  .replaceAll("Mở cuộc trò chuyện trong dự án đã được thiết lập", "Mở session trong tab Code, chọn Local và thư mục workflow")
  .replaceAll("Mở dự án workflow", "Mở thư mục workflow trong Code Local")
  .replaceAll("Mở dự án Claude", "Mở session Claude Code Local")
  .replaceAll("một dự án Claude riêng", "một thư mục và session Claude Code riêng")
  .replaceAll("dự án của doanh nghiệp", "session Code Local của doanh nghiệp")
  .replaceAll("dự án workflow", "session Code Local của workflow");
export const guides: Guide[] = baseGuides.map((guide) => codeDesktopGuides[guide.slug] ?? {
  ...guide,
  sections: guide.sections.map((section) => ({
    ...section,
    paragraphs: section.paragraphs?.map(adaptCodeText),
    prompt: section.prompt ? adaptCodeText(section.prompt) : undefined,
    steps: section.steps?.map((step) => ({ ...step, body: adaptCodeText(step.body) })),
    faqs: section.faqs?.map((faq) => ({ ...faq, answer: adaptCodeText(faq.answer) })),
  })),
});

export const groups = ["Chuẩn bị trên máy", "Mở bằng Claude", "Thực hiện workflow", "Trợ giúp"];
export const guideHref = (slug: string) => `/huong-dan/${slug}`;

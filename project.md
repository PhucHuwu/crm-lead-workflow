Một quy trình cho việc quản trị và chăm sóc khách hàng:

B1: Người dùng sử dụng Claude để thực hiện tất cả.  
B2: Người dùng gửi dữ liệu thông tin về công ty vào một folder có sẵn (slide, pdf, docx,...).  
B3: Claude tạo subagent để phân tích dữ liệu thông tin công ty.  
B4: Người dùng gửi các thông tin giới thiệu sản phẩm/dịch vụ của công ty vào một folder khác (slide, pdf, docx,...).  
B5: Claude tạo subagent để phân tích dữ liệu marketing.  
B6: 2 subagent sẽ làm việc với nhau để đưa ra các tiêu chí của lead (markdown/json/...).  
B7: Claude đưa ra công cụ, nền tàng để có thể cào dữ liệu từ các nguồn khác nhau (website, social media, email,...) để tìm kiếm lead.  
B8: Các agent sẽ sử dụng các tài khoản cá nhân mà người dùng cung cấp để cào dữ liệu từ các nguồn khác nhau.  
B9: Gọi webhook để gửi dữ liệu lên nền tảng CRM (tôi sẽ gửi thông tin webhook sau).  
B10: Agent sẽ lấy dữ liệu từ CRM và lên kế hoạch chăm sóc khách hàng, lên routine chăm sóc khách hàng.  
B11: Agent gửi mail chăm sóc khách hàng theo routine đã lên kế hoạch, đồng thời ghi nhận các phản hồi từ khách hàng.  
B12: Nếu khách hàng phản hồi thì tạo task trên CRM (sẽ gửi thông tin webhook sau) để nhân viên chăm sóc khách hàng thực hiện, nếu không thì huỷ chăm sóc khách hàng.  
B13: Tổng hợp dữ liệu hàng tuần về các lead đã cào, các lead đã chăm sóc,... và gửi cho email của người dùng để người dùng có thể theo dõi và đánh giá hiệu quả của quy trình chăm sóc khách hàng.  

Tôi cần tạo một quy trình như trên bao gồm cấu trúc thư mục, các gói SKILL, RULE, WORKFLOW,... để người dùng chỉ cần clone và import vào Claude là có thể sử dụng được.
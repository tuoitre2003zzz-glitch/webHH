window.createConstructionSimulation = (root) => {
    const elementIds = { cv: "estimate-construction-canvas", tag: "estimate-construction-tag", steps: "estimate-construction-steps", panel: "estimate-construction-panel" };
    const $ = id => root.querySelector(`#${elementIds[id] || id}`);
    const FH = 3.4, W = 8, D = 12, hw = W / 2, hd = D / 2;
    const BT = "TCVN 4453:1995 · TCVN 5593:2012 · TCVN 5574:2018";
    const S = [
        ["Chuẩn bị mặt bằng và định vị công trình", "Định vị", "TCVN 4055:2012 · QCVN 18:2021/BXD", ["Khảo sát hiện trạng, chụp ảnh nhà liền kề, lập biên bản hiện trạng với hàng xóm.", "Dọn mặt bằng, dựng rào che chắn, bảng công trình, kho vật tư, kéo điện nước tạm.", "Dùng máy toàn đạc hoặc laser xác định trục và cao độ chuẩn ±0.000, gửi mốc ra ngoài vùng thi công.", "Dựng ván cọc định vị, giăng dây trục, dọi điểm xuống đất, rải vôi bột đánh dấu mép đào."], ["Đo hai đường chéo, đối chiếu bản vẽ; lập biên bản định vị có chữ ký chủ nhà."]],
        ["Đào đất hố móng, vệ sinh đáy hố", "Đào móng", "TCVN 9361:2012 · QCVN 18:2021/BXD", ["Đào máy đến cách đáy thiết kế 10–15 cm, phần còn lại đào thủ công để không xáo trộn đất nền.", "Đào có mái dốc hoặc chống vách, làm rãnh thu nước và hố bơm để hố luôn khô.", "Vệ sinh đáy hố; bơm hết nước đọng và nghiệm thu đất nền trước khi đổ bê tông lót.", "Đào riêng từng hố móng; các đoạn giằng nối giữa các móng chưa đào ở giai đoạn này.", "Đào quanh cọc bằng thủ công để không làm lệch cọc; cọc giữ nguyên vị trí đã ép, lộ dần thân cọc trong hố."], ["Nghiệm thu đáy hố: cao độ, kích thước và đất nền đúng hồ sơ khảo sát."]],
        ["Ép cọc bê tông cốt thép theo hồ sơ thiết kế", "Ép cọc", "TCVN 9394:2012", ["Ép cọc tại từng vị trí đài theo số lượng, kích thước, chiều sâu, lực ép và độ chối trong hồ sơ thiết kế; mô hình minh họa một cọc mỗi đài.", "Nối các đoạn cọc theo thiết kế và quy trình được duyệt; kiểm soát độ thẳng đứng, lực ép và độ chối trong suốt quá trình.", "Ghi nhật ký từng cọc: chiều dài, lực ép, ngày giờ và các mối nối.", "Sau khi nghiệm thu cọc mới đào hố móng; bảo vệ đầu cọc và đập đầu cọc đến cao độ thiết kế theo chỉ dẫn kỹ thuật."], ["Đối chiếu vị trí, độ lệch tâm, lực ép và độ chối với hồ sơ thiết kế; lưu nhật ký ép cọc."]],
        ["Đổ bê tông lót móng", "BT lót móng", "TCVN 9361:2012 · TCVN 4453:1995", ["Đáy hố sạch, phẳng, không đọng nước.", "Đổ bê tông lót đá 4×6 mác 100 dày khoảng 100 mm, rộng hơn móng mỗi bên 10 cm.", "Gạt phẳng theo cao độ, chờ bê tông đủ cứng mới đặt thép.", "Vạch tim móng lên mặt bê tông lót bằng máy."], ["Kiểm tra cao độ và độ phẳng mặt bê tông lót."]],
        ["Gia công, lắp dựng cốt thép móng", "Thép móng", BT + " · TCVN 1651-2:2018", ["Thép đúng chủng loại trong hợp đồng, kiểm tra ký hiệu trên thanh thép; có chứng chỉ chất lượng, kiểm tra hàng thật giả.", "Thanh thép không gỉ sét, bề mặt sạch; giảm tiết diện do làm sạch không quá 2% đường kính.", "Cắt, uốn bằng phương pháp cơ học, hạn chế dùng nhiệt. Sai lệch theo TCVN 5593:2012: ±5 mm mỗi mét, ±20 mm toàn chiều dài, góc uốn ±3°.", "Nối buộc so le, không nối quá 50% diện tích thép tại một mặt cắt, chiều dài nối tối thiểu 30D, buộc chắc ít nhất 3 vị trí.", "Kê bằng cục kê bê tông đúc sẵn đúng lớp bảo vệ theo TCVN 5574:2018; tuyệt đối không dùng gạch vỡ kê thép."], ["Kỹ sư giám sát lập biên bản nghiệm thu cốt thép (công trình sẽ bị che lấp) trước khi đóng cốp pha."]],
        ["Lắp cốp pha móng", "Cốp pha móng", "Quy trình nghiệm thu móng · Quy trình nghiệm thu ván khuôn", ["Cốp pha ván hoặc xây gạch thành móng, đúng kích thước, tiết diện, cốt móng và giằng móng.", "Ván không mục, cong vênh; dùng cọc, cùm (gông), cây chống gia cố để không xô lệch khi đổ.", "Mối nối không xếp chồng ván, kín khít, đóng nẹp cố định mối nối; chỗ giáp nhà liền kề phải đóng bạt hoặc nylon ngăn cách.", "Cốp pha gạch xây thẳng hàng, chắc chắn, xây kín để không mất nước bê tông.", "Khoảng cách thép với cốp pha bảo đảm lớp bê tông bảo vệ; tưới ẩm cốp pha trước khi đổ."], ["Nghiệm thu cốp pha theo 7 bước: bản vẽ, vật liệu, kích thước, tim trục cao độ, gông cây chống, kín khít, vệ sinh."]],
        ["Đổ bê tông móng", "Đổ BT móng", BT + " · TCVN 8828:2011", ["Sau khi hố móng, cốp pha, cốt thép đạt mới đổ; không đạt thì làm lại bước trước.", "Bê tông tươi: kiểm tra phiếu xuất xưởng, lấy mẫu đo độ sụt (12±2 hoặc 14±2), thu tổ mẫu lưu; tuyệt đối không tự ý thêm nước.", "Bê tông trộn tại chỗ: kiểm tra cát, đá, xi măng, nước và tỷ lệ trộn, mác 250.", "Đổ liên tục từng lớp, đầm dùi đúng kỹ thuật, không đầm chạm thép.", "Tưới ẩm, che phủ bảo dưỡng liên tục."], ["Biên bản đổ bê tông, kết quả nén mẫu, ảnh từng đợt đổ."]],
        ["Tháo cốp pha móng và lấp đất", "Lấp đất móng", "TCVN 9361:2012", ["Tháo cốp pha khi bê tông đủ cường độ, không sứt cạnh.", "Vá chỗ rỗ, nứt bằng vữa không co ngót.", "Lấp đất đầm chặt từng lớp 20–30 cm, đều hai bên móng.", "Giữ thép chờ cột sạch, thẳng, che tránh gỉ."], ["Kiểm tra độ chặt đất lấp, vị trí thép chờ cột đúng tim."]],
        ["Thi công nền tầng trệt", "Nền trệt", "TCVN 9361:2012 · Quy trình xử lý bề mặt nền bê tông (21/4/2025)", ["Nền mới: đắp cát đầm chặt từng lớp 15–20 cm, phun thuốc phòng mối, trải nilon cách ẩm, đổ bê tông nền theo thiết kế, cán phẳng theo cao độ.", "Nền hư hỏng: khảo sát, lập biên bản kèm hình ảnh; dọn sạch, dùng máy mài bỏ lớp vữa bong tróc.", "Phương án kết nối: pha Sika Latex TH theo tỷ lệ 1 lít Sika + 1 lít nước + 1 kg xi măng (hoặc Sikadur 732 tỷ lệ A:B = 2:1) bằng máy trộn cầm tay; tưới ẩm bề mặt rồi lăn hoặc trét đều.", "Sau đó trộn bê tông đá mi, cán lớp mới đủ dày, làm mặt bằng thước nhôm, bay hoặc máy xoa nền; có thể dùng vữa tự san.", "Che chắn, bảo dưỡng theo quy trình, cắt rãnh làm khe co giãn."], ["Nghiệm thu: bề mặt phẳng, không rỗ, không lồi lõm; kiểm tra bám dính giữa bê tông cũ và mới; đo khối lượng thực tế."]],
        ["Cột tầng trệt: thép và cốp pha", "Cột trệt (thép)", BT, ["Cốt thép cột uốn cổ chai tại đoạn nối, gia cố đai toàn đoạn nối (a100 hoặc a150); nối so le, chiều dài nối tối thiểu 30D.", "Dùng cục kê treo cho cột; bọc nylon hoặc bạt quấn chân cột để bê tông không bám.", "Kiểm tra định vị tim cột và cao độ bằng máy theo bản vẽ đã duyệt.", "Cốp pha cột sạch, kín khít, gông chắc, cây chống xiên; chân cây chống đặt trên nền ổn định, không đặt trực tiếp trên đất, cát."], ["Biên bản nghiệm thu thép và cốp pha; kiểm tra lại tim trục sau khi cố định cây chống."]],
        ["Đổ bê tông cột tầng trệt", "Đổ BT cột trệt", BT + " · TCVN 8828:2011", ["Vệ sinh hồ, bê tông bám thép cột; xử lý kết nối bê tông cũ và mới ở chân cột bằng hồ dầu.", "Đổ từng đoạn cao tối đa 1,5 m, tuyệt đối không đổ từ trên cao xuống (gây phân tầng, rỗ chân cột); cột cao dưới 5 m đổ liên tục.", "Bê tông M250 R28 (cần thiết dùng R14 và phụ gia chống thấm B8), độ sụt 12±2 hoặc 14±2; không tự ý thêm nước.", "Sau khi đổ kiểm tra lệch tim để điều chỉnh kịp thời.", "Bảo dưỡng ẩm; tháo cốp pha cột tối thiểu sau 1–2 ngày."], ["Lấy mẫu nén; kiểm tra độ thẳng đứng và bề mặt cột không rỗ."]],
        ["Xây tường tầng trệt", "Xây tường trệt", "TCVN 4085:2011 · Quy trình xây tường", ["Tưới ẩm nền, cột, dầm; kéo dây căng và dây lèo; định vị chính xác cửa trước khi xây hàng gạch thẻ định vị chân tường trên lớp vữa 15–20 mm.", "Tường bao 200 xây 5 lớp gạch ống rồi 1 hàng gạch thẻ quay ngang; tường ngăn 100; xây tường bao trước, tường chính trước, xây hai đầu trước.", "Khu vực WC, ban công, sân thượng, sê nô, sàn mái, giếng trời xây 3 hàng gạch thẻ, không dùng gạch ống.", "Thép râu chờ tại cột; trát hồ dầu bề mặt cột; lanh tô cửa; chèn gạch thẻ quanh khung cửa; mỗi đợt xây không quá 1,5 m, tưới nước trước khi xây đợt kế tiếp.", "Mạch vữa ngang khoảng 12 mm, mạch đứng khoảng 10 mm (trong khoảng 8–15 mm), no vữa; xây đến dầm thì khóa đỉnh tường bằng 3 hàng gạch thẻ.", "Bảo dưỡng: phun nước giữ ẩm 2–3 ngày liên tục, che chắn khi nắng gắt hoặc mưa.", "Xây bậc tam cấp bằng gạch theo bản vẽ; phần ốp đá hoàn thiện ở bước ốp lát."], ["Dùng dọi, thước tầm, ke kiểm tra độ thẳng, phẳng, vuông góc và kích thước ô cửa."]],
        ["Dựng giàn giáo, cốp pha dầm sàn lầu 1", "Cốp pha sàn L1", "Quy trình nghiệm thu ván khuôn (8/2026) · Quy trình cột dầm sàn", ["Kiểm tra bản vẽ kiến trúc, kết cấu, điện nước đồng thời để phát hiện sai sót: tim trục, kích thước, cao độ, ô thông tầng, hộp kỹ thuật, vị trí chờ.", "Cốp pha cứng, phẳng, không mục, cong vênh; ván tái sử dụng phải sạch bê tông bám dính.", "Dựng cốp pha và cây chống cho cả ban công trước, dầm đặt trên 2 cột trước hiên và ban công tròn bán nguyệt cạnh cửa sổ: lót ván, chống đỡ đủ cây, ván thành cong ghép theo đúng bán kính, rồi mới lắp thép và đổ bê tông.", "Hạ cốt cốp pha sàn ban công, nhà vệ sinh theo bản vẽ; hộp kỹ thuật, sàn vệ sinh, ban công phải ghép cốp pha đổ gờ bê tông cao tối thiểu 150 mm so với mặt trên dầm.", "Kiểm tra cây chống, khóa liên kết, thanh giằng, gông cùm, khoảng cách cây chống; chân cây chống đặt trên nền ổn định.", "Ván nối kín khít không có khe hở; sàn phủ bạt sọc trước khi lắp thép."], ["Nghiệm thu cốp pha theo 7 bước, đo lại tim trục, cao độ sau khi cố định cây chống."]],
        ["Cốt thép dầm sàn lầu 1 và ống chờ", "Thép sàn L1", BT, ["Thép dầm, sàn bố trí ngay ngắn; thép chính và thép phụ không xô đẩy lên nhau.", "Kê cục kê bê tông đúc sẵn cho sàn, dầm giằng, đúng lớp bảo vệ.", "Có thép gia cường tại vị trí tường xây trên sàn, lỗ xuyên sàn, hộp kỹ thuật, kể cả khi bản vẽ không thể hiện.", "Ống xuyên sàn đặt sẵn ống chờ và thanh trương nở, không đục sàn lắp ống sau; lắp ống điện nước âm sàn.", "Thép sàn có móc ở vùng chịu kéo (đối với thép tròn trơn)."], ["Kỹ sư giám sát lập biên bản nghiệm thu cốt thép trước khi đổ."]],
        ["Đổ bê tông dầm sàn lầu 1", "Đổ BT sàn L1", BT + " · TCVN 8828:2011", ["Chuẩn bị thước gạt, đầm dùi, bạt che; nắm lịch cắt điện; rửa sạch sàn; tưới ẩm cốp pha ngay trước khi đổ.", "Đổ bê tông sàn từng dải 1–2 m nối tiếp, giật lùi từ xa đến gần, từ trong ra ngoài, từ thấp lên cao, dùng đầm.", "Mạch ngừng (nếu bắt buộc) đặt ở vị trí chịu lực nhỏ, theo Bảng 18 TCVN 4453:1995, thời gian ngừng khoảng 20–24 giờ; xử lý kỹ bề mặt trước khi đổ tiếp.", "Gạt mặt, tạo dốc đồng thời theo thiết kế thoát nước.", "Sau 1–2 giờ phun nước giữ ẩm, phủ bao bố hoặc bạt; bảo dưỡng liên tục.", "Tháo cốp pha dầm sàn sau 21 ngày (dùng R14 có thể sớm hơn)."], ["Lấy mẫu nén; kiểm tra độ phẳng, độ võng sàn sau khi tháo cốp pha."]],
        ["Cột tầng lầu 1", "Cột lầu 1", BT, ["Dọi lại tim trục tầng trên, thép chờ cột đúng vị trí.", "Lắp thép cột, cốp pha cột như tầng trệt (nối 30D, đai gia cố, cục kê treo).", "Đổ bê tông từng đoạn tối đa 1,5 m, xử lý hồ dầu chân cột, không đổ từ trên cao.", "Bảo dưỡng, tháo cốp pha cột sau 1–2 ngày; kiểm tra lệch tim.", "Chỉ tháo cây chống tạm dưới mái đua ban công khi bê tông sàn đạt cường độ theo thiết kế và được nghiệm thu."], ["Mẫu nén, độ thẳng đứng cột."]],
        ["Xây tường tầng lầu 1", "Xây tường L1", "TCVN 4085:2011", ["Thực hiện như tầng trệt: định vị, tưới ẩm, hồ dầu, thép râu, lanh tô, khóa đỉnh tường.", "Vách lắp tủ bếp treo xây gạch thẻ; góc không có cột dùng kỹ thuật xây câu bằng gạch thẻ.", "Lắp gạch bông gió, gạch kính lấy sáng, lam bê tông theo thiết kế; không dùng gạch cong vênh, nứt, kích thước không đều."], ["Kiểm tra độ phẳng, thẳng đứng, góc vuông; kiểm tra bằng thước tầm hoặc đèn soi."]],
        ["Cốp pha và cốt thép sàn mái", "Cốp pha sàn mái", "Quy trình cột dầm sàn · Quy trình cấp thoát nước", ["Dựng giàn giáo, cốp pha như sàn lầu 1; đổ gờ bê tông cao tối thiểu 150 mm quanh sàn mái, sân thượng.", "Lắp thép sàn mái, sê nô, thép mũ đúng thiết kế.", "Đặt ống chờ xuyên sàn kèm thanh trương nở; chuẩn bị quả cầu chắn rác cho phễu thu sê nô, sàn mái.", "Nghiệm thu thép, cốp pha bằng biên bản."], ["Kiểm tra độ dốc về phễu thu và vị trí ống chờ."]],
        ["Đổ bê tông sàn mái", "Đổ BT sàn mái", BT + " · TCVN 8828:2011", ["Đổ như sàn lầu 1: dải 1–2 m, giật lùi, đầm kỹ.", "Gạt mặt, tạo dốc thoát nước đồng thời; có thể dùng phụ gia chống thấm B8.", "Phun nước giữ ẩm sau 1–2 giờ, che phủ, bảo dưỡng liên tục.", "Tháo cốp pha khi đủ thời gian (21 ngày với dầm sàn)."], ["Mẫu nén, kiểm tra độ phẳng và độ dốc sàn mái."]],
        ["Lợp ngói và xử lý khe tiếp giáp", "Lợp ngói", "Quy trình chống thấm bổ sung 2026", ["Ốp ngói (hoặc lợp tôn) lên hệ litô thép theo thiết kế, từ dưới lên, đúng độ dốc; úp nóc, diềm mái, máng xối kín nước.", "Khe giữa tường nhà và công trình liền kề: vệ sinh sạch, lắp thanh trương nở kín khe (đỉnh tường bằng nhau), rồi chống thấm theo quy trình.", "Đỉnh tường hai bên không bằng nhau: cắt rãnh sâu 1–2 cm trên tường bên cao, có độ nghiêng ngoài thấp hơn trong, lắp tole phẳng hoặc tấm inox ngàm vào rãnh, bắt đinh vít, chít keo silicon ngoài trời đầy rãnh.", "Mái che polycarbonate (nếu có): độ dốc trung bình 10 độ, mặt có decal quay lên, dùng nẹp nhôm chữ H, khoan mồi lỗ lớn hơn thân vít 3–5 mm, vít có ron cao su và nút chụp.", "Lắp tole, silicon vào khe giữa mái che và tường tương tự."], ["Kiểm tra tole cố định chắc, rãnh chít keo liền mạch; thử bằng vòi phun nước hoặc mưa; lập biên bản kèm ảnh."]],
        ["Lắp đặt điện nước âm", "Điện nước âm", "TCVN 4519:1988 · TCVN 9206:2012 · Quy trình cấp thoát nước (16/10/2025)", ["Ống PVC cho nước lạnh, PPR cho nước nóng. Trục đứng gồm 4 trục độc lập: thoát nước mưa, thoát sinh hoạt (Ø90–114), thoát phân (Ø114), thông hơi hầm tự hoại (Ø42); thoát ban công tối thiểu Ø60–90.", "Chuyển hướng bằng co lơi, co Y, co T cong; hạn chế co L, co T và đường ống gấp khúc. Độ dốc theo Bảng 2 TCVN 4519:1988 (Ø60 tiêu chuẩn 2,8%; Ø90 2,2%; Ø114 1,7%), trung bình tối thiểu 1–2%.", "Lắp phễu thu có quả cầu chắn rác; xi phông (con thỏ) cho ống thoát sàn; trục ngang dùng ty treo, cùm Omega; trục đứng dùng dây rút và nẹp.", "Cấp nước từ bồn xuống giảm dần đường kính, lắp van một chiều và ống thông hơi; rẽ nhánh từng tầng từ trục thẳng đứng; ống song song, vuông góc với sàn tường.", "Đầu chờ thiết bị lắp bít, không dùng băng keo, vỏ bao, nylon; lắp vòi nước lạnh cho vệ sinh, sân thượng, ban công, bồn hoa trệt kể cả khi bản vẽ không thể hiện.", "Dây điện lõi đồng luồn ống PVC âm tường, tách mạch riêng điều hòa, bình nóng lạnh; tủ điện có CB, chống giật, nối đất."], ["Thử áp lực: bít đầu chờ, xả khí, bơm nước theo dõi 30 phút không sụt quá 0,5 kg/cm²; niêm phong van theo dõi 24 giờ sụt dưới 1 kg/cm² thì đạt; sau đó mới xây hộp gen và chừa ô cửa thăm."]],
        ["Tô trát tường, trần và tam cấp", "Tô trát", "Quy trình trát tường (30/10/2025)", ["Chỉ trát sau khi xây xong khoảng 10–15 ngày (trường hợp gấp phải thống nhất, tuyệt đối không dưới 2 ngày); đục bỏ bê tông, hồ thừa; tường khô thì tưới ẩm vừa đủ.", "Chỗ lắp hệ thống âm tường, tiếp giáp tường với cột dầm, góc lanh tô cửa đóng lưới mắt cáo chống nứt, phủ mỗi cạnh ít nhất 150 mm.", "Đắp mốc chính, mốc phụ, làm dải mốc. Vữa mác 75: 1 bao xi măng 50 kg + 12 thùng cát 18 lít + 3 thùng nước (thực tế giảm còn 11 thùng cát để dẻo, bám dính tốt); chỗ cần chống thấm dùng mác 100 (1 bao + 9 thùng cát + 2 thùng nước).", "Trát từ trên xuống, trần dầm trước tường cột; bề mặt bê tông quét hồ dầu; cán phẳng bằng thước tầm, xoa nhẵn nhiều lần, quét bỏ cát thừa.", "Trát 2 lớp cách nhau 3–4 giờ, mỗi lớp không quá 8 mm, tổng không quá 20 mm.", "Trát phẳng cả mặt đứng và mặt bậc tam cấp; hoàn thiện bậc, cổ bậc, cạnh mũi bậc rồi bảo dưỡng ẩm.", "Bệ cửa sổ trát hèm ngăn nước mưa, bệ cửa và đầu tường hồi, lan can tạo dốc thoát nước; phun nước giữ ẩm 2–3 ngày."], ["Nghiệm thu: phẳng, thẳng đứng, góc vuông, gờ chỉ sắc cạnh; gõ không bộp, không nứt chân chim; tam cấp phẳng và cạnh bậc thẳng."]],
        ["Chống thấm sàn mái, sân thượng, ban công", "Chống thấm", "Quy trình chống thấm 2025–2026 · TCVN 5718:1993", ["Làm sạch bề mặt, xử lý góc cạnh, cổ ống (thanh trương nở đã đặt khi đổ sàn), phễu thu.", "Chống thấm gốc xi măng polymer nhiều lớp, quét chéo nhau, lật cao chân tường và chân cột mái tối thiểu 30 cm.", "Ngâm nước thử 24–48 giờ ở sàn mái, sân thượng, ban công, sê nô, sàn bồn nước, bồn hoa trên cao để phát hiện thiếu sót; đạt mới được dựng sườn thép và lợp mái.", "Thấm cục bộ thì ghi nhận vị trí, xử lý lại đến khi hết thấm; chụp ảnh từng lớp."], ["Biên bản ngâm nước có chữ ký chủ nhà trước khi dựng sườn thép mái."]],
        ["Ốp lát gạch", "Ốp lát", "Quy trình ốp lát gạch (30/4/2025)", ["Sàn vệ sinh, ban công, bồn hoa trệt: chống thấm nhiều lớp, lật cao chân tường tối thiểu 30 cm, ngâm nước thử 24–48 giờ, đạt mới cán nền.", "Dọn sạch tường, sàn; dùng máy laser, thủy bình đánh mốc; gạch ngâm nước 15–30 phút trước khi thi công.", "Chọn lát nguội (chờ nền khô, bám chắc) hoặc lát sống (cần thợ tay nghề cao).", "Dán gạch tường: trét keo đều lên mặt gạch, lát viên định vị từ dưới lên, dán cùng chiều gân mặt sau, dùng kích đỡ, nêm, ke để ron đều khoảng 2 mm, gõ búa cao su.", "Lát nền: tưới ẩm, cán hồ theo cốt nền và độ dốc, tưới hồ dầu trước khi lát; keo chà ron sau 1 ngày (Cá Sấu, Sika, Saveto, Weber).", "Độ dốc sàn 1–2% thoát nước tốt; nền vệ sinh, ban công lát âm 3–5 cm; thềm ba, sảnh lát âm dương; cắt xéo 45° ở góc cạnh; vị trí phễu thu cắt gạch theo đường xéo.", "Dùng bạt che bảo quản nền gạch; đầu ren trong bằng mặt gạch ốp tường cho thiết bị."], ["Gõ không bộp, mạch phẳng không gờ cộm; xả nước thử không đọng vũng."]],
        ["Bả matit và sơn", "Bả & sơn", "Quy trình bả matit (18/11/2025)", ["Kỹ sư kiểm tra tường: tường trát ít nhất 7 ngày, độ ẩm 22–28%; tường chưa bảo đảm thì không bả; tường quá khô phải tạo ẩm.", "Bột bả trong và ngoài đúng hợp đồng, không dùng bột nội thất cho bên ngoài; giấy nhám hạt 120, 150, 180.", "Che bạt nền đã lát; vệ sinh bề mặt; trộn bột vào nước sạch (không làm ngược) bằng cần trộn điện, chỉ dùng bột đã trộn trong khoảng 2 giờ.", "Lớp bả 1 dày khoảng 1 mm; lớp 2 sau 12–24 giờ, dày khoảng 1 mm; tổng lớp bả không quá 3 mm.", "Xả nhám, dùng đèn rọi kiểm tra độ phẳng, vệ sinh bụi bằng chổi cỏ hoặc máy nén; sau đó sơn lót và sơn phủ."], ["Rọi đèn: phẳng mịn, không lồi lõm, không lộ vữa trát; góc cạnh vuông thẳng; đế âm tường trét kín."]],
        ["Lắp cửa, thiết bị, lan can, cổng và hàng rào", "Cửa & thiết bị", "TCVN 9206:2012", ["Lắp khung cửa, cửa đi, cửa sổ (khung đen) đúng cao độ, bắn silicon quanh khung.", "Lắp lan can ban công (sắt nghệ thuật), cố định chắc chắn theo hồ sơ thiết kế.", "Lắp thiết bị vệ sinh vào đầu ren chờ sẵn, thử xả nước; mở ô cửa thăm hộp kỹ thuật.", "Lắp đèn, công tắc, ổ cắm, thử từng mạch.", "Lắp cổng và hoàn thiện hàng rào; lát sân, lối đi, trồng cỏ cây và lắp đèn ngoại thất."], ["Đóng mở thử cửa và cổng; thử nước, thử điện; kiểm tra hàng rào chắc chắn."]],
        ["Nghiệm thu và bàn giao", "Hoàn thiện, nghiệm thu & bàn giao", "TCVN 4055:2012 · Nghị định 06/2021/NĐ-CP", ["Vệ sinh công nghiệp toàn nhà: lau kính, cửa, thiết bị, hút bụi sàn, chà keo ron nền lần cuối; thu dọn vật tư, tháo rào che chắn tạm và giàn giáo.", "Chạy thử toàn bộ hệ thống: điện từng mạch, CB chống giật, cấp thoát nước, bồn nước mái, bình nóng lạnh; đóng mở thử cửa, khóa và cổng.", "Kiểm tra lại bề mặt sơn, ốp lát, trần, chống thấm; xử lý toàn bộ hạng mục tồn đọng trước ngày bàn giao.", "Cùng chủ nhà kiểm tra từng phòng, từng hạng mục theo hợp đồng và bản vẽ; hướng dẫn sử dụng thiết bị, tủ điện, van nước, hộp kỹ thuật và cách bảo quản vật liệu.", "Bàn giao chìa khóa, hồ sơ hoàn công, bản vẽ hoàn công, biên bản nghiệm thu, nhật ký thi công và phiếu bảo hành; thống nhất lịch kiểm tra sau bàn giao."], ["Danh mục tồn đọng được xử lý 100%; biên bản nghiệm thu và bàn giao có chữ ký hai bên."]]
    ];
    [S[1], S[2]] = [S[2], S[1]]; S.splice(22, 0, S.splice(19, 1)[0]);
    const NEWSEG = [
        ["Bê tông lót đáy hố móng", "BT lót hố", "TCVN 9361:2012 · TCVN 4453:1995", ["Cọc giữ nguyên vị trí đã ép; đập bỏ phần đầu cọc dư đến cao độ thiết kế (đầu cọc hạ dần xuống sát đáy hố rồi nằm trong lớp bê tông lót), để lộ thép neo, vệ sinh sạch.", "Nghiệm thu đáy hố: sạch, khô, đúng cao độ; có nước đọng thì bơm hút.", "Đổ lớp bê tông lót đá 4×6 mác 100 dày khoảng 100 mm xuống đáy từng hố móng, rộng hơn móng mỗi bên 5–10 cm.", "Gạt phẳng theo cao độ, chờ bê tông đủ cứng mới đặt thép.", "Vạch tim móng và tim cột lên mặt bê tông lót bằng máy."], ["Kiểm tra cao độ và độ phẳng mặt bê tông lót."]],
        ["Đào rãnh giằng móng và đổ bê tông lót", "Đào rãnh + lót giằng", "TCVN 9361:2012", ["Vạch tim giằng móng từ tim các cột, đào rãnh nối các móng đến cao độ thiết kế; vệ sinh đáy rãnh.", "Đổ bê tông lót đá 4×6 mác 100 dày khoảng 100 mm đáy rãnh nối liền các móng.", "Gạt phẳng, chờ đủ cứng mới dựng cốp pha giằng móng."], ["Kiểm tra tim, cao độ đáy rãnh giằng móng so với móng."]],
        ["Gia công, lắp dựng cốt thép móng và thép chờ cột", "Cốt thép móng", BT + " · TCVN 1651-2:2018", ["Thép đúng chủng loại trong hợp đồng, có chứng chỉ, ký hiệu rõ trên thanh thép; không gỉ sét, giảm tiết diện không quá 2%.", "Cắt, uốn cơ học theo bản vẽ, sai lệch theo TCVN 5593:2012 (±5 mm mỗi mét, ±20 mm toàn chiều dài, góc uốn ±3°).", "Móng chưa đổ, lưới thép móng đặt trên lớp bê tông lót bằng con kê bê tông đúc sẵn, không dùng gạch vỡ; buộc chắc các điểm giao.", "Dựng thép chờ cột (đoạn thấp, chỉ nhô cao khỏi mặt đất khoảng 1 m) cùng thép đai; phần thép cột lên trên sẽ nối sau ở bước cột tầng trệt.", "Móng nằm ở rìa công trình thì thép chờ cột đặt lệch hẳn về phía mép ngoài: móng góc lệch cả hai phương, móng biên lệch một phương; chỉ 2 móng ở giữa mới đặt thép cột ở tâm. Chân thép bẻ L hướng vào trong móng.", "Giằng chống thép cột để đứng thẳng, đúng tim; con kê giữ lớp bảo vệ theo TCVN 5574:2018."], ["Kỹ sư giám sát lập biên bản nghiệm thu cốt thép trước khi đóng cốp pha."]],
        ["Lắp cốp pha móng", "Cốp pha móng", "Quy trình nghiệm thu móng · Quy trình nghiệm thu ván khuôn", ["Dựng cốp pha bao quanh từng móng đúng kích thước, kín khít, không mục, cong vênh.", "Gia cố bằng cọc, cùm (gông), cây chống để không xô lệch khi đổ; mối nối không xếp chồng ván, đóng nẹp.", "Chỗ giáp nhà liền kề đóng bạt hoặc nylon ngăn cách.", "Kiểm tra khoảng cách thép với cốp pha bảo đảm lớp bê tông bảo vệ; tưới ẩm ván trước khi đổ."], ["Nghiệm thu cốp pha theo 7 bước trước khi đổ."]],
        ["Đổ bê tông móng", "Đổ BT móng", BT + " · TCVN 8828:2011", ["Chỉ đổ bê tông vào các hố móng tới cao độ móng.", "Bê tông tươi: kiểm tra phiếu xuất xưởng, đo độ sụt 12±2 hoặc 14±2, thu tổ mẫu lưu, tuyệt đối không tự ý thêm nước. Bê tông trộn tại chỗ: kiểm tra cát, đá, xi măng, nước và tỷ lệ, mác 250.", "Đổ từng lớp, đầm dùi cắm thẳng đứng, bước đầm đều, không đầm chạm thép, đến khi hết bọt khí và nổi nước xi măng.", "Che phủ, tưới ẩm bảo dưỡng liên tục."], ["Biên bản đổ bê tông, mẫu nén có kết quả, ảnh từng móng."]],
        ["Lắp cốp pha giằng móng", "Cốp pha giằng", "Quy trình nghiệm thu ván khuôn · Quy trình nghiệm thu móng", ["Đặt cốp pha hai bên dọc theo tim giằng móng, nối giữa các hố, lên đến cao độ thiết kế.", "Cốp pha có thể là ván hoặc xây gạch; gạch xây thẳng hàng, chắc, xây kín để không mất nước bê tông.", "Chống đỡ bằng cọc, cùm, cây chống; mối nối kín khít.", "Kiểm tra tim trục, cao độ bằng máy; tưới ẩm trước khi đổ."], ["Nghiệm thu cốp pha theo 7 bước: bản vẽ, vật liệu, kích thước, tim trục cao độ, gông cây chống, kín khít, vệ sinh."]],
        ["Lắp thép giằng móng, buộc vào thép chờ cột", "Thép giằng móng", BT + " · TCVN 1651-2:2018", ["Lắp thép dọc và thép đai giằng móng trong lòng cốp pha, buộc liên kết với thép chờ cột đã dựng ở bước thép móng.", "Nối thép so le, không nối quá 50% diện tích thép tại một mặt cắt, chiều dài nối tối thiểu 30D.", "Dùng cục kê bê tông đúc sẵn, không dùng gạch vỡ; đai dày hơn ở nút giao giằng móng và cột.", "Kiểm tra lại thép chờ cột còn thẳng đứng, đúng tim sau khi lắp thép giằng móng."], ["Lập biên bản nghiệm thu cốt thép giằng móng trước khi đổ."]],
        ["Đổ bê tông giằng móng và cổ cột", "Đổ BT giằng móng", BT + " · TCVN 8828:2011", ["Đổ bê tông mác 250 vào cốp pha giằng móng, nối liền các móng, lên đến cao độ thiết kế.", "Đầm dùi kỹ, nhất là các nút giao với cột; không đầm chạm thép và cốp pha.", "Mạch ngừng (nếu có) làm nhám, quét nước xi măng trước khi đổ tiếp.", "Bảo dưỡng ẩm, thu tổ mẫu lưu."], ["Mẫu nén, kiểm tra cao độ mặt giằng móng."]],
        ["Tháo cốp pha giằng móng, lấp đất rãnh và đổ cát lấp nền", "Lấp rãnh, cát nền", "TCVN 9361:2012 · Quy trình xử lý bề mặt nền bê tông (21/4/2025)", ["Tháo cốp pha giằng móng khi bê tông đủ cường độ, không sứt cạnh; vá chỗ rỗ, nứt bằng vữa không co ngót.", "Lấp đất rãnh giằng móng, đầm chặt từng lớp 20–30 cm hai bên giằng.", "Đổ cát san lấp lòng nền bằng cao độ mặt bê tông giằng móng, đầm chặt từng lớp 15–20 cm, tưới ẩm khi đầm; phun thuốc phòng mối.", "Nền bê tông sau này nếu hư hỏng: khảo sát, mài bỏ vữa bong, quét Sika Latex TH (1 lít + 1 lít nước + 1 kg xi măng) hoặc Sikadur 732 (A:B = 2:1), rồi cán bê tông đá mi, cắt khe co giãn."], ["Kiểm tra cao độ nền bằng máy, độ chặt từng lớp."]],
        ["Nối thép và lắp cốp pha cột tầng trệt", "Thép + cốp pha cột", "Quy trình nghiệm thu ván khuôn · Quy trình cột dầm sàn", ["Nối thép cột vào thép chờ từ giằng móng, lên tới cao độ sàn lầu 1; nối so le, chiều dài nối tối thiểu 30D, uốn cổ chai tại đoạn nối, gia cố đai a100 hoặc a150.", "Dùng cục kê treo giữ lớp bảo vệ, bọc nylon chân cột.", "Dựng cốp pha cột, gông chắc, chống xiên hai phương; chân cây chống đặt trên nền ổn định.", "Kiểm tra tim cột, cao độ bằng máy; vệ sinh chân cột, chừa cửa vệ sinh ở đáy cốp pha; tưới ẩm cốp pha ngay trước khi đổ."], ["Biên bản nghiệm thu thép và cốp pha cột; kiểm tra lại tim sau khi cố định cây chống."]],
        ["Đổ bê tông cột tầng trệt (đầm dùi)", "Đổ BT cột trệt", BT + " · TCVN 8828:2011", ["Vệ sinh chân cột, xử lý kết nối bê tông cũ và mới bằng hồ dầu.", "Đổ từng đoạn cao tối đa 1,5 m, dùng phễu hoặc ống dẫn, tuyệt đối không đổ từ trên cao xuống (phân tầng, rỗ chân cột).", "Đầm dùi cắm thẳng đứng, đầm đều đến khi hết bọt khí; có thể gõ búa cao su thành cốp pha.", "Bê tông M250 R28 (cần thì dùng R14 và phụ gia chống thấm B8), độ sụt 12±2 hoặc 14±2; không tự ý thêm nước.", "Kiểm tra lệch tim sau khi đổ; bảo dưỡng ẩm; tháo cốp pha cột sau 1–2 ngày."], ["Lấy mẫu nén; kiểm tra độ thẳng đứng và bề mặt cột không rỗ."]]
    ];
    S.splice(3, 8, ...NEWSEG);
    {
        const f = n => S.find(x => x[1] == n); const o = {};["Điện nước âm", "Tô trát", "Chống thấm", "Lợp ngói", "Ốp lát"].forEach(n => o[n] = f(n));
        const CM = ["Thi công cột bê tông cốt thép mái và lắp dựng kèo, xà gồ, hệ sườn thép mái", "Cột mái + sườn thép mái", BT + " · TCVN 8828:2011 · TCVN 5575:2012", ["Dọi tim trục từ tầng dưới lên sàn mái; thép chờ cột chừa sẵn khi đổ sàn mái, nối so le, chiều dài nối tối thiểu 30D.", "Lắp thép cột và thép đai gia cố, kê đúng lớp bảo vệ; dựng ván khuôn, gông chắc và chống xiên hai phương.", "Đổ bê tông từng đoạn tối đa 1,5 m, đầm dùi kỹ, xử lý mạch ngừng chân cột bằng hồ dầu.", "Chờ bê tông đạt cường độ yêu cầu rồi tháo ván khuôn, kiểm tra bề mặt và độ thẳng đứng.", "Chia cột mái thành 5 hàng từ trái sang phải: thấp, cao, thấp, cao, thấp; hai hàng cao tạo đỉnh cho hai phần mái. Chừa bản mã hoặc bu lông chờ để liên kết sườn thép mái.", "Gia công kèo, xà gồ thép mạ kẽm theo bản vẽ; sơn chống gỉ các mối cắt, mối hàn.", "Dựng kèo thép lên đỉnh cột bê tông, liên kết bản mã bằng bu lông hoặc hàn đúng quy cách; kiểm tra thẳng đứng và khoảng cách giữa các vì kèo.", "Lắp xà gồ đúng bước, đúng độ dốc mái, bắt chặt vào kèo; lắp giằng chéo ổn định khung.", "Lắp hệ litô theo bước ngói để chuẩn bị ốp ngói."], ["Kiểm tra tim, độ thẳng đứng và cao độ đỉnh cột; mẫu nén, bản mã, độ võng, độ dốc, mối liên kết và lớp sơn chống gỉ trước khi lợp."]];
        const UG = ["Lắp đường ống âm dưới nền", "Ống âm nền", "TCVN 4519:1988 · TCVN 9206:2012", ["Sau khi đầm cát nền, định vị và lắp các tuyến ống cấp thoát nước, ống luồn dây điện âm dưới nền theo bản vẽ.", "Tạo độ dốc thoát nước liên tục, cố định ống để không xê dịch khi lấp bảo vệ và đổ bê tông.", "Bịt đầu chờ, thử kín/áp lực các tuyến ống; chụp ảnh, ghi nhận vị trí trước khi che khuất."], ["Nghiệm thu cao độ, độ dốc, mối nối và kết quả thử kín trước khi thi công đà sàn nền."]];
        const DN = ["Làm đà sàn nền: cốp pha biên và thép lưới nền", "Đà sàn nền", "TCVN 9361:2012", ["Sau khi lắp và nghiệm thu đường ống âm dưới nền, bảo vệ các tuyến ống rồi trải nylon cách ẩm lên mặt cát.", "Dựng cốp pha biên và làm các đà sàn nền (dải chia ô) theo bản vẽ, đúng cao độ thiết kế.", "Đặt lưới thép sàn nền theo bản vẽ trên con kê, buộc chắc các điểm giao; chừa thép chờ cho cột và tường.", "Kiểm tra cao độ, độ phẳng bằng máy laser trước khi đổ."], ["Biên bản nghiệm thu lớp cát đầm, đường ống âm, cao độ nền và thép lưới trước khi đổ bê tông."]];
        const DB = ["Đổ bê tông sàn nền (nền trệt)", "Đổ BT nền", BT + " · TCVN 9361:2012", ["Đổ bê tông nền theo từng ô đà, phủ kín các đoạn giằng móng bên dưới, đầm đúng độ dày, cán phẳng đúng cao độ.", "Chừa khe thi công, khe co giãn theo bản vẽ.", "Bảo dưỡng bằng tưới nước hoặc phủ bạt tối thiểu 7 ngày.", "Bê tông nền đủ cứng mới lên thép và cốp pha cột; tháo cốp pha biên khi bê tông đủ cường độ."], ["Kiểm tra cao độ, độ phẳng, lấy mẫu nén; bảo dưỡng đủ ngày."]];
        const LD = ["Tháo cốp pha móng và lấp đất hố móng bằng mặt đất tự nhiên", "Lấp đất hố móng", "TCVN 9361:2012", ["Tháo cốp pha móng khi bê tông đủ cường độ, không sứt cạnh; vá chỗ rỗ, nứt bằng vữa không co ngót.", "Lấp đất từng lớp 20–30 cm, đầm chặt đều hai bên móng, lấp đến bằng mặt đất tự nhiên.", "Giữ thép chờ cột sạch, thẳng, che tránh gỉ; không để đất vùi thép chờ.", "Mặt bằng đã bằng phẳng mới vạch tim giằng móng để đào rãnh nối các móng."], ["Kiểm tra độ chặt đất lấp, vị trí thép chờ cột đúng tim."]];
        const lg = S.splice(S.findIndex(x => x[1] == "Đào rãnh + lót giằng"), 1)[0]; S.splice(S.findIndex(x => x[1] == "Đổ BT móng") + 1, 0, LD, lg);
        S.splice(S.findIndex(x => x[1] == "Lấp rãnh, cát nền") + 1, 0, UG, DN, DB);
        S.splice(S.indexOf(f("Đổ BT sàn mái")) + 1, 5, o["Chống thấm"], CM, o["Lợp ngói"], o["Điện nước âm"], o["Tô trát"], o["Ốp lát"])
    }
    const floorFrameSteps = [
        ["Lắp dựng cốp pha và cốt thép dầm sàn tầng 1", "Cốp pha + thép dầm sàn L1", "Quy trình nghiệm thu ván khuôn · Quy trình cột dầm sàn · TCVN 1651-2:2018", ["Dựng giàn giáo, cây chống, ván khuôn đáy và thành dầm; lắp ván khuôn sàn thành từng tấm riêng trong các ô giữa dầm.", "Lắp cốp pha cho ban công, dầm hiên, sàn vệ sinh, hộp kỹ thuật và các gờ theo bản vẽ; bảo đảm đúng cao độ, độ dốc, tiết diện và kín khít.", "Lắp thép chủ, thép đai, thép gối và thép tăng cường dầm theo bản vẽ; buộc chắc tại các nút giao.", "Đặt lưới thép sàn hai phương, thép mũ và thép tăng cường tại gối; kê đúng lớp bê tông bảo vệ.", "Đặt, cố định ống chờ và các chi tiết xuyên sàn; kiểm tra tim trục, kích thước, gông, giằng, cây chống và nghiệm thu toàn bộ trước khi đổ."], ["Nghiệm thu từng tấm ván sàn nằm riêng trong đúng ô dầm; kiểm tra số lượng, đường kính, bước đai, chiều dài nối, lớp bảo vệ, ống chờ và các nút giao dầm sàn."]],
        ["Đổ bê tông dầm và sàn tầng 1", "Đổ BT dầm sàn L1", BT + " · TCVN 8828:2011", ["Kiểm tra cấp phối, phiếu giao, độ sụt và lấy mẫu theo hồ sơ được duyệt; không tự ý thêm nước.", "Đổ, đầm bê tông dầm trước rồi đến sàn theo trình tự thiết kế; không làm xô lệch cốt thép hoặc chi tiết chờ.", "Cán phẳng, tạo dốc nơi cần thiết; xử lý mạch ngừng theo hồ sơ thiết kế, che phủ và bảo dưỡng bê tông. Chỉ tháo cốp pha, cây chống khi bê tông đạt cường độ và được chấp thuận."], ["Lưu phiếu giao bê tông, nhật ký và kết quả lấy mẫu; nghiệm thu cao độ, độ phẳng, độ võng và chất lượng bề mặt."]]
    ];
    const floorFrameIndex = S.findIndex(step => step[1] == "Cốp pha sàn L1");
    if (floorFrameIndex < 0) throw new Error("Không tìm thấy các bước kết cấu sàn lầu 1.");
    S.splice(floorFrameIndex, 3, ...floorFrameSteps);
    const roofFrameSteps = [
        ["Lắp dựng cốp pha và cốt thép dầm sàn mái", "Cốp pha + thép dầm sàn mái", "Quy trình nghiệm thu ván khuôn · Quy trình cột dầm sàn · TCVN 1651-2:2018", ["Dựng cây chống, ván khuôn đáy và thành dầm mái; lắp ván khuôn sàn bằng các tấm riêng trong từng ô giữa dầm.", "Tạo đúng cao độ, độ dốc, gờ và sê nô; chừa vị trí phễu thu, ống chờ và ô kỹ thuật theo bản vẽ.", "Lắp thép chủ, thép đai, thép tăng cường tại nút dầm và thép chờ liên kết cột mái theo bản vẽ.", "Đặt lưới thép sàn mái, thép sê nô, thép mũ và thép tăng cường; kê đúng lớp bảo vệ.", "Đặt và cố định ống chờ, phễu thu cùng các chi tiết xuyên sàn; nghiệm thu thép, cốp pha, cây chống, cao độ và độ dốc trước khi đổ."], ["Nghiệm thu vị trí từng tấm ván sàn trong các ô dầm; kiểm tra cốt thép, lớp bảo vệ, ống chờ, phễu thu, cao độ và độ dốc thiết kế."]],
        ["Đổ bê tông dầm và sàn mái", "Đổ BT dầm sàn mái", BT + " · TCVN 8828:2011", ["Kiểm tra cấp phối, phiếu giao, độ sụt và lấy mẫu theo hồ sơ được duyệt; không tự ý thêm nước.", "Đổ, đầm bê tông dầm trước rồi đến sàn mái; tạo độ dốc thoát nước và không làm xô lệch cốt thép, phễu thu hoặc chi tiết chờ.", "Xử lý mạch ngừng theo hồ sơ thiết kế; che phủ và bảo dưỡng bê tông. Chỉ tháo cốp pha, cây chống khi bê tông đạt cường độ và được chấp thuận."], ["Lưu phiếu giao bê tông, nhật ký và kết quả lấy mẫu; nghiệm thu cao độ, độ dốc và chất lượng bề mặt bê tông mái."]]
    ];
    const roofFrameIndex = S.findIndex(step => step[1] == "Cốp pha sàn mái");
    if (roofFrameIndex < 0) throw new Error("Không tìm thấy các bước kết cấu sàn mái.");
    S.splice(roofFrameIndex, 2, ...roofFrameSteps);
    const panelTitles = new Map([
        ["Định vị", "Chuẩn bị mặt bằng, định vị tim trục công trình"],
        ["Ép cọc", "Thi công ép cọc"],
        ["Đào móng", "Đào hố móng, vệ sinh và nghiệm thu đáy hố"],
        ["BT lót hố", "Xử lý đầu cọc và đổ bê tông lót đáy hố móng"],
        ["Cốt thép móng", "Lắp dựng cốt thép đài móng và thép chờ cột"],
        ["Cốp pha móng", "Lắp dựng ván khuôn đài móng"],
        ["Đổ BT móng", "Đổ bê tông đài móng"],
        ["Lấp đất hố móng", "Tháo ván khuôn đài móng, lấp đất hố móng"],
        ["Đào rãnh + lót giằng", "Đào rãnh giằng móng, đổ bê tông lót"],
        ["Cốp pha giằng", "Lắp dựng ván khuôn giằng móng"],
        ["Thép giằng móng", "Lắp dựng cốt thép giằng móng, liên kết thép chờ cột"],
        ["Đổ BT giằng móng", "Đổ bê tông giằng móng và cổ cột"],
        ["Lấp rãnh, cát nền", "Tháo ván khuôn giằng móng, lấp đất và đầm cát nền"],
        ["Ống âm nền", "Lắp đặt đường ống âm dưới nền"],
        ["Đà sàn nền", "Thi công đà nền, ván khuôn biên và cốt thép sàn nền"],
        ["Đổ BT nền", "Đổ bê tông sàn nền tầng trệt"],
        ["Thép + cốp pha cột", "Nối thép chờ, lắp dựng cốt thép và ván khuôn cột tầng trệt"],
        ["Đổ BT cột trệt", "Đổ bê tông cột tầng trệt"],
        ["Xây tường trệt", "Xây tường tầng trệt"],
        ["Cốp pha + thép dầm sàn L1", "Lắp dựng cốp pha và cốt thép dầm, sàn tầng 1"],
        ["Thép dầm sàn L1", "Lắp dựng cốt thép dầm và sàn tầng 1"],
        ["Đổ BT dầm sàn L1", "Đổ bê tông dầm và sàn tầng 1"],
        ["Cột lầu 1", "Thi công cột tầng 1: cốt thép, ván khuôn và đổ bê tông đầm, dùi"],
        ["Xây tường L1", "Xây tường tầng 1"],
        ["Cốp pha + thép dầm sàn mái", "Lắp dựng cốp pha và cốt thép dầm, sàn mái"],
        ["Thép dầm sàn mái", "Lắp dựng cốt thép dầm và sàn mái"],
        ["Đổ BT dầm sàn mái", "Đổ bê tông dầm và sàn mái"],
        ["Cột mái + sườn thép mái", "Thi công cột bê tông cốt thép mái và lắp dựng kèo, xà gồ, hệ sườn thép mái"],
        ["Chống thấm", "Thi công chống thấm sàn mái, sân thượng và ban công"],
        ["Lợp ngói", "Lợp ngói, hoàn thiện khe tiếp giáp mái"],
        ["Điện nước âm", "Lắp đặt hệ thống điện, cấp thoát nước âm tường"],
        ["Tô trát", "Tô trát tường"],
        ["Ốp lát", "Cán nền, ốp lát gạch"],
        ["Bả & sơn", "Bả matit, sơn lót và sơn hoàn thiện"],
        ["Cửa & thiết bị", "Lắp đặt cửa, thiết bị, lan can; hoàn thiện cổng, hàng rào và cảnh quan sân"],
        ["Hoàn thiện, nghiệm thu & bàn giao", "Vệ sinh, nghiệm thu hoàn thành và bàn giao công trình"]
    ]);
    if (S.some(step => !panelTitles.has(step[1]))) throw new Error("Thiếu tiêu đề chuẩn hóa cho một hoặc nhiều bước thi công.");
    S.forEach(step => { step[0] = panelTitles.get(step[1]) });
    const formworkChecklist = "Nghiệm thu đủ 7 nội dung: đối chiếu hồ sơ kiến trúc, kết cấu và điện nước; kiểm tra vật liệu; kích thước, hình dạng; tim trục, cao độ (đo lại sau khi cố định); gông, giằng và cây chống trên nền ổn định; khe nối kín khít; vệ sinh sạch trước khi đổ. Tưới ẩm ván gỗ ngay trước khi đổ.";
    for (const key of ["Cốp pha móng", "Cốp pha giằng", "Thép + cốp pha cột", "Cốp pha + thép dầm sàn L1", "Cốp pha + thép dầm sàn mái"]) {
        const step = S.find(item => item[1] === key);
        if (!step) throw new Error(`Không tìm thấy bước nghiệm thu ván khuôn: ${key}.`);
        step[4] = [...step[4].filter(item => !item.includes("theo 7 bước")), formworkChecklist];
    }
    const procedureUpdates = new Map([
        ["Lấp rãnh, cát nền", {
            standards: "TCVN 9361:2012",
            method: [
                "Chỉ tháo cốp pha thành giằng khi bê tông đạt điều kiện tháo theo hồ sơ kỹ thuật; tránh làm sứt cạnh và sửa khuyết tật theo chỉ dẫn giám sát.",
                "Lấp đất hai bên giằng cân đối, đầm chặt từng lớp dày 20–30 cm; không làm xê dịch kết cấu hoặc các tuyến ống đã lắp.",
                "San cát lòng nền theo cao độ thiết kế, đầm từng lớp dày 15–20 cm và điều chỉnh độ ẩm phù hợp; thực hiện phòng mối theo hồ sơ công trình."
            ],
            quality: ["Kiểm tra cao độ nền và độ chặt từng lớp đắp trước khi chuyển sang lắp đặt hệ thống âm nền."]
        }],
        ["Đổ BT nền", {
            method: [
                "Trước khi đổ, nghiệm thu lớp nền, cốp pha biên, cốt thép và các tuyến ống; đối chiếu phiếu giao/cấp phối, kiểm tra độ sụt và lấy mẫu theo hồ sơ được duyệt, không tự ý thêm nước.",
                "Đổ bê tông theo từng ô đà, phủ kín các đoạn giằng móng bên dưới; đầm phù hợp, không làm xê dịch cốt thép hoặc đường ống, cán phẳng đúng cao độ.",
                "Tạo khe thi công, khe co giãn theo bản vẽ; che phủ và bảo dưỡng theo chỉ dẫn kỹ thuật. Chỉ thi công cột khi nền đạt điều kiện chịu lực."
            ],
            quality: ["Ghi nhật ký và kết quả lấy mẫu; nghiệm thu cao độ, độ phẳng, khe và bảo dưỡng bê tông theo hồ sơ công trình."]
        }],
    ]);
    for (const [key, update] of procedureUpdates) {
        const step = S.find(item => item[1] === key);
        if (!step) throw new Error(`Không tìm thấy bước để đối chiếu quy trình: ${key}.`);
        if (update.standards) step[2] = update.standards;
        if (update.method) step[3] = update.method;
        if (update.quality) step[4] = update.quality;
    }
    const tieBeamStepKeys = ["Đào rãnh + lót giằng", "Cốp pha giằng", "Thép giằng móng", "Đổ BT giằng móng"];
    const tieBeamStepStart = S.findIndex(step => step[1] === tieBeamStepKeys[0]);
    if (tieBeamStepStart < 0 || tieBeamStepKeys.some((key, offset) => S[tieBeamStepStart + offset]?.[1] !== key)) {
        throw new Error("Không tìm thấy đủ các bước thi công giằng móng theo đúng thứ tự.");
    }
    const tieBeamSteps = S.slice(tieBeamStepStart, tieBeamStepStart + tieBeamStepKeys.length);
    const tieBeamDisplayStep = [
        "Thi công giằng móng: đào rãnh, lắp cốp pha, lắp thép và đổ bê tông",
        "Thi công giằng móng",
        [...new Set(tieBeamSteps.flatMap(step => step[2].split(" · ")))].join(" · "),
        tieBeamSteps.flatMap(step => step[3]),
        tieBeamSteps.flatMap(step => step[4])
    ];
    const displaySteps = [
        ...S.slice(0, tieBeamStepStart),
        tieBeamDisplayStep,
        ...S.slice(tieBeamStepStart + tieBeamStepKeys.length)
    ];
    const tieBeamDisplayIndex = tieBeamStepStart;
    let tieBeamAnimationStage = null;
    function simulationStepForDisplayStep(displayIndex) {
        if (displayIndex < tieBeamDisplayIndex) return displayIndex;
        if (displayIndex === tieBeamDisplayIndex) return tieBeamStepStart + (tieBeamAnimationStage || 0);
        return displayIndex + tieBeamStepKeys.length - 1;
    }
    const floorFrameStart = floorFrameIndex, roofFrameStart = S.findIndex(step => step[1] == "Cốp pha + thép dầm sàn mái");
    const groundPipeStep = S.findIndex(step => step[1] == "Ống âm nền");
    const groundTrenchStep = S.findIndex(step => step[1] == "Đào rãnh + lót giằng");
    const footingBackfillStep = S.findIndex(step => step[1] == "Lấp đất hố móng");
    const groundFillStep = S.findIndex(step => step[1] == "Lấp rãnh, cát nền");
    const groundSlabFrameStep = S.findIndex(step => step[1] == "Đà sàn nền");
    const groundFloorColumnPourStep = S.findIndex(step => step[1] == "Đổ BT cột trệt");
    const groundColumnStep = S.findIndex(step => step[1] == "Thép + cốp pha cột");
    const groundColumnWallStep = S.findIndex(step => step[1] == "Xây tường trệt");
    const upperColumnWallStep = S.findIndex(step => step[1] == "Xây tường L1");
    const floorSlabPourStep = floorFrameStart + floorFrameSteps.length - 1;
    const roofSlabPourStep = roofFrameStart + 1;
    const roofWaterproofStep = S.findIndex(step => step[1] === "Chống thấm");
    const roofColumnStep = S.findIndex(step => step[1] == "Cột mái + sườn thép mái");
    const fenceInstallStep = S.findIndex(step => step[1] == "Cửa & thiết bị");
    if (groundPipeStep < 0 || groundTrenchStep < 0 || footingBackfillStep < 0 || groundFillStep < 0 || groundSlabFrameStep < 0 || groundFloorColumnPourStep < 0 || groundColumnStep < 0 || groundColumnWallStep < 0 || upperColumnWallStep < 0) throw new Error("Không tìm thấy một hoặc nhiều mốc thi công phần nền, cột tầng trệt hoặc tường tầng trệt.");
    if (roofWaterproofStep < 0 || roofColumnStep < 0 || fenceInstallStep < 0) throw new Error("Không tìm thấy một hoặc nhiều bước chống thấm mái, thi công cột mái hoặc lắp cửa và hàng rào.");
    const upperColumnStep = floorFrameStart + floorFrameSteps.length;
    const visualPhaseForStep = current => {
        if (current < groundColumnStep) return -1;
        if (current == groundColumnStep) return 12;
        if (current == groundFloorColumnPourStep) return 13;
        if (current < floorFrameStart) return 14;
        if (current < upperColumnStep) return current === floorFrameStart ? 14 : 17;
        if (current == upperColumnStep) return 18;
        if (current < roofFrameStart) return 19;
        if (current < roofColumnStep) {
            if (current === roofSlabPourStep) return 21;
            if (current === roofWaterproofStep) return 23;
            return 20;
        }
        return 24 + current - roofColumnStep;
    };
    let st = 0;
    let playbackTimer = null;
    let playbackActive = false;
    let stepAnimationDurationMs = 0;
    const PLAYBACK_PHOTO_PAUSE_MS = 2000;
    const reference = $("estimate-construction-reference");
    const referenceImage = $("estimate-construction-reference-image");
    const referenceToggle = $("estimate-construction-reference-toggle");
    let referenceTransitionTimer = null;
    const STEP_REFERENCE_IMAGES = {
        "Định vị": "img/biện pháp thi công/1.png",
        "Ép cọc": "img/biện pháp thi công/2.png",
        "Đào móng": "img/biện pháp thi công/3.png",
        "BT lót hố": "img/biện pháp thi công/4.png",
        "Cốt thép móng": "img/biện pháp thi công/5.png",
        "Cốp pha móng": "img/biện pháp thi công/6.png",
        "Đổ BT móng": "img/biện pháp thi công/7.png",
        "Lấp đất hố móng": "img/biện pháp thi công/8.png",
        "Thi công giằng móng": "img/biện pháp thi công/9.png",
        "Lấp rãnh, cát nền": "img/biện pháp thi công/10.png",
        "Ống âm nền": "img/biện pháp thi công/11.png",
        "Đà sàn nền": "img/biện pháp thi công/12.png",
        "Đổ BT nền": "img/biện pháp thi công/13.png",
        "Thép + cốp pha cột": "img/biện pháp thi công/14.png",
        "Đổ BT cột trệt": "img/biện pháp thi công/15.png",
        "Xây tường trệt": "img/biện pháp thi công/16.png",
        "Cốp pha + thép dầm sàn L1": "img/biện pháp thi công/17.png",
        "Đổ BT dầm sàn L1": "img/biện pháp thi công/18.png",
        "Cột lầu 1": "img/biện pháp thi công/19.png",
        "Xây tường L1": "img/biện pháp thi công/20.png",
        "Cốp pha + thép dầm sàn mái": "img/biện pháp thi công/21.png",
        "Đổ BT dầm sàn mái": "img/biện pháp thi công/22.png",
        "Chống thấm": "img/biện pháp thi công/23.png",
        "Cột mái + sườn thép mái": "img/biện pháp thi công/24.png",
        "Lợp ngói": "img/biện pháp thi công/25.png",
        "Điện nước âm": "img/biện pháp thi công/26.png",
        "Tô trát": "img/biện pháp thi công/27.png",
        "Ốp lát": "img/biện pháp thi công/28.png",
        "Bả & sơn": "img/biện pháp thi công/29.png",
        "Cửa & thiết bị": "img/biện pháp thi công/30.png",
        "Hoàn thiện, nghiệm thu & bàn giao": "img/biện pháp thi công/31.png"
    };
    function escapeSvgText(value) {
        return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[character]);
    }
    function createStepSampleImage(step) {
        if (STEP_REFERENCE_IMAGES[displaySteps[step][1]]) return STEP_REFERENCE_IMAGES[displaySteps[step][1]];
        const title = displaySteps[step][0];
        const lower = title.toLocaleLowerCase("vi");
        let illustration;
        if (/đào|hố móng|lấp đất/.test(lower)) {
            illustration = '<path d="M86 335h468v34H86z" fill="#9b704f"/><path d="m190 335 55-128h148l56 128" fill="#c9a27a"/><path d="M246 207h147" stroke="#f6f1e8" stroke-width="12"/><path d="M265 207v114m110-114v114" stroke="#805a3b" stroke-width="10"/><path d="m210 191 42-38h90l35 38" fill="#e9b64f"/><circle cx="270" cy="197" r="13" fill="#354b55"/><circle cx="362" cy="197" r="13" fill="#354b55"/>';
        } else if (/cọc|ép cọc/.test(lower)) {
            illustration = '<path d="M120 345h400" stroke="#9b704f" stroke-width="18"/><path d="M260 115h120v56H260z" fill="#e6a83d"/><path d="M280 171v149m80-149v149M260 320h120" stroke="#526772" stroke-width="16"/><path d="M320 171v190" stroke="#b3bbc0" stroke-width="24"/><path d="M235 130h-44v174h44m170-174h44v174h-44" fill="none" stroke="#526772" stroke-width="12"/><path d="M320 105v35" stroke="#d87442" stroke-width="12"/>';
        } else if (/thép|cốt thép/.test(lower)) {
            illustration = '<path d="M150 330V165m65 165V165m65 165V165m65 165V165m65 165V165m65 165V165M125 195h360m-360 55h360m-360 55h360" stroke="#536d78" stroke-width="11"/><path d="M150 165h325" stroke="#d67b47" stroke-width="8"/><circle cx="150" cy="195" r="7" fill="#e8bd70"/><circle cx="280" cy="250" r="7" fill="#e8bd70"/><circle cx="410" cy="305" r="7" fill="#e8bd70"/>';
        } else if (/cốp pha|ván khuôn|giàn giáo|chống sàn/.test(lower)) {
            illustration = '<path d="M185 340V165h270v175z" fill="#bc8a55" stroke="#795b3c" stroke-width="12"/><path d="M220 165v175m70-175v175m70-175v175m70-175v175" stroke="#e0b77c" stroke-width="7"/><path d="M215 340v-92m210 92v-92M190 248h50m160 0h50" stroke="#576c72" stroke-width="12"/><path d="M160 355h320" stroke="#576c72" stroke-width="10"/>';
        } else if (/bê tông|đổ bt/.test(lower)) {
            illustration = '<path d="M108 328h420v36H108z" fill="#89979a"/><path d="m190 320 38-70h191l39 70z" fill="#bbc4c2"/><path d="M225 250q90-55 180 0" fill="#879597"/><path d="M405 245h63l-25 28h-34" fill="#d58c48"/><path d="M445 273q16 25 0 48m20-48q16 25 0 48" fill="none" stroke="#94b7bd" stroke-width="9"/><circle cx="230" cy="353" r="19" fill="#485b60"/><circle cx="433" cy="353" r="19" fill="#485b60"/>';
        } else if (/xây|tường|gạch/.test(lower)) {
            illustration = '<path d="M148 340V166h344v174z" fill="#c9825b" stroke="#8f5946" stroke-width="10"/><path d="M148 210h344m-344 44h344m-344 44h344m86-132v44m-172 0v44m172 0v44m-172 0v44" stroke="#f2d7bf" stroke-width="8"/><path d="M275 340v-75h90v75" fill="#dde5e3" stroke="#8f5946" stroke-width="8"/>';
        } else if (/điện|nước|ống|thiết bị|mep/.test(lower)) {
            illustration = '<path d="M170 340V154h300v186" fill="#eef1ed" stroke="#87999b" stroke-width="12"/><path d="M205 180v126h64v-86h83v112h80V186" fill="none" stroke="#d26d55" stroke-width="13"/><path d="M230 180v78h90v68m165-160v90h-62v82" fill="none" stroke="#4d91aa" stroke-width="13"/><circle cx="269" cy="306" r="12" fill="#d26d55"/><circle cx="432" cy="306" r="12" fill="#4d91aa"/>';
        } else if (/ốp|lát|sơn|trần|cửa|hoàn thiện|vệ sinh|bàn giao/.test(lower)) {
            illustration = '<path d="M155 340V170l165-92 165 92v170z" fill="#efe8d9" stroke="#536a71" stroke-width="12"/><path d="M190 340v-125h90v125m140-125h42v78h-42z" fill="#8fb2b5" stroke="#536a71" stroke-width="9"/><path d="M320 78v82m-165 10h330" stroke="#c58b58" stroke-width="12"/><path d="M172 340h296" stroke="#b8875a" stroke-width="10"/><path d="M215 311h55m100 0h65" stroke="#d5aa69" stroke-width="8"/>';
        } else {
            illustration = '<path d="M145 335h350" stroke="#9b704f" stroke-width="14"/><path d="M190 335V210l130-92 130 92v125" fill="#efe9dc" stroke="#60747a" stroke-width="11"/><path d="m177 213 143-104 143 104" fill="none" stroke="#bd8253" stroke-width="14"/><path d="M278 335v-88h84v88" fill="#d6e4e3" stroke="#60747a" stroke-width="9"/><path d="M215 335v-75h40v75m140 0v-75h40v75" fill="#94b4b6" stroke="#60747a" stroke-width="8"/>';
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#dcecf0"/><stop offset="1" stop-color="#f6f2e8"/></linearGradient></defs><path fill="url(#sky)" d="M0 0h640v480H0z"/><circle cx="548" cy="111" r="38" fill="#f1cf83"/><path d="M0 370h640v110H0z" fill="#dce4da"/><text x="36" y="48" fill="#17648a" font-family="Arial,sans-serif" font-size="17" font-weight="700" letter-spacing="2">ẢNH MINH HỌA MẪU · BƯỚC ${step + 1}</text>${illustration}<path d="M0 402h640" stroke="#c4d0c8" stroke-width="2"/><text x="36" y="444" fill="#253e49" font-family="Arial,sans-serif" font-size="19" font-weight="700" textLength="568" lengthAdjust="spacingAndGlyphs">${escapeSvgText(title)}</text></svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
    function setStepReferenceImage() {
        reference.classList.toggle("has-full-frame-photo", !!STEP_REFERENCE_IMAGES[displaySteps[st][1]]);
        referenceImage.src = createStepSampleImage(st);
        referenceImage.alt = `Ảnh minh họa mẫu bước ${st + 1}: ${displaySteps[st][0]}`;
        referenceToggle.disabled = false;
    }
    function hideReferencePhoto(leaving = false, afterHide = null) {
        if (!reference) return;
        if (referenceTransitionTimer !== null) window.clearTimeout(referenceTransitionTimer);
        referenceTransitionTimer = null;
        if (reference.hidden) {
            if (afterHide) afterHide();
            return;
        }
        if (leaving) {
            reference.classList.add("is-leaving");
            referenceTransitionTimer = window.setTimeout(() => {
                reference.hidden = true;
                reference.classList.remove("is-leaving");
                referenceTransitionTimer = null;
                if (afterHide) afterHide();
            }, 350);
        } else {
            reference.hidden = true;
            reference.classList.remove("is-entering");
            reference.classList.remove("is-leaving");
            if (afterHide) afterHide();
        }
        referenceToggle.setAttribute("aria-pressed", "false");
        referenceToggle.textContent = "Hiện ảnh thực tế";
    }
    function showReferencePhoto() {
        if (referenceTransitionTimer !== null) window.clearTimeout(referenceTransitionTimer);
        referenceTransitionTimer = null;
        setStepReferenceImage();
        reference.hidden = false;
        reference.classList.remove("is-leaving");
        reference.classList.add("is-entering");
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => reference.classList.remove("is-entering")));
        referenceToggle.setAttribute("aria-pressed", "true");
        referenceToggle.textContent = "Ẩn ảnh thực tế";
    }
    function advancePlayback() {
        if (!playbackActive) return;
        if (st >= displaySteps.length - 1) {
            stopPlayback();
            ui();
            return;
        }
        st++;
        ui();
    }
    function waitForStepAnimation() {
        if (!playbackActive) return;
        if (!isStepAnimationComplete()) {
            playbackTimer = window.setTimeout(waitForStepAnimation, 50);
            return;
        }
        playbackTimer = window.setTimeout(() => {
            if (!playbackActive) return;
            showReferencePhoto();
            playbackTimer = window.setTimeout(() => {
                if (!playbackActive) return;
                hideReferencePhoto(true, advancePlayback);
            }, 3000);
        }, PLAYBACK_PHOTO_PAUSE_MS);
    }
    function schedulePlaybackStep() {
        if (!playbackActive) return;
        waitForStepAnimation();
    }
    function stopPlayback(hidePhoto = true) {
        playbackActive = false;
        if (playbackTimer !== null) window.clearTimeout(playbackTimer);
        playbackTimer = null;
        if (hidePhoto) hideReferencePhoto();
    }
    referenceToggle.addEventListener("click", () => {
        if (playbackActive) {
            stopPlayback();
            ui();
        }
        if (reference.hidden) showReferencePhoto();
        else hideReferencePhoto(true);
    });
    function ui() {
        const progress = Math.round((st + 1) / displaySteps.length * 100);
        $("steps").innerHTML = `<button class="nb" type="button" data-d="-1" aria-label="Xem bước trước" ${st == 0 ? "disabled" : ""}>← <span>Trước</span></button><div class="cnt" aria-live="polite"><b>${st + 1}</b><span> / ${displaySteps.length}</span><small>${displaySteps[st][1]}</small></div><button class="nb nx" type="button" data-d="1" aria-label="Xem bước tiếp theo" ${st == displaySteps.length - 1 ? "disabled" : ""}><span>Sau</span> →</button><button class="nb" type="button" data-play aria-label="${playbackActive ? "Tạm dừng" : "Phát"} mô phỏng" aria-pressed="${playbackActive}">${playbackActive ? "❚❚ Tạm dừng" : "▶ Phát"}</button><div class="step-track" role="progressbar" aria-label="Tiến độ quy trình" aria-valuemin="1" aria-valuemax="${displaySteps.length}" aria-valuenow="${st + 1}"><span style="width:${progress}%"></span></div>`;
        const a = displaySteps[st];
        $("panel").innerHTML = `<p class="prog">Bước ${st + 1}/${displaySteps.length}</p><h2>${a[0]}</h2><p class="std">${a[2]}</p><h3>Biện pháp thực hiện</h3><ul>${a[3].map(x => `<li>${x}</li>`).join("")}</ul><h3>Kiểm soát chất lượng</h3><ul class="qc">${a[4].map(x => `<li>${x}</li>`).join("")}</ul>`;
        show();
        const imageStep = st;
        hideReferencePhoto(true, () => {
            if (st === imageStep && reference.hidden) setStepReferenceImage();
        });
        if (reference.hidden) setStepReferenceImage();
        schedulePlaybackStep();
    }
    root.addEventListener("keydown", e => { if (!root.contains(document.activeElement)) return; if (e.key == "ArrowRight" && st < displaySteps.length - 1) { stopPlayback(false); st++; ui() } else if (e.key == "ArrowLeft" && st > 0) { stopPlayback(false); st--; ui() } });
    root.addEventListener("click", e => {
        const t = e.target.closest("[data-s],[data-d],[data-play]"); if (!t || !root.contains(t)) return;
        if (t.dataset.play != null) {
            if (playbackActive) { stopPlayback() }
            else {
                if (st === displaySteps.length - 1) st = 0;
                playbackActive = true;
            }
            ui();
        } else {
            stopPlayback(false);
            if (t.dataset.s != null) st = +t.dataset.s; else st = Math.max(0, Math.min(displaySteps.length - 1, st + +t.dataset.d));
            ui();
        }
        const c = root.querySelector(".chip[aria-current]"); if (c) c.scrollIntoView({ inline: "center", block: "nearest" })
    });

    /* ---- 3D ---- */
    const cv = $("cv"), R = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    R.setPixelRatio(Math.min(devicePixelRatio, 1.5)); R.shadowMap.enabled = true; R.shadowMap.autoUpdate = false; R.shadowMap.needsUpdate = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.outputEncoding = THREE.sRGBEncoding; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, 1, .1, 300);
    function T(w, h, f, rx, ry) { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); f(x, w, h); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.encoding = THREE.sRGBEncoding; t.anisotropy = 4; return t }
    function nz(x, w, h, n, a) { for (let i = 0; i < n; i++) { x.fillStyle = Math.random() < .5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`; x.fillRect(Math.random() * w, Math.random() * h, 2, 2) } }
    const flat = (c, n, r) => T(256, 256, (x, w, h) => { x.fillStyle = c; x.fillRect(0, 0, w, h); nz(x, w, h, n, .12) }, r, r);
    const brick = T(512, 512, (x, w, h) => { x.fillStyle = "#d9d2c4"; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++)for (let b = -1; b < 5; b++) { const o = (r % 2) * 56 + b * 113, v = Math.random() * 40 - 20; x.fillStyle = `rgb(${176 + v},${84 + v / 2},${58 + v / 2})`; x.fillRect(o + 2, r * 32 + 2, 109, 28) } nz(x, w, h, 3000, .12) }, 1, 1);
    const plaster = flat("#cfcdc6", 6000, 1), paint = flat("#f0e4c6", 5000, 1), conc = flat("#a9a9a4", 5000, 1), grass = flat("#5f7f48", 12000, 14), soilT = flat("#7a5a3c", 5000, 2);
    const tileT = T(256, 256, (x, w, h) => { x.fillStyle = "#e8e4da"; x.fillRect(0, 0, w, h); x.strokeStyle = "#b9b4a6"; x.lineWidth = 3; for (let i = 0; i <= 256; i += 128) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.moveTo(0, i); x.lineTo(w, i); x.stroke() } }, 3, 3);
    const roofT = T(256, 256, (x, w, h) => { x.fillStyle = "#a2402a"; x.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) { x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(0, r * 32 + 28, w, 4); for (let c = 0; c < 8; c++)x.fillRect(c * 32 + (r % 2) * 16, r * 32, 2, 28) } nz(x, w, h, 3000, .1) }, .6, .6);
    const tonT = T(128, 128, (x, w, h) => { x.fillStyle = "#3b7ea8"; x.fillRect(0, 0, w, h); for (let i = 0; i < w; i += 16) { x.fillStyle = "rgba(255,255,255,.25)"; x.fillRect(i, 0, 3, h); x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(i + 8, 0, 3, h) } }, 6, 1);
    const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .9, metalness: 0 }, o || {}));
    const MT = (t, o) => M(0xffffff, Object.assign({ map: t }, o || {}));
    const concM = MT(conc), wmat = MT(brick), soilM = MT(soilT);
    const brickB = T(512, 512, (x, w, h) => { x.fillStyle = "#000"; x.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++)for (let b = -1; b < 5; b++) { const o = (r % 2) * 56 + b * 113, v = Math.random() * 50; x.fillStyle = `rgb(${190 + v},${190 + v},${190 + v})`; x.fillRect(o + 2, r * 32 + 2, 109, 28) } nz(x, w, h, 6000, .25) }, 1, 1);
    const stucB = T(256, 256, (x, w, h) => { x.fillStyle = "#808080"; x.fillRect(0, 0, w, h); nz(x, w, h, 16000, .35) }, 1, 1);
    const plyT = M(0x9b4a2a, { transparent: true, opacity: .62, roughness: .8, side: THREE.DoubleSide }), tieM = new THREE.LineBasicMaterial({ color: 0x4a3b2e });
    const wp2 = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), ovm = MT(plaster, { polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); ovm.bumpMap = stucB; ovm.bumpScale = 1.2; ovm.clippingPlanes = [wp2]; ovm.clipShadows = true; ovm.visible = false;
    wmat.bumpMap = brickB; wmat.bumpScale = 3; concM.bumpMap = stucB; concM.bumpScale = 1.5;
    sc.background = T(2, 256, (x, w, h) => { const q = x.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#3b82c8"); q.addColorStop(1, "#cfe3f1"); x.fillStyle = q; x.fillRect(0, 0, w, h) }, 1, 1); sc.background.wrapS = sc.background.wrapT = THREE.ClampToEdgeWrapping;
    const pm = new THREE.PMREMGenerator(R), skyT = T(256, 128, (x, w, h) => { const q = x.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#2f78c4"); q.addColorStop(.5, "#9cc7ea"); q.addColorStop(.52, "#d9e2d0"); q.addColorStop(1, "#8d8f78"); x.fillStyle = q; x.fillRect(0, 0, w, h) }, 1, 1); skyT.mapping = THREE.EquirectangularReflectionMapping; sc.environment = pm.fromEquirectangular(skyT).texture; sc.fog = new THREE.Fog(0xcfe0ee, 70, 170);
    const cl = T(1024, 512, (x, w, h) => { const q = x.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#2c6fb8"); q.addColorStop(.55, "#7fb2e0"); q.addColorStop(1, "#dbe8f0"); x.fillStyle = q; x.fillRect(0, 0, w, h); for (let i = 0; i < 80; i++) { const a = Math.random() * w, b = h * .15 + Math.random() * h * .5, r = 30 + Math.random() * 90, q2 = x.createRadialGradient(a, b, 0, a, b, r); q2.addColorStop(0, "rgba(255,255,255,.3)"); q2.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = q2; x.save(); x.translate(a, b); x.scale(2.2, .7); x.translate(-a, -b); x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); x.restore() } }, 1, 1);
    sc.add(new THREE.Mesh(new THREE.SphereGeometry(150, 32, 16), new THREE.MeshBasicMaterial({ map: cl, side: THREE.BackSide, fog: false })));
    sc.add(new THREE.HemisphereLight(0xdfeeff, 0x7a8a6a, .5));
    const dl = new THREE.DirectionalLight(0xfff1d8, 1.6); dl.position.set(16, 24, 14); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048);
    Object.assign(dl.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 70 }); dl.shadow.bias = -.0005; sc.add(dl); const fl = new THREE.DirectionalLight(0xbcd6ff, .4); fl.position.set(-14, 8, -10); sc.add(fl);
    const N = ["site", "layout", "gnd0", "gnd1", "fill", "pile", "pileH", "lot", "rebF", "colRb", "formF", "ftg", "lot2", "formG", "rebG", "beamC", "bfill", "sand", "groundPipes", "flr0", "cols1", "slab1", "cols2", "slab2", "wall0", "wall1", "roof", "mep", "proof", "tile", "glass", "formS1", "rebS1", "formS2", "balconySupport", "SB", "SC", "fin", "colR1", "colF1", "colR2", "colF2", "colM", "colMRebar", "colMForm", "frm", "done", "fence", "rib", "pileS", "formN", "rebN", "slabN", "tamcap", "gnd2", "fillB", "fill2", "tamTile", "beamForm1", "beamSupport1", "beamRebar1", "beamConcrete1", "slabRebar1", "beamForm2", "beamSupport2", "beamRebar2", "beamConcrete2", "slabRebar2"];
    const g = {}; N.forEach(n => { g[n] = new THREE.Group(); g[n].visible = false; sc.add(g[n]) });
    function seg(p, A, B, r, m) { const d = new THREE.Vector3(B[0] - A[0], B[1] - A[1], B[2] - A[2]), L = d.length(), c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 10), m); c.position.set((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); p.add(c); return c }
    function bx(p, w, h, d, x, y, z, m) { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m || concM); b.position.set(x, y, z); p.add(b); return b }
    function cy(p, r, h, x, y, z, m, rx, rz) { const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 14), m); c.position.set(x, y, z); if (rx) c.rotation.x = rx; if (rz) c.rotation.z = rz; p.add(c); return c }
    function slabPlate(p, width, depth, thickness, centerX, bottomY, centerZ, material) {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2, -depth / 2); shape.lineTo(width / 2, -depth / 2);
        shape.lineTo(width / 2, depth / 2); shape.lineTo(-width / 2, depth / 2); shape.closePath();
        const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false }), material);
        mesh.rotation.x = -PI / 2; mesh.position.set(centerX, bottomY, centerZ); p.add(mesh);
        return mesh;
    }
    const PI = Math.PI, cx = [-hw + .15, 0, hw - .15], cz = [-hd + .15, -hd / 3, hd / 3, hd - .15];
    const steel = M(0x5a4636, { metalness: .6, roughness: .6 }), scaf = M(0xb9bec3, { metalness: .7, roughness: .4 }), ply = M(0xa24f2c), slabPly = M(0xc27a4e, { roughness: .9 }), upperColumnFormMaterial = M(0x9b4a2a, { transparent: true, opacity: .62, roughness: .8, side: THREE.DoubleSide }), blk = M(0x1b1b1b, { roughness: .5, metalness: .3 }), paint2 = flat("#9da3a8", 4000, 1), stoneM = MT(flat("#aeb2b6", 6000, 2));
    upperColumnFormMaterial.opacity = .92;
    const slabL = MT(plaster), slabP = MT(paint2);
    const roofTan = T(256, 256, (x, w, h) => { x.fillStyle = "#c98f5e"; x.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) { x.fillStyle = "rgba(0,0,0,.22)"; x.fillRect(0, r * 32 + 28, w, 4); for (let c = 0; c < 8; c++)x.fillRect(c * 32 + (r % 2) * 16, r * 32, 2, 28) } nz(x, w, h, 3000, .1) }, .6, .6);
    // hiện trường
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), MT(grass)); gr.rotation.x = -PI / 2; g.gnd0.add(gr);

    const sx = hw + 3, sz = hd + 3, tm = MT(tonT, { roughness: .5, metalness: .4 });


    bx(g.site, 90, .03, 2, 0, .02, sz + 1.2, M(0xb8b6b0)); bx(g.site, 90, .03, 8, 0, .02, sz + 6.2, M(0x3c3f44));
    for (let i = -24; i < 25; i += 4)bx(g.site, 1.8, .04, .15, i, .04, sz + 6.2, M(0xf0f0f0));
    const wd = M(0xc8a46a), ln = M(0xf3f3f3);
    [-1, 1].forEach(a => [-1, 1].forEach(b => bx(g.site, .1, 1.1, .1, a * (hw + 1.3), .55, b * (hd + 1.3), wd)));
    [-1, 1].forEach(a => { bx(g.layout, .02, .02, D + 2.6, a * (hw + 1.3), .9, 0, ln); bx(g.layout, W + 2.6, .02, .02, 0, .9, a * (hd + 1.3), ln); bx(g.layout, .05, .05, D + 2.6, a * (hw + 1.3), 1.05, 0, wd); bx(g.layout, W + 2.6, .05, .05, 0, 1.05, a * (hd + 1.3), wd) });
    for (let k = 0; k < 46; k++) { const an = k / 46 * PI * 2, rd = 70 + Math.random() * 25, f = new THREE.Mesh(new THREE.IcosahedronGeometry(5 + Math.random() * 4, 1), M(Math.random() < .5 ? 0x3a5f33 : 0x2f5230, { roughness: 1 })); f.position.set(Math.cos(an) * rd, 4 + Math.random() * 3, Math.sin(an) * rd); g.site.add(f) }
    [[9, -7], [-15, -8], [15, 6]].forEach(([x, z]) => { cy(g.site, .16, 1.6, x, .8, z, M(0x5b3d26));[[0, 2.6, 0, 1.5], [.9, 3.3, .4, 1.1], [-.8, 3.1, -.3, 1.2], [.2, 3.9, 0, .9]].forEach(([a, b, c, r], k) => { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), M(k % 2 ? 0x3f6e38 : 0x4a7a40)); f.position.set(x + a, b, z + c); g.site.add(f) }) });
    // ===== móng: hố đào thật, cọc, lót, thép + con kê, cốp pha, đài, giằng móng =====
    const HP = .8, q2 = .25, pits = [], trs = [], sandM = M(0xeac565, { roughness: 1, emissive: 0x4a3a10 }), lotM = M(0xbdbdb8), grassE = flat("#5f7f48", 12000, .12);
    const OF = .4, fc = (i, j) => [cx[i] + (i == 0 ? OF : i == cx.length - 1 ? -OF : 0), cz[j] + (j == 0 ? OF : j == cz.length - 1 ? -OF : 0)];
    cx.forEach((x, i) => cz.forEach((z, j) => { const [fx, fz] = fc(i, j); pits.push([fx - HP, fz - HP, 2 * HP, 2 * HP]) }));
    cx.forEach((x, i) => cz.slice(0, -1).forEach((z, k) => { const a = fc(i, k)[1] + HP + .01, b = fc(i, k + 1)[1] - HP - .01; trs.push([x - .25, a, .5, b - a]) }));
    cz.forEach((z, j) => cx.slice(0, -1).forEach((x, k) => { const a = fc(k, j)[0] + HP + .01, b = fc(k + 1, j)[0] - HP - .01; trs.push([a, z - .25, b - a, .5]) }));
    function slabE(holes, d, y, mats) {
        const sh = new THREE.Shape(); sh.moveTo(-60, -60); sh.lineTo(60, -60); sh.lineTo(60, 60); sh.lineTo(-60, 60); sh.closePath();
        holes.forEach(([a, b, c, e]) => { const p = new THREE.Path(); p.moveTo(a, -b); p.lineTo(a + c, -b); p.lineTo(a + c, -(b + e)); p.lineTo(a, -(b + e)); p.closePath(); sh.holes.push(p) });
        const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }), mats); m.rotation.x = -PI / 2; m.position.y = y; return m
    }
    g.gnd1.add(slabE(pits, .5, -.5, [MT(grassE), soilM]), slabE(pits, .5, -1, [soilM, soilM]), slabE([], .6, -1.6, [soilM, soilM]));
    const TL = []; cx.forEach(x => cz.forEach(z => TL.push([x - q2, z - q2, 2 * q2, 2 * q2]))); cx.forEach(x => cz.slice(0, -1).forEach((z, k) => TL.push([x - q2, z + q2, 2 * q2, cz[k + 1] - z - 2 * q2]))); cz.forEach(z => cx.slice(0, -1).forEach((x, k) => TL.push([x + q2, z - q2, cx[k + 1] - x - 2 * q2, 2 * q2])));
    const gmat = [soilM, soilM, MT(grassE), soilM, soilM, soilM];
    const trenchHoles = [...pits, ...trs];
    g.gnd2.add(slabE([[cx[0] - q2, cz[0] - q2, cx[cx.length - 1] - cx[0] + 2 * q2, cz[cz.length - 1] - cz[0] + 2 * q2]], .5, -.5, [MT(grassE), soilM]), slabE(trenchHoles, 1.1, -1.6, [soilM, soilM]));
    cx.slice(0, -1).forEach((x, i) => cz.slice(0, -1).forEach((z, j) => { const a = x + q2, b = z + q2, c = cx[i + 1] - x - 2 * q2, e = cz[j + 1] - z - 2 * q2; bx(g.gnd2, c, .5, e, a + c / 2, -.25, b + e / 2, gmat) }));
    function fills(p, m) { pits.forEach(([a, b, c, e]) => bx(p, c - .02, 1, e - .02, a + c / 2, -.5, b + e / 2, m)) }
    TL.forEach(([a, b, c, e]) => { bx(g.fill2, c, .5, e, a + c / 2, -.25, b + e / 2, gmat); bx(g.bfill, c, .5, e, a + c / 2, -.25, b + e / 2, gmat) })
    fills(g.fill, soilM); fills(g.fillB, gmat);
    const tg = new THREE.EdgesGeometry(new THREE.BoxGeometry(.24, .01, .24));
    cx.forEach((x, i) => cz.forEach((z, j) => {
        const [fx, fz] = fc(i, j), ox = fx - x, oz = fz - z; bx(g.pile, .3, 9.2, .3, fx, -4.2, fz, concM); bx(g.pileS, .3, 9.2, .3, fx, -4.2, fz, concM); bx(g.pileH, .3, .3, .3, fx, -.95, fz, concM);
        bx(g.lot, 1.5, .1, 1.5, fx, -.95, fz, lotM);
        for (let k = -3; k <= 3; k++) { cy(g.rebF, .014, 1.3, fx, -.78, fz + k * .2, steel, 0, PI / 2); cy(g.rebF, .014, 1.3, fx + k * .2, -.75, fz, steel, PI / 2) }
        [-.5, .5].forEach(a => [-.5, .5].forEach(b => bx(g.rebF, .1, .1, .1, fx + a, -.85, fz + b, M(0xcfcfcf))));
        [-1, 1].forEach(q => { bx(g.formF, 1.56, .7, .04, fx, -.55, fz + q * .77, plyT); bx(g.formF, .04, .7, 1.56, fx + q * .77, -.55, fz, plyT) });
        bx(g.ftg, 1.5, .55, 1.5, fx, -.625, fz); bx(g.beamC, .45, .65, .45, x, -.025, z);
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sa, sb]) => {
            const A = .17, B = .1, r = .016;
            cy(g.colRb, r, 1.1, x + sa * A, -.25, z + sb * A, steel); seg(g.colRb, [x + sa * A, .3, z + sb * A], [x + sa * B, .6, z + sb * B], r, steel); cy(g.colRb, r, .4, x + sa * B, .8, z + sb * B, steel); seg(g.colRb, [x + sa * A, -.77, z + sb * A], [x + sa * A + (ox ? Math.sign(ox) : sa) * .5, -.77, z + sb * A + (oz ? Math.sign(oz) : sb) * .5], r, steel)
        });
        [[-.1, -.1], [.1, -.1], [-.1, .1], [.1, .1]].forEach(([a, b]) => { const bar = cy(g.colR1, .016, 3.4, x + a, 2.3, z + b, steel); bar.userData.groundColumnBar = true; cy(g.colR2, .016, FH - .14, x + a, FH + FH / 2, z + b, steel) });
        [[-.6, .95, "colRb"], [1, 3.95, "colR1"], [FH + .07, 2 * FH - .07, "colR2"]].forEach(([y0, y1, n]) => { for (let y = y0; y < y1; y += .3) { const e = new THREE.LineSegments(tg, tieM); e.position.set(x, y, z); if (n == "colRb" && y < .3) e.scale.set(1.6, 1, 1.6); if (n == "colR1") { e.userData.groundColumnTie = true; e.userData.tieY = y } g[n].add(e) } })
    }));
    TL.forEach(([a, b, c, e]) => bx(g.lot2, c, .1, e, a + c / 2, -.45, b + e / 2, lotM));
    const sg1 = new THREE.EdgesGeometry(new THREE.BoxGeometry(.26, .6, .01)), sg2 = new THREE.EdgesGeometry(new THREE.BoxGeometry(.01, .6, .26));
    cx.forEach(x => {
        const d = D - .3;[-1, 1].forEach(q => bx(g.formG, .04, .8, d, x + q * .17, 0, 0, plyT)); bx(g.beamC, .3, .7, d, x, -.05, 0);
        [-.09, .09].forEach(a => [-.3, .2].forEach(y => cy(g.rebG, .014, d, x + a, y, 0, steel, PI / 2)));
        for (let t = -d / 2 + .3; t < d / 2; t += .5) { const e = new THREE.LineSegments(sg1, tieM); e.position.set(x, -.05, t); g.rebG.add(e) }
    });
    cz.forEach(z => {
        const w = W - .3;[-1, 1].forEach(q => bx(g.formG, w, .8, .04, 0, 0, z + q * .17, plyT)); bx(g.beamC, w, .7, .3, 0, -.05, z);
        [-.09, .09].forEach(a => [-.3, .2].forEach(y => cy(g.rebG, .014, w, 0, y, z + a, steel, 0, PI / 2)));
        for (let t = -w / 2 + .3; t < w / 2; t += .5) { const e = new THREE.LineSegments(sg2, tieM); e.position.set(t, -.05, z); g.rebG.add(e) }
    });
    bx(g.sand, W - .4, .2, D - .4, 0, .1, 0, sandM);
    const pipeWater = M(0x167bc1, { roughness: .55 }), pipeDrain = M(0x34383d, { roughness: .65 }), pipeElectrical = M(0xc27a22, { roughness: .6 });
    function pipeRoute(material, points, radius = .04) {
        for (let index = 1; index < points.length; index++) seg(g.groundPipes, points[index - 1], points[index], radius, material);
    }
    const pipeY = .23;
    pipeRoute(pipeDrain, [[3.35, pipeY, 5.4], [3.35, pipeY, -5.5]], .075);
    pipeRoute(pipeDrain, [[3.35, pipeY, 4.3], [2.2, pipeY, 4.3]], .06);
    pipeRoute(pipeDrain, [[3.35, pipeY, 1.6], [2.2, pipeY, 1.6]], .06);
    pipeRoute(pipeDrain, [[3.35, pipeY, -1.4], [2.2, pipeY, -1.4]], .06);
    pipeRoute(pipeWater, [[-3.35, pipeY, 5.5], [-3.35, pipeY, -5.5]], .05);
    pipeRoute(pipeWater, [[-3.35, pipeY, 4], [-1.2, pipeY, 4]], .045);
    pipeRoute(pipeWater, [[-3.35, pipeY, -.2], [-1.2, pipeY, -.2]], .045);
    pipeRoute(pipeElectrical, [[-2.8, pipeY + .04, 5.5], [-2.8, pipeY + .04, -5.5]], .04);
    pipeRoute(pipeElectrical, [[-2.8, pipeY + .04, 4], [-1.2, pipeY + .04, 4]], .035);
    pipeRoute(pipeElectrical, [[-2.8, pipeY + .04, -.2], [-1.2, pipeY + .04, -.2]], .035);
    const NW = W - .4, ND = D - .4; bx(g.slabN, NW, .11, ND, 0, .255, 0, concM);
    [-1, 1].forEach(q => { bx(g.formN, NW + .08, .16, .04, 0, .28, q * (ND / 2 + .02), plyT); bx(g.formN, .04, .16, ND + .08, q * (NW / 2 + .02), .28, 0, plyT) });
    cx.forEach(x => [-.22, .22].forEach(o => bx(g.formN, .04, .14, ND - .1, x + o, .27, 0, plyT)));
    cz.forEach(z => [-.22, .22].forEach(o => bx(g.formN, NW - .1, .14, .04, 0, .27, z + o, plyT)));
    for (let k = 0; k <= Math.floor(NW / .5); k++)cy(g.rebN, .008, ND - .2, -NW / 2 + .1 + k * .5, .24, 0, steel, PI / 2);
    for (let k = 0; k <= Math.floor(ND / .5); k++)cy(g.rebN, .008, NW - .2, 0, .23, -ND / 2 + .1 + k * .5, steel, 0, PI / 2);

    // cột (có 2 cột tròn portico), dầm, sàn
    cx.forEach(x => cz.forEach(z => {
        bx(g.cols1, .3, FH - .3, .3, x, (FH + .3) / 2, z);
        bx(g.cols2, .3, FH - .14, .3, x, FH + FH / 2, z);
        [-1, 1].forEach(q => {
            const lowerXPanel = bx(g.colF1, .04, FH - .14, .36, x + q * .18, FH / 2, z, plyT);
            lowerXPanel.userData.stripX = q * .45;
            const lowerZPanel = bx(g.colF1, .36, FH - .14, .04, x, FH / 2, z + q * .18, plyT);
            lowerZPanel.userData.stripZ = q * .45;
            bx(g.colF2, .04, FH - .14, .36, x + q * .18, FH + FH / 2, z, upperColumnFormMaterial);
            bx(g.colF2, .36, FH - .14, .04, x, FH + FH / 2, z + q * .18, upperColumnFormMaterial);
        });
    }));
    function addFrameBeam(formGroup, supportGroup, steelGroup, concreteGroup, axis, x, z, length, topY, width = .25) {
        const h = .4, bottomY = topY - h, alongZ = axis === "z";
        const dimensions = alongZ ? { w: width, d: length } : { w: length, d: width };
        bx(concreteGroup, dimensions.w, h, dimensions.d, x, topY - h / 2, z, concM);
        bx(formGroup, dimensions.w + .06, .05, dimensions.d + .06, x, bottomY - .025, z, plyT);
        for (const side of [-1, 1]) {
            if (alongZ) bx(formGroup, .04, h, length + .06, x + side * (width / 2 + .02), bottomY + h / 2, z, plyT);
            else bx(formGroup, length + .06, h, .04, x, bottomY + h / 2, z + side * (width / 2 + .02), plyT);
        }
        const supportCount = Math.max(2, Math.floor(length / 1.2));
        for (let index = 0; index <= supportCount; index++) {
            const offset = -length / 2 + length * index / supportCount;
            const sx = alongZ ? x : x + offset, sz = alongZ ? z + offset : z;
            cy(supportGroup, .035, Math.max(.1, bottomY - .3), sx, .3 + (bottomY - .3) / 2, sz, scaf);
        }
        for (const side of [-1, 1]) for (const level of [.1, .3]) {
            if (alongZ) cy(steelGroup, .016, length - .12, x + side * .08, topY - level, z, steel, PI / 2);
            else cy(steelGroup, .016, length - .12, x, topY - level, z + side * .08, steel, 0, PI / 2);
        }
        const stirrupGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(width - .04, .32, .01));
        for (let offset = -length / 2 + .2; offset < length / 2; offset += .3) {
            const stirrup = new THREE.LineSegments(stirrupGeometry, tieM);
            stirrup.position.set(alongZ ? x : x + offset, topY - .2, alongZ ? z + offset : z);
            if (!alongZ) stirrup.rotation.y = PI / 2;
            steelGroup.add(stirrup);
        }
    }
    function buildFrameBeams(level, topY) {
        const formGroup = g[`beamForm${level}`], supportGroup = g[`beamSupport${level}`], steelGroup = g[`beamRebar${level}`], concreteGroup = g[`beamConcrete${level}`];
        cx.forEach(x => addFrameBeam(formGroup, supportGroup, steelGroup, concreteGroup, "z", x, 0, D - .2, topY));
        cz.forEach(z => addFrameBeam(formGroup, supportGroup, steelGroup, concreteGroup, "x", 0, z, W - .2, topY));
    }
    buildFrameBeams(1, FH); buildFrameBeams(2, 2 * FH);
    function slabBarX(group, radius, y, z, start, end) {
        cy(group, radius, end - start, (start + end) / 2, y, z, steel, 0, PI / 2);
    }
    function slabBarZ(group, radius, y, x, start, end) {
        cy(group, radius, end - start, x, y, (start + end) / 2, steel, PI / 2);
    }
    function slabReinforcement(group, y, radius = .012, offset = .06) {
        for (let z = -hd + .5; z < hd; z += .6) slabBarX(group, radius, y + offset, z, -(W - .4) / 2, (W - .4) / 2);
        for (let x = -hw + .5; x < hw; x += .6) slabBarZ(group, radius, y + offset, x, -(D - .4) / 2, (D - .4) / 2);
    }
    [["slabRebar1", FH], ["slabRebar2", 2 * FH]].forEach(([name, y]) => slabReinforcement(g[name], y));
    [["slab1", 0], ["slab2", 1]].forEach(([name, level]) => {
        const floorY = level * FH, slabThickness = .14;
        slabPlate(g[name], W + .3, D + .3, slabThickness, 0, floorY + FH - slabThickness / 2, 0, concM);
    });
    const rb = new THREE.Mesh(new THREE.CylinderGeometry(1.57, 1.57, .2, 32, 1, false, -PI / 2, PI), concM); rb.position.set(2.6, FH, hd); g.slab1.add(rb);
    for (let i = 0; i < 17; i++)bx(g.slab1, 1, .18, .28, -hw + .8, .1 + i * .2, -hd + .6 + i * .27, M(0x999995));
    // cốp pha, chống, thép sàn
    function rm(p, y) { slabReinforcement(p, y, .012, .07) }
    function fw(p, y) {
        const beamWidth = .3, panelThickness = .05, supportBottom = .3;
        for (let xIndex = 0; xIndex < cx.length - 1; xIndex++) {
            for (let zIndex = 0; zIndex < cz.length - 1; zIndex++) {
                const x0 = cx[xIndex], x1 = cx[xIndex + 1], z0 = cz[zIndex], z1 = cz[zIndex + 1];
                const panelWidth = x1 - x0 - beamWidth - .04, panelDepth = z1 - z0 - beamWidth - .04;
                const centerX = (x0 + x1) / 2, centerZ = (z0 + z1) / 2, panelBottom = y - .07;
                slabPlate(p, panelWidth, panelDepth, panelThickness, centerX, panelBottom, centerZ, slabPly);
                const supportHeight = panelBottom - supportBottom;
                for (const xOffset of [-panelWidth / 4, panelWidth / 4]) for (const zOffset of [-panelDepth / 4, panelDepth / 4]) {
                    const supportX = centerX + xOffset, supportZ = centerZ + zOffset;
                    cy(p, .035, supportHeight, supportX, supportBottom + supportHeight / 2, supportZ, scaf);
                }
            }
        }
    }
    fw(g.formS1, FH); fw(g.formS2, 2 * FH); rm(g.rebS1, FH);
    const hc = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, .05, 32, 1, false, -PI / 2, PI), ply); hc.position.set(2.6, FH - .122, hd); g.formS1.add(hc);
    [[.5, -1], [.5, 0], [.5, 1], [1.1, -1], [1.1, -.5], [1.1, 0], [1.1, .5], [1.1, 1]].forEach(([r, a]) => cy(g.balconySupport, .035, FH - .2, 2.6 + r * Math.sin(a), FH - (FH - .2) / 2, hd + r * Math.cos(a), scaf));
    for (let k = 0; k <= 10; k++) { const a = -PI / 2 + k * PI / 10, b = bx(g.formS1, .35, .25, .04, 2.6 + 1.57 * Math.sin(a), FH - .02, hd + 1.57 * Math.cos(a), ply); b.rotation.y = a }
    [.3, .7, 1.1].forEach(d => cy(g.rebS1, .012, 2 * Math.sqrt(1.96 - d * d), 2.6, FH + .11, hd + d, steel, 0, PI / 2));[-1.2, -.6, 0, .6, 1.2].forEach(d => { const L = Math.sqrt(1.96 - d * d); cy(g.rebS1, .012, L, 2.6 + d, FH + .13, hd + L / 2, steel, PI / 2) });
    ["beamRebar1", "beamRebar2", "rebS1", "slabRebar1", "slabRebar2"].forEach(name => g[name].children.forEach(mesh => {
        mesh.material = mesh.material.clone();
        mesh.material.transparent = true;
    }));
    // tường có ô cửa
    function dr(p, a, b, c, d, ar) { p.moveTo(a, b); if (ar) { p.lineTo(a, b + d - c / 2); p.absarc(a + c / 2, b + d - c / 2, c / 2, PI, 0, true) } else { p.lineTo(a, b + d); p.lineTo(a + c, b + d) } p.lineTo(a + c, b); p.closePath(); return p }
    const FW = [[.2, 0, .6, FH], [4.6, 0, .6, FH], [1, 0, 3, 2.5], [5.4, .9, 1.8, 1.7], [1.4, FH + .05, 2.2, 2.6], [5.5, FH + .5, 1.6, 2.2, 1]], SW = [[2, .9, 1.3, 1.5], [8, .9, 1.3, 1.5], [2, FH + .9, 1.3, 1.5], [8, FH + .9, 1.3, 1.5]], BW = [[1.2, .9, 1.2, 1.3], [5.6, .9, 1.2, 1.3], [1.2, FH + .9, 1.2, 1.3], [5.6, FH + .9, 1.2, 1.3]];
    const gm = M(0xe8d3a8, { transparent: true, opacity: .82, roughness: .05, metalness: .6, envMapIntensity: 1.4, side: THREE.DoubleSide });
    [[W, FW, -hw, hd - .2, 0], [W, BW, -hw, -hd, 0], [D, SW, hw, -hd, -PI / 2], [D, SW, -hw, hd, PI / 2]].forEach(([w, hs, x, z, ry]) => {
        for (let f = 0; f < 2; f++) {
            const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(w, 0); sh.lineTo(w, FH); sh.lineTo(0, FH); sh.closePath();
            hs.filter(h => h[1] >= f * FH && h[1] < (f + 1) * FH).forEach(([a, b, c, d, ar]) => sh.holes.push(dr(new THREE.Path(), a, b - f * FH, c, d, ar)));
            const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: .2, bevelEnabled: false }), wmat); m.position.set(x, f * FH, z); m.rotation.y = ry; g["wall" + f].add(m); const mo = new THREE.Mesh(m.geometry, ovm); mo.position.copy(m.position); mo.rotation.copy(m.rotation); g["wall" + f].add(mo)
        }
        const gw = new THREE.Group(); gw.position.set(x, 0, z); gw.rotation.y = ry; gw.translateZ(ry == 0 && z > 0 ? -.07 : .07); g.glass.add(gw);
        hs.forEach(([a, b, c, d, ar]) => {
            const xx = a + c / 2, yy = b + d / 2, ys = ar ? b + (d - c / 2) / 2 : yy, dh = ar ? d - c / 2 : d;
            const gs = new THREE.Mesh(new THREE.ShapeGeometry(dr(new THREE.Shape(), a, b, c, d, ar)), gm); gs.position.z = .1; gw.add(gs); bx(gw, c - .12, dh, .03, xx, ys, ry == 0 && z > 0 ? -.15 : .35, M(0xd8c4a0, { roughness: 1 })); if (ry == 0 && z > 0 && b > 0) bx(gw, c + .3, .08, .3, xx, b - .04, .22, M(0xf4f1ea, { roughness: .6 }));
            bx(gw, c + .08, .06, .1, xx, b, .1, blk); bx(gw, .06, dh, .1, a, ys, .1, blk); bx(gw, .06, dh, .1, a + c, ys, .1, blk); bx(gw, .04, dh, .1, xx, ys, .1, blk);
            if (ar) { const t = new THREE.Mesh(new THREE.TorusGeometry(c / 2, .03, 6, 20, PI), blk); t.position.set(xx, b + d - c / 2, .1); gw.add(t) } else { bx(gw, c + .08, .06, .1, xx, b + d, .1, blk); if (b == 0) bx(gw, c, .04, .1, xx, 2.1, .1, blk) }
        })
    });
    // lan can: ban công trái (sắt), ban công tròn
    bx(g.glass, 5, .06, .06, -1.6, FH + 1, hd + 1.5, blk); for (let i = 0; i <= 20; i++)bx(g.glass, .025, .9, .025, -4.1 + i * .25, FH + .55, hd + 1.5, blk);
    const rr = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, .9, 28, 6, true, -PI / 2, PI), new THREE.MeshStandardMaterial({ color: 0x1b1b1b, wireframe: true })); rr.position.set(2.6, FH + .55, hd); g.glass.add(rr);
    // điện nước
    const pw = M(0x2f8de0), pe = M(0xf2c200);
    [-2, 0, 2].forEach((x, i) => cy(g.mep, .05, 2 * FH - .6, x, FH, -hd + .35, i == 1 ? pe : pw));
    for (let f = 0; f < 2; f++) { const y = f * FH + FH - .6; cy(g.mep, .04, W - .6, 0, y, hd - .35, pe, 0, PI / 2); cy(g.mep, .05, D - .8, hw - .35, y, 0, pw, PI / 2); cy(g.mep, .045, D - .8, -hw + .35, y, 0, M(0xcfcfcf), PI / 2) }
    // mái: hai đầu hồi tầng bậc
    function rf(w, h, len, x, z, y) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath(); const geo = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false }); geo.translate(0, 0, -len / 2); const m = new THREE.Mesh(geo, [M(0xf1ece2), MT(roofTan, { roughness: .55 })]); m.position.set(x, y, z); g.roof.add(m); bx(g.roof, .22, .12, len + .1, x, y + h + .02, z, M(0xd9a678)); bx(g.roof, .12, .14, len + .1, x - w / 2, y + .05, z, M(0xd9a678)); bx(g.roof, .12, .14, len + .1, x + w / 2, y + .05, z, M(0xd9a678)) }
    rf(5.8, 2.5, D + 2, -1.5, .5, 2 * FH + .07); rf(4.4, 2, D + 1.4, 2.6, .2, 2 * FH + .07);
    const rp = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100); g.roof.children.forEach(m => [].concat(m.material).forEach(t => { t.clippingPlanes = [rp]; t.clipShadows = true }));
    const waterproofM = M(0x8b5a2b, { roughness: .8 });
    bx(g.proof, W, .02, D, 0, 2 * FH + .09, 0, waterproofM);
    const pf2 = waterproofM;
    [-1, 1].forEach(q => { bx(g.proof, W, .3, .04, 0, 2 * FH + .22, q * (hd - .1), pf2); bx(g.proof, .04, .3, D - .2, q * (hw - .1), 2 * FH + .22, 0, pf2) });
    const tileM = MT(tileT, { roughness: .25 }), brickM = MT(brick, { roughness: .95 });
    bx(g.tile, 5, .02, 1.6, -1.6, FH + .1, hd + .75, tileM); bx(g.tile, 6, .03, 1.7, -1.3, .03, hd + 1.9, tileM);
    bx(g.tile, W - .2, .025, D - .2, 0, .33, 0, tileM); bx(g.tile, W - .2, .025, D - .2, 0, FH + .085, 0, tileM);
    for (let s = 0; s < 3; s++) { const h = .3 - .1 * s, zc = hd + .175 + .35 * s; bx(g.tamcap, 3.4, h, .35, -1.3, h / 2, zc, brickM); bx(g.tamTile, 3.46, .025, .39, -1.3, h + .0125, zc, tileM); bx(g.tamTile, 3.46, .1, .025, -1.3, h - .05, hd + .35 * (s + 1) + .0125, tileM) }
    // hoàn thiện ngoại thất: hàng rào đá, vòm portico, cây hoa, xe
    bx(g.fence, .5, 2, 2 * sz, sx, 1, 0, stoneM); bx(g.fence, .5, 2, 2 * sz, -sx, 1, 0, stoneM); bx(g.fence, 2 * sx, 2, .5, 0, 1, -sz, stoneM);
    [-1, 1].forEach(q => bx(g.fence, sx - 2.45, 1.5, .5, q * (sx + 2.45) / 2, .75, sz, stoneM));
    [[1.4, .35], [2.3, .4], [3.2, .35], [3.9, .45], [.6, .4]].forEach(([x, r], i) => { const f = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), M(i % 2 ? 0xd96a8f : 0x4d8a44)); f.position.set(x, r, hd + 2.2); g.fence.add(f) });
    const wh = M(0xf4f1ea, { roughness: .6 }), paveM = MT(T(256, 256, (x, w, h) => { x.fillStyle = "#d7d6cf"; x.fillRect(0, 0, w, h); x.strokeStyle = "#aeada5"; x.lineWidth = 3; for (let i = 0; i <= 256; i += 128) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.moveTo(0, i); x.lineTo(w, i); x.stroke() } nz(x, w, h, 4000, .06) }, 9, 5));
    bx(g.done, 2 * sx - .5, .03, sz - hd - .25, 0, .015, (hd + sz - .25) / 2, paveM);[[-3.5, 1], [2, 4]].forEach(([x, w2]) => bx(g.fin, w2, .45, .16, x, .225, hd + .06, M(0x2b2b2d, { roughness: .3, metalness: .2 }))); bx(g.fin, W + .5, .22, .32, 0, 2 * FH - .02, hd + .05, wh);
    bx(g.fin, 2.1, .12, .14, 2.3, 2.78, hd + .1, wh); bx(g.fin, 2.1, .1, .24, 2.3, .86, hd + .12, wh);[-1, 1].forEach(q => { bx(g.fin, .12, 1.9, .12, 2.3 + q * 1.0, 1.8, hd + .1, wh); bx(g.fin, .3, 2.8, .25, 2.3 + q * 1.25, FH + 1.7, hd + .12, wh) });
    const at = new THREE.Mesh(new THREE.TorusGeometry(.98, .08, 8, 24, PI), wh); at.position.set(2.3, FH + .5 + 2.2 - .8, hd + .12); g.fin.add(at);

    // thép chờ cột, giàn giáo mặt tiền
    cx.forEach(x => cz.forEach(z => [[-.08, -.08], [.08, -.08], [-.08, .08], [.08, .08]].forEach(([a, b]) => cy(g.SB, .014, 1.2, x + a, .6, z + b, steel))));
    for (let i = 0; i < 5; i++) { cy(g.SC, .03, 2 * FH + 1.2, -3.6 + i * 1.8, FH + .6, hd + 2.2, scaf); cy(g.SC, .03, 2 * FH + 1.2, -3.6 + i * 1.8, FH + .6, hd + 2.8, scaf) }
    [1.6, 3.4, 5.2, 6.8].forEach(y => { cy(g.SC, .03, 7.2, 0, y, hd + 2.2, scaf, 0, PI / 2); cy(g.SC, .03, 7.2, 0, y, hd + 2.8, scaf, 0, PI / 2); bx(g.SC, 7.2, .05, .6, 0, y + .03, hd + 2.5, M(0xc9a66b)) });

    // cột mái, sườn thép, hoàn thiện bàn giao
    const roofColumnRows = [[-3.85, .5], [-1.5, 2.5], [.4, .9], [2.6, 2], [3.85, .9]];
    const roofColumnBase = 2 * FH + .07, roofColumnFormMaterial = M(0x9b4a2a, { transparent: true, opacity: .62, roughness: .8, side: THREE.DoubleSide });
    roofColumnRows.forEach(([x, height]) => cz.forEach(z => {
        const h = height - .12, y0 = roofColumnBase;
        if (h > .3) {
            bx(g.colM, .25, h, .25, x, y0 + h / 2, z, concM);
            bx(g.proof, .34, .3, .34, x, 2 * FH + .22, z, pf2);
            for (const a of [-.075, .075]) for (const b of [-.075, .075]) cy(g.colMRebar, .012, h, x + a, y0 + h / 2, z + b, steel);
            const hoop = new THREE.EdgesGeometry(new THREE.BoxGeometry(.2, .01, .2));
            for (let y = y0 + .15; y < y0 + h; y += .25) { const tie = new THREE.LineSegments(hoop, tieM); tie.position.set(x, y, z); g.colMRebar.add(tie) }
            [-1, 1].forEach(q => {
                const xPanel = bx(g.colMForm, .04, h, .34, x + q * .15, y0 + h / 2, z, roofColumnFormMaterial);
                xPanel.userData.stripX = q * .25;
                const zPanel = bx(g.colMForm, .34, h, .04, x, y0 + h / 2, z + q * .15, roofColumnFormMaterial);
                zPanel.userData.stripZ = q * .25;
            });
        }
    }));
    function truss(w, h, len, x, z0, y0, zs) {
        w -= .3; h -= .2; len -= .3; const Lr = Math.hypot(w / 2, h), an = Math.atan2(h, w / 2);
        zs.forEach(z => { [-1, 1].forEach(q => { const r = bx(g.frm, Lr, .07, .07, x + q * w / 4, y0 + h / 2, z, scaf); r.rotation.z = -q * an }); bx(g.frm, w, .05, .05, x, y0 + .05, z, scaf) });
        [.3, .55, .8, 1].forEach(f => [-1, 1].forEach(q => bx(g.frm, .06, .06, len, x + q * (w / 2) * (1 - f), y0 + h * f, z0, scaf)))
    }
    truss(5.8, 2.5, D + 2, -1.5, .5, 2 * FH + .07, cz); truss(4.4, 2, D + 1.4, 2.6, .2, 2 * FH + .07, cz);
    const lampM = new THREE.MeshStandardMaterial({ color: 0xffe9b0, emissive: 0xffcf70, emissiveIntensity: 1 });
    [-2.35, 2.35].forEach(x => bx(g.fence, .14, 1.9, .14, x, .95, sz, blk));
    [-1, 1].forEach(s => { bx(g.fence, 2.15, .06, .05, s * 1.225, 1.6, sz, blk); bx(g.fence, 2.15, .06, .05, s * 1.225, .25, sz, blk); for (let k = 0; k < 7; k++)bx(g.fence, .04, 1.4, .04, s * (.15 + k * .32), .92, sz, blk) });
    bx(g.done, .5, .3, .05, .7, 1.5, hd + .12, blk); bx(g.done, .4, .2, .02, .7, 1.5, hd + .15, wh);
    [-3.3, .3].forEach(x => { const l = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), lampM); l.position.set(x, 2.2, hd + .2); g.done.add(l) });
    [-6, -4.8, 5, 6.2].forEach(x => { cy(g.fence, .25, .4, x, .2, hd + 2.6, M(0x8a4b2f)); const f = new THREE.Mesh(new THREE.SphereGeometry(.38, 10, 8), M(0x3f7a3a)); f.position.set(x, .65, hd + 2.6); g.fence.add(f) });
    const dg = M(0x4f8a45, { roughness: 1 }), dg2 = M(0x3d7338, { roughness: 1 }), dcap = M(0xe9e5da), dst = M(0xcfcac0, { roughness: .6 });
    [-1, 1].forEach(q => {
        bx(g.fence, sx - 3.4, .05, 1, q * (sx / 2 + 1.4), .04, sz - .9, dg); bx(g.fence, sx - 2.9, .55, .4, q * (sx / 2 + 1.35), .3, sz - .6, dg2); bx(g.fence, .4, .55, sz - hd - 1.4, q * (sx - .45), .3, hd + 1.1 + (sz - hd - 1.4) / 2, dg2);
        bx(g.fence, sx - 2.45, .08, .62, q * (sx + 2.45) / 2, 1.54, sz, dcap); bx(g.fence, .62, .08, 2 * sz, q * sx, 2.04, 0, dcap);
        cy(g.fence, .12, 1.1, q * 5.6, .55, hd + 1.7, M(0x5b3d26));[[0, 1.5, 0, .8], [.35, 1.9, .2, .55]].forEach(([a, b, c, r]) => { const f = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), dg); f.position.set(q * 5.6 + a, b, hd + 1.7 + c); g.fence.add(f) })
    });
    bx(g.fence, 2 * sx, .08, .62, 0, 2.04, -sz, dcap);
    for (let k = 0; k < 5; k++) { const u = k / 4; bx(g.done, .8, .03, .5, -1.3 * u, .06, sz - .6 - u * (sz - hd - 2.1), dst) }
    const rd = M(0xc0261f); bx(g.rib, 4.4, .14, .03, -1.3, 1.1, hd + 1.3, rd);[-1, 1].forEach(q => { const b = bx(g.rib, .4, .22, .04, -1.3 + q * .25, 1.1, hd + 1.34, rd); b.rotation.z = q * .5 }); bx(g.rib, .12, .12, .05, -1.3, 1.1, hd + 1.36, rd);
    // ===== hoạt ảnh 3D =====
    const NOANIM = new Set(["site", "layout", "gnd0", "gnd1", "gnd2"]), POUR = new Set(["fillB", "ftg", "beamC", "bfill", "sand", "cols1", "cols2", "slab1", "slab2", "beamConcrete1", "beamConcrete2", "colM", "slabN"]), SPREAD = new Set(["lot", "lot2", "proof", "tile"]), DIG = new Set(["fill", "fill2"]), ASSEMBLE = new Set(["groundPipes", "beamRebar1", "beamRebar2", "rebS1", "slabRebar1", "slabRebar2"]), RISE = new Set(["colRb", "colR1", "colR2", "colF2"]), FAST_POUR = new Set(["beamConcrete1", "beamConcrete2", "slab1", "slab2"]), POUR_SPEED = 1.8, RB = { colRb: -.8, colR1: .6, colR2: FH + .07, colF2: FH + .07 }, DLY = { lot2: 2.6, colF1: 2.5, colF2: 2.5, cols2: 4.5, slab1: 1.1, slab2: 1.1 }, run = {};
    N.forEach(n => g[n].children.forEach(m => { const u = m.userData; u.py = m.position.y; u.h = m.geometry && m.geometry.parameters && m.geometry.parameters.height || 0; u.sx = m.scale.x; u.sy = m.scale.y; u.sz = m.scale.z; u.px = m.position.x; u.pz = m.position.z }));
    function anim(n, t) {
        if (NOANIM.has(n)) return; if (RISE.has(n)) { const e = Math.min(1, Math.max(0, t / 2.8)); const s = Math.max(.001, e * e * (3 - 2 * e)); g[n].scale.y = s; g[n].position.y = (1 - s) * RB[n]; return }
        t = (t - (DLY[n] || 0)) * (FAST_POUR.has(n) ? POUR_SPEED : 1); const ch = g[n].children, sg = n == "pile" || n == "pileS" ? .18 : n == "fill" ? .15 : Math.min(.12, 1.6 / ch.length);
        ch.forEach((m, k) => {
            const u = m.userData, e = Math.min(1, Math.max(0, (t - k * sg) / (n == "pileS" ? 1.8 : .9))), p = e * e * (3 - 2 * e), q = Math.max(.001, p);
            if (ASSEMBLE.has(n)) m.scale.set(u.sx * q, u.sy * q, u.sz * q);
            else if (POUR.has(n)) { m.scale.y = u.sy * q; m.position.y = u.py - u.h / 2 + u.h * q / 2 }
            else if (DIG.has(n)) { const z2 = Math.max(.001, 1 - p); m.scale.y = u.sy * z2; m.position.y = u.py - u.h / 2 + u.h * z2 / 2 }
            else if (n == "tamTile") { m.position.y = u.py + (1 - p) * 4; m.position.z = u.pz + (1 - p) * 2; m.visible = e > 0 }
            else if (n == "pileS") { m.position.y = u.py - 1.35 * p }
            else if (n == "pile") { m.position.y = u.py + (1 - p) * 10.5; m.visible = e > 0 }
            else if (n == "formS1" || n == "formS2") { m.scale.set(u.sx * q, u.sy * q, u.sz * q); m.position.y = u.py + (1 - p) * .8 }
            else if (n == "mep") m.position.x = u.px - 8 * (1 - p);
            else if (SPREAD.has(n)) m.scale.set(u.sx * q, u.sy, u.sz * q);
            else m.position.y = u.py + (1 - p) * 3.5
        })
    }
    function animationDuration(n) {
        if (RISE.has(n)) return 2.8;
        const count = g[n].children.length, stagger = n == "pile" || n == "pileS" ? .18 : n == "fill" ? .15 : Math.min(.12, 1.6 / count);
        const speed = FAST_POUR.has(n) ? POUR_SPEED : 1;
        return (DLY[n] || 0) + (Math.max(0, count - 1) * stagger + (n == "pileS" ? 1.8 : .9)) / speed;
    }
    const wp = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100); wmat.clippingPlanes = [wp]; wmat.clipShadows = true; R.localClippingEnabled = true;
    let wc2 = 100, wt2 = 100, rc = 100, rt = 100, wc = 100, wt = 100, follow = true, camTy = 3.4, stepT0 = performance.now(), prevSt = -1, roofColumnBuildStart = null, upperColumnBuildStart = null;
    let columnFormBuildStart = null;
    let columnFormReleaseStart = null;
    let balconySupportReleaseStart = null;
    let floorRebarPourStart = null;
    let roofRebarPourStart = null;
    function hasCurrentAnimationFinished() {
        const now = performance.now();
        if (now - stepT0 < stepAnimationDurationMs) return false;
        if (Object.keys(run).length > 0) return false;
        if (columnFormBuildStart !== null || balconySupportReleaseStart !== null || roofColumnBuildStart !== null || upperColumnBuildStart !== null) return false;
        if (columnFormReleaseStart !== null && now - columnFormReleaseStart < (animationDuration("cols1") + 2.1) * 1000) return false;
        if (wc + .001 < wt || wc2 + .001 < wt2 || rc + .001 < rt) return false;
        return true;
    }
    function isStepAnimationComplete() {
        if (st === tieBeamDisplayIndex && tieBeamAnimationStage !== null && tieBeamAnimationStage < tieBeamStepKeys.length - 1) return false;
        return hasCurrentAnimationFinished();
    }
    function camFor(i) { return i <= 11 ? { az: .8, el: .85, dist: 34, ty: 0 } : i <= 13 ? { az: .7, el: .5, dist: 40, ty: 2.5 } : i <= 21 ? { az: .6, el: .38, dist: 44, ty: 3.5 } : i <= 25 ? { az: .5, el: .3, dist: 46, ty: 4.6 } : i <= 27 ? { az: .5, el: .28, dist: 44, ty: 3.6 } : i >= 31 ? { az: .3, el: .2, dist: 36, ty: 3.2 } : { az: .22, el: .14, dist: 38, ty: 3.8 } }
    let camT = camFor(0);
    sc.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true } }); gr.castShadow = false;
    const U = new Set(["wall0", "wall1", "cols1", "cols2", "slab1", "slab2", "ftg", "pile", "flr0", "fin"]);
    const smooth = t => { const p = Math.max(0, Math.min(1, t)); return p * p * (3 - 2 * p) };
    function setGroundColumnStarter(active) {
        g.colR1.children.forEach(mesh => {
            const u = mesh.userData;
            if (u.groundColumnBar) {
                mesh.scale.y = active ? u.sy * .65 / 3.4 : u.sy;
                mesh.position.y = active ? FH + .325 : u.py;
            } else if (u.groundColumnTie) mesh.visible = !active || u.tieY >= FH;
        });
    }
    function riseFromBase(group, progress, baseY) {
        group.scale.y = progress;
        group.position.y = baseY * (1 - progress);
    }
    function updateSlabRebarOpacity(name, startedAt, pourStep, slabName, time) {
        const delay = DLY[slabName] || 0, duration = animationDuration(slabName) - delay;
        const elapsed = startedAt === null ? 0 : (time - startedAt) / 1000;
        const currentStep = simulationStepForDisplayStep(st);
        const progress = currentStep < pourStep ? 0 : currentStep > pourStep ? 1 : startedAt === null ? 0 : smooth((elapsed - delay - duration * .2) / (duration * .65));
        g[name].children.forEach(mesh => { mesh.material.opacity = 1 - progress });
    }
    function show() {
        if (st === tieBeamDisplayIndex) {
            if (tieBeamAnimationStage === null) tieBeamAnimationStage = 0;
        } else tieBeamAnimationStage = null;
        const raw = simulationStepForDisplayStep(st);
        const i = visualPhaseForStep(raw);
        const now = performance.now();
        stepAnimationDurationMs = 0;
        if (raw < floorSlabPourStep) floorRebarPourStart = null;
        else if (raw === floorSlabPourStep && prevSt !== raw) floorRebarPourStart = now;
        else if (raw > floorSlabPourStep) floorRebarPourStart = null;
        if (raw < roofSlabPourStep) roofRebarPourStart = null;
        else if (raw === roofSlabPourStep && prevSt !== raw) roofRebarPourStart = now;
        else if (raw > roofSlabPourStep) roofRebarPourStart = null;
        const balconyReleaseStep = floorSlabPourStep + 1;
        if (raw < balconyReleaseStep) {
            balconySupportReleaseStart = null;
            g.balconySupport.children.forEach(support => support.position.set(support.userData.px, support.userData.py, support.userData.pz));
        }
        if (raw === balconyReleaseStep) balconySupportReleaseStart = now;
        if (raw < groundColumnStep) {
            columnFormBuildStart = null;
            columnFormReleaseStart = null;
            g.colF1.visible = false;
            g.colF1.position.y = 0;
            g.colF1.children.forEach(panel => {
                panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz);
                panel.rotation.set(0, 0, 0);
            });
        } else if (raw === groundColumnStep) {
            columnFormBuildStart = now;
            columnFormReleaseStart = null;
            g.colF1.visible = false;
            g.colF1.position.y = -FH;
            g.colF1.children.forEach(panel => {
                panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz);
                panel.rotation.set(0, 0, 0);
            });
        } else if (raw === groundFloorColumnPourStep) {
            columnFormBuildStart = null;
            columnFormReleaseStart = now;
            g.colF1.position.y = 0;
            g.colF1.children.forEach(panel => {
                panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz);
                panel.rotation.set(0, 0, 0);
            });
        }
        const v = {
            tamcap: i >= 14 && i <= 27, tamTile: i >= 28,
            gnd2: raw >= groundTrenchStep,
            fillB: raw == footingBackfillStep, fill2: raw == groundFillStep,
            formN: raw == groundSlabFrameStep, rebN: raw == groundSlabFrameStep, slabN: raw >= groundSlabFrameStep + 1,
            pileS: raw == 3, site: true, layout: raw == 0,
            gnd0: raw < 2, gnd1: raw >= 2 && raw <= 7, fill: raw == 2, pile: raw >= 1 && raw <= 2,
            lot: raw >= 3, rebF: raw == 4 || raw == 5, colRb: raw >= 4 && raw <= groundFloorColumnPourStep,
            colR1: raw >= groundColumnStep && raw < upperColumnStep, colR2: false,
            formF: raw == 5 || raw == 6, ftg: raw >= 6, lot2: raw >= groundTrenchStep,
            formG: raw >= groundTrenchStep + 1 && raw <= groundFillStep - 1, rebG: raw == groundTrenchStep + 2 || raw == groundTrenchStep + 3,
            beamC: raw >= 11, bfill: raw >= groundFillStep, sand: raw >= groundFillStep,
            groundPipes: raw >= groundPipeStep, colF1: raw == groundFloorColumnPourStep && columnFormReleaseStart !== null, cols1: raw >= groundFloorColumnPourStep, wall0: raw >= groundColumnWallStep,
            formS1: raw >= floorFrameStart && raw <= floorSlabPourStep,
            balconySupport: raw >= floorFrameStart && (raw < balconyReleaseStep || raw === balconyReleaseStep && balconySupportReleaseStart !== null),
            rebS1: raw >= floorFrameStart && raw <= floorSlabPourStep, slab1: raw >= floorSlabPourStep, colF2: false, cols2: false, wall1: i >= 19,
            formS2: raw >= roofFrameStart && raw <= roofSlabPourStep, slab2: raw >= roofSlabPourStep,
            mep: i == 26, proof: i >= 23 && i <= 24, roof: i >= 25, tile: i >= 28,
            glass: i >= 30, fin: i >= 30, colM: raw >= roofColumnStep, frm: raw > roofColumnStep,
            done: i >= 30, fence: raw >= fenceInstallStep, rib: i == 31
        };
        if (raw === groundColumnStep) v.colF1 = false;
        if (raw >= floorFrameStart) v.colF1 = false;
        if (raw >= roofFrameStart) { v.colR2 = false; v.colF2 = false }
        v.beamForm1 = raw >= floorFrameStart && raw <= floorSlabPourStep;
        v.beamSupport1 = raw >= floorFrameStart && raw <= floorSlabPourStep;
        v.beamRebar1 = raw >= floorFrameStart && raw <= floorSlabPourStep;
        v.beamConcrete1 = raw >= floorSlabPourStep;
        v.beamForm2 = raw >= roofFrameStart && raw <= roofSlabPourStep;
        v.beamSupport2 = raw >= roofFrameStart && raw <= roofSlabPourStep;
        v.beamRebar2 = raw >= roofFrameStart && raw <= roofSlabPourStep;
        v.beamConcrete2 = raw >= roofSlabPourStep;
        v.slabRebar1 = raw >= floorFrameStart && raw <= floorSlabPourStep;
        v.slabRebar2 = raw >= roofFrameStart && raw <= roofSlabPourStep;
        const showGroundStarter = raw >= groundFloorColumnPourStep && raw < upperColumnStep;
        setGroundColumnStarter(showGroundStarter);
        if (showGroundStarter) {
            delete run.colR1;
            g.colR1.scale.y = 1;
            g.colR1.position.y = 0;
        }
        updateSlabRebarOpacity("beamRebar1", floorRebarPourStart, floorSlabPourStep, "beamConcrete1", now);
        updateSlabRebarOpacity("beamRebar2", roofRebarPourStart, roofSlabPourStep, "beamConcrete2", now);
        updateSlabRebarOpacity("rebS1", floorRebarPourStart, floorSlabPourStep, "slab1", now);
        updateSlabRebarOpacity("slabRebar1", floorRebarPourStart, floorSlabPourStep, "slab1", now);
        updateSlabRebarOpacity("slabRebar2", roofRebarPourStart, roofSlabPourStep, "slab2", now);
        const jump = Math.abs(raw - prevSt) != 1, buildRoofColumns = raw === roofColumnStep && !jump;
        const buildUpperColumns = raw === floorFrameStart + floorFrameSteps.length && !jump;
        if (raw === roofColumnStep && !buildRoofColumns) v.frm = true;
        if (prevSt === floorFrameStart + floorFrameSteps.length && raw !== floorFrameStart + floorFrameSteps.length) {
            upperColumnBuildStart = null;
            g.colR2.visible = false; g.colF2.visible = false;
            g.cols2.scale.y = 1; g.cols2.position.y = 0;
            upperColumnFormMaterial.opacity = .92;
            g.colF2.children.forEach(panel => panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz));
        }
        v.colR2 = false; v.colF2 = false; v.cols2 = i >= 18 && !buildUpperColumns;
        v.colMRebar = buildRoofColumns; v.colMForm = buildRoofColumns; v.colM = raw >= roofColumnStep;
        roofColumnBuildStart = buildRoofColumns ? now : null;
        upperColumnBuildStart = buildUpperColumns ? now : null;
        N.forEach(n => {
            const o = g[n];
            if (v[n] && !o.visible && !NOANIM.has(n) && n !== "colF1" && (!buildRoofColumns || !["colMRebar", "colMForm", "colM"].includes(n))) {
                run[n] = now;
                anim(n, 0);
                stepAnimationDurationMs = Math.max(stepAnimationDurationMs, animationDuration(n) * 1000);
            }
            if (!v[n]) delete run[n];
            o.visible = !!v[n];
        });
        if (raw === groundColumnStep) stepAnimationDurationMs = Math.max(stepAnimationDurationMs, 4200);
        if (raw === groundFloorColumnPourStep) stepAnimationDurationMs = Math.max(stepAnimationDurationMs, (animationDuration("cols1") + 2.1) * 1000);
        if (raw === balconyReleaseStep) stepAnimationDurationMs = Math.max(stepAnimationDurationMs, 2800);
        if (buildUpperColumns) stepAnimationDurationMs = Math.max(stepAnimationDurationMs, 7100);
        if (buildRoofColumns) stepAnimationDurationMs = Math.max(stepAnimationDurationMs, (6050 + animationDuration("frm") * 1000));
        if (buildUpperColumns) {
            for (const n of ["colR2", "colF2", "cols2"]) { delete run[n]; g[n].scale.y = .001; g[n].position.y = (FH + .07) * .999 }
            upperColumnFormMaterial.opacity = .92;
            g.colF2.children.forEach(panel => panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz));
            g.colR2.visible = true; g.colF2.visible = false; g.cols2.visible = false;
        } else if (raw === floorFrameStart + floorFrameSteps.length) {
            for (const n of ["colR2", "colF2"]) { g[n].scale.y = 1; g[n].position.y = 0 }
            g.cols2.scale.y = 1; g.cols2.position.y = 0;
        }
        if (buildRoofColumns) { for (const n of ["colMRebar", "colMForm", "colM"]) { delete run[n]; g[n].scale.y = .001; g[n].position.y = roofColumnBase * .999 } g.colMRebar.visible = true; g.colMForm.visible = false; g.colM.visible = false }
        else if (raw >= roofColumnStep) { for (const n of ["colMRebar", "colMForm"]) { g[n].scale.y = 1; g[n].position.y = 0 } g.colM.scale.y = 1; g.colM.position.y = 0; roofColumnFormMaterial.opacity = .62 }
        prevSt = raw; stepT0 = now; follow = true; camT = camFor(i); wc = wt = 100; if (!jump && raw === groundColumnWallStep) { wc = 0; wt = FH + .05 } else if (!jump && raw === upperColumnWallStep) { wc = FH; wt = 2 * FH + .1 }
        g.SB.position.y = i == 14 ? FH + .2 : .25;
        const fin = j => j >= 29 ? paint2 : j >= 27 ? plaster : brick, ovOn = !jump && (i == 27 || i == 29), bm0 = ovOn ? fin(i - 1) : fin(i);
        wmat.map = bm0; wmat.bumpMap = bm0 == brick ? brickB : stucB; wmat.bumpScale = bm0 == brick ? 3 : 1.2; ovm.visible = ovOn; if (ovOn) { ovm.map = fin(i); ovm.needsUpdate = true; wc2 = 0; wt2 = 2 * FH + .2 } else wc2 = wt2 = 100;
        rc = rt = 100; rp.constant = rc;
        ply.transparent = false; ply.opacity = 1; ply.needsUpdate = true; wmat.transparent = i == 26; wmat.opacity = i == 26 ? .25 : 1; wmat.needsUpdate = true; const sm = i >= 29 ? slabP : i >= 27 ? slabL : concM;[g.slab1, g.slab2].forEach(gr => gr.children.forEach(m => { m.material = sm })); g.tamcap.children.forEach(m => { m.material = i >= 27 ? slabL : brickM })
        R.shadowMap.needsUpdate = true;
    }
    let az = .7, el = .4, dist = 40, pinchDistance = 0, auto = !matchMedia("(prefers-reduced-motion:reduce)").matches, last = performance.now();
    function upd() { cam.position.set(dist * Math.cos(el) * Math.sin(az), camTy + dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)); cam.lookAt(0, camTy, 0) }
    const activePointers = new Map();
    const pointerDistance = () => {
        const points = Array.from(activePointers.values());
        return points.length < 2 ? 0 : Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
    };
    const endPointer = e => {
        activePointers.delete(e.pointerId);
        pinchDistance = 0;
    };
    cv.addEventListener("pointerdown", e => {
        e.preventDefault();
        cv.setPointerCapture(e.pointerId);
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        pinchDistance = activePointers.size === 2 ? pointerDistance() : 0;
        auto = false;
        follow = false;
    });
    cv.addEventListener("pointermove", e => {
        const previous = activePointers.get(e.pointerId);
        if (!previous) return;
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activePointers.size === 1) {
            az -= (e.clientX - previous.x) * .01;
            el = Math.max(.05, Math.min(1.4, el + (e.clientY - previous.y) * .008));
        } else if (activePointers.size === 2) {
            const distance = pointerDistance();
            if (pinchDistance) dist = Math.max(20, Math.min(70, dist - (distance - pinchDistance) * .08));
            pinchDistance = distance;
        }
    });
    cv.addEventListener("pointerup", endPointer);
    cv.addEventListener("pointercancel", endPointer);
    cv.addEventListener("lostpointercapture", endPointer);
    cv.addEventListener("wheel", e => { e.preventDefault(); follow = false; dist = Math.max(20, Math.min(70, dist + e.deltaY * .02)) }, { passive: false });
    function rs() { const w = cv.clientWidth, h = cv.clientHeight; R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix() }
    window.addEventListener("resize", rs);
    let renderActive = true, renderFrame = 0, lastFrame = 0;
    function loop(n) {
        if (!renderActive) return;
        if (n - lastFrame < 1000 / 30) { renderFrame = requestAnimationFrame(loop); return }
        lastFrame = n;
        const dt = Math.min(.05, (n - last) / 1000); last = n; const T0 = (n - stepT0) / 1000;
        const shadowsChanged = Object.keys(run).length > 0 || roofColumnBuildStart !== null || columnFormBuildStart !== null || columnFormReleaseStart !== null || balconySupportReleaseStart !== null || upperColumnBuildStart !== null;
        if (follow) { const k = 1 - Math.exp(-dt * 2.2); az += (camT.az + Math.sin(n * .0003) * .18 - az) * k; el += (camT.el - el) * k; dist += (camT.dist - dist) * k; camTy += (camT.ty - camTy) * k }
        for (const k in run) { const t = (n - run[k]) / 1000; anim(k, t); if (t > animationDuration(k) + .1) { anim(k, 99); delete run[k] } }
        if (roofColumnBuildStart !== null) {
            const age = (n - roofColumnBuildStart) / 1000;
            const steelProgress = smooth(age / 1.35), formProgress = smooth((age - 1.35) / 1.05), concreteProgress = smooth((age - 2.4) / 1.55), stripProgress = smooth((age - 4.95) / 1.1);
            riseFromBase(g.colMRebar, Math.max(.001, steelProgress), roofColumnBase);
            g.colMRebar.visible = age < 2.4;
            if (age >= 1.35) { g.colMForm.visible = true; riseFromBase(g.colMForm, Math.max(.001, formProgress), roofColumnBase) }
            if (age >= 2.4) { g.colMForm.scale.y = 1; g.colMForm.position.y = 0; g.colMRebar.visible = false; g.colM.visible = true; riseFromBase(g.colM, Math.max(.001, concreteProgress), roofColumnBase) }
            if (age >= 4.95) {
                g.colM.scale.y = 1; g.colM.position.y = 0; g.colMRebar.visible = false; g.colMForm.visible = true;
                g.colMForm.scale.y = 1; g.colMForm.position.y = 0; roofColumnFormMaterial.opacity = .62 * (1 - stripProgress);
                g.colMForm.children.forEach(panel => { panel.position.x = panel.userData.px + (panel.userData.stripX || 0) * stripProgress; panel.position.z = panel.userData.pz + (panel.userData.stripZ || 0) * stripProgress });
            }
            if (age >= 6.05) {
                g.colMForm.visible = false;
                roofColumnFormMaterial.opacity = .62;
                roofColumnBuildStart = null;
                g.frm.visible = true;
                run.frm = n;
                anim("frm", 0);
            }
        }
        if (columnFormBuildStart !== null) {
            const age = (n - columnFormBuildStart) / 1000, progress = smooth((age - 2.8) / 1.4);
            if (age >= 2.8) g.colF1.visible = true;
            g.colF1.position.y = -FH * (1 - progress);
            if (age >= 4.2) columnFormBuildStart = null;
        }
        if (columnFormReleaseStart !== null) {
            const age = (n - columnFormReleaseStart) / 1000, releaseDelay = animationDuration("cols1") + 1, progress = smooth((age - releaseDelay) / 1.1);
            g.colF1.children.forEach(panel => {
                panel.position.y = panel.userData.py - 4.5 * progress;
                panel.rotation.z = Math.sign(panel.userData.stripX || 0) * .18 * progress;
                panel.rotation.x = Math.sign(panel.userData.stripZ || 0) * .18 * progress;
            });
            if (age >= releaseDelay + 1.1) {
                g.colF1.visible = false;
                g.colF1.position.y = 0;
                g.colF1.children.forEach(panel => {
                    panel.position.set(panel.userData.px, panel.userData.py, panel.userData.pz);
                    panel.rotation.set(0, 0, 0);
                });
                columnFormReleaseStart = null;
            }
        }
        if (balconySupportReleaseStart !== null) {
            const age = (n - balconySupportReleaseStart) / 1000, progress = smooth(age / 2.8);
            g.balconySupport.children.forEach(support => {
                const dx = support.userData.px - 2.6, dz = support.userData.pz - hd;
                const length = Math.hypot(dx, dz) || 1;
                support.position.set(support.userData.px + dx / length * .9 * progress, support.userData.py - 1.5 * progress, support.userData.pz + dz / length * .9 * progress);
            });
            if (age >= 2.8) {
                g.balconySupport.visible = false;
                balconySupportReleaseStart = null;
            }
        }
        if (upperColumnBuildStart !== null) {
            const age = (n - upperColumnBuildStart) / 1000, rebarProgress = smooth(age / 1.7), formProgress = smooth((age - 1.7) / 1.1), concreteProgress = smooth((age - 3.2) / 1.7), stripProgress = smooth((age - 5.9) / 1.2), baseY = FH + .07;
            riseFromBase(g.colR2, Math.max(.001, rebarProgress), baseY);
            g.colR2.visible = age < 3.2;
            if (age >= 1.7) { g.colF2.visible = true; riseFromBase(g.colF2, Math.max(.001, formProgress), baseY) }
            if (age >= 3.2) { g.colR2.visible = false; g.cols2.visible = true; riseFromBase(g.cols2, Math.max(.001, concreteProgress), baseY) }
            if (age >= 4.9) {
                g.cols2.scale.y = 1; g.cols2.position.y = 0;
                upperColumnFormMaterial.opacity = .92 * (1 - stripProgress);
                g.colF2.children.forEach(panel => {
                    const x = cx.reduce((nearest, value) => Math.abs(value - panel.userData.px) < Math.abs(nearest - panel.userData.px) ? value : nearest, cx[0]);
                    const z = cz.reduce((nearest, value) => Math.abs(value - panel.userData.pz) < Math.abs(nearest - panel.userData.pz) ? value : nearest, cz[0]);
                    const dx = panel.userData.px - x, dz = panel.userData.pz - z;
                    panel.position.x = panel.userData.px + dx * .8 * stripProgress;
                    panel.position.z = panel.userData.pz + dz * .8 * stripProgress;
                });
            }
            if (age >= 7.1) {
                g.colF2.visible = false; upperColumnFormMaterial.opacity = .92; upperColumnBuildStart = null;
            }
        }
        updateSlabRebarOpacity("rebS1", floorRebarPourStart, floorSlabPourStep, "slab1", n);
        updateSlabRebarOpacity("beamRebar1", floorRebarPourStart, floorSlabPourStep, "beamConcrete1", n);
        updateSlabRebarOpacity("beamRebar2", roofRebarPourStart, roofSlabPourStep, "beamConcrete2", n);
        updateSlabRebarOpacity("slabRebar1", floorRebarPourStart, floorSlabPourStep, "slab1", n);
        updateSlabRebarOpacity("slabRebar2", roofRebarPourStart, roofSlabPourStep, "slab2", n);
        wc = Math.min(wt, wc + dt * FH / 5); wp.constant = wc; wc2 = Math.min(wt2, wc2 + dt * FH / 3); wp2.constant = wc2; rc = Math.min(rt, rc + dt * .55); rp.constant = rc;
        if (st === tieBeamDisplayIndex && tieBeamAnimationStage !== null && tieBeamAnimationStage < tieBeamStepKeys.length - 1 && hasCurrentAnimationFinished()) {
            tieBeamAnimationStage++;
            show();
        }
        if (shadowsChanged) R.shadowMap.needsUpdate = true;
        upd(); R.render(sc, cam); renderFrame = requestAnimationFrame(loop)
    }
    renderFrame = requestAnimationFrame(loop);
    function setActive(active) { if (active === renderActive) { if (active) rs(); return } renderActive = active; if (active) { last = performance.now(); lastFrame = 0; rs(); renderFrame = requestAnimationFrame(loop) } else cancelAnimationFrame(renderFrame) }
    rs(); ui();
    function setPackage(name, price) { const formatted = Number.isFinite(price) && price > 0 ? ` \u00b7 ${new Intl.NumberFormat("vi-VN").format(Math.round(price))} \u0111/m\u00b2` : ""; $("tag").textContent = `${name}${formatted}` }
    return { setPackage, setActive };
};

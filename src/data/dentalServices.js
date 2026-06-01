import {
  Banknote,
  Clock,
  Cross,
  ShieldCheck,
  Smile,
  Sparkles,
  Syringe,
  WandSparkles,
} from "lucide-react";

export const dentalServices = [
  {
    title: "Nhổ răng khôn",
    description:
      "Loại bỏ răng khôn mọc lệch, ngầm an toàn, không đau, phục hồi nhanh chóng nhờ công nghệ siêu âm Piezotome.",
    duration: "30 - 60 phút",
    price: "từ 1.500.000 VNĐ",
    Icon: Smile,
  },
  {
    title: "Niềng răng",
    description:
      "Chỉnh nha chuyên sâu với các phương pháp mắc cài kim loại, sứ, hoặc khay trong suốt Invisalign tiên tiến.",
    duration: "1 - 3 năm",
    price: "từ 30.000.000 VNĐ",
    Icon: ShieldCheck,
  },
  {
    title: "Tẩy trắng răng",
    description:
      "Mang lại nụ cười rạng rỡ với công nghệ Laser Whitening an toàn, không ê buốt, hiệu quả tức thì sau một lần hẹn.",
    duration: "45 - 60 phút",
    price: "từ 2.500.000 VNĐ",
    Icon: WandSparkles,
  },
  {
    title: "Khám tổng quát",
    description:
      "Kiểm tra toàn diện sức khỏe răng miệng, lấy cao răng định kỳ và tư vấn phòng ngừa các bệnh lý nha khoa.",
    duration: "30 phút",
    price: "từ 300.000 VNĐ",
    Icon: Cross,
  },
  {
    title: "Trồng răng Implant",
    description:
      "Phục hình răng đã mất bằng chân răng nhân tạo Titanium, đảm bảo chức năng ăn nhai và thẩm mỹ trọn đời.",
    duration: "60 - 90 phút/răng",
    price: "từ 15.000.000 VNĐ",
    Icon: Syringe,
  },
  {
    title: "Bọc răng sứ",
    description:
      "Phục hồi hình dáng, màu sắc răng hoàn hảo với các dòng sứ cao cấp, bảo tồn tối đa răng gốc.",
    duration: "2 - 3 buổi",
    price: "từ 3.000.000 VNĐ",
    Icon: Sparkles,
  },
];

export const serviceMetaIcons = {
  DurationIcon: Clock,
  PriceIcon: Banknote,
};

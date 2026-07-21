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
      "Nhổ răng khôn mọc lệch hoặc mọc ngầm an toàn bằng công nghệ siêu âm Piezotome, giúp phục hồi nhanh hơn.",
    duration: "30 - 60 phút",
    price: "từ 1.500.000 VND",
    Icon: Smile,
  },
  {
    title: "Chỉnh nha",
    description:
      "Chỉnh nha hiện đại với mắc cài kim loại, mắc cài sứ hoặc khay trong Invisalign.",
    duration: "1 - 3 năm",
    price: "từ 30.000.000 VND",
    Icon: ShieldCheck,
  },
  {
    title: "Tẩy trắng răng",
    description:
      "Làm sáng nụ cười bằng công nghệ tẩy trắng laser an toàn, thấy rõ kết quả sau một lần hẹn.",
    duration: "45 - 60 phút",
    price: "từ 2.500.000 VND",
    Icon: WandSparkles,
  },
  {
    title: "Khám tổng quát",
    description:
      "Kiểm tra sức khỏe răng miệng toàn diện, cạo vôi định kỳ và tư vấn phòng ngừa.",
    duration: "30 phút",
    price: "từ 300.000 VND",
    Icon: Cross,
  },
  {
    title: "Cấy ghép Implant",
    description:
      "Phục hồi răng mất bằng trụ implant titanium, đảm bảo chức năng và thẩm mỹ lâu dài.",
    duration: "60 - 90 phút/răng",
    price: "từ 15.000.000 VND",
    Icon: Syringe,
  },
  {
    title: "Bọc răng sứ",
    description:
      "Phục hồi hình dáng và màu sắc răng bằng sứ cao cấp, bảo tồn tối đa mô răng thật.",
    duration: "2 - 3 lần hẹn",
    price: "từ 3.000.000 VND",
    Icon: Sparkles,
  },
];

export const serviceMetaIcons = {
  DurationIcon: Clock,
  PriceIcon: Banknote,
};

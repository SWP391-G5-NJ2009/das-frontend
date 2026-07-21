export const PATIENT_NAV_ITEMS = [
  { icon: "calendar_plus", label: "Đặt lịch khám", to: "/patient/booking" },
  {
    icon: "calendar_today",
    label: "Danh sách lịch khám",
    to: "/patient/appointments",
  },
  { icon: "history", label: "Lịch sử điều trị", to: "/patient/history" },
  { icon: "payments", label: "Lịch sử thanh toán", to: "/patient/payments" },
  { icon: "person", label: "Quản lý hồ sơ", to: "/patient/profile" },
];

export const PATIENT_FOOTER_ITEMS = [
  { icon: "logout", label: "Đăng xuất", to: "/login" },
];

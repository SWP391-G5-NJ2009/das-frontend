export const MANAGER_NAV_ITEMS = [
  {
    icon: "medical_services",
    label: "Dịch vụ nha khoa",
    to: "/manager/services-management",
  },
  {
    icon: "business",
    label: "Thông tin phòng khám",
    to: "/manager/clinic-info",
  },
  {
    icon: "calendar_today",
    label: "Duyệt lịch nha sĩ",
    to: "/manager/clinic-schedule",
  },
  {
    icon: "meeting_room",
    label: "Quản lý phòng",
    to: "/manager/rooms-management",
  },
  {
    icon: "payments",
    label: "Thống kê doanh thu",
    to: "/manager/revenue",
  },
  {
    icon: "group",
    label: "Thống kê bệnh nhân",
    to: "/manager/patient",
  },
  {
    icon: "calendar_today",
    label: "Thống kê lịch hẹn",
    to: "/manager/appointment-dashboard",
  },
  {
    icon: "group",
    label: "Quản lí nhân sự",
    to: "/manager/staff",
  },
];

export const MANAGER_FOOTER_ITEMS = [
  { icon: "logout", label: "Đăng xuất", to: "/staff/login" },
];

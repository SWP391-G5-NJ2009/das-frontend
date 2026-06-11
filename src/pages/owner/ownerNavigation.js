export const OWNER_NAV_ITEMS = [
  {
    icon: "medical_services",
    label: "Dịch vụ nha khoa",
    to: "/owner/services",
  },
  {
    icon: "business",
    label: "Thông tin phòng khám",
    to: "/owner/clinic-info",
  },
  {
    icon: "calendar_month",
    label: "Lịch phòng khám",
    to: "/owner/clinic-schedule",
  },
  {
    icon: "analytics",
    label: "Phân tích",
    to: "/owner/analytics",
  },
  {
    icon: "payments",
    label: "Doanh thu",
    to: "/owner/revenue",
  },
];

export function getOwnerFooterItems() {
  return [{ icon: "logout", label: "Đăng xuất", to: "/staff/login" }];
}

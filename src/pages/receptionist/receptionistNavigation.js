export const RECEPTIONIST_NAV_ITEMS = [
  {
    icon: "assignment",
    label: "Consultation Requests",
    to: "/receptionist/consultation-request",
  },
  {
    icon: "payments",
    label: "Payments",
    to: "/payments",
  },
  {
    icon: "calendar_today",
    label: "Appointments",
    to: "/receptionist/appointments",
  },
  {
    icon: "meeting_room",
    label: "Rooms",
    to: "/receptionist/rooms",
  },
];

export function getReceptionistFooterItems() {
  return [{ icon: "logout", label: "Logout", to: "/staff/login" }];
}

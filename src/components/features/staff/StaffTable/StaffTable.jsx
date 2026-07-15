import { Eye, Pencil } from "lucide-react";
import PropTypes from "prop-types";
import "./StaffTable.css";

function getRoleLabel(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "dentist") return "Nha sĩ";
  if (normalizedRole === "receptionist") return "Lễ tân";

  return role || "Unknown";
}

function getStatusLabel(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") return "Hoạt động";
  if (normalizedStatus === "banned") return "Bị khóa";

  return "Unknown";
}

function getStatusClass(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return "staff-table__status staff-table__status--active";
  }

  if (normalizedStatus === "banned") {
    return "staff-table__status staff-table__status--banned";
  }

  return "staff-table__status staff-table__status--inactive";
}

function StaffTable({ staff, onEditStaff, onViewStaff }) {
  return (
    <div className="staff-table">
      <table className="staff-table__table">
        <thead>
          <tr>
            <th scope="col">Tên / Tên đăng nhập</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((item) => {
            const canEditStaff =
              ["dentist", "receptionist"].includes(item.role?.toLowerCase()) &&
              item.profileId;

            return (
              <tr key={item.accountId}>
                <td>
                  {(item.profileId ? item.fullName : null) ||
                    item.username ||
                    item.fullName ||
                    "Not updated"}
                </td>
                <td>{getRoleLabel(item.role)}</td>
                <td>
                  <span className={getStatusClass(item.status)}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td>
                  <div className="staff-table__actions">
                    {canEditStaff && (
                      <button
                        className="staff-table__action-button staff-table__action-button--edit"
                        type="button"
                        aria-label={`Edit ${item.fullName || "dentist"} profile`}
                        title="Sửa"
                        onClick={() => onEditStaff(item)}
                      >
                        <Pencil size={18} aria-hidden="true" />
                      </button>
                    )}
                    <button
                      className="staff-table__action-button staff-table__action-button--view"
                      type="button"
                      aria-label={`View ${item.fullName || "staff"} profile`}
                      title="Xem"
                      onClick={() => onViewStaff(item)}
                    >
                      <Eye size={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

StaffTable.propTypes = {
  staff: PropTypes.arrayOf(
    PropTypes.shape({
      accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      fullName: PropTypes.string,
      profileId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      role: PropTypes.string,
      status: PropTypes.string,
      username: PropTypes.string,
    }),
  ).isRequired,
  onEditStaff: PropTypes.func.isRequired,
  onViewStaff: PropTypes.func.isRequired,
};

export default StaffTable;

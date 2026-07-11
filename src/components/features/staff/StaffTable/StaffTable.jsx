import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import "./StaffTable.css";

function getRoleLabel(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "dentist") return "Dentist";
  if (normalizedRole === "receptionist") return "Receptionist";

  return role || "Unknown";
}

function getStatusLabel(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") return "Active";
  if (normalizedStatus === "banned") return "Banned";

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

function StaffTable({ staff, onViewDentist }) {
  return (
    <div className="staff-table">
      <table className="staff-table__table">
        <thead>
          <tr>
            <th scope="col">Name / Username</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((item) => {
            const isDentist = item.role?.toLowerCase() === "dentist";

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
                  <button
                    className={`staff-table__view-button${
                      isDentist ? "" : " staff-table__view-button--disabled"
                    }`}
                    type="button"
                    aria-label={`View ${item.fullName || "staff"} profile`}
                    disabled={!isDentist}
                    onClick={() => onViewDentist(item)}
                  >
                    <Eye size={18} aria-hidden="true" />
                  </button>
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
  onViewDentist: PropTypes.func.isRequired,
};

export default StaffTable;

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RoleHeader from "../../../components/layout/RoleHeader/RoleHeader";
import "./RoleDashboardPage.css";

function RoleDashboardPage({ title }) {
  const { logout, user } = useAuth();

  return (
    <div className="role-dashboard">
      <RoleHeader roleLabel={user?.role || "Staff"} showHelp />
      <main className="role-dashboard__content">
        <h1>{title}</h1>
        <p>Xin chao, {user?.fullName || user?.email}.</p>
        <button type="button" onClick={logout}>
          Dang xuat
        </button>
        {user?.role === "owner" && (
          <Link to="/owner/services">Quan ly dich vu nha khoa</Link>
        )}
        <Link to="/">Ve trang chu</Link>
      </main>
    </div>
  );
}

RoleDashboardPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoleDashboardPage;

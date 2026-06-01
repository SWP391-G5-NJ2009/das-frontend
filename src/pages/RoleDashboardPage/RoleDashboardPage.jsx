import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RoleDashboardPage({ title }) {
  const { logout, user } = useAuth();

  return (
    <main className="role-dashboard">
      <h1>{title}</h1>
      <p>Xin chào, {user?.fullName || user?.email}.</p>
      <button type="button" onClick={logout}>
        Đăng xuất
      </button>
      <Link to="/">Về trang chủ</Link>
    </main>
  );
}

RoleDashboardPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoleDashboardPage;

import { useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Headphones,
  Landmark,
  Search,
  Shield,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useAccounts } from "../../../hooks/useAccounts";
import AddAccountModal from "../../../components/features/admin/AddAccountModal";
import EditAccountModal from "../../../components/features/admin/EditAccountModal";
import DeleteConfirmModal from "../../../components/features/admin/DeleteConfirmModal";
import RoleHeader from "../../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../../components/layout/RoleSidebar/RoleSidebar";
import "./AdminAccountsPage.css";

const NAV_ITEMS = [
  { icon: "person", label: "Quản lý tài khoản", to: "/admin/accounts" },
  { icon: "calendar_today", label: "Lịch hẹn", to: "/admin/appointments" },
  { icon: "assessment", label: "Báo cáo", to: "/admin/reports" },
  { icon: "settings", label: "Cài đặt", to: "/admin/settings" },
];

function AdminAccountsPage() {
  const { accounts, isLoading, error, refetch } = useAccounts();
  const [toastVisible, setToastVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="admin-accounts">
      <RoleSidebar
        ariaLabel="Điều hướng quản trị"
        navItems={NAV_ITEMS}
        footerItems={[{ icon: "logout", label: "Đăng xuất", to: "/staff/login" }]}
      />

      <main className="admin-accounts__main">
        <RoleHeader isFixed onNotificationClick={showToast} roleLabel="Admin" />

        <div className="admin-accounts__content">
          <div className="admin-accounts__page-header">
            <div>
              <h2 className="admin-accounts__page-title">Quản lý tài khoản</h2>
              <p className="admin-accounts__page-desc">
                Thêm, cập nhật hoặc gỡ quyền truy cập của người dùng trong hệ thống.
              </p>
            </div>
            <button
              className="admin-accounts__btn-primary"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <UserPlus size={20} aria-hidden="true" />
              Thêm tài khoản mới
            </button>
          </div>

          <div className="admin-accounts__stats">
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary">
                <Shield size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Quản trị viên</p>
                <p className="admin-accounts__stat-value">12</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary-container">
                <Stethoscope size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Nha sĩ</p>
                <p className="admin-accounts__stat-value">45</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--tertiary">
                <Landmark size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Chủ phòng khám</p>
                <p className="admin-accounts__stat-value">5</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <Headphones size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Nhân viên</p>
                <p className="admin-accounts__stat-value">28</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <Users size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Bệnh nhân</p>
                <p className="admin-accounts__stat-value">1,163</p>
              </div>
            </div>
          </div>

          <div className="admin-accounts__card">
            <div className="admin-accounts__card-header">
              <div className="admin-accounts__card-title-group">
                <h4 className="admin-accounts__card-title">
                  Danh sách tài khoản
                </h4>
              </div>
              <div className="admin-accounts__card-toolbar">
                <div className="admin-accounts__table-search">
                  <Search size={18} aria-hidden="true" />
                  <input placeholder="Tìm trong danh sách..." type="text" />
                </div>
                <button className="admin-accounts__tool-btn" type="button">
                  <Filter size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="admin-accounts__table-wrapper">
              <table className="admin-accounts__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên đăng nhập</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Trạng thái</th>
                    <th>Loại tài khoản</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td className="admin-accounts__cell" colSpan={7}>
                        Đang tải tài khoản...
                      </td>
                    </tr>
                  )}

                  {error && (
                    <tr>
                      <td className="admin-accounts__cell" colSpan={7}>
                        Lỗi: {error.message}
                      </td>
                    </tr>
                  )}

                  {!isLoading && !error && accounts.length === 0 && (
                    <tr>
                      <td className="admin-accounts__cell" colSpan={7}>
                        Không tìm thấy tài khoản nào
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    !error &&
                    accounts.map((account, index) => (
                      <tr
                        key={account.account_id}
                        className="admin-accounts__row"
                      >
                        <td className="admin-accounts__cell admin-accounts__cell--num">
                          {index + 1}
                        </td>
                        <td className="admin-accounts__cell">
                          <div className="admin-accounts__user-cell">
                            <div className="admin-accounts__avatar">
                              {(account.username || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span>{account.username}</span>
                          </div>
                        </td>
                        <td className="admin-accounts__cell">
                          {account.email}
                        </td>
                        <td className="admin-accounts__cell">
                          {account.phone}
                        </td>
                        <td className="admin-accounts__cell">
                          {account.status}
                        </td>
                        <td className="admin-accounts__cell">
                          <span
                            className={`admin-accounts__role-badge admin-accounts__role-badge--${(account.role?.role_name || "").toLowerCase()}`}
                          >
                            {account.role?.role_name}
                          </span>
                        </td>
                        <td className="admin-accounts__cell admin-accounts__cell--actions">
                          <button
                            className="admin-accounts__action-btn admin-accounts__action-btn--edit"
                            type="button"
                            onClick={() => setEditAccount(account)}
                          >
                            <Edit size={20} aria-hidden="true" />
                          </button>
                          <button
                            className="admin-accounts__action-btn admin-accounts__action-btn--delete"
                            type="button"
                            onClick={() => setDeleteAccount(account)}
                          >
                            <Trash2 size={20} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="admin-accounts__pagination">
              <p className="admin-accounts__pagination-info">
                Hiển thị 1-6 trong tổng số 1.248 tài khoản
              </p>
              <div className="admin-accounts__pagination-controls">
                <button className="admin-accounts__page-btn" type="button">
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  className="admin-accounts__page-btn admin-accounts__page-btn--active"
                  type="button"
                >
                  1
                </button>
                <button className="admin-accounts__page-btn" type="button">
                  2
                </button>
                <button className="admin-accounts__page-btn" type="button">
                  3
                </button>
                <button className="admin-accounts__page-btn" type="button">
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className={`admin-accounts__toast${toastVisible ? " admin-accounts__toast--visible" : ""}`}
      >
        <CheckCircle
          className="admin-accounts__toast-icon"
          size={20}
          aria-hidden="true"
        />
        <span>Thao tác thành công</span>
      </div>
      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refetch();
          }}
        />
      )}
      {editAccount && (
        <EditAccountModal
          account={editAccount}
          onClose={() => setEditAccount(null)}
          onSuccess={() => {
            setEditAccount(null);
            refetch();
          }}
        />
      )}
      {deleteAccount && (
        <DeleteConfirmModal
          account={deleteAccount}
          onClose={() => setDeleteAccount(null)}
          onSuccess={() => {
            setDeleteAccount(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

AdminAccountsPage.propTypes = {};

export default AdminAccountsPage;

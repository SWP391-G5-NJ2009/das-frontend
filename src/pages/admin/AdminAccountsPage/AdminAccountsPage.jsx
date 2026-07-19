import { useState, useCallback, useRef } from "react";
import {
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
  CheckCircle,
} from "lucide-react";
import { useAccounts } from "../../../hooks/useAccounts";
import AddAccountModal from "../../../components/features/admin/AddAccountModal";
import EditAccountModal from "../../../components/features/admin/EditAccountModal";
import DeleteConfirmModal from "../../../components/features/admin/DeleteConfirmModal";
import AdminPageShell from "../AdminPageShell";
import PropTypes from "prop-types";
import AccountFilters from "../../../components/features/admin/AccountFilters/AccountFilters"
import Pagination from "../../../components/common/Pagination/Pagination"
import "./AdminAccountsPage.css";

function AdminAccountsPage() {

  const [filters, setFilters] = useState({
    status: "All",
    date: "",
    search: "",
    pagination: 1,
  });
  const MAX_PAGE = 20;

  const { accounts, total, isLoading, error, refetch } = useAccounts(filters);
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  const triggerToast = useCallback(() => {
    clearTimeout(toastTimer.current);
    setShowToast(true);
    toastTimer.current = setTimeout(() => setShowToast(false), 5000);
  }, []);

  const handleStatusChange = useCallback(
    (status) => setFilters((prev) => ({ ...prev, status, pagination: 1 })),
    [],
  );

  const handleDateChange = useCallback(
    (date) => setFilters((prev) => ({ ...prev, date, pagination: 1 })),
    [],
  );
  const handleSearchChange = useCallback(
    (search) => setFilters((prev) => ({ ...prev, search, pagination: 1 })),
    [],
  );

  return (
    <AdminPageShell>
      <div className="admin-accounts__page-header">
        <div>
          <h2 className="admin-accounts__page-title">Quản lý tài khoản</h2>
          <p className="admin-accounts__page-desc">
            Thêm, cập nhật hoặc xóa quyền truy cập người dùng trong hệ thống.
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



      <div className="admin-accounts__card">
        <div className="admin-accounts__card-header">
          <div className="admin-accounts__card-title-group">
            <h4 className="admin-accounts__card-title">Danh sách tài khoản</h4>
          </div>
        </div>

        <AccountFilters
          filters={filters}
          onStatusChange={handleStatusChange}
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
        />

        <div className="admin-accounts__table-wrapper">
          <table className="admin-accounts__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Status</th>
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
                    Error: {error.message}
                  </td>
                </tr>
              )}

              {!isLoading && !error && accounts.length === 0 && (
                <tr>
                  <td className="admin-accounts__cell" colSpan={7}>
                    Không tìm thấy tài khoản
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                accounts.map((account, index) => (
                  <tr key={account.account_id} className="admin-accounts__row">
                    <td className="admin-accounts__cell admin-accounts__cell--num">
                      {index + 1}
                    </td>
                    <td className="admin-accounts__cell">
                      <div className="admin-accounts__user-cell">
                        <div className="admin-accounts__avatar">
                          {(account.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <span>{account.username}</span>
                      </div>
                    </td>
                    <td className="admin-accounts__cell">{account.email}</td>
                    <td className="admin-accounts__cell">{account.phone}</td>
                    <td className="admin-accounts__cell">{account.status}</td>
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
            Showing {(filters.pagination - 1) * MAX_PAGE + 1}-{filters.pagination * MAX_PAGE < total ? filters.pagination * MAX_PAGE : total} of {total} accounts
          </p>
          <div className="admin-accounts__pagination-controls">
            <Pagination
              currentPage={filters.pagination}
              totalPage={Math.ceil(total / 20)}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, pagination: page }))} />
          </div>
        </div>
      </div>

      <div className={`admin-accounts__toast${showToast ? " admin-accounts__toast--visible" : ""}`}>
        <CheckCircle
          className="admin-accounts__toast-icon"
          size={20}
          aria-hidden="true"
        />
        <span>Thao tác đã hoàn tất thành công</span>
      </div>
      {showModal && (
        <AddAccountModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            refetch();
            triggerToast();
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
    </AdminPageShell>
  );
}

AdminAccountsPage.propTypes = {};

export default AdminAccountsPage;

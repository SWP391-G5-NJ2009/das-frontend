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
import AdminPageShell from "../AdminPageShell";
import "./AdminAccountsPage.css";

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
    <AdminPageShell onNotificationClick={showToast}>
          <div className="admin-accounts__page-header">
            <div>
              <h2 className="admin-accounts__page-title">Account Management</h2>
              <p className="admin-accounts__page-desc">
                Add, update, or remove user access in the system.
              </p>
            </div>
            <button
              className="admin-accounts__btn-primary"
              type="button"
              onClick={() => setShowModal(true)}
            >
              <UserPlus size={20} aria-hidden="true" />
              Add new account
            </button>
          </div>

          <div className="admin-accounts__stats">
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary">
                <Shield size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Administrators</p>
                <p className="admin-accounts__stat-value">12</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary-container">
                <Stethoscope size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Dentists</p>
                <p className="admin-accounts__stat-value">45</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--tertiary">
                <Landmark size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Clinic owners</p>
                <p className="admin-accounts__stat-value">5</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <Headphones size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Staff</p>
                <p className="admin-accounts__stat-value">28</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <Users size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="admin-accounts__stat-label">Patients</p>
                <p className="admin-accounts__stat-value">1,163</p>
              </div>
            </div>
          </div>

          <div className="admin-accounts__card">
            <div className="admin-accounts__card-header">
              <div className="admin-accounts__card-title-group">
                <h4 className="admin-accounts__card-title">
                  Account list
                </h4>
              </div>
              <div className="admin-accounts__card-toolbar">
                <div className="admin-accounts__table-search">
                  <Search size={18} aria-hidden="true" />
                  <input placeholder="Search the list..." type="text" />
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
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone number</th>
                    <th>Status</th>
                    <th>Account type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td className="admin-accounts__cell" colSpan={7}>
                        Loading accounts...
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
                        No accounts found
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
                Showing 1-6 of 1,248 accounts
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
      

      <div
        className={`admin-accounts__toast${toastVisible ? " admin-accounts__toast--visible" : ""}`}
      >
        <CheckCircle
          className="admin-accounts__toast-icon"
          size={20}
          aria-hidden="true"
        />
        <span>Action completed successfully</span>
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
    </AdminPageShell>
  );
}

AdminAccountsPage.propTypes = {};

export default AdminAccountsPage;

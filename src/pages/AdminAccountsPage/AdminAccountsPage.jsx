import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccounts } from "../../hooks/useAccounts"
import AddAccountModal from "./AddAccountModal";
import EditAccountModal from "./EditAccountModal";
import "./AdminAccountsPage.css";

const NAV_ITEMS = [
  { icon: "person", label: "Manage Account", to: "/admin/accounts" },
  { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "calendar_today", label: "Appointments", to: "/admin/appointments" },
  { icon: "assessment", label: "Reports", to: "/admin/reports" },
  { icon: "settings", label: "Settings", to: "/admin/settings" },
];

function AdminAccountsPage() {
  const { user } = useAuth();
  const { accounts, isLoading, error, refetch } = useAccounts();
  const [toastVisible, setToastVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="admin-accounts">
      <aside className="admin-accounts__sidebar">
        <div className="admin-accounts__brand">
          <h1 className="admin-accounts__brand-name">DentalCare</h1>
        </div>

        <nav className="admin-accounts__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `admin-accounts__nav-item${isActive ? " admin-accounts__nav-item--active" : ""}`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-accounts__sidebar-footer">
          <NavLink to="#" className="admin-accounts__nav-item">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </NavLink>
          <NavLink to="/" className="admin-accounts__nav-item">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>

      <main className="admin-accounts__main">
        <header className="admin-accounts__header">
          <div className="admin-accounts__search">
            <span className="material-symbols-outlined admin-accounts__search-icon">search</span>
            <input
              className="admin-accounts__search-input"
              placeholder="Search for accounts, names or roles..."
              type="text"
            />
          </div>

          <div className="admin-accounts__header-actions">
            <button className="admin-accounts__icon-btn" type="button" onClick={showToast}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="admin-accounts__icon-btn" type="button" onClick={showToast}>
              <span className="material-symbols-outlined">help_outline</span>
            </button>

            <div className="admin-accounts__divider" />

            <div className="admin-accounts__profile">
              <div className="admin-accounts__profile-info">
                <p className="admin-accounts__profile-name">{user?.fullName || "Dr. Sarah Miller"}</p>
                <p className="admin-accounts__profile-role">Admin</p>
              </div>
              <div className="admin-accounts__avatar">
                SM
              </div>
            </div>
          </div>
        </header>

        <div className="admin-accounts__content">
          <div className="admin-accounts__page-header">
            <div>
              <h2 className="admin-accounts__page-title">Manage Accounts</h2>
              <p className="admin-accounts__page-desc">
                Add, update, or remove administrative and patient user access.
              </p>
            </div>
            <button className="admin-accounts__btn-primary" type="button" onClick={() => setShowModal(true)}>
              <span className="material-symbols-outlined">person_add</span>
              Add New Account
            </button>
          </div>

          <div className="admin-accounts__card">
            <div className="admin-accounts__card-header">
              <div className="admin-accounts__card-title-group">
                <h4 className="admin-accounts__card-title">Account Management</h4>
                <div className="admin-accounts__total-badge">
                  <span className="material-symbols-outlined">group</span>
                  <span>Total Users: 1,248</span>
                  <span className="admin-accounts__trend-badge">
                    <span className="material-symbols-outlined">trending_up</span>
                    12%
                  </span>
                </div>
              </div>
              <div className="admin-accounts__card-toolbar">
                <div className="admin-accounts__table-search">
                  <span className="material-symbols-outlined">search</span>
                  <input placeholder="Find in list..." type="text" />
                </div>
                <button className="admin-accounts__tool-btn" type="button">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="admin-accounts__tool-btn" type="button">
                  <span className="material-symbols-outlined">download</span>
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
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Account Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr><td className="admin-accounts__cell" colSpan={7}>Loading accounts...</td></tr>
                  )}

                  {error && (
                    <tr><td className="admin-accounts__cell" colSpan={7}>Error: {error.message}</td></tr>
                  )}

                  {!isLoading && !error && accounts.length === 0 && (
                    <tr><td className="admin-accounts__cell" colSpan={7}>No accounts found</td></tr>
                  )}

                  {!isLoading && !error && accounts.map((account, index) => (
                    <tr key={account.account_id} className="admin-accounts__row">
                      <td className="admin-accounts__cell admin-accounts__cell--num">{index + 1}</td>
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
                        <span className={`admin-accounts__role-badge admin-accounts__role-badge--${(account.role?.role_name || "").toLowerCase()}`}>
                          {account.role?.role_name}
                        </span>
                      </td>
                      <td className="admin-accounts__cell admin-accounts__cell--actions">
                        <button className="admin-accounts__action-btn admin-accounts__action-btn--edit" type="button" onClick={() => setEditAccount(account)}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button className="admin-accounts__action-btn admin-accounts__action-btn--delete" type="button" onClick={showToast}>
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-accounts__pagination">
              <p className="admin-accounts__pagination-info">Showing 1-6 of 1,248 accounts</p>
              <div className="admin-accounts__pagination-controls">
                <button className="admin-accounts__page-btn" type="button">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="admin-accounts__page-btn admin-accounts__page-btn--active" type="button">1</button>
                <button className="admin-accounts__page-btn" type="button">2</button>
                <button className="admin-accounts__page-btn" type="button">3</button>
                <button className="admin-accounts__page-btn" type="button">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="admin-accounts__stats">
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <p className="admin-accounts__stat-label">Admins</p>
                <p className="admin-accounts__stat-value">12</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--primary-container">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <p className="admin-accounts__stat-label">Doctors</p>
                <p className="admin-accounts__stat-value">45</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--tertiary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <p className="admin-accounts__stat-label">Owners</p>
                <p className="admin-accounts__stat-value">5</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <p className="admin-accounts__stat-label">Staff</p>
                <p className="admin-accounts__stat-value">28</p>
              </div>
            </div>
            <div className="admin-accounts__stat-card">
              <div className="admin-accounts__stat-icon admin-accounts__stat-icon--secondary">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="admin-accounts__stat-label">Patients</p>
                <p className="admin-accounts__stat-value">1,163</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`admin-accounts__toast${toastVisible ? " admin-accounts__toast--visible" : ""}`}>
        <span className="material-symbols-outlined admin-accounts__toast-icon">check_circle</span>
        <span>Action successful</span>
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
    </div>
  );
}

AdminAccountsPage.propTypes = {};

export default AdminAccountsPage;

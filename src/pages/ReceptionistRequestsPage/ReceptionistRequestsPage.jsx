import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useConsultationRequests } from "../../hooks/useConsultationRequests"
import HandleRequestModal from "./HandleRequestModal";
import "./ReceptionistRequestsPage.css";

const NAV_ITEMS = [
  { icon: "assignment", label: "Yêu cầu tư vấn", to: "/receptionist/consultation-request" },
  { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "calendar_today", label: "Appointments", to: "/admin/appointments" },
  { icon: "assessment", label: "Reports", to: "/admin/reports" },
  { icon: "settings", label: "Settings", to: "/admin/settings" },
];

function ReceptionistRequestsPage() {
  const { user } = useAuth();
  const { requests, isLoading, error, refetch } = useConsultationRequests();
  const [handleRequest, setHandleRequest] = useState(null);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="receptionist-requests">
      <aside className="receptionist-requests__sidebar">
        <div className="receptionist-requests__brand">
          <h1 className="receptionist-requests__brand-name">DentalCare</h1>
        </div>

        <nav className="receptionist-requests__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) =>
                `receptionist-requests__nav-item${isActive ? " receptionist-requests__nav-item--active" : ""}`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="receptionist-requests__sidebar-footer">
          <NavLink to="#" className="receptionist-requests__nav-item">
            <span className="material-symbols-outlined">help</span>
            <span>Support</span>
          </NavLink>
          <NavLink to="/" className="receptionist-requests__nav-item">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </NavLink>
        </div>
      </aside>

      <main className="receptionist-requests__main">
        <header className="receptionist-requests__header">
          <div className="receptionist-requests__search">
            <span className="material-symbols-outlined receptionist-requests__search-icon">search</span>
            <input
              className="receptionist-requests__search-input"
              placeholder="Search for accounts, names or roles..."
              type="text"
            />
          </div>

          <div className="receptionist-requests__header-actions">
            <button className="receptionist-requests__icon-btn" type="button" onClick={showToast}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="receptionist-requests__icon-btn" type="button" onClick={showToast}>
              <span className="material-symbols-outlined">help_outline</span>
            </button>

            <div className="receptionist-requests__divider" />

            <div className="receptionist-requests__profile">
              <div className="receptionist-requests__profile-info">
                <p className="receptionist-requests__profile-name">{user?.fullName || "Dr. Sarah Miller"}</p>
                <p className="receptionist-requests__profile-role">Admin</p>
              </div>
              <div className="receptionist-requests__avatar">
                SM
              </div>
            </div>
          </div>
        </header>

        <div className="receptionist-requests__content">
          <div className="receptionist-requests__page-header">
            <div>
              <h2 className="receptionist-requests__page-title">Manage Consultation Requests</h2>
              <p className="receptionist-requests__page-desc">
                View and update consultation requests.
              </p>
            </div>
          </div>

          <div className="receptionist-requests__card">
            <div className="receptionist-requests__card-header">
              <div className="receptionist-requests__card-title-group">
                <h4 className="receptionist-requests__card-title">Consultation Request Management</h4>
                <div className="receptionist-requests__total-badge">
                  <span className="material-symbols-outlined">group</span>
                  <span>Total Requests: 1,248</span>
                  <span className="receptionist-requests__trend-badge">
                    <span className="material-symbols-outlined">trending_up</span>
                    12%
                  </span>
                </div>
              </div>
              <div className="receptionist-requests__card-toolbar">
                <div className="receptionist-requests__table-search">
                  <span className="material-symbols-outlined">search</span>
                  <input placeholder="Find in list..." type="text" />
                </div>
                <button className="receptionist-requests__tool-btn" type="button">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="receptionist-requests__tool-btn" type="button">
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="receptionist-requests__table-wrapper">
              <table className="receptionist-requests__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Created at</th>
                    <th>Status</th>
                    <th>Handled by</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr><td className="receptionist-requests__cell" colSpan={7}>Loading accounts...</td></tr>
                  )}

                  {error && (
                    <tr><td className="receptionist-requests__cell" colSpan={7}>Error: {error.message}</td></tr>
                  )}

                  {!isLoading && !error && requests.length === 0 && (
                    <tr><td className="receptionist-requests__cell" colSpan={7}>No requests found</td></tr>
                  )}

                  {!isLoading && !error && requests.map((request, index) => (
                    <tr key={request.account_id} className="receptionist-requests__row">
                      <td className="receptionist-requests__cell receptionist-requests__cell--num">{index + 1}</td>
                      <td className="receptionist-requests__cell">
                        <div className="receptionist-requests__user-cell">
                          <div className="receptionist-requests__avatar">
                            {(request.full_name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{request.full_name}</span>
                        </div>
                      </td>
                      <td className="receptionist-requests__cell">{request.phone}</td>
                      <td className="receptionist-requests__cell">{request.email}</td>
                      <td className="receptionist-requests__cell">{request.description}</td>
                      <td className="receptionist-requests__cell">{new Date(request.created_at).toLocaleString("vi-VN")}</td>
                      <td className="receptionist-requests__cell">{request.status}</td>
                      <td className="receptionist-requests__cell">{request.handled_by}</td>
                      <td className="receptionist-requests__cell">
                        <button className="receptionist-requests__action-btn receptionist-requests__action-btn--edit" type="button" onClick={() => setHandleRequest(request)}>
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="receptionist-requests__pagination">
              <p className="receptionist-requests__pagination-info">Showing 1-6 of 1,248 accounts</p>
              <div className="receptionist-requests__pagination-controls">
                <button className="receptionist-requests__page-btn" type="button">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="receptionist-requests__page-btn receptionist-requests__page-btn--active" type="button">1</button>
                <button className="receptionist-requests__page-btn" type="button">2</button>
                <button className="receptionist-requests__page-btn" type="button">3</button>
                <button className="receptionist-requests__page-btn" type="button">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="receptionist-requests__stats">
            <div className="receptionist-requests__stat-card">
              <div className="receptionist-requests__stat-icon receptionist-requests__stat-icon--primary">
                <span className="material-symbols-outlined">security</span>
              </div>
              <div>
                <p className="receptionist-requests__stat-label">Admins</p>
                <p className="receptionist-requests__stat-value">12</p>
              </div>
            </div>
            <div className="receptionist-requests__stat-card">
              <div className="receptionist-requests__stat-icon receptionist-requests__stat-icon--primary-container">
                <span className="material-symbols-outlined">medical_services</span>
              </div>
              <div>
                <p className="receptionist-requests__stat-label">Doctors</p>
                <p className="receptionist-requests__stat-value">45</p>
              </div>
            </div>
            <div className="receptionist-requests__stat-card">
              <div className="receptionist-requests__stat-icon receptionist-requests__stat-icon--tertiary">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <div>
                <p className="receptionist-requests__stat-label">Owners</p>
                <p className="receptionist-requests__stat-value">5</p>
              </div>
            </div>
            <div className="receptionist-requests__stat-card">
              <div className="receptionist-requests__stat-icon receptionist-requests__stat-icon--secondary">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <p className="receptionist-requests__stat-label">Staff</p>
                <p className="receptionist-requests__stat-value">28</p>
              </div>
            </div>
            <div className="receptionist-requests__stat-card">
              <div className="receptionist-requests__stat-icon receptionist-requests__stat-icon--secondary">
                <span className="material-symbols-outlined">group</span>
              </div>
              <div>
                <p className="receptionist-requests__stat-label">Patients</p>
                <p className="receptionist-requests__stat-value">1,163</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className={`receptionist-requests__toast${toastVisible ? " receptionist-requests__toast--visible" : ""}`}>
        <span className="material-symbols-outlined receptionist-requests__toast-icon">check_circle</span>
        <span>Action successful</span>
      </div>
      {handleRequest && (
        <HandleRequestModal
          request={handleRequest}
          onClose={() => setHandleRequest(null)}
          onSuccess={() => {
            setHandleRequest(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

ReceptionistRequestsPage.propTypes = {};

export default ReceptionistRequestsPage;

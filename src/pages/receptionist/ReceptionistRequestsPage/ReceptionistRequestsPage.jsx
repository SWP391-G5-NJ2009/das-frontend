import { useState } from "react";
import { useConsultationRequests } from "../../../hooks/useConsultationRequests";
import HandleRequestModal from "../../../components/features/consultation/HandleRequestModal";
import "./ReceptionistRequestsPage.css";

function ReceptionistRequestsPage() {
  const { requests, isLoading, error, refetch } = useConsultationRequests();
  const [handleRequest, setHandleRequest] = useState(null);

  return (
    <section className="receptionist-requests" aria-labelledby="receptionist-requests-title">
      <div className="receptionist-requests__content">
        <div className="receptionist-requests__page-header">
          <div>
            <h1 className="receptionist-requests__page-title" id="receptionist-requests-title">
              Manage Consultation Requests
            </h1>
            <p className="receptionist-requests__page-desc">
              View and update consultation requests.
            </p>
          </div>
        </div>

        <div className="receptionist-requests__card">
          <div className="receptionist-requests__card-header">
            <div className="receptionist-requests__card-title-group">
              <h2 className="receptionist-requests__card-title">
                Consultation Request Management
              </h2>
              <div className="receptionist-requests__total-badge">
                <span className="material-symbols-outlined">group</span>
                <span>Total Requests: {requests.length}</span>
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
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
                      Loading requests...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
                      Error: {error.message}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && requests.length === 0 && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
                      No requests found
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !error &&
                  requests.map((request, index) => (
                    <tr
                      key={request.id || `${request.phone}-${request.created_at}`}
                      className="receptionist-requests__row"
                    >
                      <td className="receptionist-requests__cell receptionist-requests__cell--num">
                        {index + 1}
                      </td>
                      <td className="receptionist-requests__cell">
                        <div className="receptionist-requests__user-cell">
                          <div className="receptionist-requests__avatar" aria-hidden="true">
                            {(request.full_name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{request.full_name}</span>
                        </div>
                      </td>
                      <td className="receptionist-requests__cell">{request.phone}</td>
                      <td className="receptionist-requests__cell">{request.email}</td>
                      <td className="receptionist-requests__cell">{request.description}</td>
                      <td className="receptionist-requests__cell">
                        {new Date(request.created_at).toLocaleString("vi-VN")}
                      </td>
                      <td className="receptionist-requests__cell">{request.status}</td>
                      <td className="receptionist-requests__cell">{request.handled_by}</td>
                      <td className="receptionist-requests__cell">
                        <button
                          className="receptionist-requests__action-btn receptionist-requests__action-btn--edit"
                          type="button"
                          onClick={() => setHandleRequest(request)}
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="receptionist-requests__pagination">
            <p className="receptionist-requests__pagination-info">
              Showing 1-{Math.min(requests.length, 6)} of {requests.length} requests
            </p>
            <div className="receptionist-requests__pagination-controls">
              <button className="receptionist-requests__page-btn" type="button">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                className="receptionist-requests__page-btn receptionist-requests__page-btn--active"
                type="button"
              >
                1
              </button>
              <button className="receptionist-requests__page-btn" type="button">
                2
              </button>
              <button className="receptionist-requests__page-btn" type="button">
                3
              </button>
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
    </section>
  );
}

ReceptionistRequestsPage.propTypes = {};

export default ReceptionistRequestsPage;

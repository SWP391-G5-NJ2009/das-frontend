import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Search,
} from "lucide-react";
import { useConsultationRequests } from "../../../hooks/useConsultationRequests";
import HandleRequestModal from "../../../components/features/consultation/HandleRequestModal";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./RequestsPage.css";

function ReceptionistRequestsPage() {
  const { requests, isLoading, error, refetch } = useConsultationRequests();
  const [handleRequest, setHandleRequest] = useState(null);

  return (
    <ReceptionistPageShell
      contentClassName="receptionist-requests"
      contentLabelledBy="receptionist-requests-title"
    >
      <div className="receptionist-requests__content">
        <div className="receptionist-requests__page-header">
          <div>
            <h1
              className="receptionist-requests__page-title"
              id="receptionist-requests-title"
            >
              Manage consultation requests
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
                Consultation request list
              </h2>
            </div>
            <div className="receptionist-requests__card-toolbar">
              <div className="receptionist-requests__table-search">
                <Search size={18} aria-hidden="true" />
                <input placeholder="Search the list..." type="text" />
              </div>
              <button className="receptionist-requests__tool-btn" type="button">
                <Filter size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="receptionist-requests__table-wrapper">
            <table className="receptionist-requests__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full name</th>
                  <th>Phone number</th>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Created date</th>
                  <th>Status</th>
                  <th>Handler</th>
                  <th>Actions</th>
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
                      key={
                        request.id || `${request.phone}-${request.created_at}`
                      }
                      className="receptionist-requests__row"
                    >
                      <td className="receptionist-requests__cell receptionist-requests__cell--num">
                        {index + 1}
                      </td>
                      <td className="receptionist-requests__cell">
                        <div className="receptionist-requests__user-cell">
                          <div
                            className="receptionist-requests__avatar"
                            aria-hidden="true"
                          >
                            {(request.full_name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{request.full_name}</span>
                        </div>
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.phone}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.email}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.description}
                      </td>
                      <td className="receptionist-requests__cell">
                        {new Date(request.created_at).toLocaleString("en-US")}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.status}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.handled_by}
                      </td>
                      <td className="receptionist-requests__cell">
                        <button
                          className="receptionist-requests__action-btn receptionist-requests__action-btn--edit"
                          type="button"
                          onClick={() => setHandleRequest(request)}
                        >
                          <Edit size={20} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="receptionist-requests__pagination">
            <p className="receptionist-requests__pagination-info">
              Showing 1-{Math.min(requests.length, 6)} of {requests.length}{" "}
              requests
            </p>
            <div className="receptionist-requests__pagination-controls">
              <button className="receptionist-requests__page-btn" type="button">
                <ChevronLeft size={18} aria-hidden="true" />
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
                <ChevronRight size={18} aria-hidden="true" />
              </button>
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
    </ReceptionistPageShell>
  );
}

ReceptionistRequestsPage.propTypes = {};

export default ReceptionistRequestsPage;

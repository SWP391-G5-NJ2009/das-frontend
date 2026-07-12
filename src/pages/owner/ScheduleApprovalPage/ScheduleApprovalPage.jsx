import { Check, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { scheduleService } from "../../../services/schedule.service";
import OwnerPageShell from "../OwnerPageShell";
import "./ScheduleApprovalPage.css";

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Scheduled", label: "Published" },
  { value: "Denied", label: "Denied" },
];

function getStatusClass(status) {
  if (status === "Scheduled") {
    return "schedule-approval__badge schedule-approval__badge--approved";
  }

  if (status === "Denied") {
    return "schedule-approval__badge schedule-approval__badge--denied";
  }

  return "schedule-approval__badge schedule-approval__badge--pending";
}

function formatTime(schedule) {
  if (!schedule.startTime || !schedule.endTime) return "No slots";
  return `${schedule.startTime} - ${schedule.endTime}`;
}

function ScheduleApprovalPage() {
  const [denialReason, setDenialReason] = useState("");
  const [denialTarget, setDenialTarget] = useState(null);
  const [error, setError] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await scheduleService.getRequests({
        status: statusFilter,
      });
      setRequests(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const stats = useMemo(
    () => ({
      pending: requests.filter((request) => request.status === "Pending").length,
      published: requests.filter((request) => request.status === "Scheduled").length,
      denied: requests.filter((request) => request.status === "Denied").length,
    }),
    [requests],
  );

  const handleApprove = async (schedule) => {
    setIsActionLoading(true);
    setError(null);
    setMessage("");

    try {
      await scheduleService.approve(schedule.id);
      setMessage("MSG22: Schedule accepted and published to patient booking calendar.");
      await fetchRequests();
    } catch (err) {
      setError(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const openDenyModal = (schedule) => {
    setDenialTarget(schedule);
    setDenialReason("");
    setMessage("");
  };

  const handleDeny = async (event) => {
    event.preventDefault();
    if (!denialTarget) return;

    setIsActionLoading(true);
    setError(null);

    try {
      await scheduleService.deny(denialTarget.id, {
        reason: denialReason,
      });
      setMessage("MSG23: Schedule request denied and note sent to dentist.");
      setDenialTarget(null);
      setDenialReason("");
      await fetchRequests();
    } catch (err) {
      setError(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <OwnerPageShell>
      <div className="schedule-approval">
        <header className="schedule-approval__header">
          <div>
            <p className="schedule-approval__eyebrow">Clinic Schedule</p>
            <h1>Schedule Approval</h1>
            <p>
              Review dentist weekly shift requests before they are published to
              patient booking.
            </p>
          </div>
          <button
            className="schedule-approval__button schedule-approval__button--secondary"
            type="button"
            onClick={fetchRequests}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </header>

        <section className="schedule-approval__summary" aria-label="Request summary">
          <div>
            <span>{stats.pending}</span>
            <p>Pending</p>
          </div>
          <div>
            <span>{stats.published}</span>
            <p>Published</p>
          </div>
          <div>
            <span>{stats.denied}</span>
            <p>Denied</p>
          </div>
        </section>

        <section className="schedule-approval__toolbar">
          <label>
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {message && (
          <div className="schedule-approval__notice schedule-approval__notice--success">
            {message}
          </div>
        )}

        {error && (
          <div className="schedule-approval__notice schedule-approval__notice--error">
            {error.message || "Unable to process schedule request."}
          </div>
        )}

        <section className="schedule-approval__table-wrap">
          {isLoading ? (
            <div className="schedule-approval__loading">
              <Spinner />
            </div>
          ) : (
            <table className="schedule-approval__table">
              <thead>
                <tr>
                  <th>Dentist</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Owner note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.dentistName}</td>
                    <td>{request.date}</td>
                    <td>{formatTime(request)}</td>
                    <td>{request.roomName}</td>
                    <td>
                      <span className={getStatusClass(request.status)}>
                        {request.status === "Scheduled"
                          ? "Published"
                          : request.status}
                      </span>
                    </td>
                    <td>{request.ownerNote || "-"}</td>
                    <td>
                      <div className="schedule-approval__actions">
                        <button
                          className="schedule-approval__icon-btn schedule-approval__icon-btn--approve"
                          type="button"
                          title="Approve"
                          aria-label={`Approve schedule ${request.date}`}
                          onClick={() => handleApprove(request)}
                          disabled={
                            isActionLoading || request.status !== "Pending"
                          }
                        >
                          <Check size={18} aria-hidden="true" />
                        </button>
                        <button
                          className="schedule-approval__icon-btn schedule-approval__icon-btn--deny"
                          type="button"
                          title="Deny"
                          aria-label={`Deny schedule ${request.date}`}
                          onClick={() => openDenyModal(request)}
                          disabled={
                            isActionLoading || request.status !== "Pending"
                          }
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td className="schedule-approval__empty" colSpan={7}>
                      No schedule requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        {denialTarget && (
          <div className="schedule-approval__modal-overlay" role="presentation">
            <section
              className="schedule-approval__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="deny-schedule-title"
            >
              <header className="schedule-approval__modal-header">
                <div>
                  <h2 id="deny-schedule-title">Deny Schedule Request</h2>
                  <p>
                    {denialTarget.dentistName} - {denialTarget.date} -{" "}
                    {formatTime(denialTarget)}
                  </p>
                </div>
                <button
                  className="schedule-approval__icon-btn"
                  type="button"
                  onClick={() => setDenialTarget(null)}
                  aria-label="Close deny modal"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </header>
              <form className="schedule-approval__deny-form" onSubmit={handleDeny}>
                <label>
                  <span>Owner note</span>
                  <textarea
                    value={denialReason}
                    onChange={(event) => setDenialReason(event.target.value)}
                    rows="5"
                    required
                    placeholder="Explain why this schedule cannot be accepted."
                  />
                </label>
                <footer className="schedule-approval__modal-actions">
                  <button
                    className="schedule-approval__button schedule-approval__button--secondary"
                    type="button"
                    onClick={() => setDenialTarget(null)}
                    disabled={isActionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="schedule-approval__button schedule-approval__button--danger"
                    type="submit"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? "Sending..." : "Deny request"}
                  </button>
                </footer>
              </form>
            </section>
          </div>
        )}
      </div>
    </OwnerPageShell>
  );
}

export default ScheduleApprovalPage;

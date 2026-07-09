import { RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useStaff } from "../../../hooks/useStaff";
import OwnerPageShell from "../OwnerPageShell";
import "./OwnerStaffPage.css";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "dentist", label: "Dentist" },
  { value: "receptionist", label: "Receptionist" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Banned", label: "Banned" },
];

function getRoleLabel(role) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === "dentist") return "Dentist";
  if (normalizedRole === "receptionist") return "Receptionist";

  return role || "Unknown";
}

function getStatusLabel(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") return "Active";
  if (normalizedStatus === "banned") return "Banned";

  return "Unknown";
}

function getStatusClass(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return "owner-staff__status owner-staff__status--active";
  }

  if (normalizedStatus === "banned") {
    return "owner-staff__status owner-staff__status--banned";
  }

  return "owner-staff__status owner-staff__status--inactive";
}

function OwnerStaffPage() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });

  const { staff, isLoading, error, refetch } = useStaff(filters);

  const stats = useMemo(
    () => ({
      total: staff.length,
      dentists: staff.filter(
        (item) => item.role?.toLowerCase() === "dentist",
      ).length,
      receptionists: staff.filter(
        (item) => item.role?.toLowerCase() === "receptionist",
      ).length,
    }),
    [staff],
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setFilters((currentFilters) => ({
      ...currentFilters,
      search: searchInput.trim(),
    }));
  };

  const handleRoleChange = (event) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      role: event.target.value,
    }));
  };

  const handleStatusChange = (event) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      status: event.target.value,
    }));
  };

  return (
    <OwnerPageShell>
      <div className="owner-staff">
        <header className="owner-staff__header">
          <div>
            <h1>Staff Management</h1>
          </div>

          <button
            className="owner-staff__refresh-button"
            type="button"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </header>

        <section
          className="owner-staff__summary"
          aria-label="Staff overview"
        >
          <article className="owner-staff__summary-card">
            <span>Total staff</span>
            <strong>{stats.total}</strong>
          </article>

          <article className="owner-staff__summary-card">
            <span>Dentists</span>
            <strong>{stats.dentists}</strong>
          </article>

          <article className="owner-staff__summary-card">
            <span>Receptionists</span>
            <strong>{stats.receptionists}</strong>
          </article>
        </section>

        <section
          className="owner-staff__toolbar"
          aria-label="Staff filters"
        >
          <form
            className="owner-staff__search-form"
            onSubmit={handleSearchSubmit}
          >
            <div className="owner-staff__search-input">
              <Search size={16} aria-hidden="true" />

              <input
                type="search"
                aria-label="Search staff"
                placeholder="Search by name or username..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <button type="submit">Search</button>
          </form>

          <label className="owner-staff__filter">
            <span>Role</span>

            <select value={filters.role} onChange={handleRoleChange}>
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="owner-staff__filter">
            <span>Status</span>

            <select value={filters.status} onChange={handleStatusChange}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error ? (
          <div
            className="owner-staff__notice owner-staff__notice--error"
            role="alert"
          >
            {error.message || "Unable to load the staff list."}
          </div>
        ) : null}

        <section className="owner-staff__table-wrap">
          {isLoading ? (
            <div className="owner-staff__loading">
              <Spinner />
            </div>
          ) : (
            <table className="owner-staff__table">
              <thead>
                <tr>
                  <th scope="col">Username</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {staff.map((item) => (
                  <tr key={item.accountId}>
                    <td>
                      {item.username ||
                        item.fullName ||
                        "Not updated"}
                    </td>

                    <td>{getRoleLabel(item.role)}</td>

                    <td>
                      <span className={getStatusClass(item.status)}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}

                {!error && staff.length === 0 ? (
                  <tr>
                    <td className="owner-staff__empty" colSpan={3}>
                      No matching staff members were found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </OwnerPageShell>
  );
}

export default OwnerStaffPage;
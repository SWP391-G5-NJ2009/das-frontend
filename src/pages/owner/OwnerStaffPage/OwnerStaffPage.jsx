import { Plus, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import DentistProfileCreateModal from "../../../components/features/staff/DentistProfileCreateModal/DentistProfileCreateModal";
import DentistProfileModal from "../../../components/features/staff/DentistProfileModal/DentistProfileModal";
import StaffState from "../../../components/features/staff/StaffState/StaffState";
import StaffTable from "../../../components/features/staff/StaffTable/StaffTable";
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

function OwnerStaffPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleProfileCreated = async () => {
    setIsCreateModalOpen(false);
    setSuccessMessage("Dentist profile created successfully.");
    await refetch();
  };

  return (
    <OwnerPageShell>
      <div className="owner-staff">
        <header className="owner-staff__header">
          <h1>Staff Management</h1>

          <div className="owner-staff__header-actions">
            <button
              className="owner-staff__refresh-button"
              type="button"
              onClick={refetch}
              disabled={isLoading}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Refresh
            </button>
            <button
              className="owner-staff__add-button"
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setIsCreateModalOpen(true);
              }}
            >
              <Plus size={16} aria-hidden="true" />
              Add New Dentist
            </button>
          </div>
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

            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="owner-staff__filter">
            <span>Status</span>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </section>

        {successMessage ? (
          <div className="owner-staff__notice owner-staff__notice--success" role="status">
            {successMessage}
          </div>
        ) : null}

        {isLoading && <StaffState isLoading message="Loading staff..." />}

        {!isLoading && error && (
          <StaffState
            title="Unable to load staff"
            message={error.message || "Please try again later."}
            variant="error"
          />
        )}

        {!isLoading && !error && staff.length === 0 && (
          <StaffState
            title="No staff found"
            message="No matching staff members were found."
          />
        )}

        {!isLoading && !error && staff.length > 0 && (
          <StaffTable staff={staff} onViewDentist={setSelectedDentist} />
        )}

        {selectedDentist && (
          <DentistProfileModal
            dentist={selectedDentist}
            onClose={() => setSelectedDentist(null)}
          />
        )}

        {isCreateModalOpen && (
          <DentistProfileCreateModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreated={handleProfileCreated}
          />
        )}
      </div>
    </OwnerPageShell>
  );
}

OwnerStaffPage.propTypes = {};

export default OwnerStaffPage;

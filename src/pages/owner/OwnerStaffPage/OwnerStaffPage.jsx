import { Plus, RefreshCw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination/Pagination";
import DentistProfileCreateModal from "../../../components/features/staff/DentistProfileCreateModal/DentistProfileCreateModal";
import DentistProfileEditModal from "../../../components/features/staff/DentistProfileEditModal/DentistProfileEditModal";
import DentistProfileModal from "../../../components/features/staff/DentistProfileModal/DentistProfileModal";
import StaffState from "../../../components/features/staff/StaffState/StaffState";
import StaffTable from "../../../components/features/staff/StaffTable/StaffTable";
import { useStaff } from "../../../hooks/useStaff";
import OwnerPageShell from "../OwnerPageShell";
import "./OwnerStaffPage.css";

const ROLE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "dentist", label: "Nha sĩ" },
  { value: "receptionist", label: "Lễ tân" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "Active", label: "Hoạt động" },
  { value: "Banned", label: "Bị khóa" },
];

const PAGE_SIZE = 5;

function OwnerStaffPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingDentist, setEditingDentist] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });

  const { staff, isLoading, error, refetch } = useStaff(filters);
  const totalPages = Math.max(1, Math.ceil(staff.length / PAGE_SIZE));
  const paginatedStaff = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return staff.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, staff]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

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
    setCurrentPage(1);

    setFilters((currentFilters) => ({
      ...currentFilters,
      search: searchInput.trim(),
    }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setCurrentPage(1);

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleProfileCreated = async () => {
    setIsCreateModalOpen(false);
    setCurrentPage(1);
    setSuccessMessage("Tạo hồ sơ nhân viên thành công.");
    await refetch();
  };

  const handleProfileUpdated = async () => {
    setEditingDentist(null);
    setSuccessMessage("Cập nhật hồ sơ nha sĩ thành công.");
    await refetch();
  };

  return (
    <OwnerPageShell contentClassName="owner-staff-page">
      <div className="owner-staff">
        <header className="owner-staff__header">
          <div className="owner-staff__heading">
            <h1>Quản lý nhân sự</h1>
          </div>

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
              Thêm nhân viên mới
            </button>
          </div>
        </header>

        <section
          className="owner-staff__summary"
          aria-label="Tổng quan nhân sự"
        >
          <article className="owner-staff__summary-card">
            <span>Tổng nhân sự</span>
            <strong>{stats.total}</strong>
          </article>

          <article className="owner-staff__summary-card">
            <span>Nha sĩ</span>
            <strong>{stats.dentists}</strong>
          </article>

          <article className="owner-staff__summary-card">
            <span>Lễ tân</span>
            <strong>{stats.receptionists}</strong>
          </article>
        </section>

        <section
          className="owner-staff__toolbar"
          aria-label="Bộ lọc nhân sự"
        >
          <form
            className="owner-staff__search-form"
            onSubmit={handleSearchSubmit}
          >
            <div className="owner-staff__search-input">
              <Search size={16} aria-hidden="true" />

              <input
                type="search"
                aria-label="Tìm nhân sự"
                placeholder="Tìm theo tên hoặc tên đăng nhập..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
            </div>

            <button type="submit">Tìm kiếm</button>
          </form>

          <label className="owner-staff__filter">
            <span>Vai trò</span>

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
            <span>Trạng thái</span>

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
            title="Không thể tải nhân sự"
            message={error.message || "Vui lòng thử lại sau."}
            variant="error"
          />
        )}

        {!isLoading && !error && staff.length === 0 && (
          <StaffState
            title="Không tìm thấy nhân sự"
            message="No matching staff members were found."
          />
        )}

        {!isLoading && !error && staff.length > 0 && (
          <>
            <StaffTable
              staff={paginatedStaff}
              onEditStaff={setEditingDentist}
              onViewStaff={setSelectedStaff}
            />
            <div className="owner-staff__pagination">
              <p className="owner-staff__pagination-info">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, staff.length)} trong tổng số{" "}
                {staff.length} nhân viên
              </p>
              <Pagination
                currentPage={currentPage}
                totalPage={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        {selectedStaff && (
          <DentistProfileModal
            dentist={selectedStaff}
            onClose={() => setSelectedStaff(null)}
          />
        )}

        {editingDentist && (
          <DentistProfileEditModal
            dentist={editingDentist}
            onClose={() => setEditingDentist(null)}
            onUpdated={handleProfileUpdated}
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

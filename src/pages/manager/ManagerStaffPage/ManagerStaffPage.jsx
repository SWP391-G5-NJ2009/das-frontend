import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/common/Pagination/Pagination";
import DentistProfileModal from "../../../components/features/staff/DentistProfileModal/DentistProfileModal";
import StaffState from "../../../components/features/staff/StaffState/StaffState";
import StaffTable from "../../../components/features/staff/StaffTable/StaffTable";
import { useStaff } from "../../../hooks/useStaff";
import ManagerPageShell from "../ManagerPageShell";
import "./ManagerStaffPage.css";

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

function ManagerStaffPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
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

  const handleProfileSaved = async (wasCreated, saved) => {
    setSelectedStaff((current) => (current ? { ...current, ...saved } : current));
    setSuccessMessage(
      wasCreated
        ? "Tạo hồ sơ nhân viên thành công."
        : "Cập nhật hồ sơ nhân viên thành công.",
    );
    await refetch();
  };

  return (
    <ManagerPageShell contentClassName="manager-staff-page">
      <div className="manager-staff">
        <header className="manager-staff__header">
          <div className="manager-staff__heading">
            <h1>Quản lý nhân sự</h1>
          </div>

        </header>

        <section
          className="manager-staff__toolbar"
          aria-label="Bộ lọc nhân sự"
        >
          <form
            className="manager-staff__search-form"
            onSubmit={handleSearchSubmit}
          >
            <div className="manager-staff__search-input">
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

          <label className="manager-staff__filter">
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

          <label className="manager-staff__filter">
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
          <div className="manager-staff__notice manager-staff__notice--success" role="status">
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
              onViewStaff={setSelectedStaff}
            />
            <div className="manager-staff__pagination">
              <p className="manager-staff__pagination-info">
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
            onSaved={handleProfileSaved}
          />
        )}
      </div>
    </ManagerPageShell>
  );
}

ManagerStaffPage.propTypes = {};

export default ManagerStaffPage;

import { useEffect, useState, useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useManagerDentalServices } from "../../../hooks/useDentalServices";
import ManagerPageShell from "../ManagerPageShell";
import Pagination from "../../../components/common/Pagination/Pagination";
import "./ServiceCatalogPage.css";

const PAGE_SIZE = 8;

function ManagerServiceCatalog() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [formData, setFormData] = useState({
    service_name: "",
    category_id: "",
    description: "",
    unit_price: "",
    slot_occupied: "1",
    treatment_mode: "Single-Visit",
    status: "Inactive",
  });

  const {
    categories: dbCategories,
    createService,
    deleteService,
    error,
    isLoading,
    services,
    updateService,
  } = useManagerDentalServices();

  useEffect(() => {
    if (!formData.category_id && dbCategories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category_id: String(dbCategories[0].category_id),
      }));
    }
  }, [dbCategories, formData.category_id]);


  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentServiceId(null);
    setFormData({
      service_name: "",
      category_id: dbCategories[0]?.category_id
        ? String(dbCategories[0].category_id)
        : "",
      description: "",
      unit_price: "",
      slot_occupied: "1",
      treatment_mode: "Single-Visit",
      status: "Inactive",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentServiceId(null);
    setFormData({
      service_name: "",
      category_id: dbCategories[0]?.category_id
        ? String(dbCategories[0].category_id)
        : "",
      description: "",
      unit_price: "",
      slot_occupied: "1",
      treatment_mode: "Single-Visit",
      status: "Inactive",
    });
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setCurrentServiceId(service.service_id);
    setFormData({
      service_name: service.service_name || "",
      category_id: service.category_id ? String(service.category_id) : "",
      description: service.description || "",
      unit_price: (service.unit_price ?? service.price) ?? "",
      slot_occupied: String(service.slot_occupied || 1),
      treatment_mode: service.treatment_mode || "Single-Visit",
      status: service.status || "Active",
    });
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa dịch vụ "${serviceName}" không?`,
    );
    if (!confirmDelete) return;

    try {
      await deleteService(serviceId);
      alert("Xóa dịch vụ thành công.");
    } catch (err) {
      alert(err.message || "Không thể xóa dịch vụ.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateService(currentServiceId, formData);
        alert("Cập nhật dịch vụ thành công!");
      } else {
        await createService(formData);
        alert("Thêm dịch vụ mới thành công!");
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || "Thao tác thất bại.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredServices = useMemo(() => services.filter((service) => {
    const matchesCategory =
      filterCategory === "All" ||
      service.service_categories?.category_name === filterCategory;

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      service.service_name?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  }), [services, filterCategory, searchTerm]);

  const totalPage = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const paginatedServices = useMemo(
    () => filteredServices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredServices, currentPage],
  );


  return (
    <ManagerPageShell contentClassName="manager-catalog-page">
          <div className="catalog-container">
            <div className="catalog-header">
              <div>
                <h1>Danh mục dịch vụ</h1>
                <p className="subtitle">
                  Quản lý và cập nhật thông tin dịch vụ nha khoa
                </p>
              </div>
              <button className="btn-add-service" onClick={openAddModal}>
                <span className="plus-icon">+</span> Thêm dịch vụ mới
              </button>
            </div>

            <div
              className="search-bar-container"
              style={{ marginBottom: "20px" }}
            >
              <div
                className="search-input-wrapper"
                style={{ position: "relative", maxWidth: "400px" }}
              >
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc mô tả dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="search-service-input"
                  style={{
                    width: "100%",
                    padding: "10px 15px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#999",
                      fontSize: "16px",
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            </div>

            <div className="filter-tabs">
              <label className="filter-label" htmlFor="category-filter">
                Lọc theo danh mục:
              </label>
              <select
                id="category-filter"
                className="filter-select"
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">Tất cả</option>
                {dbCategories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div
                className="loading-container"
                style={{ textAlign: "center", padding: "40px" }}
              >
                <Spinner />
                <p style={{ marginTop: "10px", color: "#666" }}>
                  Đang tải dữ liệu dịch vụ...
                </p>
              </div>
            ) : error ? (
              <div
                className="error-message"
                style={{ color: "red", textAlign: "center", padding: "20px" }}
              >
                {error.message ||
                  "Không thể tải danh sách dịch vụ từ hệ thống."}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="catalog-table">
                  <thead>
                    <tr>
                      <th>TÊN DỊCH VỤ</th>
                      <th>DANH MỤC</th>
                      <th>GIÁ ƯỚC TÍNH (VND)</th>
                      <th>KHUNG GIỜ</th>
                      <th>TRẠNG THÁI</th>
                      <th style={{ textAlign: "center" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                   {paginatedServices.map((service) => (
                      <tr key={service.service_id}>
                        <td>
                          <div className="service-title-cell">
                            <span className="main-title">
                              {service.service_name}
                            </span>
                            <span className="sub-desc">
                              {service.description || "Chưa có mô tả"}
                            </span>
                          </div>
                        </td>
                        <td>
                          {service.service_categories?.category_name ||
                            "Chưa phân loại"}
                        </td>
                        <td className="price-cell">
                          {Number(
                            service.unit_price || service.price || 0,
                          ).toLocaleString("vi-VN")}{" "}
                          VND
                        </td>
                        <td>
                          {service.slot_occupied || 1}{" "}
                          {(service.slot_occupied || 1) === 1 ? "khung giờ" : "khung giờ"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${String(service.status || "Active").toLowerCase()}`}
                          >
                            {(service.status || "Active") === "Inactive"
                              ? "Ngừng hoạt động"
                              : "Hoạt động"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            title="Chỉnh sửa"
                            onClick={() => openEditModal(service)}
                          >
                            <Edit size={18} aria-hidden="true" />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Xóa"
                            onClick={() =>
                              handleDeleteService(
                                service.service_id,
                                service.service_name,
                              )
                            }
                          >
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredServices.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-row"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Không tìm thấy dịch vụ.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="catalog-pagination">
                  <p className="catalog-pagination__info">
                    Hiển thị {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredServices.length)}–{Math.min(currentPage * PAGE_SIZE, filteredServices.length)} / {filteredServices.length} dịch vụ
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}

          </div>
      

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {isEditMode
                  ? "Cập nhật dịch vụ nha khoa"
                  : "Thêm dịch vụ nha khoa mới"}
              </h2>
              <button className="close-modal-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>
                  Tên dịch vụ <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  required
                  placeholder="VD: Trám răng thẩm mỹ"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                   Danh mục <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                  >
                    {dbCategories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                {isEditMode && (
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Ngừng hoạt động</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Giá ước tính (VND){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="VD: 500000"
                  />
                </div>

                <div className="form-group">
                  <label>Số khung giờ cần</label>
                  <input
                    type="number"
                    name="slot_occupied"
                    value={formData.slot_occupied}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Loại điều trị</label>
                <select
                  name="treatment_mode"
                  value={formData.treatment_mode}
                  onChange={handleInputChange}
                >
                  <option value="Single-Visit">Điều trị một lần</option>
                  <option value="Multi-Visit">Điều trị theo lộ trình</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mô tả dịch vụ</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Mô tả ngắn gọn quy trình điều trị..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Lưu thay đổi" : "Lưu dịch vụ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerPageShell>
  );
}

export default ManagerServiceCatalog;

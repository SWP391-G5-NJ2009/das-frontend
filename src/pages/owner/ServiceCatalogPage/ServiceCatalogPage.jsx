import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useOwnerDentalServices } from "../../../hooks/useDentalServices";
import OwnerPageShell from "../OwnerPageShell";
import "./ServiceCatalogPage.css";

function OwnerServiceCatalog() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [formData, setFormData] = useState({
    service_name: "",
    category_id: "",
    description: "",
    unit_price: "",
    slot_occupied: "1",
    status: "Active",
  });

  const {
    categories: dbCategories,
    createService,
    deleteService,
    error,
    isLoading,
    services,
    updateService,
  } = useOwnerDentalServices();

  useEffect(() => {
    if (!formData.category_id && dbCategories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category_id: String(dbCategories[0].category_id),
      }));
    }
  }, [dbCategories, formData.category_id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

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
      status: "Active",
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
      status: "Active",
    });
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setCurrentServiceId(service.service_id);
    setFormData({
      service_name: service.service_name || "",
      category_id: service.category_id ? String(service.category_id) : "",
      description: service.description || "",
      unit_price: service.unit_price || service.price || "",
      slot_occupied: String(service.slot_occupied || 1),
      status: service.status || "Active",
    });
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    const confirmDelete = window.confirm(
      `Ban co chac muon xoa dich vu "${serviceName}"?`,
    );
    if (!confirmDelete) return;

    try {
      await deleteService(serviceId);
      alert("Da xoa dich vu thanh cong.");
    } catch (err) {
      console.error("Error occurred while deleting service:", err);
      alert(err.message || "Khong the xoa dich vu.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateService(currentServiceId, formData);
        alert("Cap nhat dich vu thanh cong!");
      } else {
        await createService(formData);
        alert("Them dich vu moi thanh cong!");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.message || "Thao tac that bai.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      filterCategory === "All" ||
      service.service_categories?.category_name === filterCategory;

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch =
      service.service_name?.toLowerCase().includes(searchLower) ||
      service.description?.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;

  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService,
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <OwnerPageShell contentClassName="owner-catalog-page">
          <div className="catalog-container">
            <div className="catalog-header">
              <div>
                <h1>Danh muc dich vu</h1>
                <p className="subtitle">
                  Quan ly va cap nhat thong tin dich vu nha khoa
                </p>
              </div>
              <button className="btn-add-service" onClick={openAddModal}>
                <span className="plus-icon">+</span> Them dich vu moi
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
                  placeholder="Tim ten dich vu hoac mo ta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <span className="filter-label">Loc theo danh muc:</span>
              <button
                className={`tab-btn ${filterCategory === "All" ? "active" : ""}`}
                onClick={() => setFilterCategory("All")}
              >
                Tat ca
              </button>
              {dbCategories.map((cat) => (
                <button
                  key={cat.category_id}
                  className={`tab-btn ${filterCategory === cat.category_name ? "active" : ""}`}
                  onClick={() => setFilterCategory(cat.category_name)}
                >
                  {cat.category_name}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div
                className="loading-container"
                style={{ textAlign: "center", padding: "40px" }}
              >
                <Spinner />
                <p style={{ marginTop: "10px", color: "#666" }}>
                  Dang tai du lieu dich vu...
                </p>
              </div>
            ) : error ? (
              <div
                className="error-message"
                style={{ color: "red", textAlign: "center", padding: "20px" }}
              >
                {error.message ||
                  "Khong the tai danh sach dich vu tu he thong."}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="catalog-table">
                  <thead>
                    <tr>
                      <th>TEN DICH VU</th>
                      <th>DANH MUC</th>
                      <th>GIA DU KIEN (VND)</th>
                      <th>SO KHUNG</th>
                      <th>TRANG THAI</th>
                      <th style={{ textAlign: "center" }}>THAO TAC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentServices.map((service) => (
                      <tr key={service.service_id}>
                        <td>
                          <div className="service-title-cell">
                            <span className="main-title">
                              {service.service_name}
                            </span>
                            <span className="sub-desc">
                              {service.description || "Chua co mo ta"}
                            </span>
                          </div>
                        </td>
                        <td>
                          {service.service_categories?.category_name ||
                            "Chua phan loai"}
                        </td>
                        <td className="price-cell">
                          {Number(
                            service.unit_price || service.price || 0,
                          ).toLocaleString("vi-VN")}{" "}
                          đ
                        </td>
                        <td>
                          {service.slot_occupied || 1}{" "}
                          khung
                        </td>
                        <td>
                          <span
                            className={`status-badge ${String(service.status || "Active").toLowerCase()}`}
                          >
                            {(service.status || "Active") === "Inactive"
                              ? "Ngung hoat dong"
                              : "Hoat dong"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            title="Chinh sua"
                            onClick={() => openEditModal(service)}
                          >
                            <Edit size={18} aria-hidden="true" />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Xoa"
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
                    {currentServices.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="empty-row"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          Khong tim thay dich vu nao.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div
                className="pagination-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "20px",
                  padding: "10px 0",
                  borderTop: "1px solid #eee",
                }}
              >
                <div
                  className="pagination-info"
                  style={{ color: "#666", fontSize: "14px" }}
                >
                  Hien thi {indexOfFirstService + 1} den{" "}
                  {Math.min(indexOfLastService, filteredServices.length)} trong
                  tong so {filteredServices.length} dich vu
                </div>

                <div
                  className="pagination-buttons"
                  style={{ display: "flex", gap: "5px" }}
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background: currentPage === 1 ? "#f5f5f5" : "#fff",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      color: currentPage === 1 ? "#aaa" : "#333",
                    }}
                  >
                    &laquo; Truoc
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      style={{
                        padding: "6px 12px",
                        border: "1px solid",
                        borderColor:
                          currentPage === index + 1 ? "#0f766e" : "#ccc",
                        borderRadius: "4px",
                        background:
                          currentPage === index + 1 ? "#0f766e" : "#fff",
                        color: currentPage === index + 1 ? "#fff" : "#333",
                        fontWeight:
                          currentPage === index + 1 ? "bold" : "normal",
                        cursor: "pointer",
                      }}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background:
                        currentPage === totalPages ? "#f5f5f5" : "#fff",
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                      color: currentPage === totalPages ? "#aaa" : "#333",
                    }}
                  >
                    Sau &raquo;
                  </button>
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
                  ? "Cap nhat dich vu nha khoa"
                  : "Tao dich vu nha khoa moi"}
              </h2>
              <button className="close-modal-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>
                  Ten dich vu <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Vi du: Tram rang tham my"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Nhom danh muc <span style={{ color: "red" }}>*</span>
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

                <div className="form-group">
                  <label>Trang thai</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Hoat dong</option>
                    <option value="Inactive">Ngung hoat dong</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Gia du kien (VND){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="Vi du: 500000"
                  />
                </div>

                <div className="form-group">
                  <label>So khung can thiet</label>
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
                <label>Mo ta dich vu</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Mo ta ngan ve quy trinh dieu tri..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Huy
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Cap nhat thay doi" : "Luu dich vu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerPageShell>
  );
}

export default OwnerServiceCatalog;

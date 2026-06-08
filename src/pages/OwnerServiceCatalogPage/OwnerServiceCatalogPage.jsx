import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import Spinner from "../../components/Spinner/Spinner";
import Badge from "../../components/Badge/Badge";
import "./OwnerServiceCatalogPage.css";

function OwnerServiceCatalog() {
  const [services, setServices] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      const response = await axios.get(
        "http://localhost:3000/api/v1/dental-services",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if (response.data && response.data.data) {
        setServices(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching data from Backend Port 3000:", err);
      setError("Unable to load service list from the backend system.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:3000/api/v1/dental-services/categories",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      if (response.data && response.data.data) {
        const categoriesFromDB = response.data.data;
        setDbCategories(categoriesFromDB);

        if (categoriesFromDB.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category_id: String(categoriesFromDB[0].category_id),
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching categories from DB:", err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchCategories()]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  // ---- HÀM KÍCH HOẠT FORM THÊM MỚI ----
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

  // ---- HÀM ĐÓNG MODAL VÀ DỌN DẸP TRẠNG THÁI ----
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

  // ---- HÀM KÍCH HOẠT FORM SỬA (ĐỔ NGƯỢC DATA) ----
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
      `Are you sure you want to delete the service "${serviceName}"?`,
    );
    if (!confirmDelete) return;

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      await axios.delete(
        `http://localhost:3000/api/v1/dental-services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      alert("Service deleted successfully.");
      setServices((prevServices) =>
        prevServices.filter((service) => service.service_id !== serviceId),
      );
    } catch (err) {
      console.error("Error occurred while deleting service:", err);
      alert(err.response?.data?.message || "Failed to delete service.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (isEditMode) {
        await axios.put(
          `http://localhost:3000/api/v1/dental-services/${currentServiceId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        alert("Service updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3000/api/v1/dental-services",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        alert("New service added successfully!");
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 1. CHẠY BỘ LỌC TÌM KIẾM VÀ CATEGORY TRƯỚC
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

  // 2. 🔥 ĐƯA LOGIC PHÂN TRANG RA NGOÀI HÀM FILTER (Sửa triệt để lỗi crash)
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;

  // Cắt lát dữ liệu đã lọc để đem đi hiển thị ở trang hiện hành
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService,
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <div className="owner-catalog-page">
      <SiteHeader />

      <main className="owner-catalog-main">
        <div className="catalog-container">
          <div className="catalog-header">
            <div>
              <h1>Service Catalog</h1>
              <p className="subtitle">
                Manage and update clinical service information
              </p>
            </div>
            {/* 🛠️ Đã sửa từ setIsModalOpen(true) sang hàm chuẩn openAddModal */}
            <button className="btn-add-service" onClick={openAddModal}>
              <span className="plus-icon">+</span> Add New Service
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
                placeholder="🔍 Search service name or description..."
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
            <span className="filter-label">Filter by category:</span>
            <button
              className={`tab-btn ${filterCategory === "All" ? "active" : ""}`}
              onClick={() => setFilterCategory("All")}
            >
              All
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

          {loading ? (
            <div
              className="loading-container"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <Spinner />
              <p style={{ marginTop: "10px", color: "#666" }}>
                Loading service data from Backend...
              </p>
            </div>
          ) : error ? (
            <div
              className="error-message"
              style={{ color: "red", textAlign: "center", padding: "20px" }}
            >
              {error}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="catalog-table">
                <thead>
                  <tr>
                    <th>SERVICE NAME</th>
                    <th>CATEGORY</th>
                    <th>EST. PRICE (VND)</th>
                    <th>SLOTS</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: "center" }}>ACTIONS</th>
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
                            {service.description || "No description provided"}
                          </span>
                        </div>
                      </td>
                      <td>
                        {service.service_categories?.category_name ||
                          "Uncategorized"}
                      </td>
                      <td className="price-cell">
                        {Number(
                          service.unit_price || service.price || 0,
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </td>
                      <td>
                        {service.slot_occupied || 1}{" "}
                        {(service.slot_occupied || 1) > 1 ? "Slots" : "Slot"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${String(service.status || "Active").toLowerCase()}`}
                        >
                          {service.status || "Active"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="action-btn edit-btn"
                          title="Edit"
                          onClick={() => openEditModal(service)}
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() =>
                            handleDeleteService(
                              service.service_id,
                              service.service_name,
                            )
                          }
                        >
                          🗑️
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
                        No services found.
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
                Showing {indexOfFirstService + 1} to{" "}
                {Math.min(indexOfLastService, filteredServices.length)} of{" "}
                {filteredServices.length} services
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
                  &laquo; Previous
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
                      fontWeight: currentPage === index + 1 ? "bold" : "normal",
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
                    background: currentPage === totalPages ? "#f5f5f5" : "#fff",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    color: currentPage === totalPages ? "#aaa" : "#333",
                  }}
                >
                  Next &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {isEditMode
                  ? "Update Dental Service"
                  : "Create New Dental Service"}
              </h2>
              <button className="close-modal-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>
                  Service Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Composite Filling"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Category Group <span style={{ color: "red" }}>*</span>
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
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Estimated Price (VND){" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 500000"
                  />
                </div>

                <div className="form-group">
                  <label>Required Slots</label>
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
                <label>Service Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief details about the clinical procedures..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isEditMode ? "Update Changes" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

export default OwnerServiceCatalog;

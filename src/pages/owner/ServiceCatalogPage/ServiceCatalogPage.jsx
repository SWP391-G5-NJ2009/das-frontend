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
      await deleteService(serviceId);
      alert("Service deleted successfully.");
    } catch (err) {
      console.error("Error occurred while deleting service:", err);
      alert(err.message || "Unable to delete the service.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateService(currentServiceId, formData);
        alert("Service updated successfully!");
      } else {
        await createService(formData);
        alert("New service added successfully!");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.message || "Operation failed.");
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

  const getPaginationRange = () => {
    const totalNumbers = 7;
    if (totalPages <= totalNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const isNearFirstPage = currentPage <= 4;
    const isNearLastPage = currentPage >= totalPages - 3;
    if (isNearFirstPage) return [1, 2, 3, 4, 5, "...", totalPages];
    if (isNearLastPage)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const paginationRange = getPaginationRange();

  return (
    <OwnerPageShell contentClassName="owner-catalog-page">
          <div className="catalog-container">
            <div className="catalog-header">
              <div>
                <h1>Service Catalog</h1>
                <p className="subtitle">
                  Manage and update dental service information
                </p>
              </div>
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
                  placeholder="Search by service name or description..."
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
              <label className="filter-label" htmlFor="category-filter">
                Filter by category:
              </label>
              <select
                id="category-filter"
                className="filter-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All</option>
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
                  Loading service data...
                </p>
              </div>
            ) : error ? (
              <div
                className="error-message"
                style={{ color: "red", textAlign: "center", padding: "20px" }}
              >
                {error.message ||
                  "Unable to load the service list from the system."}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="catalog-table">
                  <thead>
                    <tr>
                      <th>SERVICE NAME</th>
                      <th>CATEGORY</th>
                      <th>ESTIMATED PRICE (VND)</th>
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
                              {service.description || "No description"}
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
                          {(service.slot_occupied || 1) === 1 ? "slot" : "slots"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${String(service.status || "Active").toLowerCase()}`}
                          >
                            {(service.status || "Active") === "Inactive"
                              ? "Inactive"
                              : "Active"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="action-btn edit-btn"
                            title="Edit"
                            onClick={() => openEditModal(service)}
                          >
                            <Edit size={18} aria-hidden="true" />
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

                  {paginationRange.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`dots-${index}`}
                          style={{
                            padding: "6px 8px",
                            color: "#999",
                            fontSize: "14px",
                            userSelect: "none",
                          }}
                          aria-hidden="true"
                        >
                          &hellip;
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          padding: "6px 12px",
                          border: "1px solid",
                          borderColor: currentPage === page ? "#0f766e" : "#ccc",
                          borderRadius: "4px",
                          background: currentPage === page ? "#0f766e" : "#fff",
                          color: currentPage === page ? "#fff" : "#333",
                          fontWeight: currentPage === page ? "bold" : "normal",
                          cursor: "pointer",
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}

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
                    Next &raquo;
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
                  placeholder="e.g. Cosmetic Tooth Filling"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Category <span style={{ color: "red" }}>*</span>
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
                )}
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
                    placeholder="e.g. 500000"
                  />
                </div>

                <div className="form-group">
                  <label>Slots Required</label>
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
                  placeholder="Brief description of the treatment process..."
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
                  {isEditMode ? "Save Changes" : "Save Service"}
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

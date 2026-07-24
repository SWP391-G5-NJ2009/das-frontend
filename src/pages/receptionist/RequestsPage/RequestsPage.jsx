import { useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useConsultationRequests } from "../../../hooks/useConsultationRequests";
import HandleRequestModal from "../../../components/features/consultation/HandleRequestModal/HandleRequestModal";
import ReceptionistPageShell from "../ReceptionistPageShell";
import RequestFilters from "../../../components/features/consultation/RequestFilters/RequestFilters"
import PropTypes from "prop-types";
import "./RequestsPage.css";
import Pagination from "../../../components/common/Pagination/Pagination";
import Toast from "../../../components/common/Toast/Toast";

function ReceptionistRequestsPage() {

  const [filters, setFilters] = useState({
    status: "Pending",
    from_date: "",
    to_date: "",
    search: "",
    pagination: 1,
  });

  const MAX_PAGE = 20;
  const { requests, total, isLoading, error, refetch } = useConsultationRequests(filters);
  const [handleRequest, setHandleRequest] = useState(null);
  const [toast, setToast] = useState({ message: null, type: null });

  const handleStatusChange = useCallback(
    (status) => setFilters((prev) => ({ ...prev, status, pagination: 1 })),
    [],
  );

  const handleFromDateChange = useCallback(
    (from_date) => setFilters((prev) => ({ ...prev, from_date, pagination: 1 })),
    [],
  );

  const handleToDateChange = useCallback(
    (to_date) => setFilters((prev) => ({ ...prev, to_date, pagination: 1 })),
    [],
  );

  const handleSearchChange = useCallback(
    (search) => setFilters((prev) => ({ ...prev, search, pagination: 1 })),
    [],
  );

  return (
    <>
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
              Quản lý yêu cầu tư vấn
            </h1>
            <p className="receptionist-requests__page-desc">
              Xem và cập nhật yêu cầu tư vấn.
            </p>
          </div>
        </div>

        <div className="receptionist-requests__card">
          <div className="receptionist-requests__card-header">
            <div className="receptionist-requests__card-title-group">
              <h2 className="receptionist-requests__card-title">
                Danh sách yêu cầu tư vấn
              </h2>
            </div>

          </div>

          <RequestFilters
            filters={filters}
            onStatusChange={handleStatusChange}
            onFromDateChange={handleFromDateChange}
            onToDateChange={handleToDateChange}
            onSearchChange={handleSearchChange}
          />

          <div className="receptionist-requests__table-wrapper">
            <table className="receptionist-requests__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Mô tả</th>
                  <th>Dịch vụ</th>
                  <th>Ngày tư vấn</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Người xử lý</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={11}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={11}>
                      Đã xảy ra lỗi. Vui lòng thử lại sau.
                    </td>
                  </tr>
                )}

                {!isLoading && !error && requests.length === 0 && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={11}>
                      Không tìm thấy yêu cầu nào
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
                        {(filters.pagination - 1) * MAX_PAGE + index + 1}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.full_name}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.phone}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.email}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.description && request.description.length > 20
                          ? `${request.description.slice(0, 20)}...`
                          : request.description}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.dental_services?.name || "—"}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.consultation_date
                          ? new Date(request.consultation_date).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className="receptionist-requests__cell">
                        {new Date(request.created_at).toLocaleString("vi-VN")}
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
              Hiển thị {(filters.pagination - 1) * MAX_PAGE + 1}-{filters.pagination * MAX_PAGE < total ? filters.pagination * MAX_PAGE : total} trong tổng số {total} yêu cầu
            </p>
            <div className="receptionist-requests__pagination-controls">
              <Pagination
                currentPage={filters.pagination}
                totalPage={Math.ceil(total / 20)}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, pagination: page }))} />
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
            setToast({ message: "Cập nhật yêu cầu thành công.", type: "success" });
          }}
          refetch={refetch}
        />
      )}
    </ReceptionistPageShell>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ message: null, type: null })}
          duration={5000}
        />
      )}
    </>
  );
}

ReceptionistRequestsPage.propTypes = {};

export default ReceptionistRequestsPage;

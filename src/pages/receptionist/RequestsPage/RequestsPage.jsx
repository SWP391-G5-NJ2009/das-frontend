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
import HandleRequestModal from "../../../components/features/consultation/HandleRequestModal";
import ReceptionistPageShell from "../ReceptionistPageShell";
import RequestFilters from "../../../components/features/consultation/RequestFilters/RequestFilters"
import PropTypes from "prop-types";
import "./RequestsPage.css";
import Pagination from "../../../components/common/Pagination/Pagination";

function ReceptionistRequestsPage() {

  const [filters, setFilters] = useState({
    status: "Pending",
    date: "",
    search: "",
    pagination: 1,
  });

  const MAX_PAGE = 20;
  const { requests, total, isLoading, error, refetch } = useConsultationRequests(filters);
  const [handleRequest, setHandleRequest] = useState(null);

  const handleStatusChange = useCallback(
    (status) => setFilters((prev) => ({ ...prev, status })),
    [],
  );

  const handleDateChange = useCallback(
    (date) => setFilters((prev) => ({ ...prev, date, pagination: 1 })),
    [],
  );
  const handleSearchChange = useCallback(
    (search) => setFilters((prev) => ({ ...prev, search, pagination: 1 })),
    [],
  );

  return (
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
            onDateChange={handleDateChange}
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
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Người xử lý</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}

                {!isLoading && error && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
                      Lỗi: {error.message}
                    </td>
                  </tr>
                )}

                {!isLoading && !error && requests.length === 0 && (
                  <tr>
                    <td className="receptionist-requests__cell" colSpan={9}>
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
                        <div className="receptionist-requests__user-cell">
                          <div
                            className="receptionist-requests__avatar"
                            aria-hidden="true"
                          >
                            {(request.full_name || "?").charAt(0).toUpperCase()}
                          </div>
                          <span>{request.full_name}</span>
                        </div>
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.phone}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.email}
                      </td>
                      <td className="receptionist-requests__cell">
                        {request.description}
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
          }}
        />
      )}
    </ReceptionistPageShell>
  );
}

ReceptionistRequestsPage.propTypes = {};

export default ReceptionistRequestsPage;

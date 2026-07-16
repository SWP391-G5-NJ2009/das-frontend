import { useState } from "react";
import {
  Building2,
  Clock3,
  Hospital,
  MapPin,
  Pencil,
  Phone,
  RefreshCw,
} from "lucide-react";
import Button from "../../../components/common/Button/Button";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import ClinicInfoEditModal from "../../../components/features/owner/ClinicInfoEditModal/ClinicInfoEditModal";
import { useClinicInfo } from "../../../hooks/useClinicInfo";
import { clinicService } from "../../../services/clinic.service";
import OwnerPageShell from "../OwnerPageShell";
import "./ClinicInfoPage.css";

function ClinicInfoPage() {
  const { clinicInfo, error, isLoading, refetch } = useClinicInfo();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState({
    clinicName: "",
    address: "",
    hotline: "",
  });

  const openEditModal = () => {
    setFormData({
      clinicName: clinicInfo.clinic_name || "",
      address: clinicInfo.address || "",
      hotline: clinicInfo.hotline || "",
    });
    setSaveError("");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    if (!isSaving) setIsEditOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      await clinicService.updateInfo(formData);
      await refetch();
      setIsEditOpen(false);
    } catch (updateError) {
      setSaveError(updateError.message || "Không thể cập nhật thông tin phòng khám.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OwnerPageShell contentClassName="clinic-info-page">
      <section className="clinic-info" aria-labelledby="clinic-info-title">
        <header className="clinic-info__header">
          <div>
            <h1 className="clinic-info__title" id="clinic-info-title">
              Thông tin phòng khám
            </h1>
          </div>
          {!isLoading && !error && clinicInfo && (
            <button
              className="clinic-info__edit-button"
              type="button"
              onClick={openEditModal}
            >
              <Pencil size={18} aria-hidden="true" />
              Chỉnh sửa
            </button>
          )}
        </header>

        {isLoading && (
          <div className="clinic-info__state" aria-live="polite">
            <Spinner />
            <p>Đang tải thông tin phòng khám...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="clinic-info__state clinic-info__state--error" role="alert">
            <p>{error.message || "Không thể tải thông tin phòng khám."}</p>
            <Button variant="outlined" onClick={refetch}>
              <RefreshCw size={18} aria-hidden="true" />
              Thử lại
            </Button>
          </div>
        )}

        {!isLoading && !error && !clinicInfo && (
          <EmptyState message="Thông tin phòng khám chưa được thiết lập." />
        )}

        {!isLoading && !error && clinicInfo && (
          <div className="clinic-info__content">
            <article className="clinic-info__hero">
              <div className="clinic-info__hero-icon" aria-hidden="true">
                <Hospital size={36} />
              </div>
              <div className="clinic-info__hero-copy">
                <span className="clinic-info__label">Tên phòng khám</span>
                <h2 className="clinic-info__clinic-name">
                  {clinicInfo.clinic_name}
                </h2>
              </div>
            </article>

            <div className="clinic-info__grid">
              <article className="clinic-info__card">
                <header className="clinic-info__card-header">
                  <Building2 className="clinic-info__card-icon" aria-hidden="true" />
                  <h2 className="clinic-info__card-title">Thông tin liên hệ</h2>
                </header>
                <div className="clinic-info__card-body clinic-info__card-body--aligned">
                  <div className="clinic-info__detail">
                    <MapPin aria-hidden="true" />
                    <div>
                      <span className="clinic-info__label">Địa chỉ</span>
                      <p className="clinic-info__value">{clinicInfo.address}</p>
                    </div>
                  </div>
                  <div className="clinic-info__detail">
                    <Phone aria-hidden="true" />
                    <div>
                      <span className="clinic-info__label">Hotline</span>
                      <a className="clinic-info__link" href={`tel:${clinicInfo.hotline}`}>
                        {clinicInfo.hotline}
                      </a>
                    </div>
                  </div>
                </div>
              </article>

              <article className="clinic-info__card">
                <header className="clinic-info__card-header">
                  <Clock3 className="clinic-info__card-icon" aria-hidden="true" />
                  <h2 className="clinic-info__card-title">Thời gian hoạt động</h2>
                </header>
                <div className="clinic-info__card-body clinic-info__card-body--aligned">
                  <div className="clinic-info__hours">
                    <span className="clinic-info__hours-label">Giờ mở cửa</span>
                    <strong>{clinicInfo.open_time}</strong>
                  </div>
                  <div className="clinic-info__hours">
                    <span className="clinic-info__hours-label">Giờ đóng cửa</span>
                    <strong>{clinicInfo.close_time}</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        {isEditOpen && (
          <ClinicInfoEditModal
            error={saveError}
            formData={formData}
            isSaving={isSaving}
            onChange={handleFormChange}
            onClose={closeEditModal}
            onSubmit={handleUpdate}
          />
        )}
      </section>
    </OwnerPageShell>
  );
}

export default ClinicInfoPage;

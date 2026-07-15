import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { AlertTriangle, Calendar, Zap, X } from "lucide-react";
import { clinicScheduleManagementService } from "../../../../services/clinicScheduleManagement.service";
import "./ConflictResolutionModal.css";

function ConflictResolutionModal({ conflicts, hours, onForceSave, onScheduleForLater, onCancel }) {
    const [minEffectiveDate, setMinEffectiveDate] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        clinicScheduleManagementService.getMinEffectiveDate()
            .then((res) => {
                const minDate = res.minEffectiveDate || "";
                setMinEffectiveDate(minDate);
                setSelectedDate(minDate);
            })
            .catch(() => {
                const today = new Date().toISOString().split("T")[0];
                setMinEffectiveDate(today);
                setSelectedDate(today);
            });
    }, []);

    async function handleForceSave() {
        setIsCreating(true);
        try {
            await onForceSave();
        } finally {
            setIsCreating(false);
        }
    }

    async function handleScheduleForLater() {
        if (!selectedDate) return;
        setIsCreating(true);
        try {
            await onScheduleForLater(selectedDate);
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="crm__overlay" onClick={onCancel}>
            <div className="crm__modal" onClick={(e) => e.stopPropagation()}>
                <div className="crm__header">
                    <AlertTriangle size={24} className="crm__header-icon" />
                    <h2 className="crm__title">Phát hiện lịch hẹn bị ảnh hưởng</h2>
                    <button
                        className="crm__close"
                        type="button"
                        onClick={onCancel}
                        disabled={isCreating}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="crm__body">
                    <p className="crm__description">
                        Có <strong>{conflicts.length}</strong> lịch hẹn đang chờ xử lý sẽ bị ảnh hưởng
                        bởi thay đổi giờ làm việc này.
                    </p>

                    <div className="crm__conflicts-list">
                        {conflicts.slice(0, 5).map((conflict, index) => (
                            <div key={index} className="crm__conflict-item">
                                <span className="crm__conflict-date">{conflict.work_date}</span>
                                <span className="crm__conflict-time">{conflict.slot_start}</span>
                                {conflict.dentist_id && (
                                    <span className="crm__conflict-dentist">Nha sĩ #{conflict.dentist_id}</span>
                                )}
                            </div>
                        ))}
                        {conflicts.length > 5 && (
                            <div className="crm__conflict-more">
                                ... và {conflicts.length - 5} lịch hẹn khác
                            </div>
                        )}
                    </div>

                    <div className="crm__options">
                        <div className="crm__option">
                            <div className="crm__option-header">
                                <Zap size={20} className="crm__option-icon crm__option-icon--force" />
                                <h3 className="crm__option-title">Áp dụng ngay</h3>
                            </div>
                            <p className="crm__option-description">
                                Lưu thay đổi ngay lập tức. Các lịch hẹn bị ảnh hưởng sẽ được đánh dấu
                                là "Conflict" và nhân viên liên hệ bệnh nhân để sắp xếp lại.
                            </p>
                            <button
                                className="crm__btn crm__btn--force"
                                onClick={handleForceSave}
                                disabled={isCreating}
                            >
                                {isCreating ? "Đang xử lý..." : "Áp dụng ngay"}
                            </button>
                        </div>

                        <div className="crm__option">
                            <div className="crm__option-header">
                                <Calendar size={20} className="crm__option-icon crm__option-icon--schedule" />
                                <h3 className="crm__option-title">Đặt lịch sau</h3>
                            </div>
                            <p className="crm__option-description">
                                Tạo phiên bản mới với ngày hiệu lực trong tương lai. Thay đổi sẽ có hiệu
                                lực vào ngày bạn chọn mà không ảnh hưởng lịch hẹn hiện tại.
                            </p>
                            <div className="crm__date-picker">
                                <label className="crm__date-label">Ngày hiệu lực:</label>
                                <input
                                    type="date"
                                    className="crm__date-input"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={minEffectiveDate || undefined}
                                    disabled={isCreating}
                                />
                            </div>
                            <button
                                className="crm__btn crm__btn--schedule"
                                onClick={handleScheduleForLater}
                                disabled={isCreating || !selectedDate}
                            >
                                {isCreating ? "Đang tạo..." : "Đặt lịch sau"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ConflictResolutionModal.propTypes = {
    conflicts: PropTypes.arrayOf(
        PropTypes.shape({
            slot_id: PropTypes.number,
            work_date: PropTypes.string,
            slot_start: PropTypes.string,
            slot_end: PropTypes.string,
            dentist_id: PropTypes.number,
        })
    ).isRequired,
    hours: PropTypes.array.isRequired,
    onForceSave: PropTypes.func.isRequired,
    onScheduleForLater: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default ConflictResolutionModal;

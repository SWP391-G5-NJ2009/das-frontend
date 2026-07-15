import OwnerPageShell from "../OwnerPageShell";
import { Construction } from "lucide-react";
import "./ClinicInfoPage.css";

function ClinicInfoPage() {
  return (
    <OwnerPageShell contentClassName="clinic-info-page">
      <div className="clinic-info">
        <header className="clinic-info__header">
          <div>
            <h1 className="clinic-info__title">Thông tin phòng khám</h1>
            <p className="clinic-info__subtitle">
              Trang đang được phát triển.
            </p>
          </div>
        </header>

        <div className="clinic-info__placeholder">
          <Construction size={64} className="clinic-info__placeholder-icon" />
          <h2 className="clinic-info__placeholder-title">Đang trong quá trình xây dựng</h2>
          <p className="clinic-info__placeholder-text">
            Chức năng này sẽ sớm được ra mắt. Vui lòng quay lại sau.
          </p>
        </div>
      </div>
    </OwnerPageShell>
  );
}

export default ClinicInfoPage;

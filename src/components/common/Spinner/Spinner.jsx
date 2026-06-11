import "./Spinner.css";

function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="Đang tải">
      <span className="spinner__ring" />
    </div>
  );
}

export default Spinner;

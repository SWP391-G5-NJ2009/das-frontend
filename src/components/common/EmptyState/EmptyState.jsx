import PropTypes from "prop-types";
import "./EmptyState.css";

function EmptyState({ message }) {
  return (
    <section className="empty-state" aria-live="polite">
      <h3 className="empty-state__title">Nothing to show</h3>
      <p className="empty-state__message">{message}</p>
    </section>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};

export default EmptyState;

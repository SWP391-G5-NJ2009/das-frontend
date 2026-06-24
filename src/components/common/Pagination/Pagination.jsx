import PropTypes from "prop-types";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from "lucide-react"
import "./Pagination.css"

function Pagination({
    currentPage,
    totalPage,
    onPageChange
}) {
    return (
        <div className="receptionist-requests__pagination-controls">
            <button
                className="btn"
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}

            >
                <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
                className={`btn ${currentPage < 4 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(1)}
            >
                1
            </button>
            <span className={`ellipsis${currentPage < 4 ? " hidden" : ""}`}>
                <MoreHorizontal size={18} />
            </span>
            <button
                className={`btn${currentPage < 3 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(currentPage - 2)}
            >
                {currentPage - 2}
            </button>
            <button
                className={`btn${currentPage < 2 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
            >
                {currentPage - 1}
            </button>
            <button
                className="btn btn--active"
                type="button"
            >
                {currentPage}
            </button>
            <button
                className={`btn${currentPage > 29 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
            >
                {currentPage + 1}
            </button>
            <button
                className={`btn${currentPage > 28 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(currentPage + 2)}
            >
                {currentPage + 2}
            </button>
            <span className={`ellipsis${currentPage > 27 ? " hidden" : ""}`}>
                <MoreHorizontal size={18} />
            </span>
            <button
                className={`btn${currentPage > 27 ? " hidden" : ""}`}
                type="button"
                onClick={() => onPageChange(totalPage)}
            >
                {totalPage}
            </button>
            <button
                className="btn"
                type="button"
                disabled={currentPage === totalPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight size={18} aria-hidden="true" />
            </button>
        </div>

    );
}

Pagination.defaultProps = {
    currentPage: 1,
};

export default Pagination;
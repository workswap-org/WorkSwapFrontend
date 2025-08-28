const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // если закрыта — ничего не рендерим

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    {title && <h2>{title}</h2>}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null; // если закрыта — ничего не рендерим

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    {title && <h3>{title}</h3>}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
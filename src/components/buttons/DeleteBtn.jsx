import { apiFetch } from "@/components/functions/apiClient";

const DeleteBtn = ({ type, id}) => {

    const handleDelete = () => {
        if (!window.confirm("Удалить это объявление?")) return;
        // Здесь нужно сделать fetch к API для удаления
        apiFetch(`api/${type}/${id}/delete`, {
            method: "POST"
        });
    };

    return (
        <button
            type="button"
            className="btn-admin btn-admin-danger"
            onClick={() => handleDelete()}
        >
            <i className="fa-solid fa-trash"></i>
        </button>
    );
}

export default DeleteBtn;
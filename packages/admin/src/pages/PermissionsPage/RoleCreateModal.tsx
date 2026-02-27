import { Modal } from "@core/components";
import { permissionsService, IRole } from "@core/lib";
import { useState } from "react";

const RoleCreateModal = ({addRole}: {addRole: (role: IRole) => void}) => {

    const [name, setName] = useState("");

    const [isOpen, setOpen] = useState(false);

    async function createR() {
        if (!name.trim()) return;
        const newRoleId = await permissionsService.createRole(name);
        console.log(newRoleId)
        if (newRoleId) {
            addRole({id: newRoleId, name: name, level: 0})
            setName("");
            setOpen(false);
        }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="btn btn-primary">
                <i className="fa-solid fa-plus"></i> Роль
            </button>
            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Создать роль">
                <div className="form-group">
                    <label htmlFor="roleName">Имя:</label>
                    <span>(на англиском, заглавными буквами)</span>
                    <input
                        type="text"
                        id="roleName"
                        name="roleName"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-actions" onClick={() => createR()}>
                    <button className="btn btn-outline-primary">Сохранить</button>
                </div>
            </Modal>
        </>
    );
};

export default RoleCreateModal;
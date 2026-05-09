import Modal from "@core/components/ui/Modal/Modal";
import PlusIcon from "@core/components/common/icons/PlusIcon";
import { useState } from "react";
import { IRole } from "@core/lib/types/models/user";
import { permissionsService } from "@core/lib/services/permissionsService";

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
                <PlusIcon /> Роль
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
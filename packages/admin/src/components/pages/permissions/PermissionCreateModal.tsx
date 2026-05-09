import Modal from "@core/components/ui/Modal/Modal";
import { useState } from "react";
import PlusIcon from "@core/components/common/icons/PlusIcon"
import { permissionsService } from "@core/lib/services/permissionsService";
import { IPermission } from "@core/lib/types/models/user";

const PermissionCreateModal = ({addPermission}: {addPermission: (permisson: IPermission) => void}) => {

    const [name, setName] = useState("");
    const [isOpen, setOpen] = useState(false);

    async function createPerm() {
        if (!name.trim()) return;
        const newPermId = await permissionsService.createPermission(name);
        if (newPermId) {
            addPermission({id: newPermId, name: name, comment: ""})
            setName("");
            setOpen(false);
        }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="btn btn-primary">
                <PlusIcon /> Разрешение
            </button>

            <Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Создать Разрешение">
                <div className="form-group">
                    <label htmlFor="permissionName">Имя:</label>
                    <span>(на англиском, заглавными буквами)</span>
                    <input
                        type="text"
                        id="permissionName"
                        name="permissionName"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-actions" onClick={() => createPerm()}>
                    <button className="btn btn-outline-primary">Сохранить</button>
                </div>
            </Modal>
        </>
    );
};

export default PermissionCreateModal;
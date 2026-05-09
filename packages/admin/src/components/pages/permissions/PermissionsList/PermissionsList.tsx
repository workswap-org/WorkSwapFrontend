import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PermissionItem from "../PermissionItem/PermissionItem";
import { IPermission, IRole } from "@core/lib/types/models/user";
import { permissionsService } from "@core/lib/services/permissionsService";
import styles from "./PermissionsList.module.scss"

interface PermissionsListProps {
    permissions: IPermission[] | null;
    selectedRole: IRole | null;
    setSaving: Dispatch<SetStateAction<boolean>>
}

const PermissionsList = ({permissions, selectedRole, setSaving}: PermissionsListProps) => {

    const [checkedPermissions, setCheckedPermissions] = useState<IPermission[] | null>(null);

    useEffect(() => {
        async function loadPermsByRole() {
            if (!selectedRole?.id) return;
            const data = await permissionsService.getRolePermissions(selectedRole?.id);
            setCheckedPermissions(data);
        }

        if (selectedRole) {
            loadPermsByRole()
        }
    }, [selectedRole])

    return (
        <div className={styles.list}>
            {permissions?.map((perm) => (
                <PermissionItem 
                    key={perm.id}
                    permission={perm} 
                    setSaving={setSaving} 
                    selectedRole={selectedRole}
                    checkedPermissions={checkedPermissions}
                    setCheckedPermissions={setCheckedPermissions}
                />
            ))}
        </div>
    );
};

export default PermissionsList;
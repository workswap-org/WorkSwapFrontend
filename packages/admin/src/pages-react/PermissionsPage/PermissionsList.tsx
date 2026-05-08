import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { permissionsService, IPermission, IRole } from "@core/lib";
import PermissionItem from "./PermissionItem";

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
        <div className="permissions-list" id="permissionsList">
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
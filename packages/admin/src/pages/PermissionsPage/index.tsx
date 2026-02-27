import { useCallback, useEffect, useState } from "react";
import { 
    permissionsService,
    IRole,
    IPermission
} from "@core/lib";
import RolesList from "./RolesList.tsx";
import PermissionsList from "./PermissionsList.tsx";
import RoleCreateModal from "./RoleCreateModal.tsx";
import PermissionCreateModal from "./PermissionCreateModal.tsx";
import { SidebarSectionLayout } from "@core/components/index.js";

const PermissionsPage = () => {

    const [roles, setRoles] = useState<IRole[] | null>(null);
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const [permissions, setPermissions] = useState<IPermission[] | null>(null);
    const [roleListVisible, setRoleListVisible] = useState<boolean>(true);

    const [saving, setSaving] = useState<boolean>(false)

    useEffect(() => {
        async function loadRoles() {
            const data = await permissionsService.getAllRoles();
            setRoles(data);
        }

        async function loadPerms() {
            const data = await permissionsService.getAllPermissions();
            setPermissions(data);
        }

        loadPerms();
        loadRoles();
    }, [])

    const selectRole = useCallback((role: IRole) => {
        setSelectedRole(role);
        setRoleListVisible(false)
    }, [])

    const addRole = useCallback((role: IRole) => {
        setRoles((prev) => {
            if (!prev) return prev;
            return ([...prev, role]);
        })
    }, [setRoles])

    const addPermission = useCallback((perm: IPermission) => {
        setPermissions(prev => {
            if (!prev) return prev;
            return ([...prev, perm]);
        })
    }, [setPermissions])

    return (
        <>
            <div className="card admin-page">
                <div className="card__body flex-column">
                    <div className="card__header">
                        <div className="btn-actions-group">
                            <RoleCreateModal addRole={addRole}/>
                            <PermissionCreateModal addPermission={addPermission}/>
                        </div>
                    </div>
                    {selectedRole ? (
                        <div className="selected-role" onClick={() => setRoleListVisible(prev => !prev)}>
                            {selectedRole.name}
                        </div>
                    ) : (
                        <div className="selected-role"></div>
                    )}
                    
                    <div className="page-container">
                        <RolesList 
                            roles={roles} 
                            selectRole={selectRole}
                            saving={saving}
                            selectedRole={selectedRole}
                            roleListVisible={roleListVisible}
                        />
                        <PermissionsList
                            selectedRole={selectedRole} 
                            permissions={permissions}
                            setSaving={setSaving}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PermissionsPage;
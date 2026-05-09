"use client"

import { useCallback, useEffect, useState } from "react";
import { IPermission, IRole } from "@core/lib/types/models/user";
import { permissionsService } from "@core/lib/services/permissionsService"
import Card from "@/components/ui/Card/Card";
import RoleCreateModal from "@/components/pages/permissions/RoleCreateModal";
import PermissionCreateModal from "@/components/pages/permissions/PermissionCreateModal";
import RolesList from "@/components/pages/permissions/RolesList/RolesList";
import PermissionsList from "@/components/pages/permissions/PermissionsList/PermissionsList";
import styles from "./PermissionsPage.module.scss"

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
        <Card header={
            <div className="btn-actions-group">
                <RoleCreateModal addRole={addRole}/>
                <PermissionCreateModal addPermission={addPermission}/>
            </div>
        }>
            {selectedRole ? (
                <div className={styles.selectedRole} onClick={() => setRoleListVisible(prev => !prev)}>
                    {selectedRole.name}
                </div>
            ) : (
                <div className={styles.selectedRole}></div>
            )}
            
            <div className={styles.page}>
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
        </Card>
    );
};

export default PermissionsPage;
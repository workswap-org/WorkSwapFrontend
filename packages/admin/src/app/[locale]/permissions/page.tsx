"use client"

import { useCallback, useState } from "react";
import { IRole } from "@core/lib/types/models/user";
import Card from "@/components/ui/Card/Card";
import RolesList from "@/components/pages/permissions/RolesList/RolesList";
import PermissionsList from "@/components/pages/permissions/PermissionsList/PermissionsList";
import styles from "./PermissionsPage.module.scss"

const PermissionsPage = () => {

    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const [roleListVisible, setRoleListVisible] = useState<boolean>(true);

    const [saving, setSaving] = useState<boolean>(false)

    const selectRole = useCallback((role: IRole) => {
        setSelectedRole(role);
        setRoleListVisible(false)
    }, [])

    return (
        <Card>
            {selectedRole ? (
                <div className={styles.selectedRole} onClick={() => setRoleListVisible(prev => !prev)}>
                    {selectedRole.name}
                </div>
            ) : (
                <div className={styles.selectedRole}></div>
            )}
            
            <div className={styles.page}>
                <RolesList 
                    selectRole={selectRole}
                    saving={saving}
                    selectedRole={selectedRole}
                    roleListVisible={roleListVisible}
                />
                <PermissionsList
                    selectedRole={selectedRole} 
                    setSaving={setSaving}
                />
            </div>
        </Card>
    );
};

export default PermissionsPage;
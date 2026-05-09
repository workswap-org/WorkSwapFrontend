import { IRole } from "@core/lib/types/models/user";
import styles from "./RolesList.module.scss"

interface RolesListProps {
    roles: IRole[] | null;
    selectRole: (role: IRole) => void;
    saving: boolean;
    roleListVisible: boolean;
    selectedRole: IRole | null;
}

const RolesList = ({
    roles, 
    selectRole, 
    selectedRole, 
    saving,
    roleListVisible
}: RolesListProps) => {

    return (
        <div className={`${styles.rolesList} ${roleListVisible ? styles.show : ""}`}>
            {roles?.map((role) => (
                <div 
                    className={`${styles.role} ${role.id == selectedRole?.id ? styles.active : ""}`} 
                    key={role.id}
                    onClick={() => selectRole(role)}
                >
                    <span>{role.name}</span>
                    {(selectedRole?.id == role.id && saving) &&
                        <div>
                            <i className="fa-solid fa-loader fa-spin"></i>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
};

export default RolesList;
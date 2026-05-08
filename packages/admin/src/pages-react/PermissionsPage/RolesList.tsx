import { Dispatch, SetStateAction } from "react";
import { IRole } from "@core/lib";

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
        <div className={`roles-list ${roleListVisible ? "show" : ""}`}>
            {roles?.map((role) => (
                <div 
                    className={`role-item ${role.id == selectedRole?.id ? "active" : ""}`} 
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
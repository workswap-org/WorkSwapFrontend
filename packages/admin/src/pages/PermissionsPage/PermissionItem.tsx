import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { 
    permissionsService, 
    useNotification, 
    IPermission,
    IRole,
    IPermissionUpdate
} from '@core/lib';
import { ActionMenu } from '@core/components';
import { IKebabAction } from '@core/components/ui/ActionMenu';

interface PermissionItemProps {
    permission: IPermission | null;
    setSaving: Dispatch<SetStateAction<boolean>>;
    selectedRole: IRole | null;
    checkedPermissions: IPermission[] | null;
    setCheckedPermissions: Dispatch<SetStateAction<IPermission[] | null>>;
} 

const PermissionItem = ({
    permission,
    setSaving,
    selectedRole,
    checkedPermissions,
    setCheckedPermissions
}: PermissionItemProps) => {

    const { notificate } = useNotification()

    const [editMode, setEditMode] = useState(false);
    const [permissionName, setPermissionName] = useState(permission?.name);
    const [permissionComment, setPermissionComment] = useState(permission?.comment);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    async function savePermissions(permId: number, enabled: boolean) {
        if (!selectedRole?.id) return
        const update: IPermissionUpdate = {
            permissionId: permId,
            enabled
        }
        const res = await permissionsService.updateRolePermissions(selectedRole?.id, update);
        if (res.ok) setSaving(false);
    }

    function changeRolePerms(perm: IPermission | null, enabled: boolean) {
        if (!perm) return
        setSaving(true);
        savePermissions(perm.id, enabled);
        setCheckedPermissions(prev => {
            // если уже есть — удалить
            if (!prev) return prev;

            if (prev.some(p => p.id === perm.id)) {
                return prev.filter(p => p.id !== perm.id);
            } else {
                return [...prev, perm];
            }
        });
    }

    async function savePermission(id: number | null) {
        if (!id) return
        const update: IPermission = {id: 0, name: "", comment: ""};
        if (permissionName) update.name = permissionName;
        update.comment = permissionComment || "";
        setEditMode(false);
        const res = await permissionsService.updatePermission(id, update);
        if (!res.ok) {
            notificate("Разрешение успешно создано", "error");
        }
    }

    const handleEnterDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { 
            savePermission(permission?.id ?? null);
        }
    };

    const actions: IKebabAction[] = [];
    actions.push({
        title: "Изменить",
        func: () => {
            setEditMode(!editMode)
        },
        icon: "pen"
    })

    return (
        <div className="permission-item" key={permission?.id}>
            {editMode ? (
                <>
                    <input
                        ref={inputRef}
                        id="permissionName"
                        className='permission-name'
                        type="text"
                        required
                        value={permissionName}
                        onChange={(e) => setPermissionName(e.target.value)}
                        onKeyDown={handleEnterDown}
                    />
                    <input
                        id="permissionComment"
                        type="text"
                        className="permission-comment"
                        required
                        value={permissionComment}
                        placeholder='Введите комментарий к разрешению'
                        onChange={(e) => setPermissionComment(e.target.value)}
                        onKeyDown={handleEnterDown}
                    />
                </>
            ) : (
                <>
                    <span>{permissionName}</span>
                    <div className="permission-comment">{permissionComment}</div>
                </>
            )}
            {(selectedRole && !editMode) && (
                <label className="switch perm-toggler">
                    <input 
                        type="checkbox"
                        checked={checkedPermissions?.some(p => p.id === permission?.id)}
                        onChange={(e) => changeRolePerms(permission, e.target.checked)}
                    />
                    <span className="slider">
                        <i className="fa-solid fa-check" style={{color: 'lightgreen'}}></i>
                        <i className="fa-solid fa-xmark" style={{color: 'rgb(184, 94, 94)'}}></i>
                    </span>
                </label>
            )}
            <ActionMenu actions={actions}/>
        </div>
    );
};

export default PermissionItem;
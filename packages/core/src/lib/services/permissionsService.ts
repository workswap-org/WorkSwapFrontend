import { IPermission, IPermissionUpdate } from '../types';
import { apiFetchJson, apiFetch } from './utils/apiClient';

export const permissionsService = {
    getAllRoles: () => apiFetchJson('/permission/roles'),
    getAllPermissions: () => apiFetchJson('/permission'),
    getRolePermissions: (roleId: number) => apiFetchJson(`/permission/${roleId}/get`),

    createPermission: (permissionName: string) => apiFetchJson(`/permission`, { method: "POST" }, {permissionName}),
    createRole: (roleName: string) => apiFetchJson(`/permission/role`, { method: "POST" }, {roleName}),
    updateRolePermissions: (roleId: number, update: IPermissionUpdate) => apiFetch(`/permission/${roleId}/role`, { method: 'PATCH' }, update),
    updatePermission: (permId: number, update: IPermission) => apiFetch(`/permission/${permId}`, {method: "PATCH"}, update),
}
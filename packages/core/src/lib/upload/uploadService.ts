import { apiFetchText } from '../common/utils/apiClient';

export const uploadService = {
    uploadAvatar: (formData: FormData) =>
        apiFetchText(`/cloud/avatar`, {
            method: "POST",
            body: formData
        }, {})
}
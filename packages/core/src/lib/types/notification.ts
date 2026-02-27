interface IPopupNotification {
    id: number;
    message: string;
    type: string;
}

interface INotification {
    id: number;
    recipientId: number;
    read: boolean;
    title: string;
    content: string;
    link: string;
    type: string;
    importance: string;
    createdAt: string;
}
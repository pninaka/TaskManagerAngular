export interface TaskItem {
    id: number;
    title: string;
    description: string;
    type: number;
    assignedUserId: number;
    assignedUserName: string;
    currentStatus: number;
    statusName : string;
    isClosed: boolean;
    customDataJson?: string;
    customData?: string;
}

export interface StatusDefinition {
  statusId: number;
  statusName: string;
  taskTypeId: number;
}
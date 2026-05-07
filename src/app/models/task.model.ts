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
    //customData?: Record<string, any>;
}

export interface StatusDefinition {
  statusId: number;
  statusName: string;
  taskTypeId: number;
}
// database table: user_task
// entity class: Task

export class Task {
    task_id: number;
    task_creator: number;
    task_create_time: Date;
 
    task_name: string;
    task_description: string;

    task_type: boolean;
    task_priority: number;
    task_ddl: Date;
    task_group_id: number;

    task_note: string;
    task_isfavorite: boolean;
    task_folder_id: number;
    task_status: number;
    subtasks_count: number;
    subtasks: SubTask[];
    

    constructor(task_id: number, task_creator: number, task_create_time: Date, task_name: string, task_description: string, task_type: boolean, task_priority: number, task_ddl: Date, task_group_id: number, task_note: string, task_isfavorite: boolean, task_folder_id: number, task_status: number) {
        this.task_id = task_id;
        this.task_creator = task_creator;
        this.task_create_time = task_create_time;
        this.task_name = task_name;
        this.task_description = task_description;
        this.task_type = task_type;
        this.task_priority = task_priority;
        this.task_ddl = task_ddl;
        this.task_group_id = task_group_id;
        this.task_note = task_note;
        this.task_isfavorite = task_isfavorite;
        this.task_folder_id = task_folder_id;
        this.task_status = task_status;
        this.subtasks_count = 0;
        this.subtasks = [];
    }

    // Two constructors for personal task and group task

    // TODO: add group task constructor
    // constructor


    // TODO: add personal task constructor
    // constructor

    
}

// subtask
export class SubTask {
    subtask_task_id: number;
    subtask_id: number;
    subtask_name: string;
    subtask_description: string;
    subtask_status: number;

    constructor(subtask_id: number, subtask_name: string, subtask_description: string, subtask_status: number, subtask_task_id: number) {
        this.subtask_id = subtask_id;
        this.subtask_name = subtask_name;
        this.subtask_description = subtask_description;
        this.subtask_status = subtask_status;
        this.subtask_task_id = subtask_task_id;
    }
}

module.exports = { Task, SubTask };
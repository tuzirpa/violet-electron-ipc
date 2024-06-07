export class FlowCommand {
    /**
     * 命令ID
     */
    id: string;
    /**
     * 命令类型
     */
    type: 'flowControl' | 'executeTask';
    /**
     * 动作类型
     */
    action: 'start' | 'stop' | 'pause' | 'resume' | undefined;
    /**
     * 任务内容
     */
    task: string;

    constructor(id: string, type: 'flowControl' | 'executeTask', task: string) {
        this.id = id;
        this.type = type;
        this.task = task;
    }

    static newTask(id: string, taskCode: string): FlowCommand {
        return new FlowCommand(id, 'executeTask', taskCode);
    }
}

export default FlowCommand;

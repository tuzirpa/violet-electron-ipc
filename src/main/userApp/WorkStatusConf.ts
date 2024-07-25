export type WorkStatus = {
    /**
     * 打开的流程
     */
    openedFlows: string[];
    /**
     * 当前激活的流程
     */
    activeFlow: string;
};

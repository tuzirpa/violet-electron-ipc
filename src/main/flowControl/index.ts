import { uuid } from '@shared/Utils';
import { FlowControl } from './FlowControl';

export function startFlowControl() {
    const flowControl = new FlowControl(uuid());
    return flowControl.id;
}

export async function executeStep(id: string, jsCode: DirectiveTree) {
    const flowControl = FlowControl.get(id);
    if (!flowControl) {
        throw new Error(`控制流程不存在，请重新启动流程`);
    }
    const result = await flowControl.executeTask(jsCode);
    if (result.res === 'error') {
    }
    return flowControl.executeTask(jsCode);
}

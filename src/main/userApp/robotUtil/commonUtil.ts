import { Block, DirectiveInput, LogLevel } from '../types';

export const olog = console.log;
export const sendLog = (level: LogLevel = 'info', message: string, data: Block, error?: Error) => {
    olog(
        `robotUtilLog-` +
            `${encodeURIComponent(JSON.stringify({ level, time: Date.now(), message, data, error }))}`
    );
};

export const sendStepLog = (message: string) => {
    olog(`robotUtilRunStep-` + `${encodeURIComponent(message)}`);
};

export function typeToCode(inputItem: DirectiveInput) {
    if (inputItem.type === 'string') {
        return `String(\`${inputItem.value}\`)`;
    } else if (inputItem.type === 'number') {
        return `Number(String(\`${inputItem.value}\`))`;
    } else if (inputItem.type === 'boolean') {
        return `String(\`${inputItem.value}\`).toLowerCase() == 'true'`;
    }
    return '';
}

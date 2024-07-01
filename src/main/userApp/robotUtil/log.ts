import { Block, LogLevel } from '../types';

const olog = console.log;
export const sendLog = (level: LogLevel = 'info', message: string, data: Block, error?: Error) => {
    olog(
        `robotUtilLog-` +
            `${encodeURIComponent(JSON.stringify({ level, time: Date.now(), message, data, error }))}`
    );
};

export const sendStepLog = (message: string) => {
    olog(`robotUtilRunStep-` + `${encodeURIComponent(message)}`);
};

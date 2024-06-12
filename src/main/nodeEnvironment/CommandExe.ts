import { spawn } from 'child_process';

export class CommandExe {
    constructor() {}

    execute(command: string): void {
        console.log(`Executing command: ${command}`);
    }
}

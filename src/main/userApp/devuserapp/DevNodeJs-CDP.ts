import CDP from 'chrome-remote-interface';

export class DevNodeJs {
    constructor(public url: string) {
        this.start();
    }

    async start() {
        const client = await CDP({
            target: this.url
        });

        client.on('event', (event) => {
            console.log(event, 'event');
        });

        const { Debugger, Runtime } = client;

        Runtime.executionContextCreated((context) => {
            console.log('executionContextCreated', context);
        });

        Debugger.scriptParsed((event) => {
            console.log('Script parsed:', event.embedderName, event.scriptId);

            // // 设置断点在指定行
            // Debugger.setBreakpoint({ location: {
            //     lineNumber: 10,
            //     columnNumber: 0,
            //     scriptId: ''
            // } });
        });
        Debugger.paused((event) => {
            console.log('Paused in debugger!');
            console.log(event);
        });
        Debugger.resumed((event) => {
            console.log('Resumed in debugger!');
            console.log(event);
        });
        await Debugger.enable();
        await Runtime.enable();
    }
}

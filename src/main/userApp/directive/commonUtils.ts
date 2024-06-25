import child_process from 'child_process';

function regQueryExeCutablePath(regPath: string) {
    return new Promise<string>((resolve, reject) => {
        child_process.exec(`REG QUERY "${regPath}"`, function (error, stdout, stderr) {
            if (error != null) {
                reject(error);
                return;
            }
            const exePath = stdout.substring(stdout.indexOf('REG_SZ') + 6, stdout.indexOf(','));
            const ep = exePath.trim().replace(/\\/g, '/');
            resolve(ep);
        });
    });
}

export async function getExeCutablePath(type: string) {
    //读取注册表获取浏览器路径
    let path = '';
    switch (type) {
        case 'chrome':
            //读取windows注册表 HKEY_LOCAL_MACHINE\SOFTWARE\Clients\StartMenuInternet\Google Chrome\DefaultIcon
            path = await regQueryExeCutablePath(
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Google Chrome\\DefaultIcon'
            );
            break;
        case 'edge':
            //HKEY_LOCAL_MACHINE\SOFTWARE\Clients\StartMenuInternet\Microsoft Edge\DefaultIcon
            path = await regQueryExeCutablePath(
                'HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\Microsoft Edge\\DefaultIcon'
            );
            break;
        default:
            break;
    }
    return path;
}

// import { getAvailablePort } from '../../utils/portUtils';
import { ApiServer } from './ApiServer';

/**
 * 启动API服务器
 * @param port 端口
 * @returns
 */
export default async function startApiServer() {
    // const port = await getAvailablePort();
    const port = 4046;
    const server = new ApiServer(port);
    server.start();
    return server;
}

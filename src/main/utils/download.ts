import fetch from 'node-fetch';
import fs, { createWriteStream } from 'fs';

type ProgressRes = {
    /**
     * 已下载字节数
     */
    downloadedBytes: number;
    /**
     * 剩余字节数
     */
    remainingBytes: number;
    /**
     * 总字节数
     */
    totalBytes: number;
    /**
     * 速度（单位：KB/秒）
     */
    speed: number;
    /**
     * 百分比
     */
    percentage: number;
    /**
     * 耗时（单位：ms）
     */
    timeConsuming: number;
};

export async function downloadFileWithResume(
    url: string,
    outputPath: string,
    progressCallback?: ({ downloadedBytes, remainingBytes, totalBytes }: ProgressRes) => void
) {
    let startByte = 0;
    let downloadedBytes = 0;

    let startTime = Date.now();
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download file, status ${response.status}`);
    }

    if (progressCallback) {
        const totalBytes = parseInt(response.headers.get('content-length') || '0', 10);
        const remainingBytes = totalBytes - startByte;

        response.body.on('data', (chunk: any) => {
            downloadedBytes += chunk.length;
            const timeConsuming = Date.now() - startTime;
            const percentage = (downloadedBytes / totalBytes) * 100;
            const speed = downloadedBytes / timeConsuming / 1024;
            progressCallback({
                downloadedBytes,
                remainingBytes,
                totalBytes,
                speed,
                percentage,
                timeConsuming
            });
        });
    }

    const fileStream = createWriteStream(outputPath);
    const pipelinePromise = new Promise<void>((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
    });

    try {
        await pipelinePromise;
        console.log(`File downloaded to ${outputPath}`);
    } catch (error) {
        fs.unlinkSync(outputPath);
        console.error('Error downloading file:', error);
    }
}

/* // 使用示例
const fileUrl = 'https://registry.npmmirror.com/-/binary/node/v18.20.3/node-v18.20.3-win-x86.zip';
const outputPath = 'downloaded_file.txt';

function progressCallback(progressRes: ProgressRes) {
    const percentage = (progressRes.downloadedBytes / progressRes.totalBytes) * 100;
    console.log(
        `Downloaded ${progressRes.downloadedBytes} bytes of ${progressRes.totalBytes} (${percentage.toFixed(2)}%)`
    );
}

downloadFileWithResume(fileUrl, outputPath, progressCallback);
 */

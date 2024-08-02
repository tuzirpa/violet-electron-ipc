import { Request } from '../Request';

export type SystemDirectiveVersion = {
    id: string;
    fileName: string;
    description: string;
    version: string;
    status: number;
    localHas: boolean;
    downloadProgress: number;
};

export const getAllVersions = async (): Promise<SystemDirectiveVersion[]> => {
    const res = await Request.post('/systemDirectivePackage/0/getAllVersions');
    return res.data;
};

export const getDirectivePackageDownloadUrl = async (id: string) => {
    const res = await Request.post('/systemDirectivePackage/0/getDirectivePackageDownloadUrl', {
        id
    });
    return res.data;
};

export const addSystemDirectivePackage = async (params: {
    fileName: string;
    description: string;
    diretivePackageVersion: string;
}) => {
    const res = await Request.post('/systemDirectivePackage/addSystemDirectivePackage', params);
    return res.data;
};

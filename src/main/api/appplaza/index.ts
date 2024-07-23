import { Request } from '../Request';

export const appPlazaAdd = async ({ fileUrl, appInfo }) => {
    const res = await Request.post('/appPlaza/add', { fileUrl, appInfo });
    return res.data;
};

export const getPlazas = async () => {
    const res = await Request.post('/appPlaza/all', {});
    return res.data;
};

export const getDownloadUrl = async (id: string) => {
    const res = await Request.post('/appPlaza/getDownloadUrl', { id });
    return res.data;
};

import { Request } from '../Request';

export const submitFeedback = async ({ content }) => {
    const res = await Request.post('/feedback/submit', { content });
    return res.data;
};

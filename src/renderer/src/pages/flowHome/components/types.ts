import { DirectiveTree } from 'src/main/userApp/types';

// 添加逻辑
export type DirectiveData = DirectiveTree & {
    foldDesc?: string;
    pdLvn: number;
    commentShow?: string;
    error?: string;
};

export type OpenFile = {
    name: string;
    filePath: string;
    historys: { saveName: string; data: any[] }[];
    curHistoryIndex: number;
    blocks: DirectiveData[];
};

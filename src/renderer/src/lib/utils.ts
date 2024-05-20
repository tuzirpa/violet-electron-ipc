import { ElMessageBox } from 'element-plus';

/**
 * 选择文件
 * @param accept 选择文件的类型
 * @param multiple 是否多选
 */
export function selectFile(accept: string = '*/*', multiple = false): Promise<File[]> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        input.onchange = () => {
            if (input.files && input.files.length > 0) {
                const files = [...input.files].map((file) => file);
                resolve(files);
            } else {
                resolve([]);
            }
        };
        input.click();
    });
}
/**
 * 选择图片
 */
export function selectImage() {
    return selectFile('image/*');
}

/**
 * 弹出输入框
 */
export function uPrompt(message: string, defaultValue = '', inputPlaceholder = '请输入内容') {
    return ElMessageBox.prompt(message, {
        inputPlaceholder,
        inputType: 'text',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: defaultValue
    });
}

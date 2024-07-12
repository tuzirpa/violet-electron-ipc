import { DirectiveTree } from '@main/userApp/types';

const modules: { [key: string]: { default: DirectiveTree } } = import.meta.glob(
    './directives/*.ts',
    {
        eager: true
    }
);

const directive: DirectiveTree = {
    name: '',
    sort: 3,
    displayName: '元素操作',
    icon: 'icon-gugeliulanqi',
    children: [],
    inputs: {},
    outputs: {}
};

for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
        const module = modules[key];
        directive.children?.push(module.default);
    }
}

export default directive;

import { DirectiveTree } from '../../types';

const modules: { [key: string]: { default: DirectiveTree } } = import.meta.glob(
    './directives/*.ts',
    {
        eager: true
    }
);

const directives: DirectiveTree = {
    name: '',
    sort: 1,
    displayName: '数据操作',
    icon: 'icon-shujuchuli',
    children: [],
    inputs: {},
    outputs: {}
};

for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
        const module = modules[key];
        directives.children?.push(module.default);
    }
}

directives.children?.sort((a, b) => {
    const asort = a.sort || 0;
    const bsort = b.sort || 0;
    return bsort - asort;
});

export default directives;

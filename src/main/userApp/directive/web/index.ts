import { DirectiveTree } from '../../types';

const modules: { [key: string]: { default: DirectiveTree } } = import.meta.glob(
    './directives/*.ts',
    {
        eager: true
    }
);

const web: DirectiveTree = {
    name: '',
    sort: 2,
    displayName: '浏览器操作',
    icon: 'icon-gugeliulanqi',
    children: [],
    inputs: {},
    outputs: {}
};

for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
        const module = modules[key];
        web.children?.push(module.default);
    }
}
web.children?.sort((a, b) => {
    const asort = a.sort || 0;
    const bsort = b.sort || 0;
    return asort - bsort;
});

export default web;

import { DirectiveTree } from '../../types';

const modules: { [key: string]: { default: DirectiveTree } } = import.meta.glob(
    './directives/*.ts',
    {
        eager: true
    }
);

const web: DirectiveTree = {
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
        web.children?.push(module.default);
    }
}

export default web;

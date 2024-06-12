import { DirectiveTree } from '../types';

export interface DirectiveConvert {
    convert(directive: DirectiveTree): string;
    match(directiveName: string): boolean;
}

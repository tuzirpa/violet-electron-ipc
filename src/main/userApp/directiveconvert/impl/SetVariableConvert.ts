import { DirectiveTree } from '../../types';
import { BaseConvert } from '../BaseConvert';

export class SetVariableConvert extends BaseConvert {
    /**
     * inputs: {
        varType: {
            name: '变量类型',
            value: 'text',
            display: '',
            type: 'string'
        },
        varValue: {
            name: '变量值',
            value: '',
            type: 'string'
        }
    },
    outputs: {
        varName: {
            name: 'variable',
            required: true,
            type: 'string',
            display: '变量名'
        }
    }
     */
    convert(_directive: DirectiveTree): string {
        const name = _directive.outputs.varName.name;
        const value = _directive.inputs.varValue;
        const varTypeType = _directive.inputs.varType.value;
        if (varTypeType === 'number') {
            return `variables.var_${name} = Number(${this.typeToCode(value)});`;
        } else {
            return `variables.var_${name} = ${this.typeToCode(value)};`;
        }
    }
    match(divrctiveName: string): boolean {
        return divrctiveName === 'setVariable';
    }
}

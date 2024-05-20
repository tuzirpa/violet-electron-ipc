export default class MethodsUtils {
    // 使用反射获取类的静态方法列表
    static getStaticMethods<T>(classType: { new (): T }): { name: string; method: Function }[] {
        const staticMethods: { name: string; method: Function }[] = [];
        // 获取类的所有属性
        for (const methodName of Object.getOwnPropertyNames(classType)) {
            if (
                typeof classType[methodName] === 'function' &&
                classType[methodName].prototype === undefined
            ) {
                staticMethods.push({ name: methodName, method: classType[methodName] });
            }
        }
        return staticMethods;
    }
}

import ClassDetails from "./ClassDetails";
import Helpers from "./Helpers";
import NamespaceDetails from "./NamespaceDetails";

export default class FunctionDetails {
    public name: string = "";
    public before: string = "";
    public after: string = "";
    public template: string = "";
    public arguments: string = "";
    public class:ClassDetails|null = null;
    public namespace:NamespaceDetails|null = null;
    public start: number = -1;
    public end: number = -1;
    public previouses: FunctionDetails[] = [];

    /**
     * Get Implementation code
     *
     * @param snippet
     * @returns string
     */
    public generteImplementation(snippet: boolean = false): string
    {
        let out = "";
        let before = this.before;
        before = before.replace(/(virtual|static|explicit)\s*/, '');
        let after = this.after;
        after = after.replace(/(override|final)\s*/g, '');
        if (this.class && this.class.getTemplateParametersNested().length > 0) {
            out += 'template<' + this.class?.getTemplateParametersNested().join(', ') + '>\n';
        }
        if (this.template.length > 0 ) {
            out += 'template<' + this.getTemplateParameters() + '>\n';
        }
        out += before + (before.length > 0 ? ' ' : '');
        if (this.class) {
            out += this.class.getNestedName() + '::';
        }
        out += this.name + '(' + this.arguments + ') ' + after + '\n{\n' + (snippet ? Helpers.spacer() + '${0}' : '') + '\n}';
        return out;
    }

    /**
     * Template parameter names only.
     */
    public getTemplateNames(): string {
        return Helpers.templateNames(this.template).join(', ');
    }

    /**
     * Template parameters including parameter type.
     */
    public getTemplateParameters(): string {
        return Helpers.templateParameters(this.template).join(', ');
    }

    /**
     * Get namespace of function.
     */
    public getNamespace(): NamespaceDetails|null {
        if (this.class) {
            return this.class.namespace;
        }
        return this.namespace;
    }

    /**
     * parse function at a position.
     */
    public static parsePosition(source:string, position: number, withPreviouses: boolean = false) : FunctionDetails|null {
        let result:FunctionDetails = new FunctionDetails, previouses: FunctionDetails[] = [];
        let templateRegex = "((template\\s*<([\\w\\d_\\,\\s]+)>)[\\s\\r\\n]*)?";
        let returnTypeRegex = "(([\\w_][\\w\\d<>_\\[\\]]*\\s+)*[\\w_][\\w\\d<>_\\[\\]]*(\\**)(\\&{1,2})?)?";
        let funcRegex = "((operator\\s*.+)|(~?[\\w_][\\w\\d_]*))";
        let funcParamsRegex = "\\((.*)\\)";
        let afterParamsRegex = "(.*)\\;";
        let classRegex = "(class|struct)\\s+([\\w\\d_\\(\\)]+\\s+)*([\\w_][\\w\\d_]*)\\s*(\:[\\s\\S]+)?\\s*{";
        let classContentRegex = Helpers.scopeRegex;

        let funcRegexStr = templateRegex + returnTypeRegex + '\\s+' + funcRegex + '\\s*' + funcParamsRegex + '\\s*' + afterParamsRegex;
        let regex = new RegExp(funcRegexStr, 'gm');
        let match = null, match2 = null;
        while (match = regex.exec(source)) {
            let funcDetails = new FunctionDetails;
            funcDetails.template = match[2] ? match[2] : "";
            funcDetails.name = match[8];
            funcDetails.arguments = match[11] ? match[11] : "";
            funcDetails.before = match[4] ? match[4] : "";
            funcDetails.after = match[12] ? match[12] : "";
            funcDetails.start = match.index;
            funcDetails.end = match.index + match[0].length;
            if (position >= match.index && position < match.index + match[0].length) {
                result = funcDetails;
                break;
            } else {
                previouses.push(funcDetails);
            }
        }

        if (result.name.length > 0) {
            regex = new RegExp(templateRegex + classRegex, 'gm');
            while (match = regex.exec(source)) {
                let regex2 = new RegExp(classContentRegex, 'gm');
                if (match2 = regex2.exec(source.substr(match.index + match[0].length - 1))) {
                    if (position >= match[0].length + match.index && position < match[0].length + match.index + match2[0].length) {
                        let parentClass = null;
                        if (result.class !== null) {
                            parentClass = result.class;
                        }
                        result.class = new ClassDetails;
                        result.class.start = match.index;
                        result.class.end = match.index + match[0].length + match2[0].length;
                        result.class.name = match[6];
                        result.class.template = match[2] ? match[2] : '';
                        if (parentClass) {
                            if (!(parentClass.start < result.class.start && parentClass.end > result.class.end)) {
                                [result.class, parentClass] = [parentClass, result.class];
                            }
                            result.class.parent = parentClass;
                        }
                    }
                }
            }

            let namespaceHolder: FunctionDetails | ClassDetails = result;
            if (result.class) {
                namespaceHolder = result.class;
            }
            regex = new RegExp(NamespaceDetails.namespaceRegex(), 'gm');
            while (match = regex.exec(source)) {
                let regex2 = new RegExp(NamespaceDetails.namespaceContentRegex(), 'gm');
                if (match2 = regex2.exec(source.substr(match.index + match[0].length))) {
                    if (position >= match[0].length + match.index && position < match[0].length + match.index + match2[0].length) {
                        let parentNamespace = null;
                        if (namespaceHolder.namespace !== null) {
                            parentNamespace = namespaceHolder.namespace;
                        }
                        namespaceHolder.namespace = new NamespaceDetails;
                        namespaceHolder.namespace.start = match.index;
                        namespaceHolder.namespace.end = match.index + match[0].length + match2[0].length;
                        namespaceHolder.namespace.name = match[1];
                        if (parentNamespace) {
                            if (!(parentNamespace.start < namespaceHolder.namespace.start && parentNamespace.end > namespaceHolder.namespace.end)) {
                                [namespaceHolder.namespace, parentNamespace] = [parentNamespace, namespaceHolder.namespace];
                            }
                            namespaceHolder.namespace.parent = parentNamespace;
                        }
                    }
                }
            }

            if (previouses.length > 0 && withPreviouses) {
                for (let i in previouses) {
                    let previous: FunctionDetails|null = previouses[i];
                    previous = this.parsePosition(source, previous.start + 1);
                    if (
                        previous &&
                        ((previous.class === null && result.class === null) || (previous.class && result.class && previous?.class.getNestedName() === result.class.getNestedName())) &&
                        ((previous.getNamespace() === null && result.getNamespace() === null) || (previous.getNamespace() && result.getNamespace() && previous.getNamespace()?.fullname() === result.getNamespace()?.fullname()))
                    ) {
                        result.previouses.push(previous);
                    }
                }
            }
        }
        return result.name.length > 0 ? result : null;
    }
}

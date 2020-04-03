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
     * @param includeBody
     * @returns string
     */
    public generteImplementation(snippet: boolean = false, includeBody: boolean = true): string
    {
        let out = "";
        let before = this.before;
        before = before.replace(/(virtual|static|explicit)\s*/, '');
        let after = this.after;
        after = after.replace(/(override|final)\s*/g, '');
        if (this.class && this.class.getTemplateParametersNested().length > 0) {
            out += 'template<' + Helpers.removeArgumentDefault(this.class?.getTemplateParametersNested().join(', ')) + '>\n';
        }
        if (this.template.length > 0 ) {
            out += 'template<' + Helpers.removeArgumentDefault(this.getTemplateParameters()) + '>\n';
        }
        out += before + (before.length > 0 ? ' ' : '');
        if (this.class) {
            out += this.class.getNestedName() + '::';
        }
        out += this.name + '(' + Helpers.removeArgumentDefault(this.arguments) + ') ' + after;
        if (includeBody) {
            out += '\n{\n' + (snippet ? Helpers.spacer() + '${0}' : '') + '\n}';
        }
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
     * Parse functions
     *
     * @param source
     */
    public static parseFunctions(source:string) : Array<FunctionDetails> {
        let result:FunctionDetails[] = [];
        let templateRegex = Helpers.templateRegex;
        let returnTypeRegex = "(([\\w_][\\w\\d<>_\\[\\]]*\\s+)*([\\w_][\\w\\d<>_\\[\\]\\(\\)\\.]*|::)+(\\s+|(\\s*((\\*+)|(\\&{1,2})|(\\*+)(\\&{1,2}))\\s*)))?";
        let funcRegex = "((operator\\s*([^\\(]|\\(\\))+)|(~?[\\w_][\\w\\d_]*))";
        let funcParamsRegex = "\\((.*)\\)";
        let afterParamsRegex = "(.*)\\;";

        let funcRegexStr = templateRegex + returnTypeRegex + '\\s*' + funcRegex + '\\s*' + funcParamsRegex + '\\s*' + afterParamsRegex;
        let regex = new RegExp(funcRegexStr, 'gm');
        let match = null, match2 = null;
        while (match = regex.exec(source)) {
            let funcDetails = new FunctionDetails;
            funcDetails.template = match[2] ? match[2] : "";
            funcDetails.name = match[14];
            funcDetails.arguments = match[18] ? match[18] : "";
            funcDetails.before = match[4] ? match[4].trim() : "";
            funcDetails.after = match[19] ? match[19] : "";
            funcDetails.start = match.index;
            funcDetails.end = match.index + match[0].length;
            result.push(funcDetails);
        }
        return result;
    }
}

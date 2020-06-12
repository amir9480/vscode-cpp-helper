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
        let isMemberFunction = this.before.indexOf('friend') === -1;
        before = before.replace(/(virtual|static|explicit|friend)\s*/, '');
        let after = this.after;
        after = after.replace(/(override|final)\s*/g, '');
        if (this.class && isMemberFunction && this.class.getTemplateParametersNested().length > 0) {
            out += 'template<' + Helpers.removeArgumentDefault(this.class?.getTemplateParametersNested().join(', ')) + '>\n';
        }
        if (this.template.length > 0 ) {
            out += 'template<' + Helpers.removeArgumentDefault(this.getTemplateParameters()) + '>\n';
        }
        out += before + (before.length > 0 ? ' ' : '');
        if (this.class && isMemberFunction) {
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
        source = source.replace(/\/\/[^\n^\r]+/g, function (mat) {
            return '/'.repeat(mat.length);
        });
        let result:FunctionDetails[] = [];
        let templateRegex = Helpers.templateRegex;
        let returnTypeRegex = "((([\\w_][\\w\\d<>_\\[\\]\\.:\,]*\\s+)*[\\w_][\\w\\d<>_\\[\\]\\(\\)\\.:\,]*)(\\**\\&{0,2}))?";
        let funcRegex = "((\\**\\&{0,2})((operator\\s*([^\\(]|\\(\\))+)|(~?[\\w_][\\w\\d_]*)))";
        let funcParamsRegex = "\\((([^\\)]*)|(.+\\([^\\)]*\\).+))\\)";
        let afterParamsRegex = "([^;^)]*)\\;";

        let funcRegexStr = templateRegex + returnTypeRegex + '\\s+' + funcRegex + '\\s*' + funcParamsRegex + '\\s*' + afterParamsRegex;
        let regex = new RegExp(funcRegexStr, 'gm');
        let match = null, match2 = null;
        while (match = regex.exec(source)) {
            let funcDetails = new FunctionDetails;
            funcDetails.template = match[2] ? match[2] : "";
            funcDetails.name = match[10];
            funcDetails.arguments = match[14] ? match[14] : "";
            funcDetails.before = ((match[5] ? match[5].trim() : "") + (match[7] ? match[7].trim() : "") + (match[9] ? match[9].trim() : "")).replace(/(public|private|protected)\s*:\s*/, '');
            funcDetails.after = match[17] ? match[17] : "";
            funcDetails.start = match.index;
            funcDetails.end = match.index + match[0].length;
            result.push(funcDetails);
        }
        return result;
    }
}

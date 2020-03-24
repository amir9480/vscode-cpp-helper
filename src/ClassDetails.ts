import Helpers from "./Helpers";
import NamespaceDetails from "./NamespaceDetails";

export default class ClassDetails {
    public parent: ClassDetails | null = null;
    public namespace:NamespaceDetails|null = null;
    public template: string = "";
    public templateSpecialization: string = "";
    public name: string = "";
    public start: number = -1;
    public end: number = -1;

    /**
     * Get root parent class in nested classes.
     *
     * If has no parent then returns it self.
     *
     * @example class A { class B {} }
     * root class of B is A
     * root class of A is A
     */
    public getRootClass(): ClassDetails {
        if (this.parent) {
            return this.parent.getRootClass();
        }
        return this;
    }

    /**
     * Get nested class name.
     *
     * @example class A { class B {} }  --->  nested name of A : A::B
     */
    public getNestedName(): string {
        if (this.parent) {
            return this.parent.getNestedName() + '::' + this.name + (this.template.length > 0 ? ('<' + this.getTemplateNames() + '>') : '');
        }
        return this.name + (this.template.length > 0 ? ('<' + this.getTemplateNames() + '>') : '');
    }

    /**
     * Get template paramters including parent classes template.
     */
    public getTemplateParametersNested(): Array<string> {
        if (this.parent) {
            return this.parent.getTemplateParametersNested().concat(Helpers.templateParameters(this.template));
        }
        return Helpers.templateParameters(this.template);
    }

    /**
     * Get template parameter names only.
     */
    public getTemplateNames(): string {
        if (this.templateSpecialization.length > 0) {
            return Helpers.templateNames(this.templateSpecialization).join(', ');
        }
        return Helpers.templateNames(this.template).join(', ');
    }

    /**
     * Get template parameters including parameter types.
     */
    public getTemplateParameters(): string {
        return Helpers.templateParameters(this.template).join(', ');
    }

    /**
     * Parse classes/structs
     *
     * @param source
     */
    public static parseClasses(source: string): Array<ClassDetails> {
        let result: Array<ClassDetails> = [];
        let templateRegex = Helpers.templateRegex;
        let classRegex = "(class|struct)\\s+([\\w\\d_\\(\\)]+\\s+)*([\\w_][\\w\\d_]*)\\s*(<.*>)?\\s*(\:[^{]+)?\\s*{";
        let classContentRegex = Helpers.scopeRegex;
        let match: any, match2: any;
        let regex = new RegExp(templateRegex + classRegex, 'gm');
        while (match = regex.exec(source)) {
            let regex2 = new RegExp(classContentRegex, 'gm');
            if (match2 = regex2.exec(source.substr(match.index + match[0].length - 1))) {
                let classDetails = new ClassDetails;
                classDetails.start = match.index;
                classDetails.end = match.index + match[0].length + match2[0].length;
                classDetails.name = match[6];
                classDetails.template = match[2] ? match[2] : '';
                classDetails.templateSpecialization = match[7] ? match[7] : '';
                for (let i in result) {
                    if (result[i].start < classDetails.start && result[i].end > classDetails.end) {
                        classDetails.parent = result[i];
                    }
                }
                result.push(classDetails);
            }
        }
        return result;
    }
}

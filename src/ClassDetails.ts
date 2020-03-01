import Helpers from "./Helpers";
import NamespaceDetails from "./NamespaceDetails";

export default class ClassDetails {
    public parent: ClassDetails | null = null;
    public namespace:NamespaceDetails|null = null;
    public template: string = "";
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
            return this.parent.getNestedName() + '::' + this.name + (this.template.length > 0 ? '<' + this.getTemplateNames() + '>' : '');
        }
        return this.name + (this.template.length > 0 ? '<' + this.getTemplateNames() + '>' : '');
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
        return Helpers.templateNames(this.template).join(', ');
    }

    /**
     * Get template parameters including parameter types.
     */
    public getTemplateParameters(): string {
        return Helpers.templateParameters(this.template).join(', ');
    }
}

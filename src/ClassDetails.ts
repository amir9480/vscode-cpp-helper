import Helpers from "./Helpers";
import NamespaceDetails from "./NamespaceDetails";

export default class ClassDetails {
    public parent: ClassDetails | null = null;
    public namespace:NamespaceDetails|null = null;
    public template: string = "";
    public name: string = "";
    public start: number = -1;
    public end: number = -1;

    public getRootClass(): ClassDetails {
        if (this.parent) {
            return this.parent.getRootClass();
        }
        return this;
    }

    public getNestedName(): string {
        if (this.parent) {
            return this.parent.getNestedName() + '::' + this.name + (this.template.length > 0 ? '<' + this.getTemplateNames() + '>' : '');
        }
        return this.name + (this.template.length > 0 ? '<' + this.getTemplateNames() + '>' : '');
    }

    public getTemplateParametersNested(): Array<string> {
        if (this.parent) {
            return this.parent.getTemplateParametersNested().concat(Helpers.templateParameters(this.template));
        }
        return Helpers.templateParameters(this.template);
    }

    public getTemplateNames(): string {
        return Helpers.templateNames(this.template).join(', ');
    }

    public getTemplateParameters(): string {
        return Helpers.templateParameters(this.template).join(', ');
    }
}

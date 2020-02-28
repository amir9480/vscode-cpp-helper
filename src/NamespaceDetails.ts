import Helpers from "./Helpers";

export default class NamespaceDetails {
    public parent: NamespaceDetails | null = null;
    public name: string = "";
    public start: number = -1;
    public end: number = -1;

    public generateCode(): string {
        let result = "";
        let namespaceNames = this.namespaceNames();
        for (let i in namespaceNames) {
            result += Helpers.indent("namespace " + namespaceNames[i] + "\n{\n", Number(i));
        }
        for (let i in namespaceNames) {
            result += Helpers.indent("}\n", namespaceNames.length - Number(i) - 1);
        }
        return result;
    }

    public fullname(): string {
        return this.namespaceNames().join('::');
    }

    public namespaceNames(): Array<string> {
        if (this.parent) {
            return this.parent.namespaceNames().concat([this.name]);
        }
        return [this.name];
    }

    static namespaceRegex(): string {
        return "namespace\\s+([\\w_][\\w\\d_]*)";
    }

    static namespaceContentRegex(): string {
        let namespaceContentRegex = "\\s*\\{([^\\{\\}]|(?R))*\\}";
        for (let i = 0; i < 5; i++) {
            namespaceContentRegex = namespaceContentRegex.replace("?R", namespaceContentRegex);
        }
        namespaceContentRegex = namespaceContentRegex.replace("|(?R)", "");
        return namespaceContentRegex;
    }

    public static parseNamespaces(source: string): Array<NamespaceDetails> {
        let result: Array<NamespaceDetails> = [];
        let namespaceRegex = this.namespaceRegex();
        let namespaceContentRegex = this.namespaceContentRegex();
        let match: any, match2: any;
        let regex = new RegExp(namespaceRegex, 'gm');
        while (match = regex.exec(source)) {
            let regex2 = new RegExp(namespaceContentRegex, 'gm');
            if (match2 = regex2.exec(source.substr(match.index + match[0].length))) {
                let namespace = new NamespaceDetails;
                namespace.start = match.index;
                namespace.end = match.index + match[0].length + match2[0].length;
                namespace.name = match[1];
                for (let i in result) {
                    if (result[i].start < namespace.start && result[i].end > namespace.end) {
                        namespace.parent = result[i];
                    }
                }
                result.push(namespace);
            }
        }
        return result;
    }
}

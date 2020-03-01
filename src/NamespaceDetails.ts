import Helpers from "./Helpers";

export default class NamespaceDetails {
    public parent: NamespaceDetails | null = null;
    public name: string = "";
    public start: number = -1;
    public end: number = -1;

    /**
     * Generate code for namespace.
     */
    public generateCode(): string {
        let result = "";
        let namespaceNames = this.namespaceNames();
        for (let i in namespaceNames) {
            result += Helpers.indent("\nnamespace " + namespaceNames[i] + "\n{", Number(i));
        }
        for (let i in namespaceNames) {
            result += Helpers.indent("}\n", namespaceNames.length - Number(i) - 1);
        }
        return result;
    }

    /**
     * Name including parent namespace name.
     * using for comparison two namespaces.
     */
    public fullname(): string {
        return this.namespaceNames().join('::');
    }

    /**
     * Array of namespace parents and it self.
     */
    public namespaceNames(): Array<string> {
        if (this.parent) {
            return this.parent.namespaceNames().concat([this.name]);
        }
        return [this.name];
    }

    /**
     * Regex to detect namespaces.
     */
    static namespaceRegex(): string {
        return "namespace\\s+([\\w_][\\w\\d_]*)";
    }

    /**
     * Namespace to detect namespace scope.
     */
    static namespaceContentRegex(): string {
        let namespaceContentRegex = "\\s*\\{([^\\{\\}]|(?R))*\\}";
        for (let i = 0; i < 5; i++) {
            namespaceContentRegex = namespaceContentRegex.replace("?R", namespaceContentRegex);
        }
        namespaceContentRegex = namespaceContentRegex.replace("|(?R)", "");
        return namespaceContentRegex;
    }

    /**
     * Parse name
     *
     * @param source
     */
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

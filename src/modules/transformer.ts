import JSZip from "jszip";

export class Transformer {
  file: File | string;

  constructor(file: File | string) {
    this.file = file;
  }

  private toSnakeCase(str: string): string {
    const result: string = str.replace(
      /[A-Z]/g,
      (letter) => `${letter.toLowerCase()}`
    );
    return result.split(" ").join("_").toLowerCase();
  }

  private parseXML(xml: string): Document {
    const parser: DOMParser = new DOMParser();
    return parser.parseFromString(xml, "application/xml");
  }

  private getGameSystemName(xmlDom: XMLDocument): string {
    const roster: HTMLElement = xmlDom.querySelector("roster") as HTMLElement;
    return roster.getAttribute("gameSystemName") as string;
  }

  private async getStylesheet(gameSystem: string) {
    const fileName: string = this.toSnakeCase(gameSystem);

    const request = await fetch(`systems/${fileName}.xsl`);
    const resText = await request.text();
    return this.parseXML(resText);
  }

  private async unzip(): Promise<string> {
    const jszip: JSZip = new JSZip();
    const zip: JSZip = await jszip.loadAsync(this.file);
    return zip.file(/[^/]+\.ros/)[0].async("binarystring");
  }

  public async render(): Promise<{
    fragment: DocumentFragment;
    gameSystem: string;
  }> {
    let data: string;
    if (this.file.slice(0, 1) == "P") {
      data = await this.unzip();
    } else {
      data = this.file as string;
    }

    const xmlDom: Document = this.parseXML(data);
    const gameSystem: string = this.getGameSystemName(xmlDom);
    const xsl: Document = await this.getStylesheet(gameSystem);

    const processor: XSLTProcessor = new XSLTProcessor();
    processor.importStylesheet(xsl);
    const fragment: DocumentFragment = processor.transformToFragment(
      xmlDom,
      document
    );
    return { fragment, gameSystem };
  }
}

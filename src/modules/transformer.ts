import JSZip from "jszip";

const $wrapper = document.getElementById('wrapper') as HTMLElement
const $start: HTMLElement = document.getElementById('start') as HTMLElement
const $gameSystemContainer = document.getElementById('gameSystemContainer') as HTMLElement
const $gameSystem: HTMLElement = document.getElementById('gameSystem') as HTMLElement

export class Transformer {
  file: File | string

  constructor(file: File | string) {
    this.file = file
  }

  private toSnakeCase(str: string): string {
    const result: string = str.replace(/[A-Z]/g, letter => `${letter.toLowerCase()}`);
    return result.split(' ').join('_').toLowerCase()
  }

  private parseXML(xml:string): Document {
    const parser: DOMParser = new DOMParser()
    return parser.parseFromString(xml, 'application/xml')
  }

  private getGameSystemName(xmlDom: XMLDocument): string {
    const roster: HTMLElement = xmlDom.querySelector('roster') as HTMLElement
    const name: string = roster.getAttribute('gameSystemName') as string
    console.log('name', name)
    $gameSystem.innerText = name

    return name
  }

  private async getStylesheet(gameSystem: string) {
    const fileName: string = this.toSnakeCase(gameSystem)

    const request = await fetch(`systems/${fileName}.xsl`)
    const resText = await request.text()
    return this.parseXML(resText)
  }

  private async unzip(): Promise<string> {
    const jszip: JSZip = new JSZip()
    const zip: JSZip = await jszip.loadAsync(this.file)
    return zip.file(/[^/]+\.ros/)[0].async('binarystring')
  }

  private async loaded() {
    let data: string
    if (this.file.slice(0, 1) == 'P') {
      data = await this.unzip()
    } else {
      data = this.file as string
    }

    const xmlDom = this.parseXML(data)
    const gameSystem = this.getGameSystemName(xmlDom)
    const xsl = await this.getStylesheet(gameSystem)

    const processor: XSLTProcessor = new XSLTProcessor()
    processor.importStylesheet(xsl)
    return processor.transformToFragment(xmlDom, document)
  }

  public async render() {
    const fragment: DocumentFragment = await this.loaded()

    $start.classList.add('hidden')
    $gameSystemContainer.classList.remove('hidden')

    $wrapper.innerText = ''
    $wrapper.appendChild(fragment)
  }
}

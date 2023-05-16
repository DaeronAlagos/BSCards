import JSZip from 'jszip'

// Pure
export const lower = (str: string): string => str.toLowerCase()

export const spaceToUnderscore = (str: string): string =>
  str.split(' ').join('_')

export const parseXML = (xml: string): Document =>
  new DOMParser().parseFromString(xml, 'application/xml')

export const roster = (xmlDom: XMLDocument): HTMLElement =>
  xmlDom.querySelector('roster') as HTMLElement

export const gameSystem = (roster: HTMLElement): string =>
  roster.getAttribute('gameSystemName') as string

export const unzip = async (file: File): Promise<string> => {
  const jszip = new JSZip()
  const zip = await jszip.loadAsync(file)
  return zip.file(/[^/]+\.ros/)[0].async('binarystring')
}

export const fetchStylesheet = async (name: string) => {
  const response: Response = await fetch(`/systems/${name}.xsl`)
  const text: string = await response.text()
  if (text.startsWith('<!DOCTYPE html>')) {
    return 'not_supported'
  }
  return text
}

export const createFragment = (
  xmlDom: Document,
  xslDom: Document
): DocumentFragment => {
  const processor: XSLTProcessor = new XSLTProcessor()
  processor.importStylesheet(xslDom)
  return processor.transformToFragment(xmlDom, document)
}

// Composable
export const toSnakeCase = (str: string) => spaceToUnderscore(lower(str))

export const gameSystemName = (xmlDom: Document) => gameSystem(roster(xmlDom))

export const readData = async (data: string | File) => {
  if (data.slice(0, 1) == 'P') {
    return parseXML(await unzip(<File>data))
  }
  return parseXML(<string>data)
}

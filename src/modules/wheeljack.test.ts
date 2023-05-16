import { html, oneLineTrim } from 'common-tags'
import {
  fetchStylesheet,
  gameSystem,
  lower,
  parseXML,
  readData,
  roster,
  spaceToUnderscore,
  toSnakeCase,
  unzip,
} from './wheeljack'

// prettier-ignore
const xml: string = html`
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <roster id="fa64-927e-75b5-6d09" name="New Roster" battleScribeVersion="2.03" gameSystemId="b7a1-a7ef-bd2f-c484" gameSystemName="Stargrave" gameSystemRevision="36" xmlns="http://www.battlescribe.net/schema/rosterSchema">
  </roster>
`

const base64 = oneLineTrim`
    UEsDBBQAAAAIABtZmFZ/m/iF0AAAACIBAAAKABwAcm9zdGVyLnJvc1VUCQADNlVGZBM2RmR1eAsA
    AQToAwAABOgDAABNj0FvgzAMhe/9FZbvAUoptBWht0m79FC23Q0xNBKEKYlg/feLYJPqm+3Pz++V
    159xgJmt05ORuI8SBDbtpLTpJX5+vIkTgvNkFA2TYYlPdnitdhCqtJPzbEEriR3lmTinBYvi2BxF
    rpIzgqExXNx4gftKIjTk/cB1a3XDX/9P0yg5IPQBrp8BG9+DXlPQXlDBnWhU2ok2O2WvyG1Vrj3Z
    3tLMr6s7z3rTPeQIIZ1xEh/ef1/ieFmWaLPgVguRYR+79sEjxVuYem2w2pV/g+oXUEsBAh4DFAAA
    AAgAG1mYVn+b+IXQAAAAIgEAAAoAGAAAAAAAAQAAAKSBAAAAAHJvc3Rlci5yb3NVVAUAAzZVRmR1
    eAsAAQToAwAABOgDAABQSwUGAAAAAAEAAQBQAAAAFAEAAAAA
    `
const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
const fakeFile = new File([arrayBuffer], 'roster.rosz', {
  type: 'application/zip',
})

// prettier-ignore
// const xsl: string = html`
// <xsl:stylesheet
//   version="1.0"
//   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
//   xmlns:bs="http://www.battlescribe.net/schema/rosterSchema"
//   xmlns:exslt="http://exslt.org/common"
//   extension-element-prefixes="exslt"
// ></xsl:stylesheet>
// `

describe("lower", () => {
  it("should convert to lowercase", function () {
    expect(lower("Mixed CASE")).toBe("mixed case");
  });
});

describe('spaceToUnderscore', () => {
  it('should replace spaces with underscores', function () {
    expect(spaceToUnderscore('with spaces')).toBe('with_spaces')
  })
})

describe('parseXML', () => {
  it('should return XMLDocument from string', function () {
    expect(parseXML(xml)).toBeInstanceOf(Document)
  })
})

describe('gameSystem', () => {
  it('should return game system name from roster element', function () {
    const elem = document.createElement('roster')
    elem.setAttribute('gameSystemName', 'Stargrave')

    expect(gameSystem(elem)).toBe('Stargrave')
  })
})

describe('roster', () => {
  it('should return the roster element', function () {
    const xmlDom = new DOMParser().parseFromString(xml, 'application/xml')

    expect(roster(xmlDom)).toBeInstanceOf(Element)
  })
})

describe('unzip', () => {
  it('should return an xml string', async function () {
    expect(await unzip(fakeFile)).toBe(xml)
  })
})

describe('toSnakeCase', () => {
  it('should  returns lower cased snake string', function () {
    expect(toSnakeCase('Xenos Rampant')).toBe('xenos_rampant')
  })
})

describe('fetchStylesheet', () => {
  it('should return xsl text if exists', async function () {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('xsl string'),
      })
    ) as jest.Mock

    expect(await fetchStylesheet('game system')).toBe('xsl string')
  })

  it('should return "not_supported" if doesn\'t exist', async function () {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('<!DOCTYPE html>'),
      })
    ) as jest.Mock
    expect(await fetchStylesheet('game system')).toBe('not_supported')
  })
})

describe('readData', () => {
  it.skip('should return Document if file is zip', async function () {
    expect(await readData(fakeFile)).toBeInstanceOf(Document)
  })

  it('should return Document if file is not zip', async function () {
    expect(await readData(xml)).toBeInstanceOf(Document)
  })
})

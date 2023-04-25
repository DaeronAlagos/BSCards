import { html, oneLineTrim } from "common-tags";
import { Transformer } from './transformer'

function newTransformer() {
    const base64 = oneLineTrim`
    UEsDBBQAAAAIABtZmFZ/m/iF0AAAACIBAAAKABwAcm9zdGVyLnJvc1VUCQADNlVGZBM2RmR1eAsA
    AQToAwAABOgDAABNj0FvgzAMhe/9FZbvAUoptBWht0m79FC23Q0xNBKEKYlg/feLYJPqm+3Pz++V
    159xgJmt05ORuI8SBDbtpLTpJX5+vIkTgvNkFA2TYYlPdnitdhCqtJPzbEEriR3lmTinBYvi2BxF
    rpIzgqExXNx4gftKIjTk/cB1a3XDX/9P0yg5IPQBrp8BG9+DXlPQXlDBnWhU2ok2O2WvyG1Vrj3Z
    3tLMr6s7z3rTPeQIIZ1xEh/ef1/ieFmWaLPgVguRYR+79sEjxVuYem2w2pV/g+oXUEsBAh4DFAAA
    AAgAG1mYVn+b+IXQAAAAIgEAAAoAGAAAAAAAAQAAAKSBAAAAAHJvc3Rlci5yb3NVVAUAAzZVRmR1
    eAsAAQToAwAABOgDAABQSwUGAAAAAAEAAQBQAAAAFAEAAAAA
    `
    const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const fakeFile = new File([arrayBuffer], 'roster.rosz', {type: 'application/zip'})

    return new Transformer(fakeFile)
}
const xml: string = html`
      <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <roster id="fa64-927e-75b5-6d09" name="New Roster" battleScribeVersion="2.03" gameSystemId="b7a1-a7ef-bd2f-c484" gameSystemName="Stargrave" gameSystemRevision="36" xmlns="http://www.battlescribe.net/schema/rosterSchema">
      </roster>
    `

describe("Transformer", function() {

  it("toSnakeCase should convert string to snake case", () => {
    const tr: Transformer = newTransformer()
    const string = 'Snake Case'

    const result: string = tr['toSnakeCase'](string)

    expect(result).toBe('snake_case')
  });

  it("parseXML should return DOMParser from data", () => {
    const tr: Transformer = newTransformer()

    const result = tr['parseXML'](xml)

    expect(result).toBeInstanceOf(Document)
  });

  it("getGameSystemName should return game system name", () => {
    const tr: Transformer = newTransformer()
    const xmlDom = tr['parseXML'](xml)

    const result = tr['getGameSystemName'](xmlDom)

    expect(result).toBe('Stargrave')
  });

  it("unzip should return xml from zip file", async function() {
    const tr: Transformer = newTransformer()

    const result: string = await tr['unzip']()

    expect(result).toContain(xml)
  });

  // it("should return xsl stylesheet", function () {
  //   const tr: Transformer = newTransformer()
  //   const gameSystem = 'Stargrave'
  //
  //   jest.mocked(fetch).mockResolvedValue({text: () => xml} as Response)
  //
  //   // const fetchMock = jest
  //   //   .spyOn(global, 'fetch')
  //   //   .mockResolvedValue({
  //   //     status: 200,
  //   //     text: async () => xml
  //   //   } as Response)
  //
  //   const result = tr['getStylesheet'](gameSystem)
  //
  //   expect(result).toBeInstanceOf(Document)
  // });

});

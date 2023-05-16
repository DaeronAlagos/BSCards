import {
  createFragment,
  fetchStylesheet,
  gameSystemName,
  parseXML,
  readData,
  toSnakeCase,
} from './modules/wheeljack'

const $error = document.getElementById('error') as HTMLElement
const $rosterInput = document.getElementById('roster_input') as HTMLInputElement
const $wrapper = document.getElementById('wrapper') as HTMLElement
const $start: HTMLElement = document.getElementById('start') as HTMLElement
const $gameSystemContainer: HTMLElement = document.getElementById(
  'game_system_container'
) as HTMLElement
const $gameSystem: HTMLElement = document.getElementById(
  'game_system'
) as HTMLElement
const $print = document.getElementById('print') as HTMLElement

const resetView = () => {
  $error.classList.add('hidden')
  $start.classList.remove('hidden')
  $wrapper.innerText = ''
  $wrapper.classList.remove('hidden')
  $print.classList.remove('lg:flex')
  $gameSystem.innerText = ''
  $gameSystemContainer.classList.add('invisible')
}

$rosterInput.addEventListener('change', (e: Event) => {
  const files = (<HTMLInputElement>e.target).files
  if (files) {
    const fr = new FileReader()
    fr.readAsBinaryString(files[0])
    fr.addEventListener('loadend', (ev) => {
      resetView()
      const target: FileReader = <FileReader>ev.target
      const data: string = target.result as string
      void (async (): Promise<void> => {
        const xmlDom: Document = await readData(data)
        const gameSystem: string = gameSystemName(xmlDom)
        const stylesheet: string = await fetchStylesheet(
          toSnakeCase(gameSystem)
        )
        if (stylesheet === 'not_supported') {
          $wrapper.classList.add('hidden')
          $error.innerText = `${gameSystem} is currently unsupported!`
          $error.classList.remove('hidden')
          return
        }
        const xslDom: Document = parseXML(stylesheet)

        $print.classList.add('lg:flex')
        $start.classList.add('hidden')
        $gameSystem.innerText = gameSystem
        $gameSystemContainer.classList.remove('invisible')
        $wrapper.appendChild(createFragment(xmlDom, xslDom))
      })()
    })
  }
})

$print.addEventListener('click', () => window.print())

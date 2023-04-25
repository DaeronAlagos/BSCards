import { Transformer } from "./modules/transformer";

const $fileInput = document.getElementById('file') as HTMLInputElement
const $print = document.getElementById('print') as HTMLElement

$fileInput.addEventListener('change',  (e: Event) => {
  const files = (<HTMLInputElement>e.target).files
  if (files) {
    const fr = new FileReader()
    fr.readAsBinaryString(files[0])
    fr.addEventListener('loadend', (ev: Event) => {
      const target = <FileReader>ev.target
      const result = target.result as string
      const tr = new Transformer(result)
      void tr.render()
    })
    $print.classList.remove('hidden')
  }
})

$print.addEventListener('click', () => window.print())

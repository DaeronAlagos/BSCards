import { Transformer } from "./modules/transformer";

const $fileInput = document.getElementById("file") as HTMLInputElement;
const $wrapper = document.getElementById("wrapper") as HTMLElement;
const $start: HTMLElement = document.getElementById("start") as HTMLElement;
const $gameSystemContainer: HTMLElement = document.getElementById(
  "gameSystemContainer"
) as HTMLElement;
const $gameSystem: HTMLElement = document.getElementById(
  "gameSystem"
) as HTMLElement;
const $print = document.getElementById("print") as HTMLElement;

$fileInput.addEventListener("change", (e: Event) => {
  const files = (<HTMLInputElement>e.target).files;
  if (files) {
    const fr = new FileReader();
    fr.readAsBinaryString(files[0]);
    fr.addEventListener("loadend", (ev: Event) => {
      const target = <FileReader>ev.target;
      const result = target.result as string;
      const tr = new Transformer(result);
      tr.render()
        .then((value) => {
          $wrapper.innerText = "";
          $wrapper.appendChild(value.fragment);

          $gameSystem.innerText = value.gameSystem;
          $gameSystemContainer.classList.remove("hidden");
        })
        .catch(() => console.log(""));
    });
    $start.classList.add("hidden");
    $print.classList.remove("hidden");
  }
});

$print.addEventListener("click", () => window.print());

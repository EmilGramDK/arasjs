export async function InitAras() {
  window.aras = window.aras || top?.aras || parent.aras;
  window.ArasModules = top?.ArasModules || parent?.ArasModules;
  window.store = window.store || parent.store || top?.store;
  window.DOMParser = top?.DOMParser || parent.DOMParser;
  window.Item = top?.Item || parent.Item;

  if (!window.aras)
    throwError(
      "Aras object not initialized\n\nThis Application needs to be run inside Aras Innovator"
    );

  injectCSSToParent();
  injectArasSpinner();
  setBaseUrl();
  await Promise.all([injectStylesAndScripts(), waitForDomReady()]);
}

export function SetArasReady() {
  window.isArasReady = true;
  const event = new Event("ArasReady");
  window.dispatchEvent(event);
}

function setBaseUrl() {
  if (document.querySelector("base")) return;
  const base = document.createElement("base");
  base.setAttribute("href", aras.getScriptsURL());
  document.head.prepend(base);
}

function injectCSSToParent() {
  if (top?.document.getElementById("arasjs_parrent_css")) return;
  const css = `<style id="arasjs_parrent_css">
    .content-block__iframe_page { padding:0;width:100%;height:100%; }
    .aras-notification__message { white-space: break-spaces; line-height: 20px; padding: 8px 0px; }
    .aras-notify_bottom-left, .aras-notify_top-left { left: 50px; }
    .aras-notify_bottom-left, .aras-notify_bottom-right { bottom: 50px; }
    </style>`;
  top?.document.head.insertAdjacentHTML("beforeend", css);
}

function injectArasSpinner() {
  if (document.getElementById("dimmer_spinner")) return;
  const iframe = document.createElement("iframe");
  iframe.src = aras.getScriptsURL() + "spinner.html";
  iframe.id = "dimmer_spinner";
  document.body.appendChild(iframe);
}

function waitForDomReady(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        resolve();
      });
    }
  });
}

async function injectStylesAndScripts() {
  const resources = [];

  resources.push({
    type: "stylesheet",
    url: `../javascript/include.aspx?classes=common.min.css,cuiLayout.css`,
    id: "styles-common-layout",
  });

  resources.push(
    {
      type: "module",
      url: `../jsBundles/excelConverter.es.js`,
      id: "script-excel-converter",
    },
    {
      type: "module",
      url: `../jsBundles/cui.es.js`,
      id: "script-cui",
    }
  );

  await Promise.all(
    resources.map((resource) =>
      resource.type !== "stylesheet"
        ? loadScript(resource.type, resource.url, resource.id)
        : loadStylesheet(resource.url, resource.id)
    )
  );
}

export async function loadScript(
  type: string,
  src: string,
  id: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve(); // Skip if script already exists

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.type = type;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(`Failed to load script: ${src}`);

    document.head.appendChild(script);
  });
}

export async function loadStylesheet(href: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve(); // Skip if stylesheet already exists

    const link = document.createElement("link");
    link.id = id;
    link.href = href;
    link.rel = "stylesheet";

    link.onload = () => resolve();
    link.onerror = () => reject(`Failed to load stylesheet: ${href}`);

    var head = document.getElementsByTagName("head")[0];
    head.insertBefore(link, head.firstChild);
  });
}

export function throwError(message: string): never {
  showFullScreenError("Error Occurred", message);
  throw new Error(message);
}

function showFullScreenError(title: string, message: string) {
  const html = `
        <div class="fullscreen-error"><div class="error-content"><h1>${title}</h1><p>${message}</p></div></div>
        <style>body{margin:0}.fullscreen-error{display:flex;justify-content:center;align-items:center;height:100vh;width:100vw;background-color:#f8f9fa}.error-content{text-align:center}.error-content h1{font-size:24px}.error-content p{font-size:16px;white-space:break-spaces;line-height:20px;padding:8px 0}</style>`;
  document.body.innerHTML = html;
}

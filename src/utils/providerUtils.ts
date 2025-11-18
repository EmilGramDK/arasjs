export async function initAras() {
  window.aras = window.aras || top?.aras || parent.aras;
  window.ArasModules = top?.ArasModules || parent?.ArasModules;
  window.store = window.store || parent.store || top?.store;
  window.DOMParser = top?.DOMParser || parent.DOMParser;
  window.Item = top?.Item || parent.Item;

  if (!window.aras) throw new Error("Aras object not initialized, run inside Aras Innovator");

  injectArasSpinner();
  setBaseUrl();
  await Promise.all([injectStylesAndScripts(), waitForDomReady()]);
}

export async function waitForArasReady(): Promise<void> {
  if (window.isArasReady) return;
  await new Promise((resolve) => {
    window.addEventListener("ArasReady", resolve, { once: true });
  });
}

export function setArasReady() {
  window.isArasReady = true;
  const event = new Event("ArasReady");
  window.dispatchEvent(event);
}

function setBaseUrl() {
  const base = document.querySelector("base") || document.createElement("base");
  base.setAttribute("href", aras.getScriptsURL());
  document.head.prepend(base);
}

function injectArasSpinner() {
  if (document.querySelector("#dimmer_spinner")) return;
  const iframe = document.createElement("iframe");
  iframe.src = `${aras.getScriptsURL()}spinner.html`;
  iframe.id = "dimmer_spinner";
  document.body.append(iframe);
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
  const resources = [
    {
      type: "stylesheet",
      url: "../javascript/include.aspx?classes=common.min.css,cuiLayout.css",
      id: "styles-common-layout",
    },
    {
      type: "module",
      url: "../jsBundles/excelConverter.es.js",
      id: "script-excel-converter",
    },
    {
      type: "module",
      url: "../jsBundles/cui.es.js",
      id: "script-cui",
    },
  ].map((res) =>
    res.type === "stylesheet"
      ? loadStylesheet(res.url, res.id)
      : loadScript(res.type, res.url, res.id),
  );

  await Promise.all(resources);
}

export async function loadScript(type: string, src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve(); // Skip if script already exists

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.type = type;
    script.async = true;

    script.addEventListener("load", () => resolve());
    script.onerror = () => reject(`Failed to load script: ${src}`);

    document.head.append(script);
  });
}

export async function loadStylesheet(href: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve(); // Skip if stylesheet already exists

    const link = document.createElement("link");
    link.id = id;
    link.href = href;
    link.rel = "stylesheet";

    link.addEventListener("load", () => resolve());
    link.onerror = () => reject(`Failed to load stylesheet: ${href}`);

    const head = document.querySelectorAll("head")[0];
    head.insertBefore(link, head.firstChild);
  });
}

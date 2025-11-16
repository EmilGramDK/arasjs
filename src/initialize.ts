const properties = ["aras", "ArasModules", "store", "Item", "DOMParser"] as const;
const styles = ["../javascript/include.aspx?classes=common.min.css,cuiLayout.css"];
const scripts = ["../jsBundles/excelConverter.es.js", "./jsBundles/cui.es.js"];

export const initArasEnv = async (): Promise<void> => {
  if (window.arasReady) return;
  if (!top || !top.aras) throw new Error("Aras object not initialized, run inside Aras Innovator");
  copyObjects();
  setBase();
  injectSpinner();
  await Promise.all([injectStyles(), injectScripts(), waitForDomReady()]);
  window.arasReady = true;
  window.dispatchEvent(new Event("aras:ready"));
};

const copyObjects = () => {
  for (const prop of properties) {
    window[prop] = window[prop as keyof Window] || top![prop as keyof Window] || parent[prop as keyof Window];
  }
};

const setBase = () => {
  const base = document.querySelector("base") || document.createElement("base");
  base.setAttribute("href", aras.getScriptsURL());
  document.head.prepend(base);
};

const injectSpinner = () => {
  if (document.querySelector("#dimmer_spinner")) return;
  const iframe = document.createElement("iframe");
  iframe.src = `${aras.getScriptsURL()}spinner.html`;
  iframe.id = "dimmer_spinner";
  document.body.append(iframe);
};

const injectScripts = async () => {
  const promises = scripts.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)), { once: true });
      document.head.append(script);
    });
  });
  await Promise.all(promises);
};

const injectStyles = async () => {
  const promises = styles.map((href) => {
    return new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.addEventListener("load", () => resolve(), { once: true });
      link.addEventListener("error", () => reject(new Error(`Failed to load stylesheet: ${href}`)), { once: true });
      document.head.append(link);
    });
  });
  await Promise.all(promises);
};

const waitForDomReady = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.readyState === "complete") return resolve();
    window.addEventListener("DOMContentLoaded", () => resolve());
  });
};

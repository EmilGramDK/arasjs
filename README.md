# ArasJS - Aras Innovator Helper Library

ArasJS is a Library that make it easy to build Aras Innovator Client Extensions, by providing a lot of helper functions and types for the Aras Client-Side API directly to your editor.

> **Note:**
> ArasJS is not affiliated with, endorsed by, or sponsored by Aras Corporation. It is an independent open-source library designed to assist developers in building applications that run inside Aras Innovator.

## Pre-Setup

### 1️⃣ Configure Aras OAuth

To enable authentication, add `localhost:3000` to the allowed redirect URIs in your **Aras Innovator OAuth Configuration**.

Add the following lines to **OAuth.config** located at:
`C:\Program Files (x86)\Aras\Innovator\OAuthServer`

```xml
<!-- ArasJS Config -->
<redirectUri value='https://localhost:3000/InnovatorServer/Client/OAuth/RedirectCallback' />
<redirectUri value='https://localhost:3000/InnovatorServer/Client/OAuth/SilentCallback' />
<redirectUri value='https://localhost:3000/InnovatorServer/Client/OAuth/PopupCallback' />
<!-- ArasJS Config -->
```

### 2️⃣ Add to TOC

To add the application to the **Table of Contents (TOC)**:

1. Open **Aras Innovator**.
2. Navigate to **TOC → Administration → Configuration → TOC Editor**.
3. Add a new page as shown below:

   ![TOC Configuration](https://github.com/EmilGramDK/create-arasjs/blob/81952512dfa8cdfa4951d146d0f88d2ed7e76a75/src/toc.png)

### 3️⃣ Setup Aras Proxy

Your Application needs to run inside Aras Innovator, therfore you have to setup a proxy to Aras Innovator.

<details>
  <summary><b>Example using Vite</b></summary>

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [],
  server: {
    port: 3000,
    open: "/innovatorserver/client", // automatically open aras
    proxy: {
      "/innovatorserver": {
        target: "https://aras.example.com/innovatorserver", // link to your innovator server
        secure: false,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/innovatorserver/, ""),
      },
    },
  },
});
```

</details>

<details>
  <summary><b>Example using Angular</b></summary>

```typescript
// angular.json
"serve": {
    // other settings
    "options": {
        "proxyConfig": "proxy.conf.json"
    }
}

//proxy.conf.json
{
  "/innovatorserver": {
    "target": "https://aras.example.com/innovatorserver", // link to your innovator server
    "secure": false,
    "pathRewrite": {
      "^/innovatorserver": ""
    }
  }
}
```

</details>

## Get Started

To get started, run the following command:

```sh
npm i arasjs
```

Initialize ArasJS in your main file in your project:

```sh
useArasProvider().then(() => {
    <App />
});
```

Import the types reference to your main file in your project:

```sh
/// <reference types="arasjs-types/globals" />
```

## Examples

**React**

```typescript
// main.tsx
useArasProvider().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

**Angular**

```typescript
// main.ts
useArasProvider().then(() => {
  bootstrapApplication(AppComponent, appConfig);
});
```

## License

This project is licensed under the **MIT License**.

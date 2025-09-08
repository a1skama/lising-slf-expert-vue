// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Включаем SSR для лучшей индексации
  ssr: true,

  app: {
    head: {
      htmlAttrs: {
        lang: "ru",
      },
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/favicon/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon/favicon-16x16.png",
        },
        { rel: "manifest", href: "/favicon/site.webmanifest" },
        {
          rel: "mask-icon",
          href: "/favicon/safari-pinned-tab.svg",
          color: "#5bbad5",
        },
        { rel: "shortcut icon", href: "/favicon/favicon.ico" },
      ],
      meta: [
        { name: "msapplication-TileColor", content: "#ffffff" },
        { name: "msapplication-config", content: "/favicon/browserconfig.xml" },
        { name: "theme-color", content: "#ffffff" },
      ],

      script: [
        {
          children: `
         (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(98740304, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
          });
        `,
        },
      ],

      noscript: [
        {
          children: `><div><img src="https://mc.yandex.ru/watch/98740304" style="position:absolute; left:-9999px;" alt="" /></div>`,
          body: true,
        },
      ],
    },
  },

  compatibilityDate: "2024-04-03",

  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@vueuse/nuxt"],
  image: {
    inject: true,
  },
  plugins: ["~/plugins/gsap.client.ts"],

  runtimeConfig: {
    emailHost: process.env.EMAIL_HOST,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,

    public: {
      strapi: {
        url: process.env.STRAPI_URL,
      },
    },
  },
});

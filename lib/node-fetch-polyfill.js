// This is a polyfill for node-fetch in environments where it's not available
if (typeof global !== "undefined" && !global.fetch) {
  global.fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))
  global.Headers = (...args) => import("node-fetch").then(({ Headers }) => new Headers(...args))
  global.Request = (...args) => import("node-fetch").then(({ Request }) => new Request(...args))
  global.Response = (...args) => import("node-fetch").then(({ Response }) => new Response(...args))
}

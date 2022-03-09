<h1 align="center">The SWEET Stack</h1>
<p align="center">This is a template repository for Deno, GraphQL, and Svelte projects</p>

---

## Table of Contents

- [Introduction](#introduction)
- [How to use this template](#how-to-use-this-template)
- [Prequisites](#prerequisites)
- [Deno and GraphQL](#deno-and-graphql)
- [SvelteJS](#sveltejs)
- [BONUS](#bonus)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

Svelte is an innovative approach to frontend software development, the component
model, and reactivity features creates simplistic approach to some hard
problems. Svelte runs on the front end and is known as a Single Page
Application.

Deno is a JavaScript Server side platform similar to NodeJs but focused on Web
Standards, supports linting, formatting, testing, and typescript out of the box.

I love both of these technologies, but I also enjoy simplicity, this stack
represents simplicity, I know there are trade-offs with SPA architecture, but
one advantage of Deno, is Deno Deploy and the ability to push your app to the
Edge. This offers localized access to assets and server-based functionality, if
you wish to serve a static web page, just put it in the public folder, if you
wish to serve dynamic pages then use Svelte and compile to JS. I think the
target for this stack is small applications, if your needs are very complex, you
may want to consider SvelteKit or something similar. If your needs are static
website, checkout Astro or Gatsby.

## How to use this template

In this readme, I will go through how to manually build this stack, but if you
rather jump to just building a project you can fork this repo and go, or you can
use `degit` to pull this repo down and start building as well.

```
npx degit hyper63/sweet-stack myproject
```

You will need to have both NodeJS and Deno installed.

## Prerequisites

- Git - https://git-scm.com/
- NodeJS - https://nodejs.org
- Deno - https://deno.land

> NOTE: we will be using Makefile to run our scripts, your OS may not support
> this feature without installing the `make` command-line application.

## Deno and GraphQL

Setting up Deno and GraphQL is straight forward, now like everything, there are
many opinions, we will be using a Makefile to manage our build scripts. We will
be placing our code in the `src` directory and we will be using `import-maps`
feature of `Deno` to manage our dependencies for Deno.

### Setup Project

```sh
touch import_map.json Makefile
mkdir src
```

Makefile

```
dev:
	@deno run --allow-net --allow-read --allow-env --import-map=./import_map.json src/server.js

test:
	@deno fmt src && deno lint src && deno test src
```

import_map.json

```json
{
  "imports": {
    "std/": "https://deno.land/std/",
    "gql": "https://deno.land/x/gql@1.1.0/mod.ts",
    "graphql_tools": "https://deno.land/x/graphql_tools@0.0.2/mod.ts",
    "graphql_tag": "https://deno.land/x/graphql_tag@0.0.1/mod.ts",
    "dotenv": "https://deno.land/x/dotenv@v3.1.0/load.ts"
  }
}
```

Create a server.js and api.js files in the `src` folder

```sh
touch src/server.js src/api.js
```

server.js

```js
import { serve } from "std/http/server.ts";
import { graphql, org } from "./api.js";

/**
 * @param {Request} reg
 * @returns {Response}
 */
serve((req) => {
  const routes = {
    "/": serveStatic("./app/public/index.html", "text/html"),
    "/favicon.png": serveStatic("./app/public/favicon.png", "image/png"),
    "/build/bundle.css": serveStatic(
      "./app/public/build/bundle.css",
      "text/css",
    ),
    "/build/bundle.js": serveStatic(
      "./app/public/build/bundle.js",
      "text/javascript",
    ),
    "/graphql": graphql,
  };

  // get path from req object
  const { pathname } = new URL(req.url);

  // log request
  console.log(`${req.method} ${pathname}`);

  // simple match to handle the request
  return routes[pathname] ? routes[pathname](req) : routes["/"](req);
});

/**
 * @param {string} file
 * @param {string} type
 * @returns {Response}
 */
function serveStatic(file, type) {
  return async () =>
    new Response(
      await Deno.readTextFile(file),
      {
        headers: { "content-type": type },
      },
    );
}
```

api.js

```js
import "dotenv";
import { GraphQLHTTP } from "gql";
import { makeExecutableSchema } from "graphql_tools";
import { gql } from "graphql_tag";

const typeDefs = gql`
  type Query {
    hello : String
  }
`;

const resolvers = {
  Query: {
    hello: () => Promise.resolve("Hello World!"),
  },
};

/**
 * @param {Request} req
 * @returns {Response}
 */
export const graphql = async (req) =>
  await GraphQLHTTP({
    schema: makeExecutableSchema({ resolvers, typeDefs }),
    graphiql: true,
  })(req);
```

### Run

```sh
make
```

Navigate to http://localhost:8000/graphql

and run the following query

```
query {
  hello
}
```

### Test

```sh
make test
```

---

## SvelteJS

Setting up Svelte is the exact same process as https://svelte.dev

```sh
npx degit sveltejs/template app
cd app
yarn
```

Now we do need to make some adjustments:

edit the `rollup.conf.js` file

> We want to comment out the `!production && serve()` line, and the
> `!production && livereload('public')` line.

```js
// // In dev mode, call `npm run start` once
// // the bundle has been generated
// !production && serve(),

// // Watch the `public` directory and refresh the
// // browser on changes when not in production
// !production && livereload('public'),
```

We can run Svelte separately in another terminal by running:

```
yarn dev
```

But lets create one startup script, using `foreman`

```sh
npm i -g foreman
```

Create a `Procfile` in the project root directory

```
server: make
app: cd app && yarn && yarn dev
```

Now, we can run both our server and app with one command:

```sh
nf start
```

## Bonus

- Comming Soon

## Contributing

We welcome suggestions and improvements to this stack, especially if there are
better approaches to running parallel tasks or any other items, like dependency
management, etc.

## License

MIT

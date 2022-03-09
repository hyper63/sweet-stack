dev:
	@deno run --allow-net --allow-read --allow-env --import-map=./import_map.json src/server.js

test:
	@deno fmt src && deno lint src && deno test src
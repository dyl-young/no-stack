import { constants } from "node:fs";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const root = new URL("../", import.meta.url);
const { values } = parseArgs({
  options: {
    name: { type: "string" },
    slug: { type: "string" },
    "app-id": { type: "string" },
    scheme: { type: "string" },
  },
});
const configUrl = new URL("starter.json", root);
const original = JSON.parse(await readFile(configUrl, "utf8"));
const config = {
  name: values.name ?? original.name,
  slug: values.slug ?? original.slug,
  scheme: values.scheme ?? values.slug ?? original.scheme,
  applicationId: values["app-id"] ?? original.applicationId,
};
if (
  !config.name.trim() ||
  !/^[a-z][a-z0-9-]*$/.test(config.slug) ||
  !/^[a-z][a-z0-9-]*$/.test(config.scheme) ||
  !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(config.applicationId)
) {
  throw new Error(
    "Supply a name, lowercase slug and scheme, and reverse-domain app ID.",
  );
}
const supabaseUrl = new URL("supabase/config.toml", root);
const previous = await readFile(supabaseUrl, "utf8");
const updated = previous
  .replace(/^project_id = "[^"]+"/m, 'project_id = "' + config.slug + '"')
  .replace(
    /"[^":]+:\/\/auth\/callback"/,
    '"' + config.scheme + '://auth/callback"',
  );
if (updated !== previous) await writeFile(supabaseUrl, updated);
if (JSON.stringify(original) !== JSON.stringify(config))
  await writeFile(configUrl, JSON.stringify(config, null, 2) + "\n");

for (const relative of [".env", "apps/expo/.env"]) {
  try {
    await copyFile(
      new URL(relative + ".example", root),
      new URL(relative, root),
      constants.COPYFILE_EXCL,
    );
    console.log("Created", relative);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
}
console.log("Local configuration ready for", config.name);

import assert from "node:assert/strict";
import { test } from "node:test";

import { switchLocalePath } from "./locale-path.js";

test("switchLocalePath keeps the current route", () => {
  assert.equal(switchLocalePath("/en/pokemon/charmander", "de"), "/de/pokemon/charmander");
  assert.equal(switchLocalePath("/fr/pokemon", "de"), "/de/pokemon");
  assert.equal(switchLocalePath("/de", "en"), "/en");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { encode, decode } from "../shared/sync.js";

test("every confirmation code has 3 digits and decodes to its value", () => {
  for (let code = 1000; code < 3000; code += 7){
    for (let round = 1; round <= 4; round++){
      const seen = new Set();
      for (let v = 0; v <= 2; v++){
        const c = encode(code, round, v);
        assert.ok(c >= 100 && c <= 999);
        assert.equal(decode(code, round, c, 2), v);
        seen.add(c);
      }
      assert.equal(seen.size, 3, "codes for different values must differ");
    }
  }
});

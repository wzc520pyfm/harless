import { describe, it, expect } from "vitest";
import { decideUpdateAction } from "../../src/lib/decide-update-action.js";

describe("decideUpdateAction", () => {
  it("disk pristine, template changed → overwrite", () => {
    expect(
      decideUpdateAction({ diskHash: "A", oldTemplateHash: "A", newTemplateHash: "B", diskExists: true }),
    ).toBe("overwrite");
  });
  it("disk modified, template unchanged → keep", () => {
    expect(
      decideUpdateAction({ diskHash: "X", oldTemplateHash: "A", newTemplateHash: "A", diskExists: true }),
    ).toBe("keep");
  });
  it("both changed → conflict", () => {
    expect(
      decideUpdateAction({ diskHash: "X", oldTemplateHash: "A", newTemplateHash: "B", diskExists: true }),
    ).toBe("conflict");
  });
  it("missing on disk → recreate", () => {
    expect(
      decideUpdateAction({ diskHash: null, oldTemplateHash: "A", newTemplateHash: "B", diskExists: false }),
    ).toBe("recreate");
  });
  it("disk pristine, template unchanged → keep (no-op)", () => {
    expect(
      decideUpdateAction({ diskHash: "A", oldTemplateHash: "A", newTemplateHash: "A", diskExists: true }),
    ).toBe("keep");
  });
});

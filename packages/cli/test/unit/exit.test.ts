import { describe, it, expect } from "vitest";
import { EXIT } from "../../src/lib/exit.js";
import { HarlessError, fail, precondition, conflict, doctorBitmask } from "../../src/lib/errors.js";

describe("EXIT codes", () => {
  it("has expected numeric values", () => {
    expect(EXIT.OK).toBe(0);
    expect(EXIT.FAIL).toBe(1);
    expect(EXIT.CONFLICT).toBe(2);
    expect(EXIT.PRECONDITION).toBe(3);
    expect(EXIT.DOCTOR_BASE).toBe(10);
  });
});

describe("HarlessError", () => {
  it("is instanceof Error", () => {
    expect(fail("x")).toBeInstanceOf(Error);
    expect(fail("x")).toBeInstanceOf(HarlessError);
  });
  it("carries the correct exit code", () => {
    expect(fail("x").code).toBe(EXIT.FAIL);
    expect(precondition("x").code).toBe(EXIT.PRECONDITION);
    expect(conflict("x").code).toBe(EXIT.CONFLICT);
  });
  it("doctor bitmask arithmetic", () => {
    expect(doctorBitmask(0).code).toBe(10);
    expect(doctorBitmask(5).code).toBe(15);
    expect(doctorBitmask(63).code).toBe(73);
  });
});

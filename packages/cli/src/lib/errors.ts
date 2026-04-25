import { EXIT, type ExitCode } from "./exit.js";

export class HarlessError extends Error {
  constructor(
    public readonly code: ExitCode,
    message: string,
  ) {
    super(message);
  }
}

export const fail = (m: string) => new HarlessError(EXIT.FAIL, m);
export const precondition = (m: string) => new HarlessError(EXIT.PRECONDITION, m);
export const conflict = (m: string) => new HarlessError(EXIT.CONFLICT, m);
export const doctorBitmask = (mask: number) =>
  new HarlessError((EXIT.DOCTOR_BASE + mask) as ExitCode, `doctor failed (bitmask=${mask})`);

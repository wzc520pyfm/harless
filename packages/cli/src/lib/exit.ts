export const EXIT = {
  OK: 0,
  FAIL: 1,
  CONFLICT: 2,
  PRECONDITION: 3,
  DOCTOR_BASE: 10,
} as const;

export type ExitCode = (typeof EXIT)[keyof typeof EXIT];

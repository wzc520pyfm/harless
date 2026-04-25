import { checkbox, confirm, select } from "@inquirer/prompts";
export const prompts: { checkbox: typeof checkbox; confirm: typeof confirm; select: typeof select } =
  { checkbox, confirm, select };
export type Prompts = typeof prompts;

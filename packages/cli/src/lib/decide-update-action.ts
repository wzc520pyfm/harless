export type UpdateAction = "keep" | "overwrite" | "conflict" | "recreate";

export interface UpdateInputs {
  diskExists: boolean;
  diskHash: string | null;
  oldTemplateHash: string;
  newTemplateHash: string;
}

export function decideUpdateAction(i: UpdateInputs): UpdateAction {
  if (!i.diskExists) return "recreate";
  const diskPristine = i.diskHash === i.oldTemplateHash;
  const templateChanged = i.oldTemplateHash !== i.newTemplateHash;
  if (diskPristine && templateChanged) return "overwrite";
  if (diskPristine && !templateChanged) return "keep";
  if (!diskPristine && !templateChanged) return "keep";
  return "conflict";
}

# spec — Spec-Driven Development

Three-step workflow: idea → `spec.md` → `plan.md` → `tasks.md`.

## Files

- `.harness/spec/SKILL.md`
- `.harness/specs/.template/spec.md`
- `.harness/specs/.template/plan.md`
- `.harness/specs/.template/tasks.md`

## Usage

```bash
cp -r .harness/specs/.template .harness/specs/$(date +%Y-%m-%d)-my-feature
```

Then fill in each document before implementing.

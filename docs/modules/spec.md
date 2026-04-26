# spec — Spec-Driven Development

Three-step workflow: idea → `spec.md` → `plan.md` → `tasks.md`.

## Files

- `.agents/spec/SKILL.md`
- `.agents/specs/.template/spec.md`
- `.agents/specs/.template/plan.md`
- `.agents/specs/.template/tasks.md`

## Usage

```bash
cp -r .agents/specs/.template .agents/specs/$(date +%Y-%m-%d)-my-feature
```

Then fill in each document before implementing.

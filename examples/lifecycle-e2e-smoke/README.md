# Lifecycle E2E smoke fixture

This tiny project is intentionally boring. It exists to prove Open Scaffold's core lifecycle on a downstream project that is not Open Scaffold itself.

The Vitest smoke copies this fixture into a fresh temp directory, copies the scaffold `verify.sh` and `close.sh` scripts into that temp project, then proves:

```text
mission -> active plan -> project verification -> evidence note -> close -> final verify
```

Run from the Open Scaffold repo root:

```bash
npm run smoke:e2e
```

The fixture has no private dependencies, no network dependency, and no Hermes/Discord/runtime dependency.

# City Model Viewer

A minimal web application using Vite, Three.js and strictly typed TypeScript to visualize 3D city models in .glb format.

## Setup

```bash
pnpm install
pnpm serve
```

The dev server will open at http://localhost:5173

## Usage

### Load a Model

The url of the model needs to be passed as the `load` query parameter.

### Controls

- **Rotate**: Left mouse button + drag
- **Pan**: Right mouse button + drag (or Middle mouse button + drag)
- **Zoom**: Mouse wheel

## Features

- 🎥 OrbitControls with smooth damping
- 💡 Dynamic lighting (ambient + directional)
- 🌫️ Fog for depth perception
- 📐 Auto-fitted camera to model bounds
- 📊 Loading progress indicator
- 🎨 Dark theme UI

## Type Checking

```bash
pnpm typecheck
```

## Build for Production

```bash
pnpm build
```

Type-checks first, then builds. Output will be in `dist/`

## Deploy

On every push, the webapp will be deployed to github pages at https://otfried.github.io/view3d.

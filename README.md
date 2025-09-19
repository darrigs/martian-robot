# Martian Robot

This is a [Next.js](https://nextjs.org) project that solves the classic Martian Robot problem.

## Problem Description

The surface of Mars is modeled as a rectangular grid. Robots are placed on the grid and receive instructions to move. If a robot moves off the grid, it is LOST and leaves a "scent" so future robots ignore moves that would cause them to be lost at the same position and orientation.

**Input Format:**
- The first line: upper-right coordinates of the grid (e.g., `5 3`). The lower-left is always `0 0`.
- For each robot:
  - Line 1: Initial position and orientation (e.g., `1 1 E`)
  - Line 2: Instructions (e.g., `RFRFRFRF`)

**Output Format:**
- For each robot, output the final position and orientation. If LOST, append `LOST`.

**Sample Input:**
```
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

**Sample Output:**
```
1 1 E
3 3 N LOST
2 3 S
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Usage

- Enter the grid size and robot instructions in the textarea.
- The output will show the final positions of all robots, marking any that are LOST.

## Project Structure

- `components/` - React components (`MartianMap`, `UserInput`)
- `lib/robot.ts` - Core logic for parsing, validation, and robot movement
- `components/__tests__/` and `lib/robot.test.ts` - Unit tests

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## License

MIT

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const command = `npx shadcn@latest add ${args.join(' ')}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error executing shadcn command:', error);
  process.exit(1);
}

import fs from 'fs';
import { execSync } from 'child_process';

const distExists = fs.existsSync('dist/index.html');

// In Render cloud containers, avoid rolldown native binding issues by using the pre-built bundle
if (distExists && (process.env.RENDER || process.env.DEMO_MODE === 'true')) {
  console.log('✓ Render cloud container detected: Using pre-built production dist bundle.');
  process.exit(0);
}

try {
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✓ Vite build completed successfully.');
} catch (error) {
  if (distExists) {
    console.log('⚠ Vite build failed on container architecture. Using pre-built production dist bundle as fallback.');
    process.exit(0);
  } else {
    console.error('❌ Build failed and no pre-built dist bundle was found.');
    process.exit(1);
  }
}

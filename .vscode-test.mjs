import { defineConfig } from '../node_modules/@vscode/test-cli/out/index.d.mts';

export default defineConfig({
	files: 'out/test/**/*.test.js',
});

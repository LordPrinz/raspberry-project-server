import fs from 'fs';
import path from 'path';

export type AppInfo = {
  name: string;
  path: string;
}

const findStartScript = (dir: string): AppInfo | null => {
  const files = fs.readdirSync(dir);

  if (files.includes('start.sh')) {
    return { name: path.basename(dir), path: dir };
  }

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      const result = findStartScript(fullPath);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const getDirectoryApps = (targetDirectory: string): AppInfo[] => {
  const apps: AppInfo[] = [];

  const topLevelDirs = fs.readdirSync(targetDirectory);

  for (const dir of topLevelDirs) {
    const fullPath = path.join(targetDirectory, dir);

    if (fs.statSync(fullPath).isDirectory()) {
      const startScriptInfo = findStartScript(fullPath);
      if (startScriptInfo) {
        apps.push(startScriptInfo);
      }
    }
  }

  return apps;
};

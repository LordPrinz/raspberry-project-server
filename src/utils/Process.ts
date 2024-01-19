import { exec } from 'child_process';
import { AppInfo } from './Directory';

export type processType = {
  pid: string;
  app: string
}

export const getDirectoryProcesses = (): Promise<processType[]> => {
  return new Promise((resolve, reject) => {
    exec("ps auxww | grep -E '/projects|__project__'", (error, stdout, stderr) => {

      const processes = stdout.split('\n').slice(0, -3);
      
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        reject(stderr);
        return;
      }

      const result = processes.map(process => {
        const fragment = process.split(" ").filter(el => el !== "");

        const pid = fragment[1];
        const app = fragment[fragment.length - 1].replace(/_/g, "").replace(/"/g, "");

        return {
          pid,
          app
        }
      })

      resolve(result);
    });
  });
}

export const findActiveApps = async (apps: AppInfo[], processes: processType[]) => {
  const processCommands = processes.map(process => process.app).join(" ");

  return apps.map(app => {
    return {
      ...app,
      isActive: processCommands.includes(app.name)
    }
  })
} 
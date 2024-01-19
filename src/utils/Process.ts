import { exec } from 'child_process';
import { AppInfo, getDirectoryApps } from './Directory';

export type processType = {
  pid: string;
  app: string
}



export const getDirectoryProcesses = (): Promise<processType[]> => {
  const targetDirectory = process.env.TARGET_DIRECTORY!
  const tag = process.env.TAG!

  return new Promise((resolve, reject) => {
    exec(`ps auxww | grep -E '${targetDirectory}|__${tag}__'`, (error, stdout, stderr) => {

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

const getAppProcess = async (appName: string):Promise<processType[]>  => {
  const targetDirectory = process.env.TARGET_DIRECTORY!
  const tag = process.env.TAG!

  return new Promise((resolve, reject) => {
    exec(`ps auxww | grep -E '${targetDirectory}|__${tag}__|__${appName}__'`, (error, stdout, stderr) => {

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


export const findAppData = async (appName: string) => {
  const targetDirectory = process.env.TARGET_DIRECTORY!

  const activeApps = await getAppProcess(appName);
  const directoryApps = getDirectoryApps(targetDirectory);
 
  const directoryAppData = directoryApps.find(app => app.name === appName);

  if(!directoryAppData) {
    return null
  }

  const activeAppData = activeApps.filter(app => app.app === directoryAppData?.name);

  return {
    ...directoryAppData,
    pids: activeAppData.map(app => app.pid)
  }
}
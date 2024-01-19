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


export const terminateProcess = async (pid: string): Promise<number> => {
  try {
    const childPids = await new Promise<string>((resolve, reject) => {
      exec(`pgrep -P ${pid}`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.trim());
      });
    });

    const childPidArray = childPids.split('\n').filter(Boolean);

    await Promise.all([
      new Promise<number>((resolve, reject) => {
        exec(`kill -9 ${pid}`, (error) => {
          if (error) {
            console.error(`Error killing process ${pid}: ${error.message}`);
            reject(error);
          } else {
            resolve(0);
          }
        });
      }),
      ...childPidArray.map(childPid =>
        new Promise<number>((resolve, reject) => {
          exec(`kill -9 ${childPid}`, (error) => {
            if (error) {
              console.error(`Error killing child process ${childPid}: ${error.message}`);
              reject(error);
            } else {
              resolve(0); 
            }
          });
        })
      ),
    ]);

    return 0;

  } catch (error: any) {
    console.error(`Error terminating process: ${error.message}`);
    return 1; 
  }
};

export const runProcess = async (runPath: string, appName: string): Promise<string> => {
  const tag = process.env.TAG!

  return new Promise((resolve, reject) => {
    exec(`cd ${runPath} && nohup ./start.sh __${tag}__ __${appName}__ > output.log 2>&1 &`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        reject(error.message);
        return;
      }

      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        reject(stderr);
        return;
      }

      resolve(stdout);
    });
  });
};
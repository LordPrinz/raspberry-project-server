import { exec } from 'child_process';

export type processType = {
  pid: string;
  command: string
}

export const getDirectoryProcesses = (targetDirectory: string): Promise<processType[]> => {
  return new Promise((resolve, reject) => {
    exec('ps aux', (error, stdout, stderr) => {
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

      const processes = stdout.split('\n').map(line => line.split(/\s+/));

      const filteredProcesses = processes.filter(processInfo => {
        const command = processInfo.slice(2).join(' ');
        return command.includes(targetDirectory);
      });

      const result = filteredProcesses.map(processInfo => {
        return {
          pid: processInfo[1],
          command: processInfo.slice(10).join(' ')
        };
      });

      resolve(result);
    });
  });
}

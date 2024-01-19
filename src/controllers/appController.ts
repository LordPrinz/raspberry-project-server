import { Request, Response } from "express";
import { findActiveApps, findAppData, getDirectoryProcesses, terminateProcess as terminate } from "../utils/Process";
import catchAsync from "../utils/catchAsync";
import { getDirectoryApps } from "../utils/Directory";

export const getAll = catchAsync(async (_: Request, res: Response) => {
  const targetDirectory = process.env.TARGET_DIRECTORY!;

  const directoryApps = getDirectoryApps(targetDirectory);
  const processes = await getDirectoryProcesses()
  const activeApps = await findActiveApps(directoryApps, processes);

  res.status(200).json({
    data: activeApps
  })
})


export const getOne = catchAsync(async (req: Request, res: Response) => {

  const {appName} = req.params

  const appData = await findAppData(appName)

  res.status(200).json({
    data: appData
  })

})
export const terminateProcess = catchAsync(async (req: Request, res: Response) => {

  const {appName} = req.params

  const appData = await findAppData(appName)
  
  if(!appData) {
    return res.status(404).json({ error: 'App not found' });
  }

  const {pids} = appData

  if(pids.length === 0) {
    return  res.status(418).json({
      data: "Process is not running"
    })
  }

  pids.forEach(pid => {
    terminate(pid);
  })
  

})
export const startProcess = catchAsync(async (req: Request, res: Response) => {


  
})
import { Request, Response } from "express";
import { findActiveApps, findAppData, getDirectoryProcesses } from "../utils/Process";
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
export const terminateProcess = catchAsync(async (req: Request, res: Response) => {})
export const startProcess = catchAsync(async (req: Request, res: Response) => {})
import { Request, Response } from "express";
import { findActiveApps, getDirectoryProcesses } from "../utils/Process";
import catchAsync from "../utils/catchAsync";
import { getDirectoryApps } from "../utils/Directory";

export const getAll = catchAsync(async (_: Request, res: Response) => {
  const targetDirectory = process.env.TARGET_DIRECTORY!;

  const directoryApps = getDirectoryApps(targetDirectory);
  const processes = await getDirectoryProcesses(targetDirectory)
  const activeApps = await findActiveApps(directoryApps, processes);

  res.status(200).json({
    data: activeApps
  })
})


export const getOne = catchAsync(async () => {})
export const terminateProcess = catchAsync(async () => {})
export const startProcess = catchAsync(async () => {})
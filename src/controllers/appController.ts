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

  
  // if(processes.length === 0) {
  //   return res.status(204).json({
  //     data: null
  //   })
  // }

  // res.status(200).json({
  //   data: processes
  // })
})


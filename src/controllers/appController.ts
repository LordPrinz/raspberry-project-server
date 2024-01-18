import { Request, Response } from "express";
import { getDirectoryProcesses } from "../utils/Process";

export const getAll = async (req: Request, res: Response) => {
  const targetDirectory = process.env.TARGET_DIRECTORY!;
  const processes = await getDirectoryProcesses(targetDirectory)
  
  if(processes.length === 0) {
    return res.status(204).json({
      data: null
    })
  }

  res.status(200).json({
    data: processes
  })
}


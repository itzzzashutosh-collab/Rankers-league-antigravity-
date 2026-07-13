import { Request, Response, NextFunction } from "express";

export function handleAlertMessages(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const alertText = err.message || "An unexpected situation occurred inside the backend engine.";
  res.status(500).json({
    success: false,
    alertText,
  });
}

export function validateAspirantSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({
      success: false,
      alertText: "Aspirant session credentials missing.",
    });
    return;
  }
  next();
}

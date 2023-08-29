import { Request } from "express";

export type UpdateFeedbackRequestModel = Request<{ id: string }, {}, { content: string }>
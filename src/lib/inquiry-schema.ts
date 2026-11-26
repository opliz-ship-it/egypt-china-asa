import { z } from "zod";

export const inquiryCategoryValues = [
  "films",
  "granules",
  "custom",
] as const;

export const inquiryRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().min(7).max(40),
  category: z.enum(inquiryCategoryValues),
  message: z.string().trim().min(15).max(2000),
  locale: z.enum(["ar", "en"]).optional(),
  productCode: z.string().trim().max(80).optional(),
  website: z.string().max(120).optional(),
  formStartedAt: z.number().int().positive().optional(),
});

export type InquiryRequestPayload = z.infer<typeof inquiryRequestSchema>;

export interface InquiryFieldErrors {
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  category?: string;
  message?: string;
}

export interface InquiryApiResponse {
  ok: boolean;
  referenceId?: string;
  submittedAt?: string;
  fieldErrors?: InquiryFieldErrors;
  serverError?: string;
}

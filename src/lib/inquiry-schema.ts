import { z } from "zod";

export const inquiryCategoryValues = [
  "films",
  "granules",
  "custom",
] as const;

export const inquiryRequestSchema = z.object({
  fullName: z.string().trim().min(2),
  company: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  category: z.enum(inquiryCategoryValues),
  message: z.string().trim().min(15),
  locale: z.enum(["ar", "en"]).optional(),
  productCode: z.string().trim().optional(),
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

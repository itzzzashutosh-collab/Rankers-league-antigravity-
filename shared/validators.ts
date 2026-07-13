import { z } from "zod";

export const emailAddressValidator = z
  .string()
  .min(1, "Email target required")
  .email("Invalid email address configuration");

export const enrollmentPayloadValidator = z.object({
  aspirantId: z.string().uuid("Invalid identifier layout for aspirant"),
  leagueId: z.string().uuid("Invalid identifier layout for league"),
  declaredPaymentDetails: z.object({
    creditAmount: z.number().nonnegative("Credit value must be positive"),
    transactionReference: z.string().min(1, "Transaction reference required"),
  }),
});

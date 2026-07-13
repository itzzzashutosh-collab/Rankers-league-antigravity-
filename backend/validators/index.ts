import { z } from "zod";

export const enrollParticipantSchema = z.object({
  leagueId: z.string().uuid("Invalid league ID structure"),
  aspirantId: z.string().uuid("Invalid aspirant ID structure"),
  declaredPaymentDetails: z.object({
    creditAmount: z.number().nonnegative(),
    transactionReference: z.string(),
  }),
});

export type EnrollParticipantPayload = z.infer<typeof enrollParticipantSchema>;

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const documentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.document.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { uploadedAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // First check if the document belongs to the user
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      // Delete from database
      await ctx.db.document.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  updateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().optional(),
        category: z.enum([
          "GENERAL",
          "XRAY",
          "MRI_CT_SCAN",
          "ULTRASOUND_REPORT",
          "ECG_EKG_REPORT",
          "LAB_TEST_REPORT",
          "PRESCRIPTION",
          "REFERRAL_LETTER",
          "SURGERY_RECORD",
          "VACCINATION_CERTIFICATE",
          "COVID_TEST_RESULT",
          "INSURANCE_DOCUMENT",
          "OTHER",
        ]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // First check if the document belongs to the user
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!document) {
        throw new Error("Document not found or access denied");
      }

      return ctx.db.document.update({
        where: { id: input.id },
        data: {
          description: input.description,
          category: input.category,
        },
      });
    }),
});

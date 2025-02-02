import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Chat-related procedures

  // Fetch messages for the chat (top-level messages)
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      where: { parentId: null }, // use relation filter syntax
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        replies: {
          include: { createdBy: true },
          // orderBy: { createdAt: "asc" }, // uncomment if supported
        },
      },
    });
  }),

  // Create a new chat message (or reply)
  createMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        parentId: z.number().optional(), // for replies
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: input.parentId === undefined
          ? {
              name: input.content,
              createdById: ctx.session.user.id,            }
          : {
              name: input.content,
              parentId: input.parentId, // now guaranteed to be a number
              createdById: ctx.session.user.id,            },
      });
    }),

  // Edit an existing message (only allow if the user is the author)
  editMessage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });
      if (!post || post.createdById !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      return ctx.db.post.update({
        where: { id: input.id },
        data: {
          name: input.content,
          editedAt: new Date(),
        },
      });
    }),

  // Delete a message (only allow if the user is the author)
  deleteMessage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({ where: { id: input.id } });
      if (!post || post.createdById !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }
      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  // Like a message
  likeMessage: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.postLike.create({
        data: {
          post: { connect: { id: input.postId } },
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Unlike a message
  unlikeMessage: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.postLike.delete({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });
    }),

  // General post procedures

  // Create a new post (non-chat specific)
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Get the latest post created by the current user
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
    return post ?? null;
  }),

  // A simple test endpoint for secret messages
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
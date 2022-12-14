import { Prisma, User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { z } from "zod";

import { publicProcedure, router } from "..";
import { prisma } from "@db";

const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again later.";

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  application: z.enum(["INERTIION"]),
});

const signUp = publicProcedure
  .input(signUpInput)
  .mutation(async ({ input: { application, email, password } }) => {
    try {
      const hashedPassword = await hash(password, 12);

      const signUpRes = await prisma.user.create({
        data: { application, email, password: hashedPassword },
      });

      const userData: Omit<User, "password"> = {
        application: signUpRes.application,
        email: signUpRes.email,
        id: signUpRes.id,
      };

      const token = sign(userData, process.env.SECRET!);

      return {
        message: `${email} signed up successfully.`,
        token,
        userData,
      };
    } catch (e) {
      console.log(e);

      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const metaTarget = e?.meta?.target as string[];

        if (metaTarget?.includes("email")) {
          throw new Error("Email already in use!");
        } else {
          throw new Error(GENERIC_ERROR_MESSAGE);
        }
      } else {
        throw new Error(GENERIC_ERROR_MESSAGE);
      }
    }
  });

const login = publicProcedure
  .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
  .mutation(async ({ input: { email, password } }) => {
    try {
      const targetUser = await prisma.user.findFirstOrThrow({
        where: { email },
      });

      const isPasswordMatch = await compare(password, targetUser.password);

      if (!!isPasswordMatch) {
        const userData: Omit<User, "password"> = {
          application: targetUser.application,
          email: targetUser.email,
          id: targetUser.id,
        };

        const token = sign(userData, process.env.SECRET!);

        return { token, userData };
      } else {
        throw new Error("Invalid credentials.");
      }
    } catch (e) {
      throw new Error("Invalid credentials.");
    }
  });

const verifyToken = publicProcedure
  .input(z.object({ token: z.string() }))
  .mutation(({ input: { token } }) => {
    try {
      verify(token, process.env.SECRET!);

      return { status: "OK" };
    } catch {
      throw new Error("Invalid token.");
    }
  });

export const authRouter = router({ login, signUp, verifyToken });

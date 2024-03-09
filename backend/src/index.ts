import {
  createNoteSchema,
  signinSchema,
  signupSchema,
  updateNoteSchema,
} from "@ganicodes/sna-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import { logger } from "hono/logger";
import { toHashPassword, verifyPassword } from "./bcryptConfig";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: any;
  };
}>();

app.use(logger());

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173", "https://notesapp.ganicodes.in"],
    credentials: true,
  })
);

app.use("/api/*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set("prisma", prisma);
  await next();
});

app.use("/api/notes/*", async (c, next) => {
  // get the header
  // verify the header
  // if the header is correct, we can proceed
  const header = c.req.header("Authorization") || "";
  if (!header) {
  }
  const decodedHeader = await verify(header, c.env.JWT_SECRET);

  if (!decodedHeader) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  c.set("userId", decodedHeader.id);
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/signin", async (c) => {
  const prisma = c.get("prisma");
  const body = await c.req.json();

  const { success } = signinSchema.safeParse(body);
  if (!success) {
    // if inputs are not valid
    c.status(411);
    return c.json({
      error: "Invalid Inputs",
      message: "Invalid inputs",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    c.status(404);
    return c.json({ message: "User not found!" });
  }

  const isValidPassword = await verifyPassword(body.password, user.password);
  if (!isValidPassword) {
    c.status(401);
    return c.json({
      error: "Unauthorized",
      message: "Invalid username or password",
    });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
});

app.post("/api/signup", async (c) => {
  const prisma = c.get("prisma");

  const body = await c.req.json();

  const result = signupSchema.safeParse(body);
  if (!result.success) {
    c.status(403);
    return c.json({ message: "Invalid Input", error: result.error });
  }

  const isUserAlreadyExists = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (isUserAlreadyExists) {
    c.status(409);
    return c.json({ message: "User already signed up using same email" });
  }

  const hashedPassword = await toHashPassword(body.password);

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    console.log("jwt: ", jwt);
    return c.json({ jwt });
  } catch (e) {
    c.status(500);
    return c.json({ error: e });
  }
});

app.post("/api/notes", async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");

  const body = await c.req.json();

  const result = createNoteSchema.safeParse(body);
  if (!result.success) {
    c.status(403);
    return c.json({ message: "Insufficient Data", error: result.error });
  }

  try {
    const note = await prisma.note.create({
      data: {
        title: body.title || "",
        description: body.description,
        authorId: userId,
      },
    });

    c.status(200);
    return c.json({ message: "Note created successfully", data: note });
  } catch (error) {
    c.status(500);
    return c.json({ error: error });
  }
});

app.get("/api/notes", async (c) => {
  const id = c.get("userId");
  const prisma = c.get("prisma");
  const notes = await prisma.note.findMany({
    where: {
      authorId: id,
      isDeleted: false,
    },
  });
  return c.json({ notes });
});

app.put("/api/notes", async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const body = await c.req.json();

  const result = updateNoteSchema.safeParse(body);
  if (!result.success) {
    c.status(403);
    return c.json({ message: "Insufficient Data", error: result.error });
  }

  const note = await prisma.note.update({
    where: {
      id: body.id,
      authorId: userId,
    },
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return c.json({ message: "Note updated successfully", data: note });
});

export default app;

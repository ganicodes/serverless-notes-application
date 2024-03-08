import { Hono } from "hono";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import zod from "zod";
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

// app.use(logger());

app.use("/api/*", cors());

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

  const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
  });

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

  const signupSchema = zod.object({
    email: zod.string().email().min(1, "Email cannot be empty"),
    password: zod.string().min(8, "Atleast 8 charachters"),
    name: zod.string().min(3, "Name cannot be empty"),
  });

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
    return c.json({ jwt });
  } catch (e) {
    c.status(500);
    return c.json({ error: e });
  }
});

app.post("/api/notes", async (c) => {
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const createNoteSchema = zod.object({
    title: zod
      .string()
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
    description: zod.string().min(1),
  });

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

app.patch("/api/notes", async (c) => {
  const id = c.req.query("id");
  const isDeleted = c.req.query("isDeleted");
  console.log("isDelete: ", isDeleted);
  const isArchived = c.req.query("isArchived");
  console.log("isArchived: ", isArchived);
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const body = await c.req.json();
  try {
    let note;
    // if (isDelete) {
    //   note = await prisma.note.update({
    //     where: {
    //       id: id,
    //       authorId: userId,
    //     },
    //     data: {
    //       isDeleted: true,
    //     },
    //   });
    //   return c.json({ message: "Task sent to bin successfully", data: note });
    // }

    // if (isArchived) {
    //   note = await prisma.note.update({
    //     where: {
    //       id: id,
    //       authorId: userId,
    //     },
    //     data: {
    //       isArchived: true,
    //     },
    //   });
    //   return c.json({ message: "Task is archived successfully", data: note });
    // }

    note = await prisma.note.update({
      where: {
        id: id,
        authorId: userId,
      },
      data: body,
    });
    return c.json({ message: "Note updated successfully", data: note });
  } catch (error) {
    c.status(500);
    return c.json({ error: error });
  }
});

app.put("/api/notes", async (c) => {
  const id = c.req.query("id");
  const isDelete = c.req.query("delete");
  console.log("isDelete: ", isDelete);
  const prisma = c.get("prisma");
  const userId = c.get("userId");
  const note = await prisma.note.update({
    where: {
      id: id,
      authorId: userId,
    },
    data: {
      isDeleted: true,
    },
  });
  return c.json({ message: "Note created successfully", data: note });
});

export default app;

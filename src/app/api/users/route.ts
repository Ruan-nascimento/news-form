import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "hajebx07HHlZjKx7x6-B53RDqGbXeDqg9lcPrZ_iBHEB";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail são obrigatórios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        name,
      },
    });

    let user;
    if (existingUser) {
      user = existingUser;
    } else {
      user = await prisma.user.create({
        data: { name, email },
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        user,
        token,
        message: existingUser ? "Usuário já cadastrado" : "Usuário criado com sucesso",
      },
      { status: existingUser ? 200 : 201 }
    );
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro ao cadastrar usuário", message: String(error) },
      { status: 500 }
    );
  }
}
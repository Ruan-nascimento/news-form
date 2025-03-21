"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import {jwtDecode} from "jwt-decode";
import { API_URL } from "@/lib/utils";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          router.push(`/client/news/${decoded.id}`);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/users`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error("Erro ao cadastrar", {
          description: data.error || "Algo deu errado.",
        });
        return;
      }

      localStorage.setItem("token", data.token);

      if (response.status === 200) {
        toast.success(`Bem-vindo de volta, ${data.user.name}!`, {
          description: "Redirecionando para sua área de notícias...",
        });
        setTimeout(() => {
          router.push(`/client/news/${data.user.id}`);
        }, 1500);
        return;
      }

      if (response.status === 201) {
        toast.success(`Parabéns ${data.user.name}, Você agora está na nossa newsletter!`, {
          description: "Redirecionando para sua área de notícias...",
        });
        setName("");
        setEmail("");
        setTimeout(() => {
          router.push(`/client/news/${data.user.id}`);
        }, 1500);
      }
    } catch (error) {
      toast.error("Erro inesperado", {
        description: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700">
        <h1 className="text-2xl font-bold text-indigo-400 mb-6 text-center">
          Cadastre-se no Shadow Runner
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-200"
            >
              Nome
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-1 bg-zinc-700 border-zinc-600 text-zinc-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-200"
            >
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
              className="mt-1 bg-zinc-700 border-zinc-600 text-zinc-100 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
          >
            Cadastrar
          </Button>
        </form>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";
import { API_URL } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { BoxMessage } from "@/app/_components/boxMessage";

export type NewsItem = {
  id: number;
  subject: string;
  sender: string;
  date: string;
  content: string;
  read: boolean;
  category: string;
};


const mockNews = [
    {
      id: 1,
      subject: "Bem-vindo ao Shadow Runner!",
      sender: "Equipe Shadow Runner",
      date: "21 Mar 2025",
      content: "Olá! Você foi cadastrado com sucesso na nossa newsletter. Fique ligado nas novidades!",
      read: false,
      category: "Principal",
    },
    {
      id: 2,
      subject: "Atualização 1.1 Disponível",
      sender: "Suporte Shadow Runner",
      date: "20 Mar 2025",
      content: "Nova versão com melhorias no parkour e sombras mais rápidas!",
      read: true,
      category: "Atualizações",
    },
    {
      id: 3,
      subject: "Oferta Especial de Lançamento",
      sender: "Marketing Shadow Runner",
      date: "19 Mar 2025",
      content: "Aproveite 20% de desconto na sua primeira compra!",
      read: false,
      category: "Promoções",
    },
    {
      id: 4,
      subject: "Novo Evento na Comunidade",
      sender: "Comunidade Shadow Runner",
      date: "18 Mar 2025",
      content: "Participe do nosso evento online neste fim de semana!",
      read: true,
      category: "Social",
    },
  ];

export default function NewsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [selectedTab, setSelectedTab] = useState<string>("Primary");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]); 
  const [starredEmails, setStarredEmails] = useState<number[]>([]);

 
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime || decoded.id !== String(id)) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      const fetchUser = async () => {
        try {
          const response = await fetch(`${API_URL}/api/users/${id}`);
          if (response.ok) {
            const user = await response.json();
            setUserName(user.name);
          } else {
            throw new Error("Erro ao buscar usuário");
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
          router.push("/");
        }
      };
      fetchUser();
    } catch (error) {
      console.error("Erro ao validar token:", error);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [id, router]);

  const filteredNews = news.filter((item) => item.category === selectedTab);

  const getUnreadCount = (category: string) =>
    news.filter((item) => item.category === category && !item.read).length;


  if (!userName) return null;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">
          Caixa de Entrada de {userName}
        </h1>

        <div className="flex space-x-4 mb-4 border-b border-zinc-700">
          {["Principal", "Promoções", "Social", "Atualizações"].map((tab) => (
            <Button
              key={tab}
              variant={selectedTab === tab ? "default" : "ghost"}
              className={`relative px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                selectedTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab} {getUnreadCount(tab) > 0 && (
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    tab === "Promoções"
                      ? "bg-green-600"
                      : tab === "Social"
                      ? "bg-blue-600"
                      : tab === "Atualizações"
                      ? "bg-orange-600"
                      : "bg-indigo-600"
                  }`}
                >
                  {getUnreadCount(tab)} new
                </span>
              )}
            </Button>
          ))}
        </div>



        <div className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700">
          {filteredNews.length === 0 ? (
            <div className="p-4 text-zinc-400 text-center">
              Nenhum e-mail nesta categoria.
            </div>
          ) : (
            filteredNews.map((item) => (
              <BoxMessage
              key={item.id}
              item={item}
              selectedEmails={selectedEmails}
              setSelectedEmails={setSelectedEmails}
              setStarredEmails={setStarredEmails}
              starredEmails={starredEmails}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
import { NewsItem } from "@/app/(pages)/client/news/[id]/page"
import { Checkbox } from "@/components/ui/checkbox"
import { Star } from "lucide-react"

interface BoxMessageProps {
    item: NewsItem
    selectedEmails: number[]
    starredEmails: number[]
    setStarredEmails: (prev: any) => void
    setSelectedEmails: (prev: any) => void
}

export const BoxMessage = ({item, selectedEmails, setSelectedEmails, starredEmails, setStarredEmails}:BoxMessageProps) => {
    const toggleEmailSelection = (id: number) => {
        setSelectedEmails((prev: any) =>
          prev.includes(id) ? prev.filter((emailId: any) => emailId !== id) : [...prev, id]
        );
      };
    
      const toggleStar = (id: number) => {
        setStarredEmails((prev: any) =>
          prev.includes(id) ? prev.filter((emailId: any) => emailId !== id) : [...prev, id]
        );
      };
    return(
        <div
        key={item.id}
        className={`flex items-center p-4 border-b border-zinc-700 hover:bg-zinc-700 transition-colors ${
            !item.read ? "font-semibold" : ""
        }`}
        >
            <Checkbox
                checked={selectedEmails.includes(item.id)}
                onCheckedChange={() => toggleEmailSelection(item.id)}
                className="mr-3"
            />

            {/* Estrela */}
            <button onClick={() => toggleStar(item.id)} className="mr-3">
                <Star
                className={`h-5 w-5 ${
                    starredEmails.includes(item.id)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-zinc-500"
                }`}
                />
            </button>

            {/* Remetente */}
            <div className="w-1/4 text-zinc-100 truncate">
                {item.sender}
            </div>

            {/* Assunto e Conteúdo */}
            <div className="flex-1 truncate">
                <span className="text-zinc-100">{item.subject}</span>
                <span className="text-zinc-400 ml-2">
                - {item.content}
                </span>
            </div>

            {/* Data */}
            <div className="w-1/6 text-right text-zinc-400">
                {item.date}
            </div>
        </div>
    )
}
import { NotesCard } from "@/components/NotesCard";

export default function Notes() {
  return (
    <div className="mx-auto max-w-5xl px-8">
      <NotesCard items={projects} />
    </div>
  );
}
export const projects = [
  {
    id: "abc",
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
  },
  {
    id: "abcd",
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
  },
  {
    id: "abcds",
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
  },
  {
    id: "abca",
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
  },
  {
    id: "abcq",
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
  },
  {
    id: "abc1",
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
  },
];

import { redirect } from "next/navigation";
import { readData } from "@/lib/data";

export default async function Home() {
  const data = await readData();

  if (data.config.goals.length > 0) {
    redirect("/tracker");
  } else {
    redirect("/setup");
  }
}

import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import type { Entry } from "@/lib/types";

export async function GET(request: NextRequest) {
  const data = await readData();
  const lastParam = request.nextUrl.searchParams.get("last");

  if (lastParam) {
    const n = parseInt(lastParam, 10);
    return NextResponse.json(data.entries.slice(-n));
  }

  return NextResponse.json(data.entries);
}

export async function POST(request: Request) {
  const entry: Entry = await request.json();
  const data = await readData();

  const existingIndex = data.entries.findIndex((e) => e.date === entry.date);
  if (existingIndex >= 0) {
    data.entries[existingIndex] = entry;
  } else {
    data.entries.push(entry);
    data.entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  await writeData(data);
  return NextResponse.json({ ok: true });
}

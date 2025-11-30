import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";

async function getUser(req) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (!token) return null;
  const { data } = await supabaseServer.auth.getUser(token);
  return data?.user || null;
}

export async function GET(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseServer
    .from("incomes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = { ...body, user_id: user.id };

  const { data, error } = await supabaseServer
    .from("incomes")
    .insert([payload])
    .select();

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data[0]);
}

export async function PATCH(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { id, amount?, source?, note?, date? }
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabaseServer
    .from("incomes")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data[0]);
}

export async function DELETE(req) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseServer
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ success: true });
}
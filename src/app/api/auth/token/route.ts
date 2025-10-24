import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Devolver el token para uso del socket
    return NextResponse.json({ token: accessToken.value });
  } catch (error) {
    console.error("Error getting token:", error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}

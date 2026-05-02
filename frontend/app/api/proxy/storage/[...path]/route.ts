import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const backendUrl = `http://127.0.0.1:8000/storage/${path}`;

  try {
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=3600');

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error('Storage Proxy Error:', error);
    return new NextResponse("Error connecting to backend storage", { status: 500 });
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params, 'POST');
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params, 'GET');
}

export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params, 'PUT');
}

export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return handleProxy(req, params, 'DELETE');
}

async function handleProxy(req: Request, params: { path: string[] }, method: string) {
  const session = await getServerSession(authOptions as any);
  
  if (!session || (session as any).user?.rol !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const path = params.path.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/${path}`;
  
  const headers = new Headers();
  headers.set('X-Admin-Key', process.env.ADMIN_API_KEY || '');
  headers.set('X-Admin-Email', (session as any).user?.email || '');
  headers.set('Accept', 'application/json');
  
  const contentType = req.headers.get('content-type');
  if (contentType && !contentType.includes('multipart/form-data')) {
    headers.set('Content-Type', contentType);
  }

  let body: any = undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await req.blob();
      if (body.size === 0) body = undefined;
    } catch (e) {
      body = undefined;
    }
  }

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Backend connection failed' }, { status: 500 });
  }
}

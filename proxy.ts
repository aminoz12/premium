import { NextResponse } from 'next/server';

export function proxy(){
  return new NextResponse('Search is not available.',{
    status:404,
    headers:{'content-type':'text/plain; charset=utf-8'},
  });
}

export const config={
  matcher:[{
    source:'/:path*',
    has:[{type:'query',key:'s'}],
  }],
};

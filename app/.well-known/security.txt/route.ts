import { SITE_URL } from '@/lib/site';

export function GET(){
  const text=`Contact: ${SITE_URL}/contact\nCanonical: ${SITE_URL}/.well-known/security.txt\nExpires: 2027-08-11T23:59:59Z\nPreferred-Languages: en\nPolicy: ${SITE_URL}/terms-of-service\n`;
  return new Response(text,{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600'}});
}

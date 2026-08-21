#!/usr/bin/env python3
"""Build one branded 1200x630 social card for every URL in the local sitemap."""
from __future__ import annotations
import html,json,re,urllib.request
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps

BASE='http://127.0.0.1:3000'
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/images/og'
BASES=ROOT/'public/images/og-bases'
FONT_REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'


def get(path:str)->str:
    with urllib.request.urlopen(BASE+path,timeout=20) as r:return r.read().decode('utf-8')

def clean(fragment:str)->str:
    fragment=re.sub(r'<br\s*/?>',' ',fragment,flags=re.I)
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',fragment))).strip()

def slug(path:str)->str:return 'home' if path=='/' else path.strip('/').replace('/','--')

def background(path:str)->str:
    if path=='/':return '../commercial/iptv-hero.webp'
    if path=='/live-tv':return '../commercial/live-tv.webp'
    if path=='/sports':return 'stadium-final.webp'
    if path=='/movies':return '../commercial/movies.webp'
    if path=='/series':return '../commercial/series.webp'
    if path in ['/pricing','/order','/setup-guides']:return '../commercial/devices.webp'
    if path.endswith('/awards'):return 'awards-gold.webp'
    if path.endswith('/final-standings'):return 'standings-data.webp'
    if '/replays' in path or path.endswith('/watch-soccer-without-cable'):return 'replay-stream.webp'
    if path.endswith('/teams'):return 'teams-world.webp'
    if path.endswith('/host-cities'):return 'host-cities.webp'
    if path.startswith('/world-cup-history'):return 'history-archive.webp'
    if path in ['/world-cup-2026','/world-cup-2026/final']:return 'stadium-final.webp'
    if path.startswith('/research') or path in ['/data','/about','/editorial-policy','/corrections','/contact','/support','/privacy-policy','/terms-of-service','/updates','/guides/is-iptv-legal','/guides/sports-streaming-accessibility']:return 'research-trust.webp'
    return 'stream-tech.webp'

def footer_label(path:str)->str:
    return 'IPTV SUBSCRIPTION SERVICE' if path in ['/','/live-tv','/sports','/movies','/series','/pricing','/order','/setup-guides','/support'] else 'INDEPENDENT EDITORIAL RESOURCE'

def label(path:str)->str:
    if path=='/':return 'WATCHWORLDCUP IPTV · M3U SUBSCRIPTIONS'
    if path in ['/live-tv','/sports','/movies','/series']:return 'WATCHWORLDCUP IPTV · CONTENT CATEGORY'
    if path=='/pricing':return 'WATCHWORLDCUP IPTV · PRICING'
    if path=='/order':return 'WATCHWORLDCUP IPTV · GUIDED ORDER'
    if path=='/setup-guides':return 'IPTV / M3U SETUP GUIDES'
    if path.startswith('/world-cup-history'):return 'WORLD CUP HISTORY · 1930–2026'
    if path.startswith('/world-cup-2026'):return 'WORLD CUP 2026 · COMPLETED TOURNAMENT'
    if path.startswith('/guides'):return 'EVIDENCE-LED STREAMING GUIDE'
    if path=='/data':return 'OPEN DATA · CSV · JSON · PROVENANCE'
    if path.startswith('/research'):return 'OPEN RESEARCH & DATA'
    return 'EDITORIAL TRUST & SITE INFORMATION'

def wrap(draw:ImageDraw.ImageDraw,text:str,font:ImageFont.FreeTypeFont,width:int,max_lines:int|None=None)->list[str]:
    words=text.split();lines=[];line=''
    for word in words:
        trial=(line+' '+word).strip()
        if draw.textbbox((0,0),trial,font=font)[2]<=width:line=trial
        else:
            if line:lines.append(line)
            line=word
    if line:lines.append(line)
    if max_lines and len(lines)>max_lines:
        lines=lines[:max_lines]
        while draw.textbbox((0,0),lines[-1]+'…',font=font)[2]>width and ' ' in lines[-1]:lines[-1]=lines[-1].rsplit(' ',1)[0]
        lines[-1]+='…'
    return lines

def build(path:str,title:str,description:str,bg_name:str)->dict:
    bg=Image.open(BASES/bg_name).convert('RGB')
    image=ImageOps.fit(bg,(1200,630),method=Image.Resampling.LANCZOS,centering=(.64,.5)).convert('RGBA')
    overlay=Image.new('RGBA',image.size,(0,0,0,0));od=ImageDraw.Draw(overlay)
    for x in range(1200):
        alpha=int(238-(x/1199)*120)
        od.line((x,0,x,630),fill=(7,7,8,max(108,alpha)))
    for y in range(630):
        alpha=int(18+(y/629)*80)
        od.line((0,y,1200,y),fill=(7,7,8,alpha))
    image=Image.alpha_composite(image,overlay);d=ImageDraw.Draw(image)
    cyan=(239,59,79,255);white=(248,250,252,255);muted=(203,213,225,255);gold=(255,77,94,255);navy=(8,8,8,240)
    # Brand lockup
    d.rounded_rectangle((64,48,118,102),radius=14,fill=(220,38,55,255))
    d.text((76,65),'WWC',font=ImageFont.truetype(FONT_BOLD,13),fill=white)
    d.text((134,59),'WATCH',font=ImageFont.truetype(FONT_BOLD,23),fill=white)
    d.text((226,59),'WORLDCUP',font=ImageFont.truetype(FONT_BOLD,23),fill=cyan)
    # Kicker
    kicker=label(path)
    d.rounded_rectangle((64,137,64+min(760,25+len(kicker)*12),178),radius=20,fill=navy,outline=(239,59,79,90),width=1)
    d.text((84,148),kicker,font=ImageFont.truetype(FONT_BOLD,16),fill=cyan)
    # Headline, shrink until max three lines
    size=64
    title_lines=[]
    while size>=36:
        title_font=ImageFont.truetype(FONT_BOLD,size)
        title_lines=wrap(d,title,title_font,820)
        if len(title_lines)<=3 and len(title_lines)*(size+10)<=230:break
        size-=2
    if len(title_lines)>3:title_lines=wrap(d,title,title_font,820,3)
    y=207
    for line in title_lines:
        d.text((64,y),line,font=title_font,fill=white,stroke_width=1,stroke_fill=(0,0,0,60));y+=size+10
    # Description
    desc_font=ImageFont.truetype(FONT_REG,22)
    y=max(y+15,450)
    for line in wrap(d,description,desc_font,820,2):
        d.text((66,y),line,font=desc_font,fill=muted);y+=31
    # Bottom marker
    d.line((64,580,1136,580),fill=(148,163,184,80),width=1)
    d.ellipse((64,599,74,609),fill=gold)
    d.text((88,592),'watchworldcup.us',font=ImageFont.truetype(FONT_BOLD,18),fill=white)
    d.text((878,593),footer_label(path),font=ImageFont.truetype(FONT_BOLD,13),fill=(148,163,184,255))
    target=OUT/f'{slug(path)}.webp';target.parent.mkdir(parents=True,exist_ok=True)
    image.convert('RGB').save(target,'WEBP',quality=84,method=6)
    return {'path':path,'file':'/'+str(target.relative_to(ROOT/'public')).replace('\\','/'),'title':title,'background':bg_name,'width':1200,'height':630,'bytes':target.stat().st_size}

def main():
    sitemap=get('/sitemap.xml')
    paths=[re.sub(r'^https://watchworldcup\.us','',u) or '/' for u in re.findall(r'<url>\s*<loc>(.*?)</loc>',sitemap)]
    records=[]
    for path in paths:
        page=get(path)
        title_match=re.search(r'<h1[^>]*>(.*?)</h1>',page,re.S|re.I)
        desc_match=re.search(r'<meta name="description" content="([^"]+)',page,re.I)
        if not title_match or not desc_match:raise RuntimeError(f'Missing title data for {path}')
        records.append(build(path,clean(title_match.group(1)),html.unescape(desc_match.group(1)),background(path)))
    manifest=ROOT/'public/images/og/manifest.json'
    manifest.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Generated {len(records)} unique social cards at {OUT}')

if __name__=='__main__':main()

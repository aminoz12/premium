#!/usr/bin/env python3
"""Convert project raster images to compressed WebP while preserving dimensions."""
from __future__ import annotations
import argparse
from pathlib import Path
from PIL import Image, ImageOps

RASTER={'.jpg','.jpeg','.png','.gif','.bmp','.avif'}
EXCLUDED={'node_modules','.next','__pycache__'}

def candidates(roots:list[Path]):
    seen=set()
    for root in roots:
        items=[root] if root.is_file() else root.rglob('*')
        for item in items:
            if not item.is_file() or item.suffix.lower() not in RASTER or any(part in EXCLUDED for part in item.parts):continue
            resolved=item.resolve()
            if resolved not in seen:
                seen.add(resolved);yield item

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('paths',nargs='*',default=['.'])
    parser.add_argument('--quality',type=int,default=82)
    parser.add_argument('--keep-originals',action='store_true')
    args=parser.parse_args()
    if not 1<=args.quality<=100:raise SystemExit('Quality must be between 1 and 100')
    converted=0;before=0;after=0
    for source in candidates([Path(value) for value in args.paths]):
        destination=source.with_suffix('.webp');temporary=destination.with_suffix('.webp.tmp')
        before+=source.stat().st_size
        with Image.open(source) as image:
            image=ImageOps.exif_transpose(image)
            has_alpha=image.mode in {'RGBA','LA'} or 'transparency' in image.info
            image.convert('RGBA' if has_alpha else 'RGB').save(temporary,'WEBP',quality=args.quality,method=6)
        if destination.exists() and destination.stat().st_size<=temporary.stat().st_size:temporary.unlink()
        else:temporary.replace(destination)
        after+=destination.stat().st_size
        if not args.keep_originals:source.unlink()
        converted+=1
        print(f'{source} -> {destination}')
    reduction=(1-after/before)*100 if before else 0
    print(f'Converted {converted} raster file(s); input={before} bytes, output={after} bytes, reduction={reduction:.1f}%')

if __name__=='__main__':main()

#!/usr/bin/env python3
"""Validate dataset row counts, JSON parity, checksums and production delivery."""
from __future__ import annotations
import csv,hashlib,json,sys,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];D=ROOT/'public/downloads';BASE=(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:3000').rstrip('/')
SETS=[('world-cup-2026-replay-sources.csv','world-cup-2026-replay-sources.json',4),('world-cup-2026-final-standings.csv','world-cup-2026-final-standings.json',48),('world-cup-winners-1930-2026.csv','world-cup-winners-1930-2026.json',23),('world-cup-title-records.csv','world-cup-title-records.json',13)]

def main():
    failures=[]
    for csv_name,json_name,expected in SETS:
        with (D/csv_name).open(encoding='utf-8',newline='') as handle:rows=list(csv.DictReader(handle))
        payload=json.loads((D/json_name).read_text(encoding='utf-8'))
        if len(rows)!=expected:failures.append(f'{csv_name}: {len(rows)} rows')
        if payload.get('record_count')!=expected or payload.get('records')!=rows:failures.append(f'{json_name}: CSV parity failed')
        if payload.get('license')!='https://creativecommons.org/licenses/by/4.0/':failures.append(f'{json_name}: license')
    checksum_lines=(D/'data-checksums.sha256').read_text().splitlines()
    for line in checksum_lines:
        digest,name=line.split('  ',1)
        actual=hashlib.sha256((D/name).read_bytes()).hexdigest()
        if actual!=digest:failures.append(f'{name}: checksum mismatch')
    for name in [x for pair in SETS for x in pair[:2]]+['data-checksums.sha256']:
        try:
            request=urllib.request.Request(f'{BASE}/downloads/{name}',method='HEAD')
            with urllib.request.urlopen(request,timeout=20) as response:
                ctype=response.headers.get('content-type','')
                if response.status!=200:failures.append(f'{name}: HTTP {response.status}')
                if name.endswith('.json') and 'application/json' not in ctype:failures.append(f'{name}: MIME {ctype}')
                if name.endswith('.csv') and 'text/csv' not in ctype:failures.append(f'{name}: MIME {ctype}')
        except Exception as exc:failures.append(f'{name}: {exc}')
    if failures:
        print('\n'.join('✗ '+x for x in failures));raise SystemExit(1)
    print(f'✓ {len(SETS)} datasets passed row, JSON parity, license, checksum and delivery checks')
if __name__=='__main__':main()

#!/usr/bin/env python3
"""Generate derived records, JSON distributions and SHA-256 checksums."""
from __future__ import annotations
import csv,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DOWNLOADS=ROOT/'public/downloads'
VERSION='2026-08-11'
LICENSE='https://creativecommons.org/licenses/by/4.0/'

def build_title_records():
    with (DOWNLOADS/'world-cup-winners-1930-2026.csv').open(encoding='utf-8',newline='') as handle:editions=list(csv.DictReader(handle))
    records={}
    normalize=lambda team:'Germany' if team=='West Germany' else team
    for edition in editions:
        winner,runner=normalize(edition['champion']),normalize(edition['runner_up'])
        for team in (winner,runner):records.setdefault(team,{'team':team,'titles':0,'runner_up_finishes':0,'years_won':[],'years_runner_up':[]})
        records[winner]['titles']+=1;records[winner]['years_won'].append(edition['year'])
        records[runner]['runner_up_finishes']+=1;records[runner]['years_runner_up'].append(edition['year'])
    rows=[]
    for record in records.values():
        rows.append({'team':record['team'],'titles':str(record['titles']),'runner_up_finishes':str(record['runner_up_finishes']),'final_appearances':str(record['titles']+record['runner_up_finishes']),'years_won':' | '.join(record['years_won']),'years_runner_up':' | '.join(record['years_runner_up']),'source_dataset':'https://watchworldcup.us/world-cup-history/winners','last_checked':VERSION})
    rows.sort(key=lambda row:(-int(row['titles']),-int(row['final_appearances']),row['team']))
    target=DOWNLOADS/'world-cup-title-records.csv'
    with target.open('w',encoding='utf-8',newline='') as handle:
        writer=csv.DictWriter(handle,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    if len(rows)!=13:raise RuntimeError(f'Expected 13 finalist teams, found {len(rows)}')

DATASETS=[
('World Cup 2026 Replay Source Tracker','world-cup-2026-replay-sources.csv','world-cup-2026-replay-sources.json','/research/world-cup-2026-replay-source-tracker',4),
('World Cup 2026 Final Standings','world-cup-2026-final-standings.csv','world-cup-2026-final-standings.json','/world-cup-2026/final-standings',48),
('World Cup Winners, 1930–2026','world-cup-winners-1930-2026.csv','world-cup-winners-1930-2026.json','/world-cup-history/winners',23),
('World Cup Title and Final Appearance Records','world-cup-title-records.csv','world-cup-title-records.json','/world-cup-history/records',13),
]

def main():
    build_title_records();generated=[]
    for name,csv_name,json_name,page,expected in DATASETS:
        with (DOWNLOADS/csv_name).open(encoding='utf-8',newline='') as handle:records=list(csv.DictReader(handle))
        if len(records)!=expected:raise RuntimeError(f'{csv_name}: expected {expected}, found {len(records)}')
        payload={'name':name,'version':VERSION,'license':LICENSE,'source_page':f'https://watchworldcup.us{page}','record_count':len(records),'records':records}
        target=DOWNLOADS/json_name;target.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');generated.extend([csv_name,json_name])
    generated.append('streaming-benchmark-template.csv')
    lines=[]
    for name in sorted(generated):
        digest=hashlib.sha256((DOWNLOADS/name).read_bytes()).hexdigest();lines.append(f'{digest}  {name}')
    (DOWNLOADS/'data-checksums.sha256').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(f'Generated {len(DATASETS)} JSON distributions and {len(lines)} checksums')
if __name__=='__main__':main()

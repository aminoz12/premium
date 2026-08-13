export type WorldCupEdition={year:number;host:string;champion:string;runnerUp:string;result:string;decision:'Regulation'|'After extra time'|'Penalty shootout'|'Final-round decider'};
export const worldCupEditions:WorldCupEdition[]=[
{year:1930,host:'Uruguay',champion:'Uruguay',runnerUp:'Argentina',result:'4–2',decision:'Regulation'},
{year:1934,host:'Italy',champion:'Italy',runnerUp:'Czechoslovakia',result:'2–1',decision:'After extra time'},
{year:1938,host:'France',champion:'Italy',runnerUp:'Hungary',result:'4–2',decision:'Regulation'},
{year:1950,host:'Brazil',champion:'Uruguay',runnerUp:'Brazil',result:'2–1',decision:'Final-round decider'},
{year:1954,host:'Switzerland',champion:'West Germany',runnerUp:'Hungary',result:'3–2',decision:'Regulation'},
{year:1958,host:'Sweden',champion:'Brazil',runnerUp:'Sweden',result:'5–2',decision:'Regulation'},
{year:1962,host:'Chile',champion:'Brazil',runnerUp:'Czechoslovakia',result:'3–1',decision:'Regulation'},
{year:1966,host:'England',champion:'England',runnerUp:'West Germany',result:'4–2',decision:'After extra time'},
{year:1970,host:'Mexico',champion:'Brazil',runnerUp:'Italy',result:'4–1',decision:'Regulation'},
{year:1974,host:'West Germany',champion:'West Germany',runnerUp:'Netherlands',result:'2–1',decision:'Regulation'},
{year:1978,host:'Argentina',champion:'Argentina',runnerUp:'Netherlands',result:'3–1',decision:'After extra time'},
{year:1982,host:'Spain',champion:'Italy',runnerUp:'West Germany',result:'3–1',decision:'Regulation'},
{year:1986,host:'Mexico',champion:'Argentina',runnerUp:'West Germany',result:'3–2',decision:'Regulation'},
{year:1990,host:'Italy',champion:'West Germany',runnerUp:'Argentina',result:'1–0',decision:'Regulation'},
{year:1994,host:'United States',champion:'Brazil',runnerUp:'Italy',result:'0–0; 3–2 pens',decision:'Penalty shootout'},
{year:1998,host:'France',champion:'France',runnerUp:'Brazil',result:'3–0',decision:'Regulation'},
{year:2002,host:'Korea Republic / Japan',champion:'Brazil',runnerUp:'Germany',result:'2–0',decision:'Regulation'},
{year:2006,host:'Germany',champion:'Italy',runnerUp:'France',result:'1–1; 5–3 pens',decision:'Penalty shootout'},
{year:2010,host:'South Africa',champion:'Spain',runnerUp:'Netherlands',result:'1–0',decision:'After extra time'},
{year:2014,host:'Brazil',champion:'Germany',runnerUp:'Argentina',result:'1–0',decision:'After extra time'},
{year:2018,host:'Russia',champion:'France',runnerUp:'Croatia',result:'4–2',decision:'Regulation'},
{year:2022,host:'Qatar',champion:'Argentina',runnerUp:'France',result:'3–3; 4–2 pens',decision:'Penalty shootout'},
{year:2026,host:'Canada / Mexico / United States',champion:'Spain',runnerUp:'Argentina',result:'1–0',decision:'After extra time'}
];
const normalize=(team:string)=>team==='West Germany'?'Germany':team;
export const titleLeaders=Object.entries(worldCupEditions.reduce<Record<string,number>>((totals,edition)=>{const team=normalize(edition.champion);totals[team]=(totals[team]||0)+1;return totals},{})).map(([team,titles])=>({team,titles,years:worldCupEditions.filter(e=>normalize(e.champion)===team).map(e=>e.year)})).sort((a,b)=>b.titles-a.titles||a.team.localeCompare(b.team));
export const finalRecords=Object.values(worldCupEditions.reduce<Record<string,{team:string;titles:number;runnerUpFinishes:number;yearsWon:number[];yearsRunnerUp:number[]}>>((records,edition)=>{const winner=normalize(edition.champion),runner=normalize(edition.runnerUp);records[winner]??={team:winner,titles:0,runnerUpFinishes:0,yearsWon:[],yearsRunnerUp:[]};records[runner]??={team:runner,titles:0,runnerUpFinishes:0,yearsWon:[],yearsRunnerUp:[]};records[winner].titles++;records[winner].yearsWon.push(edition.year);records[runner].runnerUpFinishes++;records[runner].yearsRunnerUp.push(edition.year);return records},{})).map(row=>({...row,finalAppearances:row.titles+row.runnerUpFinishes})).sort((a,b)=>b.titles-a.titles||b.finalAppearances-a.finalAppearances||a.team.localeCompare(b.team));
export const decisionSummary=['Regulation','After extra time','Penalty shootout','Final-round decider'].map(decision=>({decision,count:worldCupEditions.filter(edition=>edition.decision===decision).length}));
export const hostChampions=worldCupEditions.filter(edition=>edition.host===edition.champion);
export const retainedTitles=worldCupEditions.filter((edition,index)=>index>0&&normalize(edition.champion)===normalize(worldCupEditions[index-1].champion));

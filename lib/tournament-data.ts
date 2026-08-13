export type FinalStanding={rank:string;team:string;finish:'Champions'|'Runners-up'|'Third place'|'Fourth place'|'Quarter-finals'|'Round of 16'|'Round of 32'|'Group stage'};

export const finalStandings:FinalStanding[]=[
  {rank:'1',team:'Spain',finish:'Champions'},{rank:'2',team:'Argentina',finish:'Runners-up'},{rank:'3',team:'England',finish:'Third place'},{rank:'4',team:'France',finish:'Fourth place'},
  {rank:'5',team:'Norway',finish:'Quarter-finals'},{rank:'6',team:'Belgium',finish:'Quarter-finals'},{rank:'7=',team:'Morocco',finish:'Quarter-finals'},{rank:'7=',team:'Switzerland',finish:'Quarter-finals'},
  {rank:'9',team:'Mexico',finish:'Round of 16'},{rank:'10',team:'Colombia',finish:'Round of 16'},{rank:'11',team:'Brazil',finish:'Round of 16'},{rank:'12',team:'United States',finish:'Round of 16'},{rank:'13',team:'Portugal',finish:'Round of 16'},{rank:'14',team:'Canada',finish:'Round of 16'},{rank:'15',team:'Egypt',finish:'Round of 16'},{rank:'16',team:'Paraguay',finish:'Round of 16'},
  {rank:'17',team:'Netherlands',finish:'Round of 32'},{rank:'18',team:'Germany',finish:'Round of 32'},{rank:'19',team:"Côte d'Ivoire",finish:'Round of 32'},{rank:'20',team:'Croatia',finish:'Round of 32'},{rank:'21',team:'Japan',finish:'Round of 32'},{rank:'22',team:'Australia',finish:'Round of 32'},{rank:'23',team:'Congo DR',finish:'Round of 32'},{rank:'24',team:'Ghana',finish:'Round of 32'},{rank:'25',team:'Ecuador',finish:'Round of 32'},{rank:'26',team:'South Africa',finish:'Round of 32'},{rank:'27',team:'Sweden',finish:'Round of 32'},{rank:'28',team:'Austria',finish:'Round of 32'},{rank:'29',team:'Bosnia and Herzegovina',finish:'Round of 32'},{rank:'30',team:'Algeria',finish:'Round of 32'},{rank:'31',team:'Senegal',finish:'Round of 32'},{rank:'32',team:'Cabo Verde',finish:'Round of 32'},
  {rank:'33',team:'IR Iran',finish:'Group stage'},{rank:'34',team:'Korea Republic',finish:'Group stage'},{rank:'35',team:'Türkiye',finish:'Group stage'},{rank:'36',team:'Scotland',finish:'Group stage'},{rank:'37',team:'Uruguay',finish:'Group stage'},{rank:'38',team:'Saudi Arabia',finish:'Group stage'},{rank:'39',team:'Czechia',finish:'Group stage'},{rank:'40',team:'New Zealand',finish:'Group stage'},{rank:'41',team:'Qatar',finish:'Group stage'},{rank:'42',team:'Curaçao',finish:'Group stage'},{rank:'43',team:'Panama',finish:'Group stage'},{rank:'44',team:'Jordan',finish:'Group stage'},{rank:'45',team:'Haiti',finish:'Group stage'},{rank:'46',team:'Uzbekistan',finish:'Group stage'},{rank:'47',team:'Tunisia',finish:'Group stage'},{rank:'48',team:'Iraq',finish:'Group stage'}
];

export const awardWinners=[
  {award:'Golden Ball',winner:'Rodri',team:'Spain',evidence:'Tournament player award'},
  {award:'Golden Boot',winner:'Kylian Mbappé',team:'France',evidence:'10 goals in eight matches'},
  {award:'Golden Glove',winner:'Unai Simón',team:'Spain',evidence:'Seven clean sheets in eight matches'},
  {award:'Young Player Award',winner:'Pau Cubarsí',team:'Spain',evidence:'Official FIFA young-player honour'}
] as const;

export const goldenBootTopTen=[
  {rank:1,player:'Kylian Mbappé',team:'France',goals:10,assists:4},
  {rank:2,player:'Lionel Messi',team:'Argentina',goals:8,assists:4},
  {rank:3,player:'Jude Bellingham',team:'England',goals:7,assists:1},
  {rank:4,player:'Erling Haaland',team:'Norway',goals:7,assists:0},
  {rank:5,player:'Ousmane Dembélé',team:'France',goals:6,assists:2},
  {rank:6,player:'Harry Kane',team:'England',goals:6,assists:1},
  {rank:7,player:'Mikel Oyarzabal',team:'Spain',goals:5,assists:1},
  {rank:8,player:'Ismaïla Sarr',team:'Senegal',goals:4,assists:1},
  {rank:9,player:'Julián Quiñones',team:'Mexico',goals:4,assists:1},
  {rank:10,player:'Vinícius Júnior',team:'Brazil',goals:4,assists:1}
] as const;

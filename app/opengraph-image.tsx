import { ImageResponse } from 'next/og';
export const alt = 'WATCHWORLDCUP — World Cup replays, archives and streaming guides';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OG() {
  return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:72,background:'linear-gradient(135deg,#080808,#1a0b0e)',color:'white',fontFamily:'Arial'}}><div style={{display:'flex',alignItems:'center',gap:18}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',width:64,height:64,borderRadius:20,background:'linear-gradient(135deg,#ef3b4f,#991b2f)',fontWeight:900,fontSize:23}}>WWC</div><div style={{fontSize:30,fontWeight:800,letterSpacing:1}}>WATCHWORLDCUP</div></div><div style={{display:'flex',flexDirection:'column'}}><div style={{fontSize:18,color:'#ef3b4f',fontWeight:800,letterSpacing:4,marginBottom:20}}>INDEPENDENT TOURNAMENT ARCHIVE</div><div style={{fontSize:67,lineHeight:1.02,fontWeight:900,letterSpacing:-3,maxWidth:1000}}>Replays, results and streaming guidance you can verify.</div></div><div style={{display:'flex',fontSize:22,color:'#94a3b8'}}>World Cup 2026 archive · Authorized replay sources · Technical guides</div></div>, size);
}

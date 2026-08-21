import type { SVGProps } from 'react';

type IconProps=SVGProps<SVGSVGElement>;
const base={viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.8,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true};

export function ArrowRightIcon(props:IconProps){return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
export function CheckCircleIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></svg>}
export function AlertIcon(props:IconProps){return <svg {...base} {...props}><path d="M10.3 4.2 2.8 17.5A1.7 1.7 0 0 0 4.3 20h15.4a1.7 1.7 0 0 0 1.5-2.5L13.7 4.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 16.5h.01"/></svg>}
export function TvIcon(props:IconProps){return <svg {...base} {...props}><rect x="3" y="5" width="18" height="13" rx="2"/><path d="m9 21 3-3 3 3M8 10h8M8 13h5"/></svg>}
export function FilmIcon(props:IconProps){return <svg {...base} {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/></svg>}
export function SeriesIcon(props:IconProps){return <svg {...base} {...props}><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>}
export function SportsIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="m8.5 5.7 2.2 3.1-1.4 4.1-3.7.4M15.5 5.7l-2.2 3.1 1.4 4.1 3.7.4M9.3 12.9l2.7 2 2.7-2M12 14.9V21"/></svg>}
export function DeviceIcon(props:IconProps){return <svg {...base} {...props}><rect x="3" y="4" width="14" height="11" rx="2"/><path d="M8 20h4M10 15v5"/><rect x="18" y="8" width="3" height="8" rx="1"/></svg>}
export function ShieldIcon(props:IconProps){return <svg {...base} {...props}><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>}
export function ArchiveIcon(props:IconProps){return <svg {...base} {...props}><path d="M4 7h16v13H4zM3 4h18v3H3zM9 11h6"/></svg>}
export function MessageIcon(props:IconProps){return <svg {...base} {...props}><path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>}
export function ListIcon(props:IconProps){return <svg {...base} {...props}><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>}
export function DownloadIcon(props:IconProps){return <svg {...base} {...props}><path d="M12 3v12M7 10l5 5 5-5M4 20h16"/></svg>}
export function DatabaseIcon(props:IconProps){return <svg {...base} {...props}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>}
export function ClockIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>}
export function GlobeIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"/></svg>}
export function HandshakeIcon(props:IconProps){return <svg {...base} {...props}><path d="m8.5 12.5 3-3a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8l-2 2a2 2 0 0 1-2.8 0L9 13.8"/><path d="m15.5 12.5-3-3a2 2 0 0 0-2.8 0L5.5 13.7a2 2 0 0 0 0 2.8l2 2a2 2 0 0 0 2.8 0l1.2-1.2M3 9l3-3 3 2M21 9l-3-3-3 2"/></svg>}
export function ChannelStackIcon(props:IconProps){return <svg {...base} {...props}><rect x="4" y="4" width="16" height="11" rx="2"/><path d="m10 8 4 2-4 2V8ZM7 19h10M9 15v4M15 15v4"/><path d="M2 7v9a2 2 0 0 0 2 2"/></svg>}
export function HomeIcon(props:IconProps){return <svg {...base} {...props}><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></svg>}
export function PriceTagIcon(props:IconProps){return <svg {...base} {...props}><path d="M4 4h7l9 9-7 7-9-9V4Z"/><circle cx="8" cy="8" r="1.2"/><path d="M12 11.5c-1-.7-3-.5-3 .9 0 2 4 1 4 3 0 1.4-2 1.6-3 .9M11 10v1M11 17v1"/></svg>}
export function SettingsIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>}
export function HelpCircleIcon(props:IconProps){return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M9.8 9a2.4 2.4 0 1 1 3.6 2.1c-.9.5-1.4 1-1.4 2.1M12 17h.01"/></svg>}

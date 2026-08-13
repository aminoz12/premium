export const WHATSAPP_PHONE='212723279328';
export const WHATSAPP_PHONE_DISPLAY='+212 723 279 328';
export const whatsappOrderUrl=(message:string)=>`https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}#Promo:ac47&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
export const WHATSAPP_URL=whatsappOrderUrl('Hi! I need information about a WATCHWORLDCUP IPTV subscription. Please confirm current availability and compatibility.');
export const CTA_EVENT_NAME='whatsapp_sales_click';
export const COMMERCIAL_CTA_ENABLED=true;

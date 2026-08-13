import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideArticle from '../../_components/GuideArticle';
import { guides, getGuide } from '@/lib/guides';
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from '../../schema';
import { pageMetadata } from '@/lib/seo';
export function generateStaticParams(){return guides.map(g=>({slug:g.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const g=getGuide(slug);if(!g)return{};return pageMetadata({title:g.title,description:g.description,path:`/guides/${slug}`,type:'article'})}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const g=getGuide(slug);if(!g)notFound();const path=`/guides/${slug}`;return <><BreadcrumbSchema items={[{name:'Home',path:'/'},{name:'Guides',path:'/guides'},{name:g.shortTitle,path}]}/><ArticleSchema headline={g.title} description={g.description} path={path} datePublished={g.datePublished} dateModified={g.dateModified}/><FAQSchema faqs={g.faqs} path={path}/><GuideArticle guide={g}/></>}

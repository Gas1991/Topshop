import React from 'react';

type IconProps = { s?: number; fill?: string };

export const I = {
  search:   (p?: IconProps) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  cart:     (p?: IconProps) => <svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/><path d="M2.5 3h2.5l2.7 13a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L22 7H6"/></svg>,
  user:     (p?: IconProps) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
  heart:    (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill={p?.fill||"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 17.5 4c-1.8 0-3 .8-5.5 3.5C9.5 4.8 8.3 4 6.5 4A4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/></svg>,
  pin:      (p?: IconProps) => <svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.8 7 11.6 7.3 11.8.4.3 1 .3 1.4 0C13 21.6 20 15.8 20 10c0-4.4-3.6-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>,
  chev:     (p?: IconProps) => <svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  chevR:    (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6"/></svg>,
  bolt:     (p?: IconProps) => <svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="currentColor"><path d="m13 2-9 12h7l-1 8 9-12h-7Z"/></svg>,
  truck:    (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17V5h12v12"/><path d="M14 9h5l3 4v4h-8"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>,
  star:     (p?: IconProps) => <svg width={p?.s||11} height={p?.s||11} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.3 3 1.2-6.8L2 9.3l7-1Z"/></svg>,
  starHalf: (p?: IconProps) => <svg width={p?.s||11} height={p?.s||11} viewBox="0 0 24 24"><defs><linearGradient id="halfgrad"><stop offset="50%" stopColor="#FFB800"/><stop offset="50%" stopColor="#e6e6e6"/></linearGradient></defs><path fill="url(#halfgrad)" d="m12 2 3.1 6.3 7 1-5 4.9 1.1 6.8L12 18l-6.3 3 1.2-6.8L2 9.3l7-1Z"/></svg>,
  shield:   (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v7c0 5 3.5 8 8 10 4.5-2 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  ret:      (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>,
  menu:     (p?: IconProps) => <svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>,
  globe:    (p?: IconProps) => <svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>,
  plus:     (p?: IconProps) => <svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check:    (p?: IconProps) => <svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 12 10 18 20 6"/></svg>,
};

export const CatIcon = {
  phone: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><line x1="10" y1="18" x2="14" y2="18"/></svg>,
  laptop: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="11" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  audio: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-3a9 9 0 0 1 18 0v3"/><path d="M21 17a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"/><path d="M3 17a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2Z"/></svg>,
  gaming: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.5 1.5L15 16H9l-1.5 1.5A3 3 0 0 1 2 16v-3a4 4 0 0 1 4-4Z"/><line x1="8" y1="13" x2="8" y2="13.01"/><line x1="10" y1="13" x2="10" y2="13.01"/><circle cx="15.5" cy="12.5" r=".5"/><circle cx="17.5" cy="14.5" r=".5"/></svg>,
  tv: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  home: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>,
};

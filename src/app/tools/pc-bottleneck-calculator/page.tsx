// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Activity } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader, ToolExplanation,
  ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout,
} from '@/components/tool'

/* ─── DATA ─────────────────────────────────────────────────── */
const CPUS = [
  { group:'Intel 10th Gen', items:[
    {id:'i3-10100',  name:'Core i3-10100',      score:312, cores:4,  tdp:65},
    {id:'i5-10400',  name:'Core i5-10400',      score:392, cores:6,  tdp:65},
    {id:'i5-10600k', name:'Core i5-10600K',     score:435, cores:6,  tdp:125},
    {id:'i7-10700k', name:'Core i7-10700K',     score:524, cores:8,  tdp:125},
  ]},
  { group:'Intel 11th Gen', items:[
    {id:'i5-11600k', name:'Core i5-11600K',     score:462, cores:6,  tdp:125},
    {id:'i7-11700k', name:'Core i7-11700K',     score:548, cores:8,  tdp:125},
  ]},
  { group:'Intel 12th Gen', items:[
    {id:'i3-12100',  name:'Core i3-12100',      score:488, cores:4,  tdp:60},
    {id:'i5-12400',  name:'Core i5-12400',      score:578, cores:6,  tdp:65},
    {id:'i5-12600k', name:'Core i5-12600K',     score:658, cores:10, tdp:125},
    {id:'i7-12700k', name:'Core i7-12700K',     score:728, cores:12, tdp:125},
    {id:'i9-12900k', name:'Core i9-12900K',     score:798, cores:16, tdp:125},
  ]},
  { group:'Intel 13th Gen', items:[
    {id:'i5-13400',  name:'Core i5-13400',      score:612, cores:10, tdp:65},
    {id:'i5-13600k', name:'Core i5-13600K',     score:708, cores:14, tdp:125},
    {id:'i7-13700k', name:'Core i7-13700K',     score:822, cores:16, tdp:125},
    {id:'i9-13900k', name:'Core i9-13900K',     score:928, cores:24, tdp:125},
    {id:'i9-13900ks',name:'Core i9-13900KS',    score:958, cores:24, tdp:150},
  ]},
  { group:'Intel 14th Gen', items:[
    {id:'i5-14400',  name:'Core i5-14400',      score:618, cores:10, tdp:65},
    {id:'i5-14600k', name:'Core i5-14600K',     score:732, cores:14, tdp:125},
    {id:'i7-14700k', name:'Core i7-14700K',     score:858, cores:20, tdp:125},
    {id:'i9-14900k', name:'Core i9-14900K',     score:968, cores:24, tdp:125},
    {id:'i9-14900ks',name:'Core i9-14900KS',    score:988, cores:24, tdp:150},
  ]},
  { group:'Intel Arrow Lake (15th)', items:[
    {id:'u5-265k',   name:'Core Ultra 5 265K',  score:718, cores:14, tdp:125},
    {id:'u7-265k',   name:'Core Ultra 7 265K',  score:848, cores:20, tdp:125},
    {id:'u9-285k',   name:'Core Ultra 9 285K',  score:968, cores:24, tdp:125},
  ]},
  { group:'AMD Ryzen 5000 (Zen 3)', items:[
    {id:'r5-5500',   name:'Ryzen 5 5500',       score:498, cores:6,  tdp:65},
    {id:'r5-5600',   name:'Ryzen 5 5600',       score:558, cores:6,  tdp:65},
    {id:'r5-5600x',  name:'Ryzen 5 5600X',      score:588, cores:6,  tdp:65},
    {id:'r7-5700x',  name:'Ryzen 7 5700X',      score:638, cores:8,  tdp:65},
    {id:'r7-5800x',  name:'Ryzen 7 5800X',      score:668, cores:8,  tdp:105},
    {id:'r7-5800x3d',name:'Ryzen 7 5800X3D',    score:718, cores:8,  tdp:105},
    {id:'r9-5900x',  name:'Ryzen 9 5900X',      score:798, cores:12, tdp:105},
    {id:'r9-5950x',  name:'Ryzen 9 5950X',      score:878, cores:16, tdp:105},
  ]},
  { group:'AMD Ryzen 7000 (Zen 4)', items:[
    {id:'r5-7600',   name:'Ryzen 5 7600',       score:678, cores:6,  tdp:65},
    {id:'r5-7600x',  name:'Ryzen 5 7600X',      score:708, cores:6,  tdp:105},
    {id:'r7-7700',   name:'Ryzen 7 7700',       score:758, cores:8,  tdp:65},
    {id:'r7-7700x',  name:'Ryzen 7 7700X',      score:788, cores:8,  tdp:105},
    {id:'r7-7800x3d',name:'Ryzen 7 7800X3D',    score:858, cores:8,  tdp:120},
    {id:'r9-7900x',  name:'Ryzen 9 7900X',      score:898, cores:12, tdp:170},
    {id:'r9-7950x',  name:'Ryzen 9 7950X',      score:978, cores:16, tdp:170},
    {id:'r9-7950x3d',name:'Ryzen 9 7950X3D',    score:998, cores:16, tdp:120},
  ]},
  { group:'AMD Ryzen 9000 (Zen 5)', items:[
    {id:'r5-9600x',  name:'Ryzen 5 9600X',      score:738, cores:6,  tdp:65},
    {id:'r7-9700x',  name:'Ryzen 7 9700X',      score:808, cores:8,  tdp:65},
    {id:'r7-9800x3d',name:'Ryzen 7 9800X3D',    score:948, cores:8,  tdp:120},
    {id:'r9-9900x',  name:'Ryzen 9 9900X',      score:918, cores:12, tdp:120},
    {id:'r9-9950x',  name:'Ryzen 9 9950X',      score:1018,cores:16, tdp:170},
  ]},
]

const GPUS = [
  { group:'NVIDIA GTX (Pascal/Turing)', items:[
    {id:'gtx1660',   name:'GTX 1660',           score:184, vram:6},
    {id:'gtx1660s',  name:'GTX 1660 Super',     score:212, vram:6},
    {id:'gtx1660ti', name:'GTX 1660 Ti',        score:226, vram:6},
    {id:'gtx1070',   name:'GTX 1070',           score:193, vram:8},
    {id:'gtx1080',   name:'GTX 1080',           score:248, vram:8},
    {id:'gtx1080ti', name:'GTX 1080 Ti',        score:327, vram:11},
  ]},
  { group:'NVIDIA RTX 20 (Turing)', items:[
    {id:'rtx2060',   name:'RTX 2060',           score:272, vram:6},
    {id:'rtx2060s',  name:'RTX 2060 Super',     score:308, vram:8},
    {id:'rtx2070',   name:'RTX 2070',           score:330, vram:8},
    {id:'rtx2070s',  name:'RTX 2070 Super',     score:372, vram:8},
    {id:'rtx2080',   name:'RTX 2080',           score:410, vram:8},
    {id:'rtx2080s',  name:'RTX 2080 Super',     score:441, vram:8},
    {id:'rtx2080ti', name:'RTX 2080 Ti',        score:510, vram:11},
  ]},
  { group:'NVIDIA RTX 30 (Ampere)', items:[
    {id:'rtx3060',   name:'RTX 3060',           score:372, vram:12},
    {id:'rtx3060ti', name:'RTX 3060 Ti',        score:459, vram:8},
    {id:'rtx3070',   name:'RTX 3070',           score:530, vram:8},
    {id:'rtx3070ti', name:'RTX 3070 Ti',        score:572, vram:8},
    {id:'rtx3080',   name:'RTX 3080 10GB',      score:658, vram:10},
    {id:'rtx3080-12',name:'RTX 3080 12GB',      score:688, vram:12},
    {id:'rtx3080ti', name:'RTX 3080 Ti',        score:725, vram:12},
    {id:'rtx3090',   name:'RTX 3090',           score:762, vram:24},
    {id:'rtx3090ti', name:'RTX 3090 Ti',        score:808, vram:24},
  ]},
  { group:'NVIDIA RTX 40 (Ada Lovelace)', items:[
    {id:'rtx4060',   name:'RTX 4060',           score:468, vram:8},
    {id:'rtx4060ti8',name:'RTX 4060 Ti 8GB',    score:558, vram:8},
    {id:'rtx4060ti16',name:'RTX 4060 Ti 16GB',  score:572, vram:16},
    {id:'rtx4070',   name:'RTX 4070',           score:682, vram:12},
    {id:'rtx4070s',  name:'RTX 4070 Super',     score:762, vram:12},
    {id:'rtx4070ti', name:'RTX 4070 Ti',        score:835, vram:12},
    {id:'rtx4070tis',name:'RTX 4070 Ti Super',  score:898, vram:16},
    {id:'rtx4080',   name:'RTX 4080',           score:958, vram:16},
    {id:'rtx4080s',  name:'RTX 4080 Super',     score:998, vram:16},
    {id:'rtx4090',   name:'RTX 4090',           score:1198,vram:24},
  ]},
  { group:'NVIDIA RTX 50 (Blackwell)', items:[
    {id:'rtx5070',   name:'RTX 5070',           score:952, vram:12},
    {id:'rtx5070ti', name:'RTX 5070 Ti',        score:1058,vram:16},
    {id:'rtx5080',   name:'RTX 5080',           score:1152,vram:16},
    {id:'rtx5090',   name:'RTX 5090',           score:1498,vram:32},
  ]},
  { group:'AMD RX 5000 (RDNA)', items:[
    {id:'rx5700',    name:'RX 5700',            score:270, vram:8},
    {id:'rx5700xt',  name:'RX 5700 XT',         score:310, vram:8},
  ]},
  { group:'AMD RX 6000 (RDNA 2)', items:[
    {id:'rx6600',    name:'RX 6600',            score:320, vram:8},
    {id:'rx6600xt',  name:'RX 6600 XT',         score:360, vram:8},
    {id:'rx6650xt',  name:'RX 6650 XT',         score:380, vram:8},
    {id:'rx6700',    name:'RX 6700',            score:420, vram:10},
    {id:'rx6700xt',  name:'RX 6700 XT',         score:470, vram:12},
    {id:'rx6750xt',  name:'RX 6750 XT',         score:490, vram:12},
    {id:'rx6800',    name:'RX 6800',            score:570, vram:16},
    {id:'rx6800xt',  name:'RX 6800 XT',         score:640, vram:16},
    {id:'rx6900xt',  name:'RX 6900 XT',         score:700, vram:16},
    {id:'rx6950xt',  name:'RX 6950 XT',         score:730, vram:16},
  ]},
  { group:'AMD RX 7000 (RDNA 3)', items:[
    {id:'rx7600',    name:'RX 7600',            score:410, vram:8},
    {id:'rx7600xt',  name:'RX 7600 XT',         score:450, vram:16},
    {id:'rx7700xt',  name:'RX 7700 XT',         score:560, vram:12},
    {id:'rx7800xt',  name:'RX 7800 XT',         score:660, vram:16},
    {id:'rx7900gre', name:'RX 7900 GRE',        score:740, vram:16},
    {id:'rx7900xt',  name:'RX 7900 XT',         score:820, vram:20},
    {id:'rx7900xtx', name:'RX 7900 XTX',        score:920, vram:24},
  ]},
  { group:'AMD RX 9000 (RDNA 4)', items:[
    {id:'rx9070',    name:'RX 9070',            score:870, vram:16},
    {id:'rx9070xt',  name:'RX 9070 XT',         score:960, vram:16},
  ]},
]

const RAMS = [
  {id:'ddr4-8-2666',   name:'8GB DDR4 2666MHz',  cap:8,  gen:'DDR4', mods:{gaming_1080p:-18,gaming_1440p:-12,gaming_4k:-6,video:-15,render_3d:-8,streaming:-10}, label:'Very low — upgrade ASAP'},
  {id:'ddr4-16-3200',  name:'16GB DDR4 3200MHz', cap:16, gen:'DDR4', mods:{gaming_1080p:0,gaming_1440p:0,gaming_4k:0,video:0,render_3d:0,streaming:0},           label:'Standard baseline'},
  {id:'ddr4-32-3200',  name:'32GB DDR4 3200MHz', cap:32, gen:'DDR4', mods:{gaming_1080p:2,gaming_1440p:1,gaming_4k:0,video:8,render_3d:10,streaming:5},           label:'Good — comfortable headroom'},
  {id:'ddr4-32-3600',  name:'32GB DDR4 3600MHz', cap:32, gen:'DDR4', mods:{gaming_1080p:5,gaming_1440p:3,gaming_4k:1,video:9,render_3d:11,streaming:6},           label:'Excellent DDR4 config'},
  {id:'ddr4-64-3600',  name:'64GB DDR4 3600MHz', cap:64, gen:'DDR4', mods:{gaming_1080p:5,gaming_1440p:3,gaming_4k:1,video:14,render_3d:16,streaming:8},          label:'High capacity DDR4'},
  {id:'ddr5-16-5600',  name:'16GB DDR5 5600MHz', cap:16, gen:'DDR5', mods:{gaming_1080p:6,gaming_1440p:4,gaming_4k:2,video:4,render_3d:5,streaming:4},            label:'DDR5 entry — fast but tight'},
  {id:'ddr5-32-6000',  name:'32GB DDR5 6000MHz', cap:32, gen:'DDR5', mods:{gaming_1080p:12,gaming_1440p:8,gaming_4k:3,video:12,render_3d:14,streaming:10},        label:'Sweet spot DDR5'},
  {id:'ddr5-32-6400',  name:'32GB DDR5 6400MHz', cap:32, gen:'DDR5', mods:{gaming_1080p:14,gaming_1440p:9,gaming_4k:4,video:13,render_3d:15,streaming:11},        label:'High speed DDR5'},
  {id:'ddr5-64-6000',  name:'64GB DDR5 6000MHz', cap:64, gen:'DDR5', mods:{gaming_1080p:12,gaming_1440p:8,gaming_4k:3,video:18,render_3d:22,streaming:14},        label:'Pro workstation config'},
  {id:'ddr5-64-6400',  name:'64GB DDR5 6400MHz', cap:64, gen:'DDR5', mods:{gaming_1080p:14,gaming_1440p:9,gaming_4k:4,video:20,render_3d:24,streaming:15},        label:'Maximum performance config'},
]

const UCS = [
  {id:'gaming_1080p', label:'1080p Gaming',  cpuW_60:.62,cpuW_144:.68,cpuW_240:.74, gpuW_60:.38,gpuW_144:.32,gpuW_240:.26, hint:'CPU is heavily stressed at high framerates. At 1080p/144fps+ the CPU is the #1 bottleneck factor.', vramMin:6,  fpsBase:180},
  {id:'gaming_1440p', label:'1440p Gaming',  cpuW_60:.48,cpuW_144:.55,cpuW_240:.62, gpuW_60:.52,gpuW_144:.45,gpuW_240:.38, hint:'The sweet spot — both CPU and GPU matter. At 1440p/144fps the GPU begins to dominate.',              vramMin:8,  fpsBase:120},
  {id:'gaming_4k',    label:'4K Gaming',     cpuW_60:.25,cpuW_144:.32,cpuW_240:.38, gpuW_60:.75,gpuW_144:.68,gpuW_240:.62, hint:'GPU-dominated. Nearly all 4K bottlenecks are GPU-side.',                                              vramMin:12, fpsBase:80},
  {id:'video',        label:'Video Editing', cpuW_60:.62,cpuW_144:.62,cpuW_240:.62, gpuW_60:.38,gpuW_144:.38,gpuW_240:.38, hint:'CPU and RAM are critical. More cores & faster memory means faster exports.',                           vramMin:8,  fpsBase:null},
  {id:'render_3d',    label:'3D Rendering',  cpuW_60:.68,cpuW_144:.68,cpuW_240:.68, gpuW_60:.32,gpuW_144:.32,gpuW_240:.32, hint:'CPU-intensive for CPU renders (Blender, V-Ray). GPU renders flip this weighting.',                    vramMin:8,  fpsBase:null},
  {id:'streaming',    label:'Streaming/OBS', cpuW_60:.70,cpuW_144:.70,cpuW_240:.70, gpuW_60:.30,gpuW_144:.30,gpuW_240:.30, hint:'CPU is paramount for software encoding. NVENC/AMF offloads encoding to the GPU.',                     vramMin:6,  fpsBase:null},
]

const GAMES = [
  {id:'cs2',      name:'Counter-Strike 2',     genre:'FPS / Competitive', color:'#F0A000', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',          cpuW:.72, base:{r1080:235,r1440:192,r4k:112}},
  {id:'valorant', name:'Valorant',              genre:'FPS / Competitive', color:'#FF4655', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',       cpuW:.80, base:{r1080:340,r1440:275,r4k:158}},
  {id:'fortnite', name:'Fortnite',              genre:'Battle Royale',     color:'#00D4FF', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1677280/header.jpg',       cpuW:.62, base:{r1080:200,r1440:155,r4k:88}},
  {id:'warzone',  name:'Call of Duty: Warzone', genre:'Battle Royale',     color:'#6B8F00', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg',       cpuW:.58, base:{r1080:145,r1440:105,r4k:58}},
  {id:'apex',     name:'Apex Legends',          genre:'Battle Royale',     color:'#CD3333', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',       cpuW:.60, base:{r1080:185,r1440:138,r4k:78}},
  {id:'cyberpunk',name:'Cyberpunk 2077',        genre:'Open World / RPG',  color:'#FCEE09', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg',       cpuW:.38, base:{r1080:85, r1440:65, r4k:36}},
  {id:'rdr2',     name:'Red Dead Redemption 2', genre:'Open World',        color:'#8B4513', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg',       cpuW:.52, base:{r1080:95, r1440:70, r4k:38}},
  {id:'elden',    name:'Elden Ring',            genre:'Action RPG',        color:'#C8A951', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',       cpuW:.45, base:{r1080:110,r1440:82, r4k:46}},
  {id:'minecraft',name:'Minecraft (Modded)',    genre:'Sandbox',           color:'#5D8A31', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1672970/header.jpg',       cpuW:.82, base:{r1080:145,r1440:112,r4k:62}},
  {id:'helldivers',name:'Helldivers 2',         genre:'Co-op Shooter',     color:'#FFB800', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg',        cpuW:.55, base:{r1080:88, r1440:65, r4k:36}},
  {id:'lol',      name:'League of Legends',     genre:'MOBA',              color:'#C89B3C', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1762350/header.jpg',       cpuW:.78, base:{r1080:308,r1440:238,r4k:135}},
  {id:'witcher3', name:'The Witcher 3',         genre:'Open World / RPG',  color:'#C0392B', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',        cpuW:.48, base:{r1080:115,r1440:85, r4k:48}},
  {id:'starfield',name:'Starfield',             genre:'RPG / Open World',  color:'#4488FF', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1716740/header.jpg',       cpuW:.65, base:{r1080:82, r1440:60, r4k:34}},
  {id:'hogwarts', name:'Hogwarts Legacy',       genre:'Action RPG',        color:'#7B2FBE', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',        cpuW:.46, base:{r1080:78, r1440:58, r4k:32}},
  {id:'spiderman',name:"Marvel's Spider-Man 2",genre:'Action / Open World',color:'#E62429', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/2119490/header.jpg',       cpuW:.48, base:{r1080:95, r1440:72, r4k:40}},
  {id:'msfs',     name:'MS Flight Simulator',   genre:'Simulation',        color:'#007FFF', thumb:'https://cdn.cloudflare.steamstatic.com/steam/apps/1250410/header.jpg',       cpuW:.72, base:{r1080:62, r1440:48, r4k:28}},
]

const MAX_CPU = 1020, MAX_GPU = 1500

/* ─── CALC ENGINE ──────────────────────────────────────────── */
function calcBN(cpu, gpu, ram, uc, fps) {
  const fpsKey = fps <= 60 ? '60' : fps <= 144 ? '144' : '240'
  const cpuW = uc[`cpuW_${fpsKey}`]
  const gpuW = uc[`gpuW_${fpsKey}`]
  const ramMod = ram.mods[uc.id] ?? 0
  const cpuAdj = Math.min(cpu.score + ramMod, MAX_CPU)
  const cn = cpuAdj / MAX_CPU
  const gn = gpu.score / MAX_GPU
  const cw = cn * cpuW
  const gw = gn * gpuW
  const diff = Math.abs(cw - gw)
  const dom  = Math.max(cw, gw)
  const pct  = Math.min(Math.round((diff / dom) * 100), 99)
  const bot  = cw < gw ? 'CPU' : 'GPU'
  const cpuU = bot === 'GPU' ? Math.min(Math.round(cw / gw * 100), 100) : 100
  const gpuU = bot === 'CPU' ? Math.min(Math.round(gw / cw * 100), 100) : 100
  let estFps = null
  if (uc.fpsBase !== null) {
    const gpuRatio = gpu.score / 600
    const cpuFactor = 0.5 + cpuW * (cw / gw)
    const rawFps = uc.fpsBase * gpuRatio * Math.min(cpuFactor, 1.3)
    estFps = Math.max(15, Math.min(Math.round(rawFps / 5) * 5, 500))
  }
  return { pct, bot, cpuU, gpuU, cw, gw, ramMod, estFps }
}

function lvOf(p) {
  return p >= 60 ? 'severe' : p >= 35 ? 'moderate' : p >= 15 ? 'minor' : 'none'
}

function calcGameFps(game, resKey, gpuScore, cpuScore, ramMod) {
  const gpuRatio = gpuScore / 530
  const cpuRatio = Math.min((cpuScore + ramMod) / 700, 1.4)
  const blended  = game.cpuW * cpuRatio + (1 - game.cpuW) * gpuRatio
  return Math.max(5, Math.round(game.base[resKey] * blended / 5) * 5)
}

function fpsColor(f) {
  return f >= 144 ? '#00E5A0' : f >= 60 ? '#FFD060' : f >= 30 ? '#FF7840' : '#FF5050'
}

function fpsClass(f) {
  return f >= 144 ? 'fps-high' : f >= 60 ? 'fps-mid' : f >= 30 ? 'fps-low' : 'fps-very-low'
}

/* ─── GAUGE COMPONENT ──────────────────────────────────────── */
function Gauge({ pct, color }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = null
    function step(ts) {
      if (!start) start = ts
      const t = Math.min((ts - start) / 1800, 1)
      const e = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(pct * e))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [pct])
  const CX=150, CY=178, R=124
  const AL = Math.PI * R
  const dashOffset = AL * (1 - display / 100)
  function pxy(p) {
    const t = Math.PI * (1 - p / 100)
    return { x: CX + R * Math.cos(t), y: CY - R * Math.sin(t) }
  }
  const np = pxy(display)
  return (
    <svg viewBox="0 0 300 210" style={{width:'100%',maxWidth:300,display:'block',margin:'0 auto'}}>
      <path d="M 26 178 A 124 124 0 0 1 274 178" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="20" strokeLinecap="round"/>
      <path d="M 26 178 A 124 124 0 0 1 88 68"   fill="none" stroke="rgba(0,229,160,.12)"  strokeWidth="14" strokeLinecap="round"/>
      <path d="M 88 68 A 124 124 0 0 1 212 68"   fill="none" stroke="rgba(255,208,96,.12)" strokeWidth="14" strokeLinecap="round"/>
      <path d="M 212 68 A 124 124 0 0 1 274 178" fill="none" stroke="rgba(255,80,80,.12)"  strokeWidth="14" strokeLinecap="round"/>
      <text x="28"  y="200" style={{fill:'rgba(0,229,160,.4)', fontSize:8,fontFamily:'monospace'}}>OK</text>
      <text x="130" y="58"  style={{fill:'rgba(255,208,96,.4)',fontSize:8,fontFamily:'monospace'}}>WARN</text>
      <text x="240" y="200" style={{fill:'rgba(255,80,80,.4)', fontSize:8,fontFamily:'monospace'}}>HOT</text>
      <path fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={AL} strokeDashoffset={dashOffset}
        d="M 26 178 A 124 124 0 0 1 150 54 A 124 124 0 0 1 274 178"/>
      <line x1="150" y1="178" x2={np.x.toFixed(1)} y2={np.y.toFixed(1)} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".7"/>
      <circle cx="150" cy="178" r="10" fill="#111418" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
      <circle cx="150" cy="178" r="5"  fill={color} opacity=".7"/>
      <text x="150" y="136" textAnchor="middle" style={{fontSize:36,fontWeight:700,fill:'#F0F2F5',fontFamily:'monospace'}}>{display}%</text>
    </svg>
  )
}

/* ─── RADAR CHART ──────────────────────────────────────────── */
function RadarChart({ cpu, gpu, ram, fps }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!canvasRef.current) return
    let chart = null
    import('chart.js/auto').then(m => {
      const Chart = m.default
      const data = UCS.map(uc => calcBN(cpu, gpu, ram, uc, fps).pct)
      const pts  = data.map(v => v >= 60 ? '#FF5050' : v >= 35 ? '#FF7840' : v >= 15 ? '#FFD060' : '#00E5A0')
      if (chart) chart.destroy()
      chart = new Chart(canvasRef.current.getContext('2d'), {
        type:'radar',
        data:{
          labels: UCS.map(u => u.label),
          datasets:[{label:'Bottleneck %',data,borderColor:'#00E5A0',backgroundColor:'rgba(0,229,160,.1)',pointBackgroundColor:pts,pointBorderColor:'#0A0C10',pointBorderWidth:2,pointRadius:6,borderWidth:2.5}]
        },
        options:{
          responsive:true,maintainAspectRatio:true,
          plugins:{legend:{display:false},tooltip:{backgroundColor:'#1A1E28',borderColor:'rgba(255,255,255,.12)',borderWidth:1,titleColor:'#F0F2F5',bodyColor:'#9AA3B2',padding:12,cornerRadius:8}},
          scales:{r:{min:0,max:90,beginAtZero:true,ticks:{stepSize:30,color:'#F0F2F5',font:{size:10},backdropColor:'rgba(8,10,14,.75)',callback:v=>v===0?'':v+'%'},grid:{color:ctx=>{const v=ctx.tick?.value;return v===30?'rgba(255,208,96,.22)':v===60?'rgba(255,80,80,.22)':'rgba(255,255,255,.08)'}},angleLines:{color:'rgba(255,255,255,.1)'},pointLabels:{color:'#F0F2F5',font:{size:11,weight:600}}}}
        }
      })
    })
    return ()=>{ if(chart) chart.destroy() }
  }, [cpu, gpu, ram, fps])
  return <canvas ref={canvasRef} style={{maxWidth:520,width:'100%',margin:'0 auto',display:'block'}}/>
}

/* ─── MAIN PAGE ────────────────────────────────────────────── */
export default function BottleneckPage() {
  const [cpuId, setCpuId] = useState('')
  const [gpuId, setGpuId] = useState('')
  const [ramId, setRamId] = useState('ddr4-16-3200')
  const [ucId,  setUcId]  = useState('')
  const [fps,   setFps]   = useState(144)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [showAll, setShowAll]   = useState(false)
  const [copied,  setCopied]    = useState(false)
  const resultsRef = useRef(null)

  // Flatten lookups
  const allCpus = CPUS.flatMap(g => g.items)
  const allGpus = GPUS.flatMap(g => g.items)
  const cpu = allCpus.find(c => c.id === cpuId) || null
  const gpu = allGpus.find(g => g.id === gpuId) || null
  const ram = RAMS.find(r => r.id === ramId) || RAMS[1]
  const uc  = UCS.find(u => u.id === ucId)  || null

  const canCalc = !!(cpu && gpu && uc)

  // Auto-run when all selected
  useEffect(() => {
    if (cpu && gpu && uc && !result && !loading) {
      runCalc()
    }
  }, [cpuId, gpuId, ramId, ucId])

  // Re-run on fps change if result exists
  useEffect(() => {
    if (result && cpu && gpu && uc) {
      setResult(calcBN(cpu, gpu, ram, uc, fps))
    }
  }, [fps])

  function runCalc() {
    if (!cpu || !gpu || !uc) return
    setLoading(true)
    setTimeout(() => {
      setResult(calcBN(cpu, gpu, ram, uc, fps))
      setLoading(false)
      setTimeout(() => resultsRef.current?.scrollIntoView({behavior:'smooth', block:'nearest'}), 120)
    }, 1600)
  }

  function handleReset() {
    setCpuId(''); setGpuId(''); setRamId('ddr4-16-3200')
    setUcId(''); setFps(144); setResult(null); setShowAll(false)
    window.scrollTo({top:0, behavior:'smooth'})
  }

  const lv      = result ? lvOf(result.pct) : 'none'
  const lvColor = {none:'#00E5A0', minor:'#FFD060', moderate:'#FF7840', severe:'#FF5050'}[lv]
  const lvLabel = {none:'Well balanced', minor:'Minor bottleneck', moderate:'Moderate bottleneck', severe:'Severe bottleneck'}[lv]
  const ramMod  = ram ? (ram.mods[ucId] ?? 0) : 0

  /* small helpers */
  const s = (obj) => ({ ...obj }) // passthrough style helper

  function panel(children, extra={}) {
    return (
      <div style={{background:'var(--bg2,#13161E)',border:'.5px solid var(--border,rgba(255,255,255,.08))',borderRadius:14,padding:'1.5rem',marginBottom:10,...extra}}>
        {children}
      </div>
    )
  }

  function SecLabel({n, label}) {
    return (
      <div style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.16em',display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
        <span style={{width:18,height:18,borderRadius:5,background:'rgba(255,255,255,.06)',border:'.5px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'rgba(255,255,255,.3)',flexShrink:0}}>{n}</span>
        {label}
        <span style={{flex:1,height:'.5px',background:'rgba(255,255,255,.08)'}}/>
      </div>
    )
  }

  function SelectCard({label, dotColor, bg, border, children}) {
    return (
      <div style={{background:bg,border:`.5px solid ${border}`,borderRadius:12,padding:'.9rem 1rem',transition:'border-color .2s'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10,fontSize:11,fontWeight:600,color:'#8A94A6',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.05em'}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:dotColor,flexShrink:0}}/>
          {label}
        </div>
        {children}
      </div>
    )
  }

  function TierBar({score, max, color}) {
    const pct = Math.round(score/max*100)
    return (
      <div style={{marginTop:8}}>
        <div style={{height:2,background:'rgba(255,255,255,.07)',borderRadius:2,overflow:'hidden',marginBottom:4}}>
          <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:2,transition:'width .65s ease'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'rgba(255,255,255,.3)',fontFamily:'monospace'}}>
          <span>Benchmark tier</span>
          <span style={{color:'rgba(255,255,255,.5)'}}>{score} / {max}</span>
        </div>
      </div>
    )
  }

  const selStyle = {
    width:'100%',
    background:'#0A0E14',
    border:'.5px solid rgba(255,255,255,.18)',
    borderRadius:8,
    color:'#EEF1F6',
    fontSize:13,
    padding:'9px 28px 9px 10px',
    outline:'none',
    fontFamily:'inherit',
    appearance:'none',
    backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(255,255,255,.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat:'no-repeat',
    backgroundPosition:'right 10px center',
    cursor:'pointer',
  }

  const pillStyle = (active) => ({
    padding:'8px 14px', borderRadius:100,
    border:`1px solid ${active?'rgba(0,229,160,.55)':'rgba(255,255,255,.1)'}`,
    background: active?'rgba(0,229,160,.1)':'rgba(255,255,255,.04)',
    color: active?'#00E5A0':'#8A94A6',
    fontSize:12.5, cursor:'pointer', transition:'all .2s',
    fontWeight: active?600:400, fontFamily:'inherit',
  })

  const displayedGames = showAll ? GAMES : GAMES.slice(0,4)

  return (
    <ToolLayout wide>
      <ToolBreadcrumb toolName="PC Bottleneck Calculator" toolSlug="pc-bottleneck-calculator"/>

      <ToolHeader
        name="PC Bottleneck Calculator"
        description="Select your CPU, GPU, and RAM. Get an instant bottleneck score, performance gauge, FPS estimates across 16 games, and balanced upgrade suggestions — free, no sign-up."
        categoryLabel="Hardware"
        categoryColor="orange"
        typeLabel="Calculator"
        typeColor="blue"
        updatedAt="May 2025"
        usersPerMonth="50,000+"
      />

      {/* ── FULL-SCREEN LOADING OVERLAY ── */}
      {loading && (
        <div style={{position:'fixed',inset:0,background:'rgba(6,8,12,.93)',backdropFilter:'blur(16px)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#12161E',border:'.5px solid rgba(255,255,255,.1)',borderRadius:20,padding:'2.25rem 2.75rem',textAlign:'center',minWidth:260,maxWidth:'90vw',boxShadow:'0 40px 100px rgba(0,0,0,.85)'}}>
            {/* spinner */}
            <div style={{width:48,height:48,margin:'0 auto 1.4rem',position:'relative'}}>
              <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2.5px solid transparent',borderTopColor:'#00E5A0',animation:'spin .9s linear infinite'}}/>
              <div style={{position:'absolute',inset:8,borderRadius:'50%',border:'2px solid transparent',borderBottomColor:'#508CFF',animation:'spinr 1.3s linear infinite'}}/>
            </div>
            <div style={{fontSize:16,fontWeight:700,color:'#EEF1F6',marginBottom:5}}>Analyzing your build</div>
            <div style={{fontSize:12.5,color:'#8A94A6',fontFamily:'monospace'}}>Running calculations<span style={{animation:'dp 1.2s infinite'}}>.</span><span style={{animation:'dp 1.2s infinite',animationDelay:'.2s'}}>.</span><span style={{animation:'dp 1.2s infinite',animationDelay:'.4s'}}>.</span></div>
            <div style={{height:2.5,background:'rgba(255,255,255,.07)',borderRadius:2,marginTop:'1.2rem',overflow:'hidden'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,#00E5A0,#508CFF)',borderRadius:2,animation:'lb 1.6s cubic-bezier(.4,0,.2,1) forwards'}}/>
            </div>
          </div>
        </div>
      )}

      {/* ── SELECTOR PANEL ── */}
      {panel(<>
        <SecLabel n={1} label="Your components"/>

        {/* Component selects */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginBottom:24}}>

          <SelectCard label="Processor (CPU)" dotColor="#508CFF" bg="rgba(80,140,255,.06)" border={cpuId?'rgba(80,140,255,.35)':'rgba(255,255,255,.08)'}>
            <select value={cpuId} onChange={e=>setCpuId(e.target.value)} style={{...selStyle, borderColor: cpuId?'rgba(80,140,255,.4)':'rgba(255,255,255,.18)'}}>
              <option value="" disabled>Select a CPU</option>
              {CPUS.map(g=>(
                <optgroup key={g.group} label={g.group} style={{background:'#0F1218',color:'#8A94A6'}}>
                  {g.items.map(c=><option key={c.id} value={c.id} style={{background:'#161B23'}}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
            {cpu && <TierBar score={cpu.score} max={MAX_CPU} color="#508CFF"/>}
            {cpu && <div style={{marginTop:6,fontSize:11,color:'rgba(255,255,255,.35)',fontFamily:'monospace'}}>{cpu.cores} cores · {cpu.tdp}W TDP · PassMark {cpu.score}</div>}
          </SelectCard>

          <SelectCard label="Graphics Card (GPU)" dotColor="#00E5A0" bg="rgba(0,229,160,.05)" border={gpuId?'rgba(0,229,160,.35)':'rgba(255,255,255,.08)'}>
            <select value={gpuId} onChange={e=>setGpuId(e.target.value)} style={{...selStyle, borderColor: gpuId?'rgba(0,229,160,.4)':'rgba(255,255,255,.18)'}}>
              <option value="" disabled>Select a GPU</option>
              {GPUS.map(g=>(
                <optgroup key={g.group} label={g.group} style={{background:'#0F1218',color:'#8A94A6'}}>
                  {g.items.map(c=><option key={c.id} value={c.id} style={{background:'#161B23'}}>{c.name} ({c.vram}GB)</option>)}
                </optgroup>
              ))}
            </select>
            {gpu && <TierBar score={gpu.score} max={MAX_GPU} color="#00E5A0"/>}
            {gpu && <div style={{marginTop:6,fontSize:11,color:'rgba(255,255,255,.35)',fontFamily:'monospace'}}>{gpu.vram}GB VRAM · PassMark {gpu.score}</div>}
          </SelectCard>

          <SelectCard label="Memory (RAM)" dotColor="#FF7840" bg="rgba(255,120,64,.05)" border={ramId?'rgba(255,120,64,.35)':'rgba(255,255,255,.08)'}>
            <select value={ramId} onChange={e=>setRamId(e.target.value)} style={{...selStyle, borderColor:'rgba(255,120,64,.4)'}}>
              {RAMS.map(r=><option key={r.id} value={r.id} style={{background:'#161B23'}}>{r.name}</option>)}
            </select>
            {ram && <div style={{marginTop:8,fontSize:11,color:'rgba(255,255,255,.35)',fontFamily:'monospace'}}>{ram.gen} · {ram.cap}GB · {ram.label}</div>}
          </SelectCard>
        </div>

        {/* FPS Target */}
        <SecLabel n={2} label="Target framerate"/>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:24,flexWrap:'wrap'}}>
          <span style={{fontSize:13,color:'#8A94A6',marginRight:4}}>I want to run at:</span>
          {[60,144,240].map(f=>(
            <button key={f} onClick={()=>setFps(f)} style={pillStyle(fps===f)}>{f} fps</button>
          ))}
        </div>

        {/* Use Case */}
        <SecLabel n={3} label="Use case"/>
        <div style={{fontSize:13,color:'#8A94A6',marginBottom:10}}>What will you primarily use this PC for?</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}>
          {UCS.map(u=>(
            <button key={u.id} onClick={()=>setUcId(u.id)} style={pillStyle(ucId===u.id)}>{u.label}</button>
          ))}
        </div>
        {uc && (
          <div style={{marginBottom:20,padding:'10px 14px',background:'rgba(0,229,160,.06)',border:'.5px solid rgba(0,229,160,.18)',borderRadius:8,fontSize:13,color:'rgba(0,229,160,.9)',display:'flex',alignItems:'flex-start',gap:10,lineHeight:1.6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:2}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            {uc.hint}
          </div>
        )}

        {/* Action row */}
        <div style={{display:'flex',gap:10}}>
          <button onClick={handleReset} style={{display:'flex',alignItems:'center',gap:7,padding:'0 18px',background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.12)',borderRadius:9,color:'#8A94A6',fontSize:13,cursor:'pointer',transition:'all .18s',whiteSpace:'nowrap',flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>
            Reset
          </button>
          <button
            onClick={runCalc}
            disabled={!canCalc||loading}
            style={{flex:1,background:canCalc?'#00E5A0':'rgba(255,255,255,.1)',color:canCalc?'#08100D':'rgba(255,255,255,.3)',fontSize:14,fontWeight:700,border:'none',borderRadius:9,padding:'14px 20px',cursor:canCalc?'pointer':'not-allowed',transition:'all .18s',display:'flex',alignItems:'center',justifyContent:'center',gap:9}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            {canCalc ? 'Analyze my build' : 'Select CPU, GPU and use case to continue'}
          </button>
        </div>
      </>)}

      {/* ── RESULTS ── */}
      {result && cpu && gpu && ram && uc && (
        <div ref={resultsRef}>

          {/* Data source banner */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px',background:'rgba(80,140,255,.07)',border:'.5px solid rgba(80,140,255,.18)',borderRadius:9,marginBottom:10,flexWrap:'wrap',gap:8}}>
            <span style={{fontSize:11.5,color:'#508CFF',fontFamily:'monospace',display:'flex',alignItems:'center',gap:8}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              PassMark G3D (GPU) · PassMark CPU Mark · GamersNexus, TechPowerUp, Hardware Unboxed FPS data
            </span>
            <span style={{fontSize:10.5,color:'rgba(255,255,255,.3)',fontFamily:'monospace'}}>Dataset v9 · May 2025</span>
          </div>

          {/* ─ Verdict ─ */}
          {panel(<>
            <SecLabel n={4} label="Verdict"/>
            <div style={{borderRadius:14,padding:'1.4rem',background:{none:'rgba(0,229,160,.07)',minor:'rgba(255,208,96,.06)',moderate:'rgba(255,120,64,.07)',severe:'rgba(255,80,80,.08)'}[lv],border:`1px solid ${lvColor}38`}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:14}}>
                <div style={{width:40,height:40,borderRadius:11,background:`${lvColor}26`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lvColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {lv==='none'?<polyline points="20 6 9 17 4 12"/>:lv==='severe'?<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
                  </svg>
                </div>
                <div>
                  <div style={{fontSize:10,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4,color:`${lvColor}cc`}}>{lvLabel}</div>
                  <div style={{fontSize:16,fontWeight:700,color:lvColor}}>{result.bot} bottleneck — {result.pct}% imbalance at {fps}fps</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:14}}>
                {[
                  {val:`${result.pct}%`,      lbl:'Bottleneck', color:lvColor},
                  {val:result.bot,             lbl:'Limiting part', color:result.bot==='CPU'?'#508CFF':'#00E5A0'},
                  {val:result.estFps?`~${result.estFps} fps`:'N/A', lbl:'Est. FPS', color:'#F0F2F5'},
                ].map(s=>(
                  <div key={s.lbl} style={{background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:9,padding:'10px 12px',textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:700,fontFamily:'monospace',color:s.color,lineHeight:1.1,marginBottom:3}}>{s.val}</div>
                    <div style={{fontSize:10,color:'rgba(255,255,255,.3)',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:'.08em'}}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:13.5,color:'#8A94A6',lineHeight:1.75}}>
                Your <strong style={{color:'#EEF1F6'}}>{cpu.name}</strong> and <strong style={{color:'#EEF1F6'}}>{gpu.name}</strong> — {result.pct<15?'running in good sync. Neither component is waiting for the other.':result.bot==='CPU'?`CPU is the bottleneck. GPU sits at ${result.gpuU}% while CPU runs flat out.`:`GPU is the bottleneck. CPU is idle ${100-result.cpuU}% of the time.`}
              </div>
            </div>
          </>)}

          {/* ─ Gauge + Share ─ */}
          {panel(<>
            <SecLabel n={5} label="Performance gauge"/>

            {/* Share */}
            <div style={{marginBottom:16,background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:11,padding:'12px 14px'}}>
              <div style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.13em',marginBottom:10}}>Share your result</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                <button onClick={()=>{navigator.clipboard.writeText(window.location.href).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)})}} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',border:'.5px solid rgba(0,229,160,.3)',background:'rgba(0,229,160,.1)',color:'#00E5A0'}}>
                  🔗 {copied?'Copied! ✓':'Copy link'}
                </button>
                <button onClick={()=>window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Checked my build on ZARYNX — bottleneck results')}`, '_blank')} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',border:'.5px solid rgba(255,105,0,.28)',background:'rgba(255,105,0,.1)',color:'#FF6900'}}>Reddit</button>
                <button onClick={()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`My ${cpu.name} + ${gpu.name} has a ${result.pct}% ${result.bot} bottleneck`)}&url=${encodeURIComponent(window.location.href)}`, '_blank')} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',border:'.5px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.06)',color:'#8A94A6'}}>X / Twitter</button>
              </div>
            </div>

            {/* Gauge */}
            <div style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:12,padding:'1.1rem',marginBottom:10,textAlign:'center'}}>
              <div style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.13em',marginBottom:6}}>Bottleneck percentage</div>
              <Gauge pct={result.pct} color={lvColor}/>
              <div style={{fontSize:14,fontWeight:700,color:lvColor,marginTop:4}}>{result.pct<5?'Your build is well balanced!':result.bot==='CPU'?'CPU is the limiting component':'GPU is the limiting component'}</div>
            </div>

            {/* Util bars */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[{label:'CPU utilization',val:result.cpuU,color:'#508CFF'},{label:'GPU utilization',val:result.gpuU,color:'#00E5A0'}].map(u=>(
                <div key={u.label} style={{background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:10,padding:'.9rem 1rem'}}>
                  <div style={{fontSize:12,color:'rgba(255,255,255,.3)',marginBottom:4,display:'flex',alignItems:'center',gap:6,fontFamily:'monospace'}}>
                    <span style={{width:5,height:5,borderRadius:'50%',background:u.color,flexShrink:0}}/>
                    {u.label}
                  </div>
                  <div style={{fontSize:28,fontWeight:700,color:'#EEF1F6',margin:'4px 0 8px',fontFamily:'monospace'}}>{u.val}%</div>
                  <div style={{height:3,background:'rgba(255,255,255,.07)',borderRadius:2,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${u.val}%`,background:u.color,borderRadius:2,transition:'width .75s ease'}}/>
                  </div>
                </div>
              ))}
            </div>
          </>)}

          {/* ─ Score Comparison ─ */}
          {panel(<>
            <SecLabel n={6} label="Component score comparison"/>
            <div style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:12,padding:'1.1rem'}}>
              <div style={{fontSize:13.5,fontWeight:700,color:'#EEF1F6',marginBottom:4}}>CPU vs GPU — effective score for this use case</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.3)',fontFamily:'monospace',marginBottom:16}}>Weighted from benchmark data. Gap = bottleneck.</div>
              {(()=>{
                const fpsKey = fps<=60?'60':fps<=144?'144':'240'
                const cpuEff = Math.round(result.cw*1000)/10
                const gpuEff = Math.round(result.gw*1000)/10
                const maxE   = Math.max(cpuEff,gpuEff,1)
                return (
                  <div style={{display:'flex',flexDirection:'column',gap:14}}>
                    {[
                      {label:cpu.name,eff:cpuEff,color:'#508CFF',grad:'#7AABFF',sub:`${cpu.cores} cores · ${cpu.tdp}W TDP · CPU weight: ${Math.round(uc[`cpuW_${fpsKey}`]*100)}%`},
                      {label:gpu.name,eff:gpuEff,color:'#00E5A0',grad:'#00C880',sub:`${gpu.vram}GB VRAM · GPU weight: ${Math.round(uc[`gpuW_${fpsKey}`]*100)}%`},
                      {label:ram.name,eff:null,  color:'#FF7840',grad:'#FFAA70',sub:`${ram.gen} · ${ram.cap}GB · RAM modifier: ${result.ramMod>0?'+':''}${result.ramMod} pts`},
                    ].map(row=>(
                      <div key={row.label}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                          <span style={{fontSize:12.5,fontWeight:600,color:'#EEF1F6'}}>{row.label}</span>
                          {row.eff!==null && <span style={{fontSize:12,fontFamily:'monospace',color:'rgba(255,255,255,.5)'}}>{row.eff.toFixed(1)} effective score</span>}
                        </div>
                        <div style={{height:8,background:'rgba(255,255,255,.06)',borderRadius:20,overflow:'hidden',marginBottom:4}}>
                          <div style={{height:'100%',width:row.eff!==null?`${Math.round(row.eff/maxE*100)}%`:'40%',background:`linear-gradient(90deg,${row.color},${row.grad})`,borderRadius:20,transition:'width .85s ease'}}/>
                        </div>
                        <div style={{fontSize:11,color:'rgba(255,255,255,.3)',fontFamily:'monospace'}}>{row.sub}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </>)}

          {/* ─ Radar ─ */}
          {panel(<>
            <SecLabel n={7} label="Cross-scenario analysis"/>
            <div style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:12,padding:'1.1rem'}}>
              <div style={{fontSize:13.5,fontWeight:700,color:'#EEF1F6',marginBottom:4}}>Bottleneck across all use cases</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.3)',fontFamily:'monospace',marginBottom:16}}>How balanced is your build for every scenario? Lower = better.</div>
              <div style={{height:320,maxWidth:520,margin:'0 auto'}}>
                <RadarChart cpu={cpu} gpu={gpu} ram={ram} fps={fps}/>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginTop:14,fontFamily:'monospace',fontSize:11}}>
                {[['#00E5A0','Balanced (0–15%)'],['#FFD060','Minor (15–35%)'],['#FF7840','Moderate (35–60%)'],['#FF5050','Severe (60%+)']].map(([c,l])=>(
                  <span key={l} style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,.5)'}}>
                    <span style={{width:9,height:9,borderRadius:'50%',background:c}}/>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </>)}

          {/* ─ Scenario Table ─ */}
          {panel(<>
            <SecLabel n={8} label="Full use case breakdown"/>
            <div style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:12,padding:'1.1rem'}}>
              <div style={{overflowX:'auto',borderRadius:8,border:'.5px solid rgba(255,255,255,.08)'}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:440}}>
                  <thead>
                    <tr>
                      {['Scenario','Bottleneck','Limiting','CPU util','GPU util','Est. FPS'].map(h=>(
                        <th key={h} style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',padding:'10px 8px',textAlign:h==='Scenario'?'left':'center',borderBottom:'.5px solid rgba(255,255,255,.08)',fontWeight:500,whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {UCS.map(u=>{
                      const r2  = calcBN(cpu,gpu,ram,u,fps)
                      const lv2 = lvOf(r2.pct)
                      const c2  = {none:'#00E5A0',minor:'#FFD060',moderate:'#FF7840',severe:'#FF5050'}[lv2]
                      const isActive = u.id===ucId
                      return (
                        <tr key={u.id} style={{background:isActive?'rgba(0,229,160,.04)':'transparent'}}>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',fontSize:13,color:'#EEF1F6',fontWeight:600}}>
                            {u.label}{isActive&&<span style={{fontSize:10,color:'#00E5A0',fontFamily:'monospace',marginLeft:6}}>← current</span>}
                          </td>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                              <div style={{width:50,height:5,background:'rgba(255,255,255,.06)',borderRadius:10,overflow:'hidden',flexShrink:0}}>
                                <div style={{height:'100%',width:`${r2.pct}%`,background:c2,borderRadius:10}}/>
                              </div>
                              <span style={{fontSize:11.5,color:c2,fontFamily:'monospace',minWidth:30}}>{r2.pct}%</span>
                            </div>
                          </td>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center'}}>
                            {lv2==='none'?<span style={{fontSize:10,padding:'2px 7px',borderRadius:10,fontFamily:'monospace',background:'rgba(0,229,160,.08)',color:'#00E5A0'}}>Balanced</span>:r2.bot==='CPU'?<span style={{fontSize:10,padding:'2px 7px',borderRadius:10,fontFamily:'monospace',background:'rgba(80,140,255,.15)',color:'#508CFF',border:'.5px solid rgba(80,140,255,.3)'}}>CPU</span>:<span style={{fontSize:10,padding:'2px 7px',borderRadius:10,fontFamily:'monospace',background:'rgba(0,229,160,.12)',color:'#00E5A0',border:'.5px solid rgba(0,229,160,.3)'}}>GPU</span>}
                          </td>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center',fontFamily:'monospace',fontSize:13,color:'#508CFF'}}>{r2.cpuU}%</td>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center',fontFamily:'monospace',fontSize:13,color:'#00E5A0'}}>{r2.gpuU}%</td>
                          <td style={{padding:'10px 8px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center',fontFamily:'monospace',fontSize:13,color:r2.estFps?fpsColor(r2.estFps):'rgba(255,255,255,.3)'}}>{r2.estFps?`${r2.estFps}+`:'—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>)}

          {/* ─ Resolution Matrix ─ */}
          {panel(<>
            <SecLabel n={9} label="Bottleneck by resolution"/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginBottom:20}}>
              {[{key:'r1080',label:'1080p',sub:'1920×1080',ucId:'gaming_1080p'},{key:'r1440',label:'1440p',sub:'2560×1440',ucId:'gaming_1440p'},{key:'r4k',label:'4K',sub:'3840×2160',ucId:'gaming_4k'}].map(res=>{
                const u2 = UCS.find(u=>u.id===res.ucId)
                const r2 = calcBN(cpu,gpu,ram,u2,fps)
                const lv2= lvOf(r2.pct)
                const c2 = {none:'#00E5A0',minor:'#FFD060',moderate:'#FF7840',severe:'#FF5050'}[lv2]
                return (
                  <div key={res.key} style={{background:'rgba(255,255,255,.03)',border:`.5px solid ${c2}33`,borderRadius:12,padding:'14px 14px 12px',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:2.5,background:c2,borderRadius:'12px 12px 0 0'}}/>
                    <div style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:8}}>{res.label}</div>
                    <div style={{fontSize:15,fontWeight:700,color:'#EEF1F6',fontFamily:'monospace',marginBottom:2}}>{res.sub}</div>
                    <div style={{fontSize:28,fontWeight:800,color:c2,lineHeight:1,marginBottom:4,fontFamily:'monospace'}}>{r2.pct}%</div>
                    <div style={{fontSize:11,color:'rgba(255,255,255,.3)',fontFamily:'monospace',marginBottom:6}}>{lv2==='none'?'No bottleneck':lv2==='minor'?'Minor':lv2==='moderate'?'Moderate':'Severe'}</div>
                    <span style={{fontSize:10.5,padding:'3px 8px',borderRadius:20,display:'inline-block',fontFamily:'monospace',background:`${c2}1a`,color:c2}}>{r2.bot==='CPU'?'CPU-limited':r2.bot==='GPU'?'GPU-limited':'Balanced'}</span>
                  </div>
                )
              })}
            </div>
            {/* FPS playability table */}
            <div style={{overflowX:'auto',borderRadius:10,border:'.5px solid rgba(255,255,255,.08)'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:480}}>
                <thead>
                  <tr>
                    <th style={{background:'rgba(255,255,255,.04)',fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',padding:'10px 14px',textAlign:'left',fontWeight:500,borderBottom:'.5px solid rgba(255,255,255,.08)',whiteSpace:'nowrap'}}>Resolution</th>
                    {[30,60,90,120,144].map(t=><th key={t} style={{background:'rgba(255,255,255,.04)',fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',padding:'10px 12px',textAlign:'center',fontWeight:500,borderBottom:'.5px solid rgba(255,255,255,.08)',whiteSpace:'nowrap'}}>{t}+ fps</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{key:'r1080',label:'1080p',sub:'1920×1080'},{key:'r1440',label:'1440p',sub:'2560×1440'},{key:'r4k',label:'4K',sub:'3840×2160'}].map(res=>(
                    <tr key={res.key}>
                      <td style={{padding:'11px 14px',borderBottom:'.5px solid rgba(255,255,255,.04)',fontSize:12.5,fontWeight:600,color:'#EEF1F6'}}>{res.label} <span style={{color:'rgba(255,255,255,.3)',fontSize:11,fontFamily:'monospace'}}>{res.sub}</span></td>
                      {[30,60,90,120,144].map(t=>{
                        let playable=0
                        GAMES.forEach(g=>{if(calcGameFps(g,res.key,gpu.score,cpu.score,ramMod)>=t)playable++})
                        const pct=Math.round(playable/GAMES.length*100)
                        const cls=pct>=90?{bg:'rgba(0,229,160,.12)',color:'#00E5A0',border:'rgba(0,229,160,.25)'}:pct>=70?{bg:'rgba(80,200,120,.1)',color:'#4DC87A',border:'rgba(80,200,120,.2)'}:pct>=45?{bg:'rgba(255,208,96,.1)',color:'#FFD060',border:'rgba(255,208,96,.22)'}:pct>=20?{bg:'rgba(255,120,64,.1)',color:'#FF7840',border:'rgba(255,120,64,.22)'}:{bg:'rgba(255,80,80,.1)',color:'#FF5050',border:'rgba(255,80,80,.22)'}
                        return (
                          <td key={t} style={{padding:'11px 12px',borderBottom:'.5px solid rgba(255,255,255,.04)',textAlign:'center'}}>
                            <span style={{display:'inline-block',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600,fontFamily:'monospace',minWidth:52,textAlign:'center',background:cls.bg,color:cls.color,border:`.5px solid ${cls.border}`}}>{pct}%</span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* ─ Game FPS Cards ─ */}
          {panel(<>
            <SecLabel n={10} label="FPS in popular games"/>
            <div style={{fontSize:12.5,color:'rgba(255,255,255,.4)',marginBottom:14,fontFamily:'monospace'}}>Estimated average FPS at medium-high settings.</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {displayedGames.map(g=>{
                const f1080=calcGameFps(g,'r1080',gpu.score,cpu.score,ramMod)
                const f1440=calcGameFps(g,'r1440',gpu.score,cpu.score,ramMod)
                const f4k  =calcGameFps(g,'r4k',  gpu.score,cpu.score,ramMod)
                const maxF =Math.max(f1080,f1440,f4k,fps,1)
                return (
                  <div key={g.id} style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:10,overflow:'hidden',display:'flex',alignItems:'stretch'}}>
                    <div style={{width:3,background:g.color,flexShrink:0}}/>
                    <div style={{width:64,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',padding:8,background:'rgba(255,255,255,.02)',borderRight:'.5px solid rgba(255,255,255,.06)'}}>
                      <img
                        src={g.thumb}
                        alt={g.name}
                        loading="lazy"
                        style={{width:46,height:46,borderRadius:7,objectFit:'cover',border:`.5px solid ${g.color}44`}}
                        onError={e=>{e.currentTarget.style.display='none';e.currentTarget.nextSibling.style.display='flex'}}
                      />
                      <div style={{display:'none',width:46,height:46,borderRadius:7,background:`${g.color}22`,border:`.5px solid ${g.color}44`,alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>🎮</div>
                    </div>
                    <div style={{flex:1,padding:'9px 12px',minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#EEF1F6',marginBottom:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.name}</div>
                      <div style={{fontSize:10,color:'rgba(255,255,255,.3)',fontFamily:'monospace',marginBottom:7,display:'flex',alignItems:'center',gap:4}}>
                        <span style={{width:4,height:4,borderRadius:'50%',background:g.color}}/>
                        {g.genre}
                      </div>
                      {[{res:'1080p',f:f1080},{res:'1440p',f:f1440},{res:'4K',f:f4k}].map(({res,f})=>(
                        <div key={res} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                          <span style={{fontSize:10,fontFamily:'monospace',color:'rgba(255,255,255,.3)',width:40,flexShrink:0}}>{res}</span>
                          <div style={{flex:1,height:4,background:'rgba(255,255,255,.07)',borderRadius:10,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${Math.min(Math.round(f/maxF*100),100)}%`,background:fpsColor(f),borderRadius:10,transition:'width 1s ease'}}/>
                          </div>
                          <span style={{fontSize:11.5,fontWeight:700,fontFamily:'monospace',color:fpsColor(f),width:60,textAlign:'right',flexShrink:0}}>{f} FPS</span>
                          <span style={{fontSize:9,padding:'1px 5px',borderRadius:4,flexShrink:0,background:f>=fps?'rgba(0,229,160,.12)':'rgba(255,80,80,.1)',color:f>=fps?'#00E5A0':'#FF5050'}}>{f>=fps?'✓':'✗'} {fps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={()=>setShowAll(v=>!v)} style={{width:'100%',marginTop:10,background:'rgba(255,255,255,.04)',border:'.5px solid rgba(255,255,255,.12)',borderRadius:9,color:'#8A94A6',fontSize:13,fontWeight:500,padding:'11px 16px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {showAll?'Show fewer games':`View all ${GAMES.length} games`}
            </button>
          </>)}

          {/* ─ Suggestions ─ */}
          {panel(<>
            <SecLabel n={11} label="Balanced build suggestions"/>
            <div style={{background:'rgba(255,255,255,.03)',border:'.5px solid rgba(255,255,255,.08)',borderRadius:12,padding:'1.1rem'}}>
              <div style={{fontSize:13.5,fontWeight:700,color:'#EEF1F6',marginBottom:4}}>Best-matched CPU + GPU pairs for {uc.label} @ {fps}fps</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.3)',fontFamily:'monospace',marginBottom:12}}>Pairs with ≤10% bottleneck gap · sorted by performance tier</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {(()=>{
                  const defRam = RAMS[1]
                  const pairs=[], seen=new Set()
                  allCpus.forEach(c=>allGpus.forEach(g=>{
                    const r=calcBN(c,g,defRam,uc,fps)
                    if(r.pct<=10){const k=c.id+'|'+g.id;if(!seen.has(k)){seen.add(k);pairs.push({cpu:c,gpu:g,pct:r.pct})}}
                  }))
                  pairs.sort((a,b)=>a.pct!==b.pct?a.pct-b.pct:(b.cpu.score+b.gpu.score)-(a.cpu.score+a.gpu.score))
                  return pairs.slice(0,6).map(s=>{
                    const isCur=cpu.id===s.cpu.id&&gpu.id===s.gpu.id
                    return (
                      <div key={s.cpu.id+s.gpu.id} onClick={()=>{if(!isCur){setCpuId(s.cpu.id);setGpuId(s.gpu.id);setResult(calcBN(s.cpu,s.gpu,ram,uc,fps))}}} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:9,background:isCur?'rgba(0,229,160,.06)':'rgba(255,255,255,.03)',border:`.5px solid ${isCur?'rgba(0,229,160,.35)':'transparent'}`,cursor:isCur?'default':'pointer',transition:'all .18s'}}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><polyline points="20 6 9 17 4 12"/></svg>
                        <span style={{flex:1,minWidth:0,lineHeight:1.65}}>
                          <span style={{fontWeight:700,color:'#EEF1F6',fontSize:13}}>{s.cpu.name}</span>
                          <span style={{color:'rgba(255,255,255,.3)',margin:'0 5px'}}>+</span>
                          <span style={{fontWeight:700,color:'#EEF1F6',fontSize:13}}>{s.gpu.name}</span>
                          {isCur&&<span style={{display:'block',fontSize:10,color:'#00E5A0'}}>Currently loaded</span>}
                        </span>
                        <span style={{fontSize:10.5,padding:'2px 9px',borderRadius:20,background:'rgba(0,229,160,.1)',color:'#00E5A0',flexShrink:0,fontFamily:'monospace'}}>{s.pct}% gap</span>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </>)}

        </div>
      )}

      <ToolExplanation
        title="What is a PC bottleneck and how does it affect gaming?"
        paragraphs={['A bottleneck happens when one component is significantly slower than another, causing the faster part to sit idle. The most common pairing is CPU vs GPU — an imbalance directly impacts your FPS and gaming performance.']}
        cards={[
          {icon:Monitor, iconBg:'rgba(80,140,255,.1)', iconColor:'var(--blue)',   title:'CPU bottleneck',  body:'Your processor cannot keep up with your GPU. Common in CPU-heavy games and at high framerates (144fps+).'},
          {icon:Monitor, iconBg:'rgba(0,229,160,.1)',  iconColor:'var(--mint)',   title:'GPU bottleneck',  body:'Your graphics card is the slower part. This is actually ideal — it means the GPU runs at 100% load.'},
          {icon:Activity,iconBg:'rgba(255,120,64,.1)', iconColor:'var(--orange)', title:'RAM impact',      body:'RAM speed and capacity affect CPU headroom. Enabling XMP/EXPO in BIOS is a free upgrade that helps reduce CPU bottlenecks.'},
        ]}
        secondTitle="How does resolution affect bottlenecks?"
        secondParagraphs={['At 4K the GPU does almost all the work. At 1080p/240fps the CPU is under far more pressure. The same build can be GPU-bottlenecked at 4K but CPU-bottlenecked at 1080p high framerate.']}
      />

      <ToolHowTo
        steps={[
          {title:'Select your CPU and GPU', description:'Choose your exact processor and graphics card from the dropdowns. They are grouped by generation for easy browsing.'},
          {title:'Select your RAM', description:'Choose your RAM kit. Higher speed DDR5 or enabling XMP/EXPO can meaningfully reduce CPU bottlenecks, especially at 1080p.'},
          {title:'Set target framerate and use case', description:'Select your target FPS and what you mainly use your PC for. Gaming at 240fps is far more CPU-heavy than gaming at 60fps.'},
          {title:'Read your results', description:'Under 15% is good. 15–35% is minor. 35–60% is moderate. Above 60% is severe and upgrading the bottlenecking component will have major impact.'},
        ]}
      />

      <ToolFaq
        items={[
          {question:'Is a 10% bottleneck bad?',           answer:'No. Under 15% is considered well-balanced. A small bottleneck is normal in any build — no pairing is 100% perfect. Focus on bottlenecks above 35%.'},
          {question:'Should I avoid a CPU bottleneck?',   answer:'Not necessarily. A slight GPU bottleneck is actually ideal — the GPU (the most expensive part) runs at 100% while the CPU handles OS and game logic without being maxed out.'},
          {question:'Does RAM really matter?',             answer:'Yes, especially at 1080p and high framerates. Running RAM at its rated speed (XMP/EXPO in BIOS) and using faster DDR5 can reduce CPU bottlenecks — it\'s a free performance upgrade.'},
          {question:'Are these FPS numbers accurate?',     answer:'The FPS figures are model-estimated based on PassMark benchmark tiers and published data from GamersNexus, TechPowerUp, and Hardware Unboxed. They are good approximations — actual in-game FPS varies by title, settings, and driver version.'},
          {question:'What is PassMark?',                   answer:'PassMark CPU Mark and G3D Mark are widely-used industry benchmarks that give consistent, comparable scores across CPU and GPU generations. They allow us to build a unified scoring model.'},
        ]}
      />

      <ToolRelated
        tools={[
          {name:'Sensitivity Converter',  description:'Convert mouse sensitivity across CS2, Valorant, Apex and more', slug:'sensitivity-converter',  icon:Activity, iconBg:'rgba(0,229,160,.1)', iconColor:'var(--mint)'},
          {name:'Game Pass Calculator',   description:'Is Xbox Game Pass worth it for you? Calculate real cost vs buying', slug:'game-pass-calculator', icon:Monitor, iconBg:'rgba(255,120,64,.1)', iconColor:'var(--orange)'},
          {name:'Reaction Speed Tester',  description:'Measure your reaction time in milliseconds',                        slug:'reaction-speed-test',  icon:Activity, iconBg:'rgba(80,140,255,.1)', iconColor:'var(--blue)'},
        ]}
      />

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg) } }
        @keyframes spinr { to { transform: rotate(-360deg) } }
        @keyframes dp    { 0%,80%,100%{opacity:.2}40%{opacity:1} }
        @keyframes lb    { 0%{width:0}55%{width:65%}80%{width:90%}100%{width:100%} }
        select option, select optgroup { background:#161B23; color:#EEF1F6; }
      `}</style>
    </ToolLayout>
  )
}

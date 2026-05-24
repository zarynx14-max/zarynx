'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Monitor, Activity } from 'lucide-react'
import {
  ToolBreadcrumb, ToolHeader, ToolExplanation,
  ToolHowTo, ToolFaq, ToolRelated,
  ToolLayout, ToolSection, SectionLabel,
} from '@/components/tool'

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — PassMark-derived scores (same as HTML v9)
───────────────────────────────────────────────────────────────────────────── */
const DB = {
  cpus: [
    // Intel 10th
    {id:'i3-10100',  name:'Core i3-10100',     score:312, cores:4,  tdp:65,  brand:'Intel', gen:'10th'},
    {id:'i5-10400',  name:'Core i5-10400',     score:392, cores:6,  tdp:65,  brand:'Intel', gen:'10th'},
    {id:'i5-10600k', name:'Core i5-10600K',    score:435, cores:6,  tdp:125, brand:'Intel', gen:'10th'},
    {id:'i7-10700k', name:'Core i7-10700K',    score:524, cores:8,  tdp:125, brand:'Intel', gen:'10th'},
    // Intel 11th
    {id:'i5-11600k', name:'Core i5-11600K',    score:462, cores:6,  tdp:125, brand:'Intel', gen:'11th'},
    {id:'i7-11700k', name:'Core i7-11700K',    score:548, cores:8,  tdp:125, brand:'Intel', gen:'11th'},
    // Intel 12th
    {id:'i3-12100',  name:'Core i3-12100',     score:488, cores:4,  tdp:60,  brand:'Intel', gen:'12th'},
    {id:'i5-12400',  name:'Core i5-12400',     score:578, cores:6,  tdp:65,  brand:'Intel', gen:'12th'},
    {id:'i5-12600k', name:'Core i5-12600K',    score:658, cores:10, tdp:125, brand:'Intel', gen:'12th'},
    {id:'i7-12700k', name:'Core i7-12700K',    score:728, cores:12, tdp:125, brand:'Intel', gen:'12th'},
    {id:'i9-12900k', name:'Core i9-12900K',    score:798, cores:16, tdp:125, brand:'Intel', gen:'12th'},
    // Intel 13th
    {id:'i5-13400',  name:'Core i5-13400',     score:612, cores:10, tdp:65,  brand:'Intel', gen:'13th'},
    {id:'i5-13600k', name:'Core i5-13600K',    score:708, cores:14, tdp:125, brand:'Intel', gen:'13th'},
    {id:'i7-13700k', name:'Core i7-13700K',    score:822, cores:16, tdp:125, brand:'Intel', gen:'13th'},
    {id:'i9-13900k', name:'Core i9-13900K',    score:928, cores:24, tdp:125, brand:'Intel', gen:'13th'},
    {id:'i9-13900ks',name:'Core i9-13900KS',   score:958, cores:24, tdp:150, brand:'Intel', gen:'13th'},
    // Intel 14th
    {id:'i5-14400',  name:'Core i5-14400',     score:618, cores:10, tdp:65,  brand:'Intel', gen:'14th'},
    {id:'i5-14600k', name:'Core i5-14600K',    score:732, cores:14, tdp:125, brand:'Intel', gen:'14th'},
    {id:'i7-14700k', name:'Core i7-14700K',    score:858, cores:20, tdp:125, brand:'Intel', gen:'14th'},
    {id:'i9-14900k', name:'Core i9-14900K',    score:968, cores:24, tdp:125, brand:'Intel', gen:'14th'},
    {id:'i9-14900ks',name:'Core i9-14900KS',   score:988, cores:24, tdp:150, brand:'Intel', gen:'14th'},
    // Intel Arrow Lake
    {id:'i5-265k',   name:'Core Ultra 5 265K', score:718, cores:14, tdp:125, brand:'Intel', gen:'15th (Arrow Lake)'},
    {id:'i7-265k',   name:'Core Ultra 7 265K', score:848, cores:20, tdp:125, brand:'Intel', gen:'15th (Arrow Lake)'},
    {id:'i9-285k',   name:'Core Ultra 9 285K', score:968, cores:24, tdp:125, brand:'Intel', gen:'15th (Arrow Lake)'},
    // AMD Ryzen 5000
    {id:'r5-5500',   name:'Ryzen 5 5500',      score:498, cores:6,  tdp:65,  brand:'AMD', gen:'Zen 3'},
    {id:'r5-5600',   name:'Ryzen 5 5600',      score:558, cores:6,  tdp:65,  brand:'AMD', gen:'Zen 3'},
    {id:'r5-5600x',  name:'Ryzen 5 5600X',     score:588, cores:6,  tdp:65,  brand:'AMD', gen:'Zen 3'},
    {id:'r7-5700x',  name:'Ryzen 7 5700X',     score:638, cores:8,  tdp:65,  brand:'AMD', gen:'Zen 3'},
    {id:'r7-5800x',  name:'Ryzen 7 5800X',     score:668, cores:8,  tdp:105, brand:'AMD', gen:'Zen 3'},
    {id:'r7-5800x3d',name:'Ryzen 7 5800X3D',   score:718, cores:8,  tdp:105, brand:'AMD', gen:'Zen 3 (3D V-Cache)'},
    {id:'r9-5900x',  name:'Ryzen 9 5900X',     score:798, cores:12, tdp:105, brand:'AMD', gen:'Zen 3'},
    {id:'r9-5950x',  name:'Ryzen 9 5950X',     score:878, cores:16, tdp:105, brand:'AMD', gen:'Zen 3'},
    // AMD Ryzen 7000
    {id:'r5-7600',   name:'Ryzen 5 7600',      score:678, cores:6,  tdp:65,  brand:'AMD', gen:'Zen 4'},
    {id:'r5-7600x',  name:'Ryzen 5 7600X',     score:708, cores:6,  tdp:105, brand:'AMD', gen:'Zen 4'},
    {id:'r7-7700',   name:'Ryzen 7 7700',      score:758, cores:8,  tdp:65,  brand:'AMD', gen:'Zen 4'},
    {id:'r7-7700x',  name:'Ryzen 7 7700X',     score:788, cores:8,  tdp:105, brand:'AMD', gen:'Zen 4'},
    {id:'r7-7800x3d',name:'Ryzen 7 7800X3D',   score:858, cores:8,  tdp:120, brand:'AMD', gen:'Zen 4 (3D V-Cache)'},
    {id:'r9-7900x',  name:'Ryzen 9 7900X',     score:898, cores:12, tdp:170, brand:'AMD', gen:'Zen 4'},
    {id:'r9-7950x',  name:'Ryzen 9 7950X',     score:978, cores:16, tdp:170, brand:'AMD', gen:'Zen 4'},
    {id:'r9-7950x3d',name:'Ryzen 9 7950X3D',   score:998, cores:16, tdp:120, brand:'AMD', gen:'Zen 4 (3D V-Cache)'},
    // AMD Ryzen 9000
    {id:'r5-9600x',  name:'Ryzen 5 9600X',     score:738, cores:6,  tdp:65,  brand:'AMD', gen:'Zen 5'},
    {id:'r7-9700x',  name:'Ryzen 7 9700X',     score:808, cores:8,  tdp:65,  brand:'AMD', gen:'Zen 5'},
    {id:'r9-9900x',  name:'Ryzen 9 9900X',     score:918, cores:12, tdp:120, brand:'AMD', gen:'Zen 5'},
    {id:'r9-9950x',  name:'Ryzen 9 9950X',     score:1018,cores:16, tdp:170, brand:'AMD', gen:'Zen 5'},
    {id:'r7-9800x3d',name:'Ryzen 7 9800X3D',   score:948, cores:8,  tdp:120, brand:'AMD', gen:'Zen 5 (3D V-Cache)'},
  ],
  gpus: [
    // GTX Legacy
    {id:'gtx1660',   name:'GTX 1660',          score:184, vram:6,  brand:'NVIDIA', gen:'Pascal'},
    {id:'gtx1660s',  name:'GTX 1660 Super',    score:212, vram:6,  brand:'NVIDIA', gen:'Turing'},
    {id:'gtx1660ti', name:'GTX 1660 Ti',       score:226, vram:6,  brand:'NVIDIA', gen:'Turing'},
    {id:'gtx1070',   name:'GTX 1070',          score:193, vram:8,  brand:'NVIDIA', gen:'Pascal'},
    {id:'gtx1070ti', name:'GTX 1070 Ti',       score:222, vram:8,  brand:'NVIDIA', gen:'Pascal'},
    {id:'gtx1080',   name:'GTX 1080',          score:248, vram:8,  brand:'NVIDIA', gen:'Pascal'},
    {id:'gtx1080ti', name:'GTX 1080 Ti',       score:327, vram:11, brand:'NVIDIA', gen:'Pascal'},
    // RTX 20
    {id:'rtx2060',   name:'RTX 2060',          score:272, vram:6,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2060s',  name:'RTX 2060 Super',    score:308, vram:8,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2070',   name:'RTX 2070',          score:330, vram:8,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2070s',  name:'RTX 2070 Super',    score:372, vram:8,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2080',   name:'RTX 2080',          score:410, vram:8,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2080s',  name:'RTX 2080 Super',    score:441, vram:8,  brand:'NVIDIA', gen:'Turing'},
    {id:'rtx2080ti', name:'RTX 2080 Ti',       score:510, vram:11, brand:'NVIDIA', gen:'Turing'},
    // RTX 30
    {id:'rtx3060',   name:'RTX 3060',          score:372, vram:12, brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3060ti', name:'RTX 3060 Ti',       score:459, vram:8,  brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3070',   name:'RTX 3070',          score:530, vram:8,  brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3070ti', name:'RTX 3070 Ti',       score:572, vram:8,  brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3080',   name:'RTX 3080 10GB',     score:658, vram:10, brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3080-12',name:'RTX 3080 12GB',     score:688, vram:12, brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3080ti', name:'RTX 3080 Ti',       score:725, vram:12, brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3090',   name:'RTX 3090',          score:762, vram:24, brand:'NVIDIA', gen:'Ampere'},
    {id:'rtx3090ti', name:'RTX 3090 Ti',       score:808, vram:24, brand:'NVIDIA', gen:'Ampere'},
    // RTX 40
    {id:'rtx4060',   name:'RTX 4060',          score:468, vram:8,  brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4060ti-8', name:'RTX 4060 Ti 8GB', score:558, vram:8,  brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4060ti-16',name:'RTX 4060 Ti 16GB',score:572, vram:16, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4070',   name:'RTX 4070',          score:682, vram:12, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4070s',  name:'RTX 4070 Super',    score:762, vram:12, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4070ti', name:'RTX 4070 Ti',       score:835, vram:12, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4070tis',name:'RTX 4070 Ti Super', score:898, vram:16, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4080',   name:'RTX 4080',          score:958, vram:16, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4080s',  name:'RTX 4080 Super',    score:998, vram:16, brand:'NVIDIA', gen:'Ada Lovelace'},
    {id:'rtx4090',   name:'RTX 4090',          score:1198,vram:24, brand:'NVIDIA', gen:'Ada Lovelace'},
    // RTX 50
    {id:'rtx5070',   name:'RTX 5070',          score:952, vram:12, brand:'NVIDIA', gen:'Blackwell'},
    {id:'rtx5070ti', name:'RTX 5070 Ti',       score:1058,vram:16, brand:'NVIDIA', gen:'Blackwell'},
    {id:'rtx5080',   name:'RTX 5080',          score:1152,vram:16, brand:'NVIDIA', gen:'Blackwell'},
    {id:'rtx5090',   name:'RTX 5090',          score:1498,vram:32, brand:'NVIDIA', gen:'Blackwell'},
    // AMD RX 5000
    {id:'rx5700',    name:'RX 5700',           score:270, vram:8,  brand:'AMD', gen:'RDNA'},
    {id:'rx5700xt',  name:'RX 5700 XT',        score:310, vram:8,  brand:'AMD', gen:'RDNA'},
    // AMD RX 6000
    {id:'rx6600',    name:'RX 6600',           score:320, vram:8,  brand:'AMD', gen:'RDNA 2'},
    {id:'rx6600xt',  name:'RX 6600 XT',        score:360, vram:8,  brand:'AMD', gen:'RDNA 2'},
    {id:'rx6650xt',  name:'RX 6650 XT',        score:380, vram:8,  brand:'AMD', gen:'RDNA 2'},
    {id:'rx6700',    name:'RX 6700',           score:420, vram:10, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6700xt',  name:'RX 6700 XT',        score:470, vram:12, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6750xt',  name:'RX 6750 XT',        score:490, vram:12, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6800',    name:'RX 6800',           score:570, vram:16, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6800xt',  name:'RX 6800 XT',        score:640, vram:16, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6900xt',  name:'RX 6900 XT',        score:700, vram:16, brand:'AMD', gen:'RDNA 2'},
    {id:'rx6950xt',  name:'RX 6950 XT',        score:730, vram:16, brand:'AMD', gen:'RDNA 2'},
    // AMD RX 7000
    {id:'rx7600',    name:'RX 7600',           score:410, vram:8,  brand:'AMD', gen:'RDNA 3'},
    {id:'rx7600xt',  name:'RX 7600 XT',        score:450, vram:16, brand:'AMD', gen:'RDNA 3'},
    {id:'rx7700xt',  name:'RX 7700 XT',        score:560, vram:12, brand:'AMD', gen:'RDNA 3'},
    {id:'rx7800xt',  name:'RX 7800 XT',        score:660, vram:16, brand:'AMD', gen:'RDNA 3'},
    {id:'rx7900gre', name:'RX 7900 GRE',       score:740, vram:16, brand:'AMD', gen:'RDNA 3'},
    {id:'rx7900xt',  name:'RX 7900 XT',        score:820, vram:20, brand:'AMD', gen:'RDNA 3'},
    {id:'rx7900xtx', name:'RX 7900 XTX',       score:920, vram:24, brand:'AMD', gen:'RDNA 3'},
    // AMD RX 9000
    {id:'rx9070',    name:'RX 9070',           score:870, vram:16, brand:'AMD', gen:'RDNA 4'},
    {id:'rx9070xt',  name:'RX 9070 XT',        score:960, vram:16, brand:'AMD', gen:'RDNA 4'},
  ],
  rams: [
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
  ],
}

const UCS = [
  {id:'gaming_1080p', label:'1080p Gaming',   cpuW_60:.62,cpuW_144:.68,cpuW_240:.74, gpuW_60:.38,gpuW_144:.32,gpuW_240:.26, hint:'CPU is heavily stressed at high framerates. At 1080p/144fps+ the processor is the #1 bottleneck factor.', vramMin:6,  fpsBase:180, vramWarnMsg:'8GB+ VRAM recommended for 1080p in modern titles.'},
  {id:'gaming_1440p', label:'1440p Gaming',   cpuW_60:.48,cpuW_144:.55,cpuW_240:.62, gpuW_60:.52,gpuW_144:.45,gpuW_240:.38, hint:'The sweet spot — both CPU and GPU matter. At 1440p/144fps the GPU begins to dominate.', vramMin:8,  fpsBase:120, vramWarnMsg:'10GB+ VRAM recommended for 1440p. 8GB may stutter in VRAM-heavy titles.'},
  {id:'gaming_4k',    label:'4K Gaming',      cpuW_60:.25,cpuW_144:.32,cpuW_240:.38, gpuW_60:.75,gpuW_144:.68,gpuW_240:.62, hint:'GPU-dominated. Nearly all 4K bottlenecks are GPU-side.', vramMin:12, fpsBase:80,  vramWarnMsg:'12GB+ VRAM strongly recommended for 4K. Many titles exceed 8–10GB at 4K ultra.'},
  {id:'video',        label:'Video Editing',  cpuW_60:.62,cpuW_144:.62,cpuW_240:.62, gpuW_60:.38,gpuW_144:.38,gpuW_240:.38, hint:'CPU and RAM are critical. More cores & faster memory means faster exports.', vramMin:8,  fpsBase:null,vramWarnMsg:'8GB+ VRAM recommended for GPU-accelerated video encoding.'},
  {id:'render_3d',    label:'3D Rendering',   cpuW_60:.68,cpuW_144:.68,cpuW_240:.68, gpuW_60:.32,gpuW_144:.32,gpuW_240:.32, hint:'CPU-intensive for CPU renders (Blender, V-Ray). GPU renders flip this.', vramMin:8,  fpsBase:null,vramWarnMsg:'8GB+ VRAM needed for GPU rendering with complex scenes.'},
  {id:'streaming',    label:'Streaming/OBS',  cpuW_60:.70,cpuW_144:.70,cpuW_240:.70, gpuW_60:.30,gpuW_144:.30,gpuW_240:.30, hint:'CPU is paramount for software encoding. NVENC/AMF offloads to the GPU.', vramMin:6,  fpsBase:null,vramWarnMsg:''},
] as const

type UcId = typeof UCS[number]['id']

const GAMES = [
  {id:'cs2',      name:'Counter-Strike 2',     genre:'FPS / Competitive', color:'#F0A000', cpuW:.72, base:{r1080:235,r1440:192,r4k:112}},
  {id:'valorant', name:'Valorant',              genre:'FPS / Competitive', color:'#FF4655', cpuW:.80, base:{r1080:340,r1440:275,r4k:158}},
  {id:'fortnite', name:'Fortnite',              genre:'Battle Royale',     color:'#00D4FF', cpuW:.62, base:{r1080:200,r1440:155,r4k:88}},
  {id:'warzone',  name:'Call of Duty: Warzone', genre:'Battle Royale',     color:'#6B8F00', cpuW:.58, base:{r1080:145,r1440:105,r4k:58}},
  {id:'apex',     name:'Apex Legends',          genre:'Battle Royale',     color:'#CD3333', cpuW:.60, base:{r1080:185,r1440:138,r4k:78}},
  {id:'cyberpunk',name:'Cyberpunk 2077',        genre:'Open World / RPG',  color:'#FCEE09', cpuW:.38, base:{r1080:85, r1440:65, r4k:36}},
  {id:'rdr2',     name:'Red Dead Redemption 2', genre:'Open World',        color:'#8B4513', cpuW:.52, base:{r1080:95, r1440:70, r4k:38}},
  {id:'elden',    name:'Elden Ring',            genre:'Action RPG',        color:'#C8A951', cpuW:.45, base:{r1080:110,r1440:82, r4k:46}},
  {id:'minecraft',name:'Minecraft (Modded)',    genre:'Sandbox',           color:'#5D8A31', cpuW:.82, base:{r1080:145,r1440:112,r4k:62}},
  {id:'helldivers',name:'Helldivers 2',         genre:'Co-op Shooter',     color:'#FFB800', cpuW:.55, base:{r1080:88, r1440:65, r4k:36}},
  {id:'lol',      name:'League of Legends',     genre:'MOBA',              color:'#C89B3C', cpuW:.78, base:{r1080:308,r1440:238,r4k:135}},
  {id:'witcher3', name:'The Witcher 3',         genre:'Open World / RPG',  color:'#C0392B', cpuW:.48, base:{r1080:115,r1440:85, r4k:48}},
  {id:'starfield',name:'Starfield',             genre:'RPG / Open World',  color:'#4488FF', cpuW:.65, base:{r1080:82, r1440:60, r4k:34}},
  {id:'hogwarts', name:'Hogwarts Legacy',       genre:'Action RPG',        color:'#7B2FBE', cpuW:.46, base:{r1080:78, r1440:58, r4k:32}},
  {id:'spiderman',name:"Marvel's Spider-Man 2",genre:'Action / Open World',color:'#E62429', cpuW:.48, base:{r1080:95, r1440:72, r4k:40}},
  {id:'msfs',     name:'MS Flight Simulator',   genre:'Simulation',        color:'#007FFF', cpuW:.72, base:{r1080:62, r1440:48, r4k:28}},
]

const MAX_CPU = 1020, MAX_GPU = 1500

/* ─────────────────────────────────────────────────────────────────────────────
   CALCULATION ENGINE
───────────────────────────────────────────────────────────────────────────── */
type Cpu = typeof DB.cpus[number]
type Gpu = typeof DB.gpus[number]
type Ram = typeof DB.rams[number]
type Uc  = typeof UCS[number]

function calcBN(cpu: Cpu, gpu: Gpu, ram: Ram, uc: Uc, fps: number) {
  const fpsKey = fps <= 60 ? '60' : fps <= 144 ? '144' : '240'
  const cpuW = (uc as any)[`cpuW_${fpsKey}`] as number
  const gpuW = (uc as any)[`gpuW_${fpsKey}`] as number
  const ramMod = (ram.mods as any)[uc.id] ?? 0
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
  let estFps: number | null = null
  if (uc.fpsBase !== null) {
    const gpuRatio = gpu.score / 600
    const cpuFactor = 0.5 + cpuW * (cw / gw)
    const rawFps = uc.fpsBase * gpuRatio * Math.min(cpuFactor, 1.3)
    estFps = Math.max(15, Math.min(Math.round(rawFps / 5) * 5, 500))
  }
  return { pct, bot, cpuU, gpuU, cw, gw, cpuAdj, ramMod, estFps }
}

function lvOf(p: number) {
  return p >= 60 ? 'severe' : p >= 35 ? 'moderate' : p >= 15 ? 'minor' : 'none'
}

function calcGameFps(game: typeof GAMES[number], resKey: 'r1080'|'r1440'|'r4k', gpuScore: number, cpuScore: number, ramMod: number) {
  const gpuRatio = gpuScore / 530
  const cpuRatio = Math.min((cpuScore + ramMod) / 700, 1.4)
  const blended  = game.cpuW * cpuRatio + (1 - game.cpuW) * gpuRatio
  return Math.max(5, Math.round(game.base[resKey] * blended / 5) * 5)
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTOCOMPLETE COMPONENT
───────────────────────────────────────────────────────────────────────────── */
interface AcItem { id: string; name: string; brand: string; gen: string; [key: string]: any }

function Autocomplete({ type, items, value, onSelect, placeholder }: {
  type: 'cpu'|'gpu'|'ram'
  items: AcItem[]
  value: AcItem | null
  onSelect: (item: AcItem) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) { setQuery(''); inputRef.current?.focus() }
  }, [open])

  const filtered = query.trim()
    ? items.filter(i => (i.brand + ' ' + i.name).toLowerCase().includes(query.toLowerCase()) || i.gen.toLowerCase().includes(query.toLowerCase()))
    : items

  // Group by brand+gen
  const groups: Record<string, AcItem[]> = {}
  filtered.forEach(item => {
    const g = type === 'ram' ? item.gen : `${item.brand} (${item.gen})`
    if (!groups[g]) groups[g] = []
    groups[g].push(item)
  })

  function subline(item: AcItem) {
    if (type === 'cpu') return `${item.cores} cores · ${item.tdp}W · ${item.gen}`
    if (type === 'gpu') return `${item.vram}GB VRAM · ${item.gen}`
    return (item as any).label ?? ''
  }

  const accentColor = type === 'cpu' ? '#508CFF' : type === 'gpu' ? '#00E5A0' : '#FF7840'

  return (
    <div ref={wrapRef} style={{ position: 'relative', zIndex: open ? 50 : 'auto' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#0A0E14',
          border: `0.5px solid ${open ? accentColor + '66' : 'rgba(255,255,255,.12)'}`,
          borderRadius: open ? '8px 8px 0 0' : 8,
          padding: '0 10px', height: 38, cursor: 'pointer',
          boxShadow: open ? `0 0 0 3px ${accentColor}14` : 'none',
          transition: 'all .18s',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={open ? accentColor : 'rgba(255,255,255,.3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={`Search ${type.toUpperCase()}…`}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#EEF1F6', fontSize: 13, fontFamily: 'inherit' }}
          />
        ) : (
          <span style={{ flex: 1, fontSize: 13, color: value ? '#EEF1F6' : 'rgba(255,255,255,.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value ? `${value.brand} ${value.name}` : placeholder}
          </span>
        )}
        {value && !open && (
          <span
            onClick={e => { e.stopPropagation(); onSelect(null as any) }}
            style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', cursor: 'pointer', padding: '2px 3px' }}
          >✕</span>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: '#0E1219',
          border: `0.5px solid ${accentColor}66`, borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          maxHeight: 260, overflowY: 'auto',
          boxShadow: '0 16px 48px rgba(0,0,0,.6)',
          zIndex: 100,
        }}>
          {Object.keys(groups).length === 0 ? (
            <div style={{ padding: '18px 12px', textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,.35)', fontFamily: 'var(--mono, monospace)' }}>
              No results for &quot;{query}&quot;
            </div>
          ) : Object.entries(groups).map(([gName, gItems]) => (
            <div key={gName}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.16em', padding: '8px 14px 5px', background: '#0E1219', borderBottom: '0.5px solid rgba(255,255,255,.06)', fontFamily: 'var(--mono, monospace)' }}>
                {gName}
              </div>
              {gItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => { onSelect(item); setOpen(false) }}
                  style={{
                    display: 'block', padding: '9px 14px', cursor: 'pointer',
                    borderLeft: `2px solid transparent`,
                    transition: 'background .12s',
                    background: value?.id === item.id ? `${accentColor}0d` : 'transparent',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${accentColor}0d`; (e.currentTarget as HTMLElement).style.borderLeftColor = `${accentColor}66` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = value?.id === item.id ? `${accentColor}0d` : 'transparent'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent' }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: value?.id === item.id ? accentColor : '#EEF1F6', marginBottom: 2 }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)' }}>{subline(item)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED GAUGE
───────────────────────────────────────────────────────────────────────────── */
function GaugeSvg({ pct, color }: { pct: number; color: string }) {
  const CX=150, CY=178, R=124
  const AL = Math.PI * R
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    let start: number | null = null
    const target = pct
    function step(ts: number) {
      if (!start) start = ts
      const t = Math.min((ts - start) / 1800, 1)
      const e = 1 - Math.pow(1 - t, 3)
      setDisplayPct(Math.round(target * e))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [pct])

  function pxy(p: number) {
    const t = Math.PI * (1 - p / 100)
    return { x: CX + R * Math.cos(t), y: CY - R * Math.sin(t) }
  }

  const np = pxy(displayPct)
  const dashOffset = AL * (1 - displayPct / 100)

  return (
    <svg viewBox="0 0 300 210" style={{ width: '100%', maxWidth: 300, display: 'block', margin: '0 auto' }}>
      <path d="M 26 178 A 124 124 0 0 1 150 54 A 124 124 0 0 1 274 178" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="20" strokeLinecap="round"/>
      <path d="M 26 178 A 124 124 0 0 1 88 68"  fill="none" stroke="rgba(0,229,160,.13)"  strokeWidth="14" strokeLinecap="round"/>
      <path d="M 88 68 A 124 124 0 0 1 212 68"  fill="none" stroke="rgba(255,208,96,.13)" strokeWidth="14" strokeLinecap="round"/>
      <path d="M 212 68 A 124 124 0 0 1 274 178" fill="none" stroke="rgba(255,80,80,.13)"  strokeWidth="14" strokeLinecap="round"/>
      <text x="34"  y="163" style={{ fill: 'rgba(0,229,160,.45)',  fontSize: 8, fontFamily: 'monospace' }}>OK</text>
      <text x="133" y="61"  style={{ fill: 'rgba(255,208,96,.45)', fontSize: 8, fontFamily: 'monospace' }}>WARN</text>
      <text x="239" y="163" style={{ fill: 'rgba(255,80,80,.45)',  fontSize: 8, fontFamily: 'monospace' }}>HOT</text>
      <path
        fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={AL} strokeDashoffset={dashOffset}
        d="M 26 178 A 124 124 0 0 1 150 54 A 124 124 0 0 1 274 178"
      />
      <line x1="150" y1="178" x2={np.x.toFixed(1)} y2={np.y.toFixed(1)} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".75"/>
      <circle cx="150" cy="178" r="11" fill="#111418" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
      <circle cx="150" cy="178" r="5" fill={color} opacity=".7"/>
      <text x="150" y="136" textAnchor="middle" style={{ fontSize: 36, fontWeight: 700, fill: '#F0F2F5', fontFamily: 'monospace' }}>{displayPct}%</text>
      <text x="16"  y="198" style={{ fill: 'rgba(255,255,255,.2)', fontSize: 9, fontFamily: 'monospace' }}>0%</text>
      <text x="255" y="198" style={{ fill: 'rgba(255,255,255,.2)', fontSize: 9, fontFamily: 'monospace' }}>100%</text>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   RADAR CHART (canvas)
───────────────────────────────────────────────────────────────────────────── */
function RadarChart({ cpu, gpu, ram, fps }: { cpu: Cpu; gpu: Gpu; ram: Ram; fps: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let chartInstance: any = null

    async function draw() {
      const ChartModule = await import('chart.js/auto')
      const Chart = ChartModule.default
      const data = UCS.map(uc => calcBN(cpu, gpu, ram, uc as any, fps).pct)
      const pointColors = data.map(v => v >= 60 ? '#FF5050' : v >= 35 ? '#FF7840' : v >= 15 ? '#FFD060' : '#00E5A0')
      const ctx = canvas!.getContext('2d')!
      if (chartInstance) { chartInstance.destroy() }
      chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: UCS.map(u => u.label),
          datasets: [{ label: 'Bottleneck %', data, borderColor: '#00E5A0', backgroundColor: 'rgba(0,229,160,.1)', pointBackgroundColor: pointColors, pointBorderColor: '#0A0C10', pointBorderWidth: 2, pointRadius: 6, borderWidth: 2.5 }]
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1A1E28', borderColor: 'rgba(255,255,255,.12)', borderWidth: 1, titleColor: '#F0F2F5', bodyColor: '#9AA3B2', padding: 12, cornerRadius: 8 } },
          scales: { r: { min: 0, max: 90, beginAtZero: true, ticks: { stepSize: 30, color: '#F0F2F5', font: { size: 10 }, backdropColor: 'rgba(8,10,14,.75)', callback: (v: any) => v === 0 ? '' : v + '%' }, grid: { color: (ctx: any) => { const v = ctx.tick?.value; if (v===30) return 'rgba(255,208,96,.22)'; if (v===60) return 'rgba(255,80,80,.22)'; return 'rgba(255,255,255,.08)'; } }, angleLines: { color: 'rgba(255,255,255,.1)' }, pointLabels: { color: '#F0F2F5', font: { size: 12, weight: '600' } } } }
        }
      })
    }
    draw()
    return () => { if (chartInstance) chartInstance.destroy() }
  }, [cpu, gpu, ram, fps])

  return <canvas ref={canvasRef} style={{ maxWidth: 560, width: '100%', margin: '0 auto', display: 'block' }} />
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function BottleneckCalculatorPage() {
  const [cpu, setCpu] = useState<Cpu | null>(null)
  const [gpu, setGpu] = useState<Gpu | null>(null)
  const [ram, setRam] = useState<Ram | null>(null)
  const [uc,  setUc]  = useState<UcId | null>(null)
  const [fps, setFps] = useState(144)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReturnType<typeof calcBN> | null>(null)
  const [showAllGames, setShowAllGames] = useState(false)
  const [copied, setCopied] = useState('')
  const resultsRef = useRef<HTMLDivElement>(null)

  const canCalc = !!(cpu && gpu && ram && uc)
  const ucObj = UCS.find(u => u.id === uc)

  function handleCalc() {
    if (!canCalc) return
    setLoading(true)
    setTimeout(() => {
      setResult(calcBN(cpu!, gpu!, ram!, ucObj as any, fps))
      setLoading(false)
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    }, 1400)
  }

  function handleReset() {
    setCpu(null); setGpu(null); setRam(null); setUc(null); setFps(144)
    setResult(null); setShowAllGames(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Re-run when fps or uc changes if we already have a result
  useEffect(() => {
    if (result && cpu && gpu && ram && uc) {
      setResult(calcBN(cpu, gpu, ram, ucObj as any, fps))
    }
  }, [fps, uc])

  const lv      = result ? lvOf(result.pct) : 'none'
  const lvColor = { none: '#00E5A0', minor: '#FFD060', moderate: '#FF7840', severe: '#FF5050' }[lv]

  const lvLabels = { none: 'Well balanced', minor: 'Minor bottleneck', moderate: 'Moderate bottleneck', severe: 'Severe bottleneck' }

  const ramMod = ram ? ((ram.mods as any)[uc ?? 'gaming_1440p'] ?? 0) : 0

  // Suggestions
  const suggestions = useCallback(() => {
    if (!ucObj) return []
    const defRam = DB.rams.find(r => r.id === 'ddr4-16-3200')!
    const pairs: {cpu: Cpu; gpu: Gpu; pct: number}[] = []
    const seen = new Set<string>()
    DB.cpus.forEach(c => DB.gpus.forEach(g => {
      const r = calcBN(c, g, defRam, ucObj as any, fps)
      if (r.pct <= 10) { const k = c.id + '|' + g.id; if (!seen.has(k)) { seen.add(k); pairs.push({ cpu: c, gpu: g, pct: r.pct }) } }
    }))
    return pairs.sort((a, b) => a.pct !== b.pct ? a.pct - b.pct : (b.cpu.score + b.gpu.score) - (a.cpu.score + a.gpu.score)).slice(0, 6)
  }, [uc, fps])

  function copyLink() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => { setCopied('link'); setTimeout(() => setCopied(''), 2000) })
  }

  const secLabelStyle: React.CSSProperties = {
    fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)',
    textTransform: 'uppercase', letterSpacing: '0.16em',
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16
  }

  function SecNum({ n }: { n: number }) {
    return (
      <span style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(255,255,255,.06)', border: '0.5px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'rgba(255,255,255,.3)', flexShrink: 0 }}>
        {n}
      </span>
    )
  }

  function panel(children: React.ReactNode, style?: React.CSSProperties) {
    return (
      <div style={{ background: 'var(--bg2, #13161E)', border: '0.5px solid var(--border, rgba(255,255,255,.08))', borderRadius: 14, padding: '1.5rem', marginBottom: 10, ...style }}>
        {children}
      </div>
    )
  }

  function smallCard(children: React.ReactNode, style?: React.CSSProperties) {
    return (
      <div style={{ background: 'rgba(255,255,255,.04)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '0.9rem 1rem', ...style }}>
        {children}
      </div>
    )
  }

  // Tier bar for autocomplete cards
  function TierBar({ score, max, color }: { score: number; max: number; color: string }) {
    const pct = Math.round(score / max * 100)
    return (
      <div style={{ marginTop: 6 }}>
        <div style={{ height: 2, background: 'rgba(255,255,255,.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width .65s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)' }}>
          <span>Benchmark tier</span>
          <span style={{ color: 'rgba(255,255,255,.5)' }}>{score} / {max}</span>
        </div>
      </div>
    )
  }

  // FPS color
  function fpsColor(f: number) {
    return f >= 144 ? '#00E5A0' : f >= 60 ? '#FFD060' : f >= 30 ? '#FF7840' : '#FF5050'
  }

  return (
    <ToolLayout wide>
      <ToolBreadcrumb
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'PC Bottleneck Calculator' },
        ]}
      />

      <ToolHeader
        icon={Monitor}
        iconColor="orange"
        title="PC Bottleneck Calculator"
        description="Select your CPU, GPU, and RAM. Get an instant bottleneck score, performance gauge, FPS estimates across 16 games, and balanced upgrade suggestions — free, no sign-up."
        badge={{ text: '100+ CPUs & GPUs · PassMark-based · May 2025', type: 'info' }}
      />

      {/* ── SELECTOR PANEL ── */}
      {panel(<>
        {/* Step 1: Components */}
        <div style={secLabelStyle}><SecNum n={1} /> Your components</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 24 }}>

          {/* CPU card */}
          <div style={{ background: 'rgba(80,140,255,.06)', border: `0.5px solid ${cpu ? 'rgba(80,140,255,.35)' : 'rgba(255,255,255,.08)'}`, borderRadius: 12, padding: '0.9rem 1rem', transition: 'border-color .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, fontSize: 11, fontWeight: 600, color: '#8A94A6', fontFamily: 'var(--mono, monospace)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#508CFF', flexShrink: 0 }} />
              Processor (CPU)
            </div>
            <Autocomplete type="cpu" items={DB.cpus} value={cpu} onSelect={v => setCpu(v)} placeholder="Select a CPU" />
            {cpu && <TierBar score={cpu.score} max={MAX_CPU} color="#508CFF" />}
          </div>

          {/* GPU card */}
          <div style={{ background: 'rgba(0,229,160,.05)', border: `0.5px solid ${gpu ? 'rgba(0,229,160,.35)' : 'rgba(255,255,255,.08)'}`, borderRadius: 12, padding: '0.9rem 1rem', transition: 'border-color .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, fontSize: 11, fontWeight: 600, color: '#8A94A6', fontFamily: 'var(--mono, monospace)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E5A0', flexShrink: 0 }} />
              Graphics Card (GPU)
            </div>
            <Autocomplete type="gpu" items={DB.gpus} value={gpu} onSelect={v => setGpu(v)} placeholder="Select a GPU" />
            {gpu && <TierBar score={gpu.score} max={MAX_GPU} color="#00E5A0" />}
            {gpu && ucObj && gpu.vram < ucObj.vramMin && ucObj.vramWarnMsg && (
              <div style={{ marginTop: 6, padding: '6px 10px', background: 'rgba(255,208,96,.08)', border: '0.5px solid rgba(255,208,96,.25)', borderRadius: 7, fontSize: 11, color: '#FFD060', fontFamily: 'var(--mono, monospace)', lineHeight: 1.5 }}>
                ⚠ {gpu.vram}GB VRAM — {ucObj.vramWarnMsg}
              </div>
            )}
          </div>

          {/* RAM card */}
          <div style={{ background: 'rgba(255,120,64,.05)', border: `0.5px solid ${ram ? 'rgba(255,120,64,.35)' : 'rgba(255,255,255,.08)'}`, borderRadius: 12, padding: '0.9rem 1rem', transition: 'border-color .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, fontSize: 11, fontWeight: 600, color: '#8A94A6', fontFamily: 'var(--mono, monospace)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF7840', flexShrink: 0 }} />
              Memory (RAM)
            </div>
            <Autocomplete type="ram" items={DB.rams} value={ram} onSelect={v => setRam(v)} placeholder="Select RAM" />
            {ram && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,.35)', fontFamily: 'var(--mono, monospace)' }}>
                {ram.gen} · {ram.cap}GB · {ram.label}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: FPS target */}
        <div style={secLabelStyle}><SecNum n={2} /> Target framerate</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: '#8A94A6', marginRight: 4 }}>I want to run at:</span>
          {[60, 144, 240].map(f => (
            <button key={f} onClick={() => setFps(f)} style={{
              padding: '7px 16px', borderRadius: 100, border: `1px solid ${fps === f ? 'rgba(0,229,160,.5)' : 'rgba(255,255,255,.1)'}`,
              background: fps === f ? 'rgba(0,229,160,.1)' : 'rgba(255,255,255,.04)',
              color: fps === f ? '#00E5A0' : '#8A94A6',
              fontSize: 12.5, cursor: 'pointer', transition: 'all .18s',
              fontWeight: fps === f ? 600 : 400,
              fontFamily: 'var(--mono, monospace)',
            }}>
              {f} fps
            </button>
          ))}
        </div>

        {/* Step 3: Use case */}
        <div style={secLabelStyle}><SecNum n={3} /> Use case</div>
        <div style={{ fontSize: 13, color: '#8A94A6', marginBottom: 10 }}>What will you primarily use this PC for?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {UCS.map(u => (
            <button key={u.id} onClick={() => setUc(u.id as UcId)} style={{
              padding: '8px 14px', borderRadius: 100,
              border: `1px solid ${uc === u.id ? 'rgba(0,229,160,.55)' : 'rgba(255,255,255,.1)'}`,
              background: uc === u.id ? 'rgba(0,229,160,.1)' : 'rgba(255,255,255,.04)',
              color: uc === u.id ? '#00E5A0' : '#8A94A6',
              fontSize: 12.5, cursor: 'pointer', transition: 'all .2s',
              fontWeight: uc === u.id ? 600 : 400,
            }}>
              {u.label}
            </button>
          ))}
        </div>
        {ucObj && (
          <div style={{ marginBottom: 20, padding: '10px 14px', background: 'rgba(0,229,160,.06)', border: '0.5px solid rgba(0,229,160,.18)', borderRadius: 8, fontSize: 13, color: 'rgba(0,229,160,.9)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>{ucObj.hint}</span>
          </div>
        )}

        {/* Action row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleReset} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '0 18px',
            background: 'rgba(255,255,255,.04)', border: '0.5px solid rgba(255,255,255,.12)',
            borderRadius: 9, color: '#8A94A6', fontSize: 13, cursor: 'pointer', transition: 'all .18s', whiteSpace: 'nowrap', flexShrink: 0
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>
            Reset
          </button>
          <div style={{ position: 'relative', flex: 1 }}>
            {!canCalc && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 9px)', left: '50%', transform: 'translateX(-50%)', background: '#1A1E28', border: '0.5px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '7px 13px', fontSize: 11.5, color: '#8A94A6', whiteSpace: 'nowrap', pointerEvents: 'none', fontFamily: 'var(--mono, monospace)', zIndex: 10 }}>
                Select {[!cpu && 'a CPU', !gpu && 'a GPU', !ram && 'RAM', !uc && 'a use case'].filter(Boolean).join(', ')} to continue
              </div>
            )}
            <button
              onClick={handleCalc}
              disabled={!canCalc || loading}
              style={{
                width: '100%', background: canCalc ? '#00E5A0' : 'rgba(255,255,255,.1)',
                color: canCalc ? '#08100D' : 'rgba(255,255,255,.3)',
                fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 9, padding: '14px 20px',
                cursor: canCalc ? 'pointer' : 'not-allowed', transition: 'all .18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4"/></svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Analyze my build
                </>
              )}
            </button>
          </div>
        </div>
      </>)}

      {/* ── RESULTS ── */}
      {result && cpu && gpu && ram && ucObj && (
        <div ref={resultsRef}>

          {/* Data banner */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(80,140,255,.07)', border: '0.5px solid rgba(80,140,255,.18)', borderRadius: 9, marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: '#508CFF', fontFamily: 'var(--mono, monospace)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              GPU: PassMark G3D · CPU: PassMark CPU Mark · FPS: GamersNexus, TechPowerUp, Hardware Unboxed
            </span>
            <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)' }}>Dataset v9 · May 2025</span>
          </div>

          {/* 4: Verdict */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={4} /> Verdict</div>
            <div style={{
              borderRadius: 14, padding: '1.4rem',
              background: { none: 'rgba(0,229,160,.07)', minor: 'rgba(255,208,96,.06)', moderate: 'rgba(255,120,64,.07)', severe: 'rgba(255,80,80,.08)' }[lv],
              border: `1px solid ${lvColor}38`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: `${lvColor}26`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={lvColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {lv === 'none' ? <><polyline points="20 6 9 17 4 12"/></> : lv === 'minor' ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></> : lv === 'moderate' ? <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></> : <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>}
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4, color: `${lvColor}cc` }}>
                    {lvLabels[lv]}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: lvColor, lineHeight: 1.25 }}>
                    {result.bot} bottleneck — {result.pct}% imbalance at {fps}fps
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { val: `${result.pct}%`, lbl: 'Bottleneck', color: lvColor },
                  { val: result.bot, lbl: 'Limiting part', color: result.bot === 'CPU' ? '#508CFF' : '#00E5A0' },
                  { val: result.estFps ? `~${result.estFps} fps` : 'N/A', lbl: 'FPS estimate', color: '#F0F2F5' },
                ].map(s => (
                  <div key={s.lbl} style={{ background: 'rgba(255,255,255,.04)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--mono, monospace)', color: s.color, lineHeight: 1.1, marginBottom: 3 }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13.5, color: '#8A94A6', lineHeight: 1.75 }}>
                Your <strong style={{ color: '#EEF1F6' }}>{cpu.brand} {cpu.name}</strong> and <strong style={{ color: '#EEF1F6' }}>{gpu.brand} {gpu.name}</strong> — {result.pct < 15 ? 'running in good sync. Neither component is waiting for the other.' : result.bot === 'CPU' ? `CPU is the bottleneck. GPU sits at ${result.gpuU}% while CPU runs flat out.` : `GPU is the bottleneck. CPU is idle ${100 - result.cpuU}% of the time.`}
              </div>
            </div>
          </>)}

          {/* 5: Gauge + share */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={5} /> Performance gauge</div>

            {/* Share bar */}
            <div style={{ marginBottom: 16, background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 11, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 10 }}>Share your result</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                <button onClick={copyLink} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid rgba(0,229,160,.3)', background: 'rgba(0,229,160,.1)', color: '#00E5A0', transition: 'all .18s' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  {copied === 'link' ? 'Copied! ✓' : 'Copy link'}
                </button>
                <button onClick={() => { const title = encodeURIComponent('Checked my PC build on ZARYNX — bottleneck results'); const url = encodeURIComponent(window.location.href); window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank') }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid rgba(255,105,0,.28)', background: 'rgba(255,105,0,.1)', color: '#FF6900', transition: 'all .18s' }}>Reddit</button>
                <button onClick={() => { const txt = encodeURIComponent(`Checked my PC build on ZARYNX — ${result.pct}% bottleneck (${result.bot}-limited)`); const url = encodeURIComponent(window.location.href); window.open(`https://twitter.com/intent/tweet?text=${txt}&url=${url}`, '_blank') }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '0.5px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: '#8A94A6', transition: 'all .18s' }}>X / Twitter</button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.1rem', marginBottom: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 6 }}>Bottleneck percentage</div>
              <GaugeSvg pct={result.pct} color={lvColor} />
              <div style={{ fontSize: 14, fontWeight: 700, color: lvColor, marginTop: 4 }}>{result.bot === 'CPU' ? 'CPU is the limiting component' : result.pct < 5 ? 'Your build is well balanced!' : 'GPU is the limiting component'}</div>
            </div>

            {/* Util bars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                { label: 'CPU utilization', val: result.cpuU, color: '#508CFF' },
                { label: 'GPU utilization', val: result.gpuU, color: '#00E5A0' },
              ].map(u => (
                <div key={u.label} style={{ background: 'rgba(255,255,255,.04)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono, monospace)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: u.color, flexShrink: 0 }} />
                    {u.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#EEF1F6', margin: '4px 0 8px', fontFamily: 'var(--mono, monospace)' }}>{u.val}%</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${u.val}%`, background: u.color, borderRadius: 2, transition: 'width .75s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* FPS estimate */}
            {ucObj.fpsBase !== null && (() => {
              const resolutions = ucObj.id === 'gaming_1080p' ? [{label:'1080p Low',mult:1.4},{label:'1080p Medium',mult:1.0},{label:'1080p Ultra',mult:0.75}] : ucObj.id === 'gaming_1440p' ? [{label:'1440p Medium',mult:1.0},{label:'1440p High',mult:0.8},{label:'1440p Ultra',mult:0.65}] : [{label:'4K Medium',mult:1.0},{label:'4K High',mult:0.75},{label:'4K Ultra',mult:0.55}]
              const fpsKey = fps <= 60 ? '60' : fps <= 144 ? '144' : '240'
              const cpuFactor = Math.min(1.0 + (ucObj as any)[`cpuW_${fpsKey}`] * (result.cw / Math.max(result.gw, 0.01) - 1) * 0.5, 1.15)
              const gpuRatio = gpu.score / 600
              return (
                <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '0.9rem 1rem' }}>
                  <div style={{ fontSize: 12, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Estimated FPS range</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 8 }}>Based on GPU tier, resolution, and CPU headroom. Actual FPS varies by title and settings.</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {resolutions.map(r => {
                      const f = Math.max(10, Math.round((ucObj.fpsBase! * gpuRatio * r.mult * cpuFactor) / 5) * 5)
                      const c = fpsColor(f)
                      return (
                        <div key={r.label} style={{ textAlign: 'center', padding: '8px 6px', borderRadius: 8, background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)' }}>
                          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--mono, monospace)', color: c, lineHeight: 1.1 }}>{f}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginTop: 3 }}>{r.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </>)}

          {/* 6: Score comparison */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={6} /> Component score comparison</div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#EEF1F6', marginBottom: 4 }}>CPU vs GPU — Effective score for this use case</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 16 }}>Weighted from benchmark data. Gap = bottleneck.</div>
              {(() => {
                const fpsKey = fps <= 60 ? '60' : fps <= 144 ? '144' : '240'
                const cpuW = (ucObj as any)[`cpuW_${fpsKey}`]
                const gpuW = (ucObj as any)[`gpuW_${fpsKey}`]
                const cpuEff = Math.round(result.cw * 1000) / 10
                const gpuEff = Math.round(result.gw * 1000) / 10
                const maxE = Math.max(cpuEff, gpuEff, 1)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { label: `${cpu.brand} ${cpu.name}`, eff: cpuEff, raw: cpu.score, color: '#508CFF', lightColor: '#7AABFF', sub: `${cpu.cores} cores · ${cpu.tdp}W TDP · CPU weight: ${Math.round(cpuW * 100)}%` },
                      { label: `${gpu.brand} ${gpu.name}`, eff: gpuEff, raw: gpu.score, color: '#00E5A0', lightColor: '#00C880', sub: `${gpu.vram}GB VRAM · ${gpu.gen} · GPU weight: ${Math.round(gpuW * 100)}%` },
                      { label: ram.name, eff: null, raw: null, color: '#FF7840', lightColor: '#FFAA70', sub: `${ram.label} — RAM mod: ${result.ramMod > 0 ? '+' : ''}${result.ramMod} pts` },
                    ].map((row, i) => (
                      <div key={row.label}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#EEF1F6' }}>{row.label}</span>
                          {row.eff !== null && <span style={{ fontSize: 12, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.5)', flexShrink: 0 }}>Effective: {row.eff.toFixed(1)} · PassMark: {row.raw}</span>}
                        </div>
                        <div style={{ height: 8, background: 'rgba(255,255,255,.06)', borderRadius: 20, overflow: 'hidden', marginBottom: 4 }}>
                          <div style={{ height: '100%', width: row.eff !== null ? `${Math.round(row.eff / maxE * 100)}%` : `${Math.round((i + 1) / DB.rams.length * 100)}%`, background: `linear-gradient(90deg, ${row.color}, ${row.lightColor})`, borderRadius: 20, transition: 'width .85s ease' }} />
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)' }}>{row.sub}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
              <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', padding: '8px 12px', background: 'rgba(80,140,255,.06)', border: '0.5px solid rgba(80,140,255,.15)', borderRadius: 7, lineHeight: 1.6 }}>
                CPU scores derived from PassMark CPU Mark. GPU scores are PassMark-normalized tiers. FPS figures are model-estimated — not measured game data. RAM modifiers reflect memory latency sensitivity per workload.
              </div>
            </div>
          </>)}

          {/* 7: Radar chart */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={7} /> Cross-scenario analysis</div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#EEF1F6', marginBottom: 4 }}>Bottleneck across all use cases</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 16 }}>How balanced is your build for every scenario? Lower = better.</div>
              <div style={{ position: 'relative', height: 320, maxWidth: 520, margin: '0 auto' }}>
                <RadarChart cpu={cpu} gpu={gpu} ram={ram} fps={fps} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 14, fontFamily: 'var(--mono, monospace)', fontSize: 11 }}>
                {[['#00E5A0','Balanced (0–15%)'],['#FFD060','Minor (15–35%)'],['#FF7840','Moderate (35–60%)'],['#FF5050','Severe (60%+)']].map(([c, l]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.5)' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: c, flexShrink: 0 }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </>)}

          {/* 8: Scenario table */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={8} /> Full use case breakdown</div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '0.5px solid rgba(255,255,255,.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 440 }}>
                  <thead>
                    <tr>
                      {['Scenario', 'Bottleneck', 'Limiting part', 'CPU util', 'GPU util', 'Est. FPS'].map(h => (
                        <th key={h} style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 10px', textAlign: h === 'Scenario' ? 'left' : 'center', borderBottom: '0.5px solid rgba(255,255,255,.08)', fontWeight: 500, whiteSpace: 'nowrap', paddingTop: 10 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {UCS.map(u => {
                      const defRam = DB.rams.find(r => r.id === 'ddr4-16-3200')!
                      const r = calcBN(cpu, gpu, defRam, u as any, fps)
                      const lv2 = lvOf(r.pct)
                      const col = { none: '#00E5A0', minor: '#FFD060', moderate: '#FF7840', severe: '#FF5050' }[lv2]
                      const isActive = u.id === uc
                      return (
                        <tr key={u.id} style={{ background: isActive ? 'rgba(0,229,160,.04)' : 'transparent' }}>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', fontSize: 13, color: '#EEF1F6', fontWeight: 600 }}>
                            {u.label}
                            {isActive && <span style={{ fontSize: 10, color: '#00E5A0', fontFamily: 'var(--mono, monospace)', marginLeft: 6 }}>← current</span>}
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                              <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,.06)', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                                <div style={{ height: '100%', width: `${r.pct}%`, background: col, borderRadius: 10 }} />
                              </div>
                              <span style={{ fontSize: 11.5, color: col, fontFamily: 'var(--mono, monospace)', minWidth: 30 }}>{r.pct}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center' }}>
                            {lv2 === 'none' ? <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono, monospace)', fontWeight: 500, background: 'rgba(0,229,160,.08)', color: '#00E5A0' }}>Balanced</span> : r.bot === 'CPU' ? <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono, monospace)', fontWeight: 500, background: 'rgba(80,140,255,.15)', color: '#508CFF', border: '0.5px solid rgba(80,140,255,.3)' }}>CPU</span> : <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontFamily: 'var(--mono, monospace)', fontWeight: 500, background: 'rgba(0,229,160,.12)', color: '#00E5A0', border: '0.5px solid rgba(0,229,160,.3)' }}>GPU</span>}
                          </td>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center', fontFamily: 'var(--mono, monospace)', fontSize: 13, color: '#508CFF' }}>{r.cpuU}%</td>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center', fontFamily: 'var(--mono, monospace)', fontSize: 13, color: '#00E5A0' }}>{r.gpuU}%</td>
                          <td style={{ padding: '10px 8px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center', fontFamily: 'var(--mono, monospace)', fontSize: 13, color: r.estFps ? (r.estFps >= 144 ? '#00E5A0' : r.estFps >= 60 ? '#FFD060' : '#FF5050') : 'rgba(255,255,255,.3)' }}>
                            {r.estFps ? `${r.estFps}+` : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>)}

          {/* 9: Resolution matrix */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={9} /> Bottleneck by resolution</div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,.4)', fontFamily: 'var(--mono, monospace)', marginBottom: 16, lineHeight: 1.65 }}>
              Bottleneck percentage at each resolution for gaming. Lower = more balanced.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: 10, marginBottom: 20 }}>
              {[{key:'r1080' as const, label:'1080p', sub:'1920×1080', ucId:'gaming_1080p'},{key:'r1440' as const, label:'1440p', sub:'2560×1440', ucId:'gaming_1440p'},{key:'r4k' as const, label:'4K', sub:'3840×2160', ucId:'gaming_4k'}].map(res => {
                const u2 = UCS.find(u => u.id === res.ucId)!
                const r2 = calcBN(cpu, gpu, ram, u2 as any, fps)
                const lv2 = lvOf(r2.pct)
                const col2 = { none: '#00E5A0', minor: '#FFD060', moderate: '#FF7840', severe: '#FF5050' }[lv2]
                return (
                  <div key={res.key} style={{ background: 'rgba(255,255,255,.03)', border: `0.5px solid ${col2}33`, borderRadius: 12, padding: '14px 14px 12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: col2, borderRadius: '12px 12px 0 0' }} />
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{res.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#EEF1F6', marginBottom: 2, fontFamily: 'var(--mono, monospace)' }}>{res.sub}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: col2, lineHeight: 1, marginBottom: 4, fontFamily: 'var(--mono, monospace)' }}>{r2.pct}%</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 6 }}>{{ none: 'No bottleneck', minor: 'Minor', moderate: 'Moderate', severe: 'Severe' }[lv2]}</div>
                    <div style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 20, display: 'inline-block', fontFamily: 'var(--mono, monospace)', background: `${col2}1a`, color: col2 }}>
                      {r2.bot === 'CPU' ? 'CPU-limited' : r2.bot === 'GPU' ? 'GPU-limited' : 'Balanced'}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* FPS playability table */}
            <div style={{ fontSize: 12, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Games playable at FPS target</span>
              <div style={{ flex: 1, height: 0.5, background: 'rgba(255,255,255,.08)' }} />
            </div>
            <div style={{ overflowX: 'auto', borderRadius: 10, border: '0.5px solid rgba(255,255,255,.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr>
                    <th style={{ background: 'rgba(255,255,255,.04)', fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 14px', textAlign: 'left', fontWeight: 500, borderBottom: '0.5px solid rgba(255,255,255,.08)', whiteSpace: 'nowrap' }}>Resolution</th>
                    {[30,60,90,120,144].map(t => <th key={t} style={{ background: 'rgba(255,255,255,.04)', fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 12px', textAlign: 'center', fontWeight: 500, borderBottom: '0.5px solid rgba(255,255,255,.08)', whiteSpace: 'nowrap' }}>{t}+ FPS</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[{key:'r1080' as const,label:'1080p',sub:'1920×1080'},{key:'r1440' as const,label:'1440p',sub:'2560×1440'},{key:'r4k' as const,label:'4K',sub:'3840×2160'}].map(res => (
                    <tr key={res.key}>
                      <td style={{ padding: '11px 14px', borderBottom: '0.5px solid rgba(255,255,255,.04)', fontSize: 12.5, fontWeight: 600, color: '#EEF1F6' }}>{res.label} <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, fontFamily: 'var(--mono, monospace)' }}>{res.sub}</span></td>
                      {[30,60,90,120,144].map(t => {
                        let playable = 0
                        GAMES.forEach(g => { if (calcGameFps(g, res.key, gpu.score, cpu.score, ramMod) >= t) playable++ })
                        const pct = Math.round(playable / GAMES.length * 100)
                        const cls = pct >= 90 ? { bg: 'rgba(0,229,160,.12)', color: '#00E5A0', border: 'rgba(0,229,160,.25)' } : pct >= 70 ? { bg: 'rgba(80,200,120,.1)', color: '#4DC87A', border: 'rgba(80,200,120,.2)' } : pct >= 45 ? { bg: 'rgba(255,208,96,.1)', color: '#FFD060', border: 'rgba(255,208,96,.22)' } : pct >= 20 ? { bg: 'rgba(255,120,64,.1)', color: '#FF7840', border: 'rgba(255,120,64,.22)' } : { bg: 'rgba(255,80,80,.1)', color: '#FF5050', border: 'rgba(255,80,80,.22)' }
                        return (
                          <td key={t} style={{ padding: '11px 12px', borderBottom: '0.5px solid rgba(255,255,255,.04)', textAlign: 'center' }}>
                            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono, monospace)', minWidth: 52, textAlign: 'center', background: cls.bg, color: cls.color, border: `0.5px solid ${cls.border}` }}>{pct}%</span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>)}

          {/* 10: Game FPS cards */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={10} /> FPS in popular games</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.4)', marginBottom: 14, fontFamily: 'var(--mono, monospace)' }}>
              Estimated average FPS at medium-high settings. Based on GPU tier, CPU headroom, and per-game CPU/GPU weighting.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(showAllGames ? GAMES : GAMES.slice(0, 4)).map(g => {
                const fps1080 = calcGameFps(g, 'r1080', gpu.score, cpu.score, ramMod)
                const fps1440 = calcGameFps(g, 'r1440', gpu.score, cpu.score, ramMod)
                const fps4k   = calcGameFps(g, 'r4k',   gpu.score, cpu.score, ramMod)
                const maxFps = Math.max(fps1080, fps1440, fps4k, fps)
                return (
                  <div key={g.id} style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'stretch', transition: 'border-color .2s' }}>
                    <div style={{ width: 3, background: g.color, flexShrink: 0 }} />
                    <div style={{ width: 64, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, background: 'rgba(255,255,255,.02)', borderRight: '0.5px solid rgba(255,255,255,.06)' }}>
                      <div style={{ width: 46, height: 46, borderRadius: 7, background: `${g.color}22`, border: `0.5px solid ${g.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        {g.genre.includes('FPS') ? '🎯' : g.genre.includes('Battle') ? '🏆' : g.genre.includes('RPG') ? '⚔️' : g.genre.includes('MOBA') ? '🏆' : g.genre.includes('Open') ? '🌍' : '🎮'}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: '9px 12px', minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#EEF1F6', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 7, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: g.color }} />
                        {g.genre}
                      </div>
                      {[{res:'1080p',f:fps1080},{res:'1440p',f:fps1440},{res:'4K',f:fps4k}].map(({res, f}) => (
                        <div key={res} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontFamily: 'var(--mono, monospace)', color: 'rgba(255,255,255,.3)', width: 40, flexShrink: 0 }}>{res}</span>
                          <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.07)', borderRadius: 10, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(Math.round(f / maxFps * 100), 100)}%`, background: fpsColor(f), borderRadius: 10, transition: 'width 1s ease' }} />
                          </div>
                          <span style={{ fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--mono, monospace)', color: fpsColor(f), width: 60, textAlign: 'right', flexShrink: 0 }}>{f} FPS</span>
                          <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, flexShrink: 0, background: f >= fps ? 'rgba(0,229,160,.12)' : 'rgba(255,80,80,.1)', color: f >= fps ? '#00E5A0' : '#FF5050' }}>
                            {f >= fps ? '✓' : '✗'} {fps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {GAMES.length > 4 && (
              <button onClick={() => setShowAllGames(v => !v)} style={{ width: '100%', marginTop: 10, background: 'rgba(255,255,255,.04)', border: '0.5px solid rgba(255,255,255,.12)', borderRadius: 9, color: '#8A94A6', fontSize: 13, fontWeight: 500, padding: '11px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .18s' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                {showAllGames ? `Show fewer games` : `View all ${GAMES.length} games`}
              </button>
            )}
          </>)}

          {/* 11: Suggestions */}
          {panel(<>
            <div style={secLabelStyle}><SecNum n={11} /> Balanced build suggestions</div>
            <div style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '1.1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#EEF1F6' }}>Best-matched pairs</div>
                <span style={{ fontSize: 10, padding: '2px 9px', borderRadius: 20, background: 'rgba(0,229,160,.1)', color: '#00E5A0', border: '0.5px solid rgba(0,229,160,.3)', fontFamily: 'var(--mono, monospace)' }}>≤10% gap</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', fontFamily: 'var(--mono, monospace)', marginBottom: 6 }}>Best pairs for {ucObj.label} @ {fps}fps · sorted by performance</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                Tap any row to load it into the calculator
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {suggestions().map(s => {
                  const isCur = cpu.id === s.cpu.id && gpu.id === s.gpu.id
                  return (
                    <div
                      key={s.cpu.id + s.gpu.id}
                      onClick={() => { if (!isCur) { setCpu(s.cpu); setGpu(s.gpu); setResult(calcBN(s.cpu, s.gpu, ram, ucObj as any, fps)) } }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, background: isCur ? 'rgba(0,229,160,.06)' : 'rgba(255,255,255,.03)', border: `0.5px solid ${isCur ? 'rgba(0,229,160,.35)' : 'transparent'}`, cursor: isCur ? 'default' : 'pointer', transition: 'all .18s' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.65 }}>
                        <span style={{ fontWeight: 700, color: '#EEF1F6', fontSize: 13 }}>{s.cpu.brand} {s.cpu.name}</span>
                        <span style={{ color: 'rgba(255,255,255,.3)', margin: '0 5px' }}>+</span>
                        <span style={{ fontWeight: 700, color: '#EEF1F6', fontSize: 13 }}>{s.gpu.brand} {s.gpu.name}</span>
                        {isCur && <span style={{ display: 'block', fontSize: 10, color: '#00E5A0' }}>Currently loaded</span>}
                      </span>
                      <span style={{ fontSize: 10.5, padding: '2px 9px', borderRadius: 20, background: 'rgba(0,229,160,.1)', color: '#00E5A0', flexShrink: 0, fontFamily: 'var(--mono, monospace)' }}>{s.pct}% gap</span>
                      {!isCur && <span style={{ fontSize: 11, color: '#00E5A0', flexShrink: 0, fontFamily: 'var(--mono, monospace)', display: 'flex', alignItems: 'center', gap: 4 }}>→ Load</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </>)}

        </div>
      )}

      {/* Explanation section */}
      <ToolExplanation
        title="What is a PC bottleneck and how does it affect gaming?"
        points={[
          { title: 'CPU bottleneck', body: 'Your processor cannot keep up with your GPU. Common in CPU-heavy games like strategy, simulation, and open world titles with many NPCs.' },
          { title: 'GPU bottleneck', body: 'Your graphics card is slower than your CPU can feed frames to. This is actually the ideal direction — it means your CPU is not wasted.' },
          { title: 'RAM impact', body: 'RAM speed and capacity affect CPU headroom, especially at 1080p and high framerates. DDR5 and XMP/EXPO profiles can reduce CPU bottlenecks for free.' },
          { title: 'Resolution matters', body: 'At 4K the GPU does almost all the work. At 1080p/240fps the CPU is under far more pressure. Resolution changes which component bottlenecks you.' },
        ]}
      />

      <ToolHowTo
        steps={[
          { title: 'Select your CPU and GPU', description: 'Choose your exact processor and graphics card from the searchable dropdowns. Search by model name or number.' },
          { title: 'Select your RAM', description: 'Choose your RAM kit. Higher speed DDR4 or DDR5 can meaningfully reduce CPU bottlenecks, especially at 1080p.' },
          { title: 'Set target framerate and use case', description: 'Select your target FPS and what you mainly use your PC for. Gaming at 240fps is far more CPU-heavy than gaming at 60fps.' },
          { title: 'Read your results', description: 'Under 15% is good — not worth worrying about. 15–35% is minor. 35–60% is moderate. Above 60% is severe and the bottlenecking component upgrade will have major impact.' },
        ]}
      />

      <ToolFaq
        items={[
          { question: 'Is a 10% bottleneck bad?', answer: 'No. Under 15% is considered well-balanced. A small bottleneck is normal in any build — no pairing is 100% perfect. Focus on bottlenecks above 35%.' },
          { question: 'Should I always avoid a CPU bottleneck?', answer: 'Not necessarily. A slight GPU bottleneck is actually ideal — it means the GPU (the most expensive part) is working at 100% while the CPU handles OS and game logic without being maxed out.' },
          { question: 'Does RAM really matter for bottlenecks?', answer: 'Yes, especially at 1080p and high framerates. Running RAM at its rated speed (XMP/EXPO in BIOS) and using faster DDR5 can reduce CPU bottlenecks meaningfully — it\'s a free upgrade if you haven\'t done it.' },
          { question: 'Are these FPS numbers accurate?', answer: 'The FPS figures are model-estimated based on PassMark benchmark tiers and published benchmark data from GamersNexus, TechPowerUp, and Hardware Unboxed. They are good approximations but actual in-game FPS varies by title, settings, and driver version.' },
          { question: 'What is PassMark and why do you use it?', answer: 'PassMark CPU Mark and G3D Mark are widely-used industry benchmarks that give consistent, comparable scores across CPU and GPU generations. They allow us to build a unified scoring model without relying on game-specific test data.' },
        ]}
      />

      <ToolRelated
        tools={[
          { name: 'Sensitivity Converter',    description: 'Convert mouse sensitivity across CS2, Valorant, Apex and more', slug: 'sensitivity-converter',    icon: Activity,  iconBg: 'rgba(0,229,160,.1)', iconColor: 'var(--mint)' },
          { name: 'Game Pass Calculator',     description: 'Is Xbox Game Pass worth it for you? Calculate real cost vs buying', slug: 'game-pass-calculator',     icon: Monitor,   iconBg: 'rgba(255,120,64,.1)', iconColor: 'var(--orange)' },
          { name: 'Reaction Speed Tester',    description: 'Measure your reaction time in milliseconds',                       slug: 'reaction-speed-test',     icon: Activity,  iconBg: 'rgba(80,140,255,.1)', iconColor: 'var(--blue)' },
        ]}
      />

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </ToolLayout>
  )
}

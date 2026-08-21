// Yaw = degrees the camera rotates per single mouse count, at sensitivity 1.0 / DPI 1.
// Cross-checked against multiple published sensitivity-converter sources (2026).
// Formula: targetSens = sourceSens × (sourceDPI / targetDPI) × (sourceYaw / targetYaw)

export interface SensGame {
  id: string
  name: string
  yaw: number
}

export const SENS_GAMES: SensGame[] = [
  { id: 'cs2',       name: 'CS2',                    yaw: 0.022      },
  { id: 'valorant',  name: 'Valorant',                yaw: 0.07       },
  { id: 'apex',      name: 'Apex Legends',            yaw: 0.022      },
  { id: 'fortnite',  name: 'Fortnite',                yaw: 0.005555   },
  { id: 'ow2',       name: 'Overwatch 2',             yaw: 0.0066     },
  { id: 'warzone',   name: 'Call of Duty: Warzone',   yaw: 0.0066     },
  { id: 'r6',        name: 'Rainbow Six Siege',       yaw: 0.00572958 },
  { id: 'pubg',      name: 'PUBG: Battlegrounds',     yaw: 0.002222   },
  { id: 'rust',      name: 'Rust',                    yaw: 0.11247    },
  { id: 'destiny2',  name: 'Destiny 2',               yaw: 0.0066     },
  { id: 'thefinals', name: 'The Finals',              yaw: 0.0066     },
  { id: 'rivals',    name: 'Marvel Rivals',           yaw: 0.022      },
  { id: 'deadlock',  name: 'Deadlock',                yaw: 0.044      },
  { id: 'halo',      name: 'Halo Infinite',           yaw: 0.022      },
]

export function findGame(id: string): SensGame {
  return SENS_GAMES.find(g => g.id === id) ?? SENS_GAMES[0]
}

export function cmPer360(sens: number, dpi: number, yaw: number): number {
  if (sens <= 0 || dpi <= 0 || yaw <= 0) return 0
  return ((360 / (sens * yaw)) / dpi) * 2.54
}

export function convertSens(
  sourceSens: number,
  sourceDpi: number,
  targetDpi: number,
  sourceYaw: number,
  targetYaw: number
): number {
  if (sourceDpi <= 0 || targetDpi <= 0 || targetYaw <= 0) return 0
  return sourceSens * (sourceDpi / targetDpi) * (sourceYaw / targetYaw)
}

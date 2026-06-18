import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate limiting con dos backends:
 *
 *  1. Upstash Redis (distribuido) si están definidas las variables
 *     UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN. Es la opción correcta
 *     para producción / serverless porque el contador es compartido entre todas
 *     las instancias.
 *
 *  2. Fallback en memoria (ventana fija, por proceso) si Upstash no está
 *     configurado. Sirve para desarrollo local; en serverless el límite es
 *     aproximado porque cada instancia tiene su propio contador.
 *
 * La interfaz pública (`rateLimit`) es la misma en ambos casos.
 */

export interface RateLimitOptions {
  /** Máximo de solicitudes permitidas dentro de la ventana. */
  limit: number
  /** Tamaño de la ventana en milisegundos. */
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

// ── Backend Upstash ───────────────────────────────────────

const upstashEnabled =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

const redis = upstashEnabled ? Redis.fromEnv() : null

// Se cachea una instancia de Ratelimit por configuración (limit + ventana)
// para no recrearla en cada request.
const limiters = new Map<string, Ratelimit>()

function getUpstashLimiter({ limit, windowMs }: RateLimitOptions): Ratelimit {
  const cacheKey = `${limit}:${windowMs}`
  let limiter = limiters.get(cacheKey)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: 'ratelimit',
    })
    limiters.set(cacheKey, limiter)
  }
  return limiter
}

// ── Backend en memoria (fallback) ─────────────────────────

type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

function sweep(now: number) {
  if (store.size < 5000) return
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key)
  }
}

function memoryRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true, remaining: limit - entry.count, retryAfterSeconds: 0 }
}

// ── API pública ───────────────────────────────────────────

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  if (redis) {
    try {
      const { success, remaining, reset } = await getUpstashLimiter(options).limit(key)
      return {
        allowed: success,
        remaining,
        retryAfterSeconds: success ? 0 : Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
      }
    } catch (e) {
      // Si Upstash falla (mal configurado / caído) NO bloqueamos el flujo:
      // degradamos al limitador en memoria en vez de lanzar una excepción que
      // tiraría abajo el login o los formularios.
      console.error('[rate-limit] Upstash no disponible, usando fallback en memoria:', e)
      return memoryRateLimit(key, options)
    }
  }
  return memoryRateLimit(key, options)
}

/** Obtiene la IP del cliente a partir de las cabeceras del proxy. */
export async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return h.get('x-real-ip') ?? 'unknown'
}

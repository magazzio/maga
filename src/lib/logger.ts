/**
 * Logger strutturato per l'applicazione
 * Centralizza il logging degli errori con contesto
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export interface LogContext {
  [key: string]: any
}

export interface LogEntry {
  level: LogLevel
  message: string
  error?: Error
  context?: LogContext
  timestamp: string
  userAgent?: string
  url?: string
}

class Logger {
  private formatEntry(level: LogLevel, message: string, error?: Error, context?: LogContext): LogEntry {
    return {
      level,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    }
  }

  private log(level: LogLevel, message: string, error?: Error, context?: LogContext) {
    const entry = this.formatEntry(level, message, error, context)
    
    // In sviluppo, log completo
    if (process.env.NODE_ENV === 'development') {
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `[${level.toUpperCase()}] ${message}`,
        entry
      )
    } else {
      // In produzione, solo errori importanti
      if (level === 'error') {
        console.error(`[ERROR] ${message}`, {
          error: entry.error,
          context: entry.context,
        })
      }
    }

    // Qui potresti inviare a un servizio di logging esterno
    // es: sendToLoggingService(entry)
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, error, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, undefined, context)
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, undefined, context)
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, undefined, context)
    }
  }
}

export const logger = new Logger()


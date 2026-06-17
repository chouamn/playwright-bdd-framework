/**
 * Lightweight logger that writes timestamped, emoji-decorated messages to stdout/stderr.
 * Each instance is independent; no shared singleton state is required.
 */
export class Logger {
    /**
     * Log an informational message.
     * @param message - Message to log
     */
    log(message: string): void {
        console.log(`[${new Date().toISOString()}] ℹ️  ${message}`);
    }

    /**
     * Log a warning message.
     * @param message - Warning message to log
     */
    warn(message: string): void {
        console.warn(`[${new Date().toISOString()}] ⚠️  ${message}`);
    }

    /**
     * Log an error message, optionally including the error stack trace.
     * @param message - Error description
     * @param error - Optional Error object whose stack trace will be included
     */
    error(message: string, error?: Error): void {
        const stack = error?.stack ? `\n${error.stack}` : '';
        console.error(`[${new Date().toISOString()}] ❌ ${message}${stack}`);
    }

    /**
     * Log a success message.
     * @param message - Success message to log
     */
    success(message: string): void {
        console.log(`[${new Date().toISOString()}] ✅ ${message}`);
    }
}

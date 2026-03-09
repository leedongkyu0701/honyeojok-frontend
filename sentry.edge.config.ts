import * as Sentry from "@sentry/nextjs";

// Next.js Edge 런타임용 Sentry 연결파일

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0.1,
});

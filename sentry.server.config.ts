import * as Sentry from "@sentry/nextjs";

// Next.js Node 서버용 설정

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 0.1,
});

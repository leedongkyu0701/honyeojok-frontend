import * as Sentry from "@sentry/nextjs";

// 브라우저용 Sentry 초기화

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true",
  integrations: [Sentry.replayIntegration()],
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 1.0,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

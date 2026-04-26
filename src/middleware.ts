import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (
    !context.url.pathname.startsWith('/keystatic') ||
    !response.headers.get('content-type')?.includes('text/html')
  ) {
    return response;
  }

  const html = await response.text();
  if (html.includes('<title>')) return new Response(html, response);

  const withTitle = html.replace(
    '<!DOCTYPE html>',
    '<!DOCTYPE html><title>CMS | BEARS</title>',
  );

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(withTitle, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});

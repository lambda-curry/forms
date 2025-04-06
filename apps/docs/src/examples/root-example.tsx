// Example of setting up the middleware in root.tsx
import { unstable_extractFormDataMiddleware } from 'remix-hook-form/middleware';
import { Outlet } from 'react-router-dom';

// Export the middleware for React Router 7
export const unstable_middleware = [unstable_extractFormDataMiddleware()];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Remix Hook Form v7 Example</title>
      </head>
      <body>
        <div className="container mx-auto">
          <Outlet />
        </div>
      </body>
    </html>
  );
}

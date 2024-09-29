// Importing the required modules
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // Make sure this is correctly pointing to your core file

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

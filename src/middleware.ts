// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({});

// export const config = {
//   matcher: ["/(admin)(.*)"],
// };


// middleware.ts

import { clerkMiddleware } from "@clerk/nextjs/server";
//This function will handle the authentication and authorization checks for the routes specified in the config.
export default clerkMiddleware();

export const config = {
  matcher: ["/(admin)(.*)"],
};

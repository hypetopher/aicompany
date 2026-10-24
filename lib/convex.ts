import { ConvexReactClient } from "convex/react";
import { createContext, useContext } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "https://personal-ai-agent-i6yk6p.convex.cloud");

export { convex };

export const ConvexContext = createContext(convex);

export function useConvex() {
  return useContext(ConvexContext);
}

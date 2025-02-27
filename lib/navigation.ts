import { router } from "expo-router";

export function navigate(path: string) {
  router.replace(path as any); 
}

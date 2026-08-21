import { useState, useEffect } from 'react';

let currentPath = "/";
const listeners = new Set<() => void>();

export function navigate(path: string) {
  currentPath = path;
  listeners.forEach(l => l());
}

export function useLocation(): [string, typeof navigate] {
  const [path, setPath] = useState(currentPath);
  
  useEffect(() => {
    const listener = () => setPath(currentPath);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  return [path, navigate];
}

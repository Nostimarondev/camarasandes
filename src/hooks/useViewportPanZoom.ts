import { useRef, useEffect, useCallback } from 'react';

interface UseViewportPanZoomOptions {
  panX: number;
  setPanX: React.Dispatch<React.SetStateAction<number>>;
  panY: number;
  setPanY: React.Dispatch<React.SetStateAction<number>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  onClearSelection: () => void;
}

export function useViewportPanZoom({
  panX, setPanX,
  panY, setPanY,
  zoom, setZoom,
  onClearSelection
}: UseViewportPanZoomOptions) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const initialPanXRef = useRef<number>(0);
  const initialPanYRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('.camera-node') || target.closest('.handle-node') || target.closest('.zone-shape')) return;

    onClearSelection();

    isPanningRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    initialPanXRef.current = panX;
    initialPanYRef.current = panY;

    if (viewportRef.current) {
      viewportRef.current.style.cursor = 'grabbing';
    }
  }, [panX, panY, onClearSelection]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;
      setPanX(initialPanXRef.current + dx);
      setPanY(initialPanYRef.current + dy);
    };

    const handleMouseUp = () => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        if (viewportRef.current) {
          viewportRef.current.style.cursor = 'grab';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setPanX, setPanY]);

  // Touch Support
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const target = touch.target as HTMLElement;
        if (target.closest('.camera-node') || target.closest('.handle-node') || target.closest('.zone-shape')) return;

        isPanningRef.current = true;
        startXRef.current = touch.clientX;
        startYRef.current = touch.clientY;
        initialPanXRef.current = panX;
        initialPanYRef.current = panY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isPanningRef.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - startXRef.current;
        const dy = touch.clientY - startYRef.current;
        setPanX(initialPanXRef.current + dx);
        setPanY(initialPanYRef.current + dy);
      }
    };

    const handleTouchEnd = () => {
      isPanningRef.current = false;
    };

    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: true });
    viewport.addEventListener('touchend', handleTouchEnd);

    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
      viewport.removeEventListener('touchend', handleTouchEnd);
    };
  }, [panX, panY, setPanX, setPanY]);

  // Cursor-focused wheel zoom
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setZoom((oldZoom) => {
        const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
        const newZoom = Math.max(0.3, Math.min(3.5, oldZoom * zoomFactor));

        if (newZoom !== oldZoom) {
          setPanX((prevPanX) => mouseX - (mouseX - prevPanX) * (newZoom / oldZoom));
          setPanY((prevPanY) => mouseY - (mouseY - prevPanY) * (newZoom / oldZoom));
        }
        return newZoom;
      });
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [setZoom, setPanX, setPanY]);

  return { viewportRef, handleMouseDown };
}

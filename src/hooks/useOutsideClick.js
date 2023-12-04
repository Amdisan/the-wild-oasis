import { useEffect, useRef } from 'react';

export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          handler();
        }
      }
      // use "true". need to catch only in capturing faze (not bubbling), because modal will close immediately
      document.addEventListener('click', handleClick, listenCapturing);
      return () => document.removeEventListener('click', handleClick);
    },
    [handler, listenCapturing]
  );

  return ref;
}

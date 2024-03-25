'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Tokenizer from '../components/tokenizer';

export default function Home() {
  // Keep track of the tokenizer result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState<boolean | null>(null);

  // Create a reference to the worker object.
  const worker: any = useRef(null);

  // // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../worker.ts', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: any) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          break;
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          setReady(true);
          setResult(e.data.output)
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const tokenize = useCallback((text: String) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);

  return <Tokenizer ready={ready} result={result ?? []} tokenize={tokenize} />
}

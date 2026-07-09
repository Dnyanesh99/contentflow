import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { init } from '@contentful/app-sdk';
import type { KnownAppSDK } from '@contentful/app-sdk';
import { ContentfulContext } from './ContentfulContext';

const LoadingMessage = styled.div`
  padding: 20px;
  color: #888;
`;

type SdkWithWindow = KnownAppSDK & {
  window?: {
    startAutoResizer: () => void;
  };
};

export const ContentfulProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sdk, setSdk] = useState<KnownAppSDK | null>(null);
  const [isInContentful, setIsInContentful] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Detect if we are running in an iframe inside Contentful
    const inIframe = window.self !== window.top;

    if (inIframe) {
      init((appSdk: KnownAppSDK) => {
        setSdk(appSdk);
        setIsInContentful(true);
        setIsReady(true);
        
        // Auto-resize the app window when running in locations like Sidebar or Entry Editor
        const sdkWithWindow = appSdk as SdkWithWindow;
        if (sdkWithWindow.window?.startAutoResizer) {
          sdkWithWindow.window.startAutoResizer();
        }
      });
    } else {
      setIsReady(true);
    }
  }, []);

  return (
    <ContentfulContext.Provider value={{ sdk, isInContentful, isReady }}>
      {isReady ? children : <LoadingMessage>Initializing Contentful App...</LoadingMessage>}
    </ContentfulContext.Provider>
  );
};

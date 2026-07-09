import { createContext, useContext } from 'react';
import type { KnownAppSDK } from '@contentful/app-sdk';

export interface ContentfulContextType {
  sdk: KnownAppSDK | null;
  isInContentful: boolean;
  isReady: boolean;
}

export const ContentfulContext = createContext<ContentfulContextType>({
  sdk: null,
  isInContentful: false,
  isReady: false,
});

export const useContentful = () => useContext(ContentfulContext);

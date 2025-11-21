import React, { createContext, useState } from 'react';

export const PageLoadingContext = createContext();

export const PageLoadingProvider = ({ children }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);

  return (
    <PageLoadingContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {children}
    </PageLoadingContext.Provider>
  );
};

export const usePageLoading = () => {
  const context = React.useContext(PageLoadingContext);
  if (!context) {
    throw new Error('usePageLoading must be used within PageLoadingProvider');
  }
  return context;
};

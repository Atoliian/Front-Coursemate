import React, { createContext, useContext, ReactNode } from 'react';

// Définissez le type pour vos routes API
type ApiRoutes = {
    getMyBrackets: string;
    getDetailBracket: string;
    getLogin: string;
    getMyInformations: string;
    getSearchItem: string;
    addItemInBracket: string;
    removeItemInBracket: string;
    // Ajoutez d'autres routes API au besoin
};

const ApiRoutesContext = createContext<ApiRoutes | undefined>(undefined);

export const useApiRoutes = () => {
    const context = useContext(ApiRoutesContext);
    if (!context) {
      throw new Error('useApiRoutes must be used within a ApiRoutesProvider');
    }
    return context;
};

type ApiRoutesProviderProps = {
    routes: ApiRoutes;
    children: ReactNode; // Propriété children de type ReactNode
  };

// Créez un composant de fournisseur pour envelopper votre application
export const ApiRoutesProvider: React.FC<ApiRoutesProviderProps> = ({ routes, children }) => {
    return (
      <ApiRoutesContext.Provider value={routes}>
        {children}
      </ApiRoutesContext.Provider>
    );
}
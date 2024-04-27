import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ApiRoutesProvider } from './components/ApiRoutesContext';

const container = document.getElementById('root');
const root = createRoot(container!);
const apiDomain = "http://localhost:3000/api";

const apiRoutes = {
  getMyBrackets: `${apiDomain}/brackets`,
  getDetailBracket: `${apiDomain}/brackets/:id`,
  getLogin: `${apiDomain}/auth/login`,
  getMyInformations: `${apiDomain}/auth/me`,
  getSearchItem: `${apiDomain}/items?itemsPerPage=10&wording=:search`,
  addItemInBracket: `${apiDomain}/brackets/addItem/:id`,
  removeItemInBracket: `${apiDomain}/brackets/removeItem/:id`
  // Ajoutez d'autres routes API au besoin ainsi que dans ApiRoutesContext
};
root.render(
  <ApiRoutesProvider routes={apiRoutes}>
    <App />
  </ApiRoutesProvider>
    
);
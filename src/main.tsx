import React, { createContext } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite';
import App from './App.tsx';
import './index.css';
import { Capacitor } from '@capacitor/core';
import { SQLiteService } from './Class.ts';
const SQLiteServeOb = new SQLiteService()
export const SQLiteServe = createContext(SQLiteServeOb);
console.log(SQLiteServe);
customElements.define('jeep-sqlite', JeepSqlite);
const platform = Capacitor.getPlatform();

const rootRender = () => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  const platform = Capacitor.getPlatform();
  console.log(platform);
  root.render(
    <React.StrictMode>
      <SQLiteServe.Provider value={SQLiteServeOb}>
      <App />
      </SQLiteServe.Provider>
      
    </React.StrictMode>
  );
}

if(platform != 'web'){
  rootRender();
}else{
  window.addEventListener('DOMContentLoaded', async()=>{
    const jeepSQLElem = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSQLElem);
    customElements.whenDefined("jeep-sqlite").then(()=>{
      rootRender();
    }).catch ((err) => {
      console.log(`Error: ${err}`);
      throw new Error(`Error: ${err}`)
    });
  });
}


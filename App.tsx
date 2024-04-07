import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Capacitor } from '@capacitor/core'
import { SQLiteServe } from './main'


function InitializeApp(SQLiteServeOb){
 let pin = false;
 let dbName: string = 'terenam';
 return async()=>{
    let platform = Capacitor.getPlatform();
    try{
      if(!pin){
        if(platform == 'web'){
          const SQLElem = document.querySelector('jeep-sqlite');
          await SQLiteServeOb.initiWebstore();

        }
        await SQLiteServeOb.initializeDatabase();
        if(platform == 'web'){
          await SQLiteServeOb.saveToStore(dbName);

        }
        pin = true;
      } 
    }catch(error: any) {
        const msg = error.message ? error.message : error;
        throw new Error(`InitializeApp: ${msg}`);
    }
    }
    
 }

function App() {
  const [count, setCount] = useState("")
  const SQLiteServeC = useContext(SQLiteServe);
  const ready = InitializeApp(SQLiteServeC);
  useEffect(()=>{
    ready();
  },[])
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {
          SQLiteServeC.addTodo({todoDesc:"Test Description", todoTitle:"test title"});
          SQLiteServeC.getTodo();
        }}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

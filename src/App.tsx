import { ReactElement, useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Capacitor } from '@capacitor/core'
import { SQLiteServe } from './main'
import {ITodo} from './Class.ts'

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

function App():ReactElement {
  const [TodoList, setTodoList] = useState<ITodo[]>([]);
  const SQLiteServeC = useContext(SQLiteServe);
  const ready = InitializeApp(SQLiteServeC);
  useEffect(()=>{
    ready();
  },[])
  async function handleSubmit(e){
    e.preventDefault();
    const Todo: ITodo ={
      todoDesc:e.target[1].value,
      todoTitle:e.target[0].value
    };
    let lastId = await SQLiteServeC.addTodo(Todo);
    Todo.id = lastId;
    setTodoList(prev => [...prev,Todo]);
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="todoTitle">
          Todo Title: <input type="text" id="todoTitle" />
        </label>
        <label htmlFor="todoDesc">
          Todo Description: <input type="text" id="todoDesc" />
        </label>
        <button>Submit</button>
      </form>
      <div className="TodoDisp">
        <h3>Todo Display</h3>
        {TodoList.length>0?TodoList.map(elem=>{
          return(<div className='todoElem' key={elem.id}>
            <h4 className="title">{elem.todoTitle}</h4>
            <span>{elem.todoDesc}</span>
          </div>)
        }):""}
      </div>
    </>
  )
}

export default App

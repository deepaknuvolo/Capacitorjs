import { CapacitorSQLite, SQLiteConnection,capSQLiteUpgradeOptions } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
export const UserUpgradeStatements = [
    {
    toVersion: 1,
    statements: [
        `CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        desc TEXT NOT NULL
        );`
    ]
    },
    /* add new statements below for next database version when required*/
    /*
    {
    toVersion: 2,
    statements: [
        `ALTER TABLE users ADD COLUMN email TEXT;`,
    ]
    },
    */
]

export interface Todo {
    id:number,
    todoTitle:string,
    todoDesc:string
}
export class SQLiteService {
    versionUpgrades = UserUpgradeStatements;
    loadToVersion = 1;
    db:any;
    database: string = 'terenam';
    sqlitePlugin = CapacitorSQLite;
    sqliteOb = new SQLiteConnection(CapacitorSQLite);
    dbNameVersion = new Map();
    setDbNameVersion(dbName, version){
     this.dbNameVersion.set(dbName,version);
    }
    getDbNameVersion(dbName){
      this.dbNameVersion.get(dbName);
    }
    async initiWebstore(){
      try{
        await this.sqliteOb.initWebStore();
      }catch (error){
        const msg = error.message? error.message : error;
        throw new Error("SQLiteService initIwebstore :"+msg); 
      }
    }
    async addUpgradeStatement(options:capSQLiteUpgradeOptions){
      try{
        await this.sqlitePlugin.addUpgradeStatement(options);
      }catch(error){
        const msg = error.message? error.message : error;
        throw new Error("SQLiteService addUpgradeStatement :"+msg);
      }
    }
    async openDatabase(dbName:string, version:number, readOnly:boolean){
      try{    
      let db;
      let encrypted = false;
      const mode = encrypted ? "secret" : "no-encryption";
      this.setDbNameVersion(dbName,version);
      const retCC = (await this.sqliteOb.checkConnectionsConsistency()).result;
      const retC = (await this.sqliteOb.isConnection(dbName,readOnly)).result;
      if(retCC && retC){
        db = await this.sqliteOb.retrieveConnection(dbName,readOnly);
      }else{
        db = await this.sqliteOb.createConnection(dbName,false,mode,version,readOnly);
      }
      await db.open();
      const res = await db.isDBOpen();
      console.log(res);
      return db;
    } catch(error){
      const msg = error.message ? error.message : error;
      throw new Error('SQLiteService opendatabase : '+msg);
    }
  
      
    }
    async saveToStore(dbName:string){
      try{
        await this.sqliteOb.saveToStore(dbName);
        return;
      }catch(error){
        throw new Error(error);
      }
    }
    async initializeDatabase(): Promise<void> {
        // create upgrade statements
        try {
            await this.addUpgradeStatement({database: this.database,
                                                  upgrade: this.versionUpgrades});
            this.db = await this.openDatabase(this.database, this.loadToVersion, false);
            const isData = await this.db.query("select * from sqlite_sequence");
            if(isData.values!.length === 0) {
            // create database initial users if any
    
            }
    
            this.setDbNameVersion(this.database,this.loadToVersion);
            if( Capacitor.getPlatform() === 'web') {
              await this.saveToStore(this.database);
            }
            // this.isInitCompleted.next(true);
        } catch(error: any) {
            const msg = error.message ? error.message : error;
            throw new Error(`storageService.initializeDatabase: ${msg}`);
        }
      }
      // Adding, Updating and Deleting Todos
      async addTodo(todoDetails:Todo){
        const sql = ' INSERT INTO todos (todo, desc) VALUES (?,?)';
        const res = await this.db.run(sql,[todoDetails.todoTitle,todoDetails.todoDesc]);
        console.log(res);
        if(res.changes !== undefined && res.changes.lastId  !== undefined && res.changes.lastId >0){
            return res.changes.lastId;
        }else{
            throw new Error('SQLiteService.addUser Error')
        }        
      }
      async getTodo():Promise<Todo[]>{
        const array = await this.db.query('SELECT * FROM todos')
        console.log(array.values);
      }
}

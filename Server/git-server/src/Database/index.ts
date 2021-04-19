import { Database as sqlDatabase } from 'sqlite3';
import { IRepository } from '../Schema/Repository';

export interface IRepositoryQuery extends IRepository {
  updatedAt: Date,
  createdAt: Date,
}

export class RepositoryDB {
  private static repoDbInstance: RepositoryDB | null = null;
  private db: sqlDatabase;
  
  /**
   * Initializes/Opens Database
   * @param dbName Datbase Name
   */
  constructor(dbName: string) {
    this.db = new sqlDatabase(dbName);

    // Destroy previous instance if re-created
    if (RepositoryDB.repoDbInstance)
      RepositoryDB.repoDbInstance.close();
    
    // Save Instance
    RepositoryDB.repoDbInstance = this;

    // Create initial table
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS REPOSITORY (
          title       TEXT          PRIMARY KEY,
          description VARCHAR(128),
          createdAt   DATETIME      NOT NULL,
          updatedAt   DATETIME      NOT NULL
        )
      `);
    })
  }

  /**
   * @returns Current DB Instance
   */
  public static getDbInstance(): RepositoryDB {
    return RepositoryDB.repoDbInstance;
  }

  /**
   * Creates a new Database Instance
   * @param dbName Name of the Database to Create
   */
  public static createDbInstance(dbName: string): RepositoryDB {
    if (RepositoryDB.repoDbInstance)
      return RepositoryDB.repoDbInstance;
    return new RepositoryDB(dbName);
  }
  
  /**
   * Closes Database
   */
  public close() {
    this.db.close();
    RepositoryDB.repoDbInstance = null;
  }

  /**
   * Attempts to fetch all rows in the Repository Table
   * @throws Internal Fetch Error
   * @returns Promise of Array of Repositories
   */
  public async getAll(): Promise<IRepositoryQuery[]> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.all('SELECT * FROM REPOSITORY', (err, rows) => {
          if (err)
            reject(err);
          else
            resolve(rows.map((elt: IRepositoryQuery) => ({ 
              ...elt,
              updatedAt: elt.updatedAt,
              createdAt: elt.createdAt,
            })));
        });
      });
    });
  }

  /**
   * Inserts a New Repository entry into the Table
   * @param newRepo New Repository to insert
   * @returns Promise of Executing the Query
   */
  public async insert(newRepo: IRepository): Promise<IRepositoryQuery> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          INSERT INTO REPOSITORY (title, description, createdAt, updatedAt)
          VALUES ($title, $description, DATETIME("now", "localtime"), DATETIME("now", "localtime"))
        `, {
          $title: newRepo.title,
          $description: newRepo.description,
        }, err => {
          if (err)
            reject(err);
          else
            resolve({
              ...newRepo,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
        });
      });
    });
  }

  /**
   * Fetches Repository Entry in database
   * @param repoName Repository Name (Primary Key)
   * @returns Repository Query Result
   */
  public async get(repoName: string): Promise<IRepositoryQuery> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT * FROM REPOSITORY
        WHERE title = $title
      `, {
        $title: repoName,
      }, (err, res) => {
        if (err)
          reject(err)
        else
          resolve({
            ...res,
            updatedAt: new Date(res.updatedAt),
            createdAt: new Date(res.createdAt),
          });
      });
    });
  }

  /**
   * Removes Repository Entry from database
   * @param repoName Repository Name (Primary Key)
   * @returns State of Removal
   */
  public async remove(repoName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        DELETE FROM REPOSITORY
        WHERE title = $title
      `, {
        $title: repoName,
      }, (err, _) => {
        if (err)
          reject(err)
        else
          resolve(true);
      });
    });
  }

  /**
   * Updated Repository Entry in database
   * @param repo Repository Object to update using
   * @returns State of Update
   */
  public async update(repo: IRepository): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get(`
        UPDATE table
        SET title       = $title,
            description = $description
            updatedAt   = DATETIME("now", "localtime")
        WHERE title = $title
      `, {
        $title: repo.title,
        $description: repo.description || '',
      }, (err, _) => {
        if (err)
          reject(err)
        else
          resolve(true);
      })
    });
  }
}
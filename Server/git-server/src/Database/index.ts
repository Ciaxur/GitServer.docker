import mongoose from 'mongoose';
import { IRepository } from '../Schema/Repository';
import { RepositorySchema } from './RepoSchema';

export interface IRepositoryQuery extends IRepository {
  updatedAt: Date,
  createdAt: Date,
}

export class RepositoryDB {
  // Connection
  private static dbInstance: RepositoryDB | null = null;
  private db: mongoose.Connection;

  // Models
  public repoModel: mongoose.Model<mongoose.Document<IRepositoryQuery, {}>, {}>;
  
  /**
   * Initializes/Opens Database
   * @param url MongoDB Datbase URL
   */
  constructor(url: string) {
    

    // Destroy previous instance if re-created
    if (RepositoryDB.dbInstance)
      RepositoryDB.dbInstance.close();
    
    // Connect to Database
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    })
      .then(mongo => {
        console.log(`MongoDB Connection to ${url} Success!`);
        this.db = mongo.connection;
      })
      .catch(err => {
        console.log(`MongoDB Conection to ${url} Failed!`, err);
      });
      
    // Save Instance
    RepositoryDB.dbInstance = this;

    // Create & Save Models
    this.repoModel = mongoose.model('Repository', RepositorySchema);
    console.log('repo model', this.repoModel);
  }

  /**
   * @returns Current DB Instance
   */
  public static getDbInstance(): RepositoryDB {
    return RepositoryDB.dbInstance;
  }

  /**
   * Creates a new Database Connection Instance
   * @param url MongoDB URL
   */
  public static createDbInstance(url: string): RepositoryDB {
    if (this.dbInstance)
      return this.dbInstance;
    this.dbInstance = new RepositoryDB(url);
  }
  
  /**
   * Closes Database
   */
  public close() {
    this.db.close();
    RepositoryDB.dbInstance = null;
  }

  /**
   * Attempts to fetch all rows in the Repository Table
   * @throws Internal Fetch Error
   * @returns Promise of Array of Repositories
   */
  public async getAll() {                       // TODO: Fix & Clean up Return Type
    return this.repoModel.find({});
  }

  /**
   * Inserts a New Repository entry into the Table
   * @param newRepo New Repository to insert
   * @returns Promise of Executing the Query
   */
  public async insert(newRepo: IRepository) {   // TODO: Fix & Clean up Return Type
      return this.repoModel.create({
        _title: newRepo.title,
        title: newRepo.title,
        description: newRepo.description || '',
      });
  }

  /**
   * Fetches Repository Entry in database
   * @param repoName Repository Name (Primary Key)
   * @returns Repository Query Result
   */
  public async get(repoName: string) {          // TODO: Fix & Clean up Return Type
    return this.repoModel.find({ _title: repoName.toLowerCase() });
  }

  /**
   * Removes Repository Entry from database
   * @param repoName Repository Name (Primary Key)
   * @returns State of Removal
   */
  public async remove(repoName: string) {       // TODO: Fix & Clean up Return Type
    return this.repoModel.deleteOne({ _title: repoName.toLowerCase() });
  }

  /**
   * Updated Repository Entry in database
   * @param repoName Repository Name to Change
   * @param repo Repository Object to update to
   * @returns State of Update
   */
  public async update(repoName:string, repo: IRepository) {      // TODO: Fix & Clean up Return Type
    return this.repoModel.findOneAndUpdate({ 
      _title: repoName.toLowerCase() 
    }, {
      _title: repo.title,
      title: repo.title,
      updatedAt: Date.now(),
    });
  }
}
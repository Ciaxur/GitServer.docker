/*
  Watches Repository for Changes and updates the respected
    repository's metadata
*/
import { FSWatcher, watch } from "fs";
import { IRepositoryQuery } from "../../Database";
import { IRepository } from "../../Schema/Repository";
import Constants from '../../Config/Constants';
import { RepositoryDB } from '../../Database';
import { join } from "path";

interface IListeners {
  [path: string]: FSWatcher,
}

abstract class RepoWatcher {
  private static listeners: IListeners = {};

  /**
   * Initializes Repo Watcher from Database entires
   */
  public static async Init() {
    RepositoryDB
      .getDbInstance()
      .getAll()
      .then(repos => repos
        .forEach(repo => this.Add(repo)))
      .catch(err => console.log('RepoWatcher: Error', err));
  }
  
  /**
   * Adds FS Watcher to given repository Instance
   *  updating its metadata in the DB
   * @param repo Repository instance to watch
   */
  public static Add(repo: IRepository) {
    // Close off prev. listener if repo listener already exists
    if (this.listeners[repo.title])
      this.listeners[repo.title].close();

    // Logs
    console.log('RepoWatcher: Add', repo.title);
      
    // Create new Watcher
    const listener = watch(join(Constants.repo_dir, `${repo.title}.git`), {
      encoding: 'buffer',
      persistent: true,
      // recursive: true,
    });
    this.listeners[repo.title] = listener;

    // Update UpdatedAt Metadata on file change
    listener.on('change', () => {
      RepositoryDB
        .getDbInstance()
        .repoModel
        .findOneAndUpdate({
          _title: repo.title.toLowerCase(),
        }, {
          updatedAt: new Date(),
        } as Partial<IRepositoryQuery>)
        .then(res => {
          if (process.env.DEBUG_ENABLE)
            console.log(`RepoWatcher: On Change Updated ${res}`);
        })
        .catch(err => {
          if (process.env.DEBUG_ENABLE)
            console.log(`RepoWatcher: On Change Update Error ${err.message}`);
        })
    });
  }

  /**
   * Stops and removes Listener of Repo
   * @param repo Repository instance to stop watching
   */
  public static Remove(repo: IRepository) {
    if (this.listeners[repo.title]) {
      // Logs
      console.log('RepoWatcher: Remove', repo.title);
      
      this.listeners[repo.title].close();
      delete this.listeners[repo.title];
    }
  }

  /**
   * Stops all listeners, cleaning up
   */
  public static Stop() {
    // Logs
    console.log('RepoWatcher: Stopping');
    for (const path of Object.keys(this.listeners)) {
      console.log('RepoWatcher: Stopped', path);
      this.listeners[path].close();
    }
    this.listeners = {};
  }
}
Object.freeze(RepoWatcher);

export {
  RepoWatcher,
}
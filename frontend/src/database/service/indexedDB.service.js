/**
 * IDBStore — a tiny, dependency-free Promise wrapper around the native
 * IndexedDB API, built for real projects.
 *
 * Design goals:
 *   - Promise-based, so it's async/await-friendly everywhere
 *   - One instance = one database connection, reused across calls
 *   - Versioned schema upgrades via an explicit migration map
 *   - Covers the CRUD + index-query operations most apps actually need
 *   - Still exposes raw transactions (`tx()`) for advanced/atomic cases
 */

export class IDBStore {
  constructor(dbName, version, migrations = {}) {
    this.dbName = dbName;
    this.version = version;
    this.migrations = migrations; // { 1: (db, tx) => {...}, 2: (db, tx) => {...} }
    this.db = null;
    this._openPromise = null;
  }

  open() {
    if (this._openPromise) return this._openPromise;

    this._openPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const tx = event.target.transaction;
        const newVersion = event.newVersion ?? this.version;

        // Run every migration step between where the user's DB currently
        // is and where we want it to be - never just "create today's schema".
        for (let v = event.oldVersion + 1; v <= newVersion; v++) {
          const migrate = this.migrations[v];
          if (migrate) migrate(db, tx);
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;

        // Another tab is trying to open a newer version of this DB.
        // Close gracefully so it isn't blocked forever.
        this.db.onversionchange = () => {
          this.db.close();
          this.db = null;
          this._openPromise = null;
        };

        resolve(this.db);
      };

      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn(`IndexedDB open blocked for "${this.dbName}" — close other tabs using this app.`);
      };
    });

    return this._openPromise;
  }

  async _store(storeName, mode) {
    const db = await this.open();
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  _wrap(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add(storeName, value, key) {
    const store = await this._store(storeName, 'readwrite');
    return this._wrap(store.add(value, key));
  }

  async put(storeName, value, key) {
    const store = await this._store(storeName, 'readwrite');
    return this._wrap(store.put(value, key));
  }

  async get(storeName, key) {
    const store = await this._store(storeName, 'readonly');
    return this._wrap(store.get(key));
  }

  async getAll(storeName, query = null, count) {
    const store = await this._store(storeName, 'readonly');
    return this._wrap(store.getAll(query, count));
  }

  async getAllByIndex(storeName, indexName, query = null, count) {
    const store = await this._store(storeName, 'readonly');
    return this._wrap(store.index(indexName).getAll(query, count));
  }

  async getFromIndex(storeName, indexName, key) {
    const store = await this._store(storeName, 'readonly');
    return this._wrap(store.index(indexName).get(key));
  }

  async delete(storeName, key) {
    const store = await this._store(storeName, 'readwrite');
    return this._wrap(store.delete(key));
  }

  async clear(storeName) {
    const store = await this._store(storeName, 'readwrite');
    return this._wrap(store.clear());
  }

  async count(storeName, query = null) {
    const store = await this._store(storeName, 'readonly');
    return this._wrap(store.count(query));
  }

  /**
   * Escape hatch: run several operations in ONE transaction so they commit
   * or fail together — mirrors a Mongo multi-document transaction.
   *
   *   await store.tx(['notes', 'tags'], 'readwrite', (tx) => {
   *     tx.objectStore('notes').put(note);
   *     tx.objectStore('tags').put(tag);
   *   });
   */

  async tx(storeNames, mode, callback) {
    const db = await this.open();
    const transaction = db.transaction(storeNames, mode);
    const result = callback(transaction);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error('Transaction aborted'));
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this._openPromise = null;
    }
  }

  static deleteDatabase(name) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(name);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => console.warn(`Delete of "${name}" blocked — close other tabs.`);
    });
  }
}
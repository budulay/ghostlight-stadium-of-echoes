import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { StoredMemory } from '../types/memory';

interface GhostlightDB extends DBSchema {
  memories: {
    key: string;
    value: StoredMemory;
    indexes: { 'by-created': number; 'by-year': number };
  };
}

const DB_NAME = 'ghostlight_museum_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GhostlightDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GhostlightDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('memories')) {
          const store = db.createObjectStore('memories', { keyPath: 'id' });
          store.createIndex('by-created', 'createdAt');
          store.createIndex('by-year', 'year');
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllStoredMemories(): Promise<StoredMemory[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('memories', 'by-created');
  // Return sorted descending (newest first)
  return all.reverse();
}

export async function getStoredMemory(id: string): Promise<StoredMemory | undefined> {
  const db = await getDB();
  return db.get('memories', id);
}

export async function saveMemoryToDB(memory: StoredMemory): Promise<void> {
  const db = await getDB();
  await db.put('memories', memory);
}

export async function deleteMemoryFromDB(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('memories', id);
}

export async function seedSampleMemoriesIfEmpty(samples: StoredMemory[]): Promise<StoredMemory[]> {
  const db = await getDB();
  const tx = db.transaction('memories', 'readwrite');
  for (const item of samples) {
    const existing = await tx.store.get(item.id);
    if (!existing) {
      await tx.store.put(item);
    }
  }
  await tx.done;
  return getAllStoredMemories();
}

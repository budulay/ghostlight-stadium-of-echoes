import { StoredMemory } from '../types/memory';
import { saveMemoryToDB, getAllStoredMemories } from './db';

export interface CapsulePackage {
  format: 'GHOSTLIGHT_SANCTUARY_CAPSULE';
  version: '1.0';
  exportedAt: string;
  totalMemories: number;
  memories: StoredMemory[];
}

/**
 * Exports all user memories into a portable .ghostlight.json capsule file
 */
export function exportTimeCapsule(memories: StoredMemory[]) {
  const pkg: CapsulePackage = {
    format: 'GHOSTLIGHT_SANCTUARY_CAPSULE',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    totalMemories: memories.length,
    memories,
  };

  const blob = new Blob([JSON.stringify(pkg, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `stadium-echoes-${dateStr}.ghostlight.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports a .ghostlight.json capsule file and merges memories into IndexedDB
 */
export async function importTimeCapsule(file: File): Promise<{
  success: boolean;
  importedCount: number;
  totalMemories: StoredMemory[];
  error?: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as CapsulePackage;

        if (parsed.format !== 'GHOSTLIGHT_SANCTUARY_CAPSULE' || !Array.isArray(parsed.memories)) {
          resolve({
            success: false,
            importedCount: 0,
            totalMemories: [],
            error: 'Invalid capsule format. Expected a .ghostlight.json package.',
          });
          return;
        }

        let importedCount = 0;
        for (const m of parsed.memories) {
          if (m.id && m.title && m.story && m.seatLocation) {
            await saveMemoryToDB(m);
            importedCount++;
          }
        }

        const all = await getAllStoredMemories();
        resolve({
          success: true,
          importedCount,
          totalMemories: all,
        });
      } catch (err: any) {
        resolve({
          success: false,
          importedCount: 0,
          totalMemories: [],
          error: `Failed to read capsule: ${err.message || 'JSON parse error'}`,
        });
      }
    };
    reader.onerror = () => {
      resolve({
        success: false,
        importedCount: 0,
        totalMemories: [],
        error: 'Failed to read file from disk.',
      });
    };
    reader.readAsText(file);
  });
}

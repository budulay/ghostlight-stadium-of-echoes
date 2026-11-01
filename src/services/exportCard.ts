import { StoredMemory } from '../types/memory';

/**
 * Downloads the memory exhibit metadata as structured JSON
 */
export function exportMemoryAsJSON(memory: StoredMemory) {
  const exportPayload = {
    museum: "GHOSTLIGHT: STADIUM OF ECHOES",
    version: "1.0",
    exhibit_id: memory.id,
    archived_at: new Date(memory.createdAt).toISOString(),
    exhibit: {
      title: memory.title,
      year: memory.year,
      theme: memory.theme,
      emotion: memory.emotion,
      story: memory.story,
      epitaph: memory.epitaph,
      tags: memory.tags,
      known_facts: memory.known_facts,
      unknowns: memory.unknowns,
      seat_location: memory.seatLocation,
      original_submission: memory.originalInput,
    },
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ghostlight-${memory.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a museum-grade 1200x1500px archival card as PNG
 * Supports 'midnight' (Midnight Sanctuary) and 'darkroom' (Archival Darkroom & Newsprint) themes
 */
export async function downloadMemoryCardImage(
  memory: StoredMemory,
  theme: 'midnight' | 'darkroom' = 'midnight'
): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1500;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isDarkroom = theme === 'darkroom';

  // 1. Background gradient (Midnight Navy vs Darkroom Carbon Noir)
  const bgGrad = ctx.createRadialGradient(width / 2, 200, 50, width / 2, height / 2, 900);
  if (isDarkroom) {
    bgGrad.addColorStop(0, '#261910');
    bgGrad.addColorStop(0.5, '#160F0A');
    bgGrad.addColorStop(1, '#0C0805');
  } else {
    bgGrad.addColorStop(0, '#0E172E');
    bgGrad.addColorStop(0.5, '#070C18');
    bgGrad.addColorStop(1, '#030509');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle film grain for Darkroom mode
  if (isDarkroom) {
    ctx.fillStyle = 'rgba(245, 158, 11, 0.035)';
    for (let i = 0; i < 4000; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }
  }

  // 2. Subtle stadium floodlight rays from top corners
  ctx.save();
  const leftBeam = ctx.createRadialGradient(100, 0, 10, 300, 600, 700);
  leftBeam.addColorStop(
    0,
    isDarkroom ? 'rgba(251, 191, 36, 0.22)' : 'rgba(245, 215, 127, 0.18)'
  );
  leftBeam.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = leftBeam;
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(0, 800);
  ctx.lineTo(600, 900);
  ctx.closePath();
  ctx.fill();

  const rightBeam = ctx.createRadialGradient(width - 100, 0, 10, width - 300, 600, 700);
  rightBeam.addColorStop(
    0,
    isDarkroom ? 'rgba(251, 191, 36, 0.22)' : 'rgba(245, 215, 127, 0.18)'
  );
  rightBeam.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = rightBeam;
  ctx.beginPath();
  ctx.moveTo(width - 100, 0);
  ctx.lineTo(width, 800);
  ctx.lineTo(width - 600, 900);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 3. Ornate Double Gold / Antique Brass Border
  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.55)' : 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(50, 50, width - 100, height - 100);

  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.25)' : 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(62, 62, width - 124, height - 124);

  // Corner ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = isDarkroom ? '#F59E0B' : '#D4AF37';
    ctx.fillRect(x - 4, y - 4, 8, 8);
  };
  drawCorner(50, 50);
  drawCorner(width - 50, 50);
  drawCorner(50, height - 50);
  drawCorner(width - 50, height - 50);

  // 4. Header: Museum title & tagline
  ctx.textAlign = 'center';
  ctx.fillStyle = isDarkroom ? '#F59E0B' : '#D4AF37';
  ctx.font = isDarkroom ? 'bold 22px "Playfair Display", Georgia, serif' : '600 22px Cinzel, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('GHOSTLIGHT : STADIUM OF ECHOES', width / 2, 120);

  ctx.fillStyle = isDarkroom ? '#A8A29E' : '#94A3B8';
  ctx.font = isDarkroom
    ? 'italic 16px "Newsreader", "Cormorant Garamond", Georgia, serif'
    : 'italic 16px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('“Where memories never die”', width / 2, 148);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.beginPath();
  ctx.moveTo(width / 2 - 140, 170);
  ctx.lineTo(width / 2 + 140, 170);
  ctx.stroke();

  // 5. Memory Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 44px Cinzel, serif';
  ctx.fillText(memory.title, width / 2, 235);

  // 6. Year & Seat Badges
  ctx.fillStyle = '#D4AF37';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  const yearText = memory.year ? `CIRCA ${memory.year}` : 'TIMEFRAME UNRECORDED';
  const seatText = `${memory.seatLocation.stand.toUpperCase()} • SEC ${memory.seatLocation.sectorNumber} • SEAT ${memory.seatLocation.seatNumber}`;
  ctx.fillText(`${yearText}  |  ${seatText}`, width / 2, 275);

  // 7. Emotional Theme Pill
  ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
  const themeBoxWidth = 500;
  ctx.fillRect(width / 2 - themeBoxWidth / 2, 305, themeBoxWidth, 34);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
  ctx.strokeRect(width / 2 - themeBoxWidth / 2, 305, themeBoxWidth, 34);

  ctx.fillStyle = '#F5D77F';
  ctx.font = 'italic 17px "Cormorant Garamond", serif';
  ctx.fillText(`${memory.theme} — ${memory.emotion}`, width / 2, 328);

  // 8. Artifact Image (if present)
  let contentStartY = 380;
  if (memory.artifactImage) {
    try {
      const img = new Image();
      img.src = memory.artifactImage;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      if (img.width > 0) {
        const imgW = 460;
        const imgH = 260;
        const imgX = width / 2 - imgW / 2;
        const imgY = 370;

        // Image frame with spotlight glow
        ctx.save();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(imgX - 4, imgY - 4, imgW + 8, imgH + 8);
        ctx.drawImage(img, imgX, imgY, imgW, imgH);
        ctx.restore();

        contentStartY = 670;
      }
    } catch (e) {
      // Continue without image
    }
  }

  // 9. Narrative Story Text (Wrapped nicely)
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '300 24px "Cormorant Garamond", Georgia, serif';
  ctx.textAlign = 'center';
  const maxStoryWidth = 900;
  const storyLines = wrapText(ctx, `“${memory.story}”`, maxStoryWidth);
  let currentY = contentStartY + 30;

  for (const line of storyLines) {
    ctx.fillText(line, width / 2, currentY);
    currentY += 34;
  }

  // 10. Epitaph Box
  currentY += 35;
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'bold 26px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`— ${memory.epitaph} —`, width / 2, currentY);

  // 11. Known Facts & Unknowns two-column summary at bottom
  const factsBoxY = height - 340;
  const colWidth = 460;

  // Known facts column (Left)
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(16, 27, 53, 0.7)';
  ctx.fillRect(90, factsBoxY, colWidth, 180);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.strokeRect(90, factsBoxY, colWidth, 180);

  ctx.fillStyle = '#F5D77F';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GROUNDED RECOLLECTIONS', 115, factsBoxY + 32);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  let factY = factsBoxY + 62;
  for (const f of memory.known_facts.slice(0, 4)) {
    ctx.fillText(`• ${f.length > 50 ? f.slice(0, 48) + '...' : f}`, 115, factY);
    factY += 26;
  }

  // Unknown details column (Right)
  ctx.fillStyle = 'rgba(16, 27, 53, 0.7)';
  ctx.fillRect(width - 90 - colWidth, factsBoxY, colWidth, 180);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.strokeRect(width - 90 - colWidth, factsBoxY, colWidth, 180);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LOST TO THE WINDS', width - 90 - colWidth + 25, factsBoxY + 32);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px "Plus Jakarta Sans", sans-serif';
  let unkY = factsBoxY + 62;
  for (const u of memory.unknowns.slice(0, 4)) {
    ctx.fillText(`? ${u.length > 50 ? u.slice(0, 48) + '...' : u}`, width - 90 - colWidth + 25, unkY);
    unkY += 26;
  }

  // 12. Bottom Archival Watermark
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64748B';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`OFFICIAL EXHIBIT RECORD #${memory.id.slice(-8).toUpperCase()}  •  PRESERVED LOCALLY ON STADIUM GROUNDS`, width / 2, height - 90);

  // Trigger download
  const imageURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = imageURL;
  a.download = `ghostlight-exhibit-${memory.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

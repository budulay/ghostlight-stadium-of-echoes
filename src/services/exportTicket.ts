import { StoredMemory } from '../types/memory';

/**
 * Renders an authentic vintage matchday ticket stub and triggers download as PNG
 * Supports 'midnight' (Midnight Sanctuary) and 'darkroom' (Archival Darkroom & Newsprint) themes
 */
export async function downloadMatchdayTicketImage(
  memory: StoredMemory,
  theme: 'midnight' | 'darkroom' = 'midnight'
): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 520;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isDarkroom = theme === 'darkroom';
  const stubDividerX = 870;

  // 1. Weathered Vintage Paper Background
  const paperGrad = ctx.createLinearGradient(0, 0, width, height);
  if (isDarkroom) {
    paperGrad.addColorStop(0, '#261D16');
    paperGrad.addColorStop(0.5, '#1C150F');
    paperGrad.addColorStop(1, '#110D09');
  } else {
    paperGrad.addColorStop(0, '#121B32');
    paperGrad.addColorStop(0.5, '#0E162B');
    paperGrad.addColorStop(1, '#090F1E');
  }
  ctx.fillStyle = paperGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle paper texture noise / grain overlay
  ctx.fillStyle = isDarkroom ? 'rgba(245, 158, 11, 0.05)' : 'rgba(212, 175, 55, 0.04)';
  for (let i = 0; i < 2800; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // 2. Outer Ticket Border
  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.55)' : 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.25)' : 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // 3. Perforation Line (at x = stubDividerX)
  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.55)' : 'rgba(212, 175, 55, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stubDividerX, 20);
  ctx.lineTo(stubDividerX, height - 20);
  ctx.stroke();

  // Top & Bottom Perforation Notches (Hole punches)
  ctx.setLineDash([]);
  ctx.fillStyle = isDarkroom ? '#0C0A09' : '#04060B'; // Cuts into canvas background
  ctx.beginPath();
  ctx.arc(stubDividerX, 20, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(stubDividerX, height - 20, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // ==========================================
  // LEFT SIDE: MAIN TICKET BODY (0 to 870px)
  // ==========================================

  // Top Banner
  ctx.fillStyle = isDarkroom ? '#F59E0B' : '#D4AF37';
  ctx.font = isDarkroom ? 'bold 15px "Playfair Display", Georgia, serif' : '700 15px Cinzel, serif';
  ctx.letterSpacing = '5px';
  ctx.fillText('GHOSTLIGHT : STADIUM OF ECHOES', 55, 65);

  ctx.fillStyle = isDarkroom ? '#A8A29E' : '#94A3B8';
  ctx.font = isDarkroom ? '12px "Courier Prime", monospace' : '12px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText(
    isDarkroom
      ? 'PRESSROOM REGISTER • ARCHIVAL MATCHDAY ADMITTANCE'
      : 'OFFICIAL SANCTUARY ADMITTANCE • MEMORY PRESERVATION REGISTER',
    55,
    88
  );

  // Separator line
  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.3)' : 'rgba(212, 175, 55, 0.25)';
  ctx.beginPath();
  ctx.moveTo(55, 105);
  ctx.lineTo(stubDividerX - 50, 105);
  ctx.stroke();

  // Memory Exhibit Title
  ctx.fillStyle = isDarkroom ? '#F5EBE1' : '#FFFFFF';
  ctx.font = isDarkroom ? 'bold 36px "Playfair Display", Georgia, serif' : 'bold 36px Cinzel, serif';
  ctx.letterSpacing = '1px';
  const displayTitle = memory.title.length > 28 ? memory.title.slice(0, 26) + '...' : memory.title;
  ctx.fillText(displayTitle, 55, 155);

  // Epitaph / Narrative quote
  ctx.fillStyle = isDarkroom ? '#FBBF24' : '#E5C158';
  ctx.font = isDarkroom
    ? 'italic 16px "Newsreader", "Cormorant Garamond", Georgia, serif'
    : 'italic 16px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`“${memory.epitaph}”`, 55, 188);

  // The Big Stadium Box Layout (STAND | SECTOR | ROW | SEAT)
  const boxY = 225;
  const boxHeight = 110;
  const boxTotalWidth = stubDividerX - 110;
  ctx.fillStyle = isDarkroom ? 'rgba(22, 17, 13, 0.85)' : 'rgba(8, 14, 28, 0.7)';
  ctx.fillRect(55, boxY, boxTotalWidth, boxHeight);
  ctx.strokeStyle = isDarkroom ? 'rgba(224, 169, 109, 0.4)' : 'rgba(212, 175, 55, 0.35)';
  ctx.strokeRect(55, boxY, boxTotalWidth, boxHeight);

  // 4 Columns inside box
  const colW = boxTotalWidth / 4;
  const labels = ['STAND', 'SECTOR', 'TIMEFRAME', 'SEAT NUMBER'];
  const values = [
    memory.seatLocation.stand.replace(' Stand', '').toUpperCase(),
    `SEC ${memory.seatLocation.sectorNumber}`,
    memory.year ? `${memory.year}` : 'UNKNOWN',
    `#${memory.seatLocation.seatNumber}`
  ];

  for (let i = 0; i < 4; i++) {
    const colX = 55 + i * colW;
    if (i > 0) {
      // vertical divider
      ctx.beginPath();
      ctx.moveTo(colX, boxY);
      ctx.lineTo(colX, boxY + boxHeight);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = isDarkroom ? '#A8A29E' : '#94A3B8';
    ctx.font = isDarkroom
      ? 'bold 11px "Courier Prime", monospace'
      : '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(labels[i], colX + colW / 2, boxY + 32);

    ctx.fillStyle = isDarkroom ? '#FEF3C7' : '#FFF8DE';
    ctx.font = isDarkroom
      ? 'bold 22px "Playfair Display", Georgia, serif'
      : 'bold 22px Cinzel, serif';
    ctx.fillText(values[i], colX + colW / 2, boxY + 74);
  }

  // Emotional Theme & Ground Info below box
  ctx.textAlign = 'left';
  ctx.fillStyle = isDarkroom ? '#D6D3D1' : '#CBD5E1';
  ctx.font = isDarkroom ? '13px "Courier Prime", monospace' : '13px "Plus Jakarta Sans", sans-serif';
  const groundInfo = memory.originalInput.stadium || memory.originalInput.club || 'Grandstand Cathedral';
  ctx.fillText(`GROUND: ${groundInfo.toUpperCase()}   •   THEME: ${memory.theme.toUpperCase()}`, 55, 375);

  // Bottom Turnstile Barcode & Serial
  ctx.fillStyle = isDarkroom ? '#78716C' : '#64748B';
  ctx.font = '10px monospace';
  ctx.fillText(
    `SERIAL: GL-${memory.year || 'HIST'}-SEC${memory.seatLocation.sectorNumber}-SEAT${memory.seatLocation.seatNumber}-${isDarkroom ? 'PRESS' : 'ARCHIVE'}`,
    55,
    410
  );

  // Draw procedural retro barcode lines
  let barX = 55;
  const barY = 425;
  const barH = 38;
  for (let b = 0; b < 70; b++) {
    const barWidth = (b % 3 === 0 || b % 7 === 0) ? 3 : (b % 2 === 0) ? 2 : 1;
    ctx.fillStyle = isDarkroom
      ? (b % 4 === 1 ? 'rgba(224, 169, 109, 0.2)' : '#F59E0B')
      : (b % 4 === 1 ? 'rgba(212, 175, 55, 0.15)' : '#D4AF37');
    ctx.fillRect(barX, barY, barWidth, barH);
    barX += barWidth + ((b % 5 === 0) ? 4 : 2);
    if (barX > stubDividerX - 90) break;
  }

  // Optional Archival Red Ink Stamp in Darkroom Mode
  if (isDarkroom) {
    ctx.save();
    ctx.translate(stubDividerX - 190, 345);
    ctx.rotate(-0.1);
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(0, 0, 140, 44);
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 11px "Courier Prime", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PRESS ARCHIVE', 70, 18);
    ctx.font = 'bold 9px "Courier Prime", monospace';
    ctx.fillText('AUTHENTICATED', 70, 32);
    ctx.restore();
  }

  // ==========================================
  // RIGHT SIDE: TURNSTILE STUB (870 to 1200px)
  // ==========================================

  ctx.textAlign = 'center';
  const stubCenterX = stubDividerX + (width - stubDividerX) / 2;

  // Stub Title
  ctx.fillStyle = isDarkroom ? '#F59E0B' : '#D4AF37';
  ctx.font = isDarkroom
    ? 'bold 16px "Playfair Display", Georgia, serif'
    : 'bold 16px Cinzel, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('TURNSTILE STUB', stubCenterX, 75);

  ctx.fillStyle = isDarkroom ? '#A8A29E' : '#94A3B8';
  ctx.font = isDarkroom
    ? '10px "Courier Prime", monospace'
    : '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KEEP THIS COUPON', stubCenterX, 98);

  // Circular Archival Stamp
  ctx.save();
  ctx.strokeStyle = isDarkroom ? 'rgba(220, 38, 38, 0.75)' : 'rgba(245, 215, 127, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(stubCenterX, 185, 52, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(stubCenterX, 185, 44, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = isDarkroom ? '#EF4444' : '#F5D77F';
  ctx.font = isDarkroom ? 'bold 11px "Courier Prime", monospace' : 'bold 11px Cinzel, serif';
  ctx.fillText(isDarkroom ? 'HISTORIC' : 'SANCTUARY', stubCenterX, 172);
  ctx.fillText(memory.year ? `${memory.year}` : 'RECORD', stubCenterX, 192);
  ctx.font = '9px monospace';
  ctx.fillText('VERIFIED ECHO', stubCenterX, 208);
  ctx.restore();

  // Stub Details
  ctx.fillStyle = isDarkroom ? '#F5EBE1' : '#FFFFFF';
  ctx.font = isDarkroom
    ? 'bold 18px "Playfair Display", Georgia, serif'
    : 'bold 18px Cinzel, serif';
  ctx.fillText(values[0], stubCenterX, 280); // Stand

  ctx.fillStyle = isDarkroom ? '#FBBF24' : '#E5C158';
  ctx.font = isDarkroom
    ? '600 15px "Courier Prime", monospace'
    : '600 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`SEC ${memory.seatLocation.sectorNumber}  •  SEAT ${memory.seatLocation.seatNumber}`, stubCenterX, 310);

  ctx.fillStyle = isDarkroom ? '#78716C' : '#64748B';
  ctx.font = isDarkroom
    ? '9px "Courier Prime", monospace'
    : '10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NO REFUND • NON-TRANSFERABLE', stubCenterX, 345);
  ctx.fillText('PRESERVED IN ETERNITY', stubCenterX, 362);

  // Tiny stub barcode
  let stubBarX = stubCenterX - 75;
  for (let s = 0; s < 30; s++) {
    const sw = (s % 2 === 0) ? 2 : 1;
    ctx.fillStyle = isDarkroom ? '#A8A29E' : '#94A3B8';
    ctx.fillRect(stubBarX, 400, sw, 25);
    stubBarX += sw + 3;
  }

  // Trigger download
  const imageURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = imageURL;
  a.download = `ghostlight-ticket-${memory.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

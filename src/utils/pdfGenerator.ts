import { DishItem, MENU_CATEGORIES, RestaurantConfig } from '../data/restaurantData';

/**
 * Generates a valid, multi-page PDF document (%PDF-1.4) in pure TypeScript
 * with zero external dependencies or paid plugins, and downloads it directly.
 */
function sanitizePdfText(input: string): string {
  return input
    .replace(/₹/g, 'INR ')
    .replace(/[—–]/g, '-')
    .replace(/[·•]/g, '|')
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function downloadMenuPdf(config: RestaurantConfig, items: DishItem[]): void {
  const pageStreams: string[] = [];
  let currentStream: string[] = [];
  let y = 780;

  const startNewPage = () => {
    if (currentStream.length > 0) {
      pageStreams.push(currentStream.join('\n'));
    }
    currentStream = [];
    y = 780;
    // Subtle header border line on each page
    currentStream.push('0.48 0.11 0.15 RG 1.5 w 48 805 m 547 805 l S');
  };

  const ensureSpace = (neededHeight: number) => {
    if (y - neededHeight < 60) {
      startNewPage();
    }
  };

  const addLine = (
    text: string,
    x: number,
    fontSize: number,
    fontKey: 'F1' | 'F2' = 'F1',
    r = 0.12,
    g = 0.1,
    b = 0.09
  ) => {
    const safe = sanitizePdfText(text);
    currentStream.push(
      `BT /${fontKey} ${fontSize} Tf ${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg ${x} ${y} Td (${safe}) Tj ET`
    );
  };

  // Start Page 1
  startNewPage();

  // Header
  addLine(config.name.toUpperCase(), 48, 22, 'F2', 0.48, 0.11, 0.15);
  y -= 20;
  addLine(`${config.cuisine} Kitchen | ${config.neighborhood}, ${config.city}`, 48, 11, 'F1', 0.35, 0.28, 0.22);
  y -= 16;
  addLine(`Est. ${config.sinceYear} | FSSAI Lic. No. ${config.fssaiNumber} | Tel: ${config.phone}`, 48, 9, 'F1', 0.45, 0.4, 0.35);
  y -= 16;
  addLine(`Direct Order Offer: ${config.offerBannerText} (Use Code: ${config.offerCode})`, 48, 9.5, 'F2', 0.48, 0.11, 0.15);
  y -= 14;
  currentStream.push('0.77 0.61 0.15 RG 0.75 w 48 ' + y + ' m 547 ' + y + ' l S');
  y -= 24;

  for (const category of MENU_CATEGORIES) {
    const categoryDishes = items.filter((d) => d.category === category);
    if (categoryDishes.length === 0) continue;

    ensureSpace(65);
    addLine(category.toUpperCase(), 48, 14, 'F2', 0.48, 0.11, 0.15);
    y -= 6;
    currentStream.push('0.85 0.80 0.72 RG 0.5 w 48 ' + y + ' m 547 ' + y + ' l S');
    y -= 18;

    for (const dish of categoryDishes) {
      const descLines = wrapText(dish.description, 82);
      ensureSpace(34 + descLines.length * 12);

      const dietTag = dish.isVeg ? '[VEG]' : '[NON-VEG]';
      const metaParts = [
        dietTag,
        `Spice: ${dish.spiceLevel}`,
        dish.isChefSpecial ? "Chef's Special" : '',
        dish.isBestseller ? 'Bestseller' : '',
      ].filter(Boolean);

      const titleLine = `${dish.name}  (${metaParts.join(' | ')})`;
      addLine(titleLine, 48, 11, 'F2', 0.12, 0.1, 0.09);
      addLine(`INR ${dish.price}`, 490, 11, 'F2', 0.48, 0.11, 0.15);
      y -= 14;

      for (const dLine of descLines) {
        addLine(dLine, 48, 9.5, 'F1', 0.35, 0.32, 0.29);
        y -= 12;
      }
      y -= 8;
    }
    y -= 8;
  }

  // Footer note on last page
  ensureSpace(40);
  currentStream.push('0.77 0.61 0.15 RG 0.5 w 48 ' + y + ' m 547 ' + y + ' l S');
  y -= 16;
  addLine(
    `Address: ${config.address} | Order direct on WhatsApp: +${config.whatsappNumber}`,
    48,
    8.5,
    'F1',
    0.4,
    0.35,
    0.3
  );

  if (currentStream.length > 0) {
    pageStreams.push(currentStream.join('\n'));
  }

  // Assemble PDF objects
  // Obj 1: Catalog, Obj 2: Pages, Obj 3: Font F1 (Helvetica), Obj 4: Font F2 (Helvetica-Bold)
  const objects: string[] = [];
  const pageCount = pageStreams.length;
  const firstPageObjNum = 5;

  const pageKids = pageStreams
    .map((_, idx) => `${firstPageObjNum + idx * 2} 0 R`)
    .join(' ');

  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pageKids}] /Count ${pageCount} >>\nendobj`);
  objects.push('3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  pageStreams.forEach((streamContent, idx) => {
    const pageObjNum = firstPageObjNum + idx * 2;
    const contentObjNum = pageObjNum + 1;

    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjNum} 0 R >>\nendobj`
    );
    objects.push(
      `${contentObjNum} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj`
    );
  });

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj + '\n';
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    const off = String(offsets[i]).padStart(10, '0');
    pdf += `${off} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  link.href = url;
  link.download = `${slug}-menu.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

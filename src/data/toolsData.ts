import type { ToolItem } from '../types';

/*
  Parsed items from CSV. toolType will be assigned randomly to either 'ISP' or 'Consumables'
  at module load time.
*/

const pickType = (): 'ISP' | 'Consumables' => (Math.random() < 0.5 ? 'ISP' : 'Consumables');

const baseTools: ToolItem[] = [
  { name: 'Fall Arrest Lanyard', quantity: 1, serialNumber: true, sku: 'HS-SHAR-FAL-YL-NS-A', totalCost: 0 },
  { name: 'Harness Working Belt', quantity: 1, serialNumber: true, sku: 'HS-SHAR-HWB-YL-NS-A', totalCost: 0 },
  { name: 'Safety Harness C', details: 'Yellow', quantity: 1, serialNumber: true, sku: 'HS-SHAR-HAR-YL-C-A', totalCost: 0 },
  { name: 'Safety Harness B', details: 'Yellow', quantity: 1, serialNumber: true, sku: 'HS-SHAR-HAR-YL-B-A', totalCost: 0 },
  { name: 'Sumitomo T-502S Alignment Fusion Splicer', details: 'Blue', purchasePrice: 1500, quantity: 1, serialNumber: true, sku: 'FT-SPL-SUMI-BLU-NS-A', totalCost: 1500 },
  { name: 'Umbrella', quantity: 1, serialNumber: false, totalCost: 0 },
  { name: 'Tool Belt', quantity: 1, serialNumber: false, sku: 'HT-BEP-BG-BLK-NS-A', totalCost: 0 },
  { name: 'Tetra Kit', quantity: 1, serialNumber: false, sku: 'HS-LE-TK-BLK-NS-A', totalCost: 0 },
  { name: 'Optical Power Meter With VFL', details: 'Yellow', purchasePrice: 294, quantity: 1, sku: 'PT-OPM-MTOOL-YL-NS-B', totalCost: 294 },
  { name: 'Measuring Pole', details: 'Brown', purchasePrice: 89, quantity: 1, sku: 'HS-MEP-MTOOL-BN-7m-A', totalCost: 89 },
  { name: 'Flush Cutters (Snips)', details: 'Blue', purchasePrice: 8.32, quantity: 1, sku: 'HT-FLC-SN-BLU-NS-B', totalCost: 8.32 },
  { name: 'Pushing Rod (Large) Cobra 11mm', details: 'Yellow', quantity: 1, sku: 'HT-PUR-COB-YL-11mm-C', totalCost: 0 },
  { name: 'Carriageway Key', details: 'Yellow', quantity: 1, sku: 'HT-CAK-ME-YL-NS-D', totalCost: 0 },
  { name: 'Chisel', details: 'Aluminum', purchasePrice: 145.2, quantity: 1, sku: 'HTC-CHI--AL-NS-B', totalCost: 145.2 },
  { name: 'AI9 Fibre Optic Splicer', details: 'Orange', purchasePrice: 798, quantity: 1, serialNumber: true, sku: 'FT-SPL-AI9-OR-NS-A', totalCost: 798 },
  { name: 'DeWalt Combi Drill', quantity: 1, serialNumber: true, sku: 'PT-DRI-CBD-YL-NS-A', totalCost: 0 },
  { name: 'Bosch Endoscope', quantity: 1, serialNumber: false, sku: 'PT-MD-LVLK-GN-NS-A', totalCost: 0 },
  { name: 'Cat 4 Signal Generator', purchasePrice: 28.8, quantity: 1, serialNumber: true, sku: 'HT-ATT-MTOOL---C', totalCost: 28.8 },
  { name: 'Road Cone (Small)', details: 'Orange', quantity: 1, sku: 'HS-STW-CO-OR-NS-B', totalCost: 0 },
  { name: 'Street Works Tent', purchasePrice: 16.99, quantity: 1, sku: 'HS-STW-TE-YL-NS-D', totalCost: 16.99 },
  // add more items from the CSV as needed...
];

export const tools: ToolItem[] = baseTools.map(t => ({ ...t, toolType: pickType() }));
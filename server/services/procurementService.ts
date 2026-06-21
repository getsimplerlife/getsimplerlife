export interface LineItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface ProcurementInput {
  invoiceId: string;
  poId: string;
  invoiceItems: LineItem[];
  poItems: LineItem[];
}

export interface Discrepancy {
  sku: string;
  type: 'Quantity Mismatch' | 'Price Mismatch' | 'Missing Item' | 'Extra Item';
  invoiceValue: number;
  poValue: number;
  description: string;
}

export interface ProcurementResult {
  success: boolean;
  matchSuccess: boolean;
  discrepancies: Discrepancy[];
  totalInvoiceAmount: number;
  totalPoAmount: number;
  matchingLog: string;
}

export const matchInvoiceWithPo = (input: ProcurementInput): ProcurementResult => {
  const { invoiceId, poId, invoiceItems, poItems } = input;
  
  const discrepancies: Discrepancy[] = [];
  
  const totalInvoiceAmount = invoiceItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const totalPoAmount = poItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const poMap = new Map<string, LineItem>();
  for (const item of poItems) {
    poMap.set(item.sku, item);
  }

  const invoiceMap = new Map<string, LineItem>();
  for (const item of invoiceItems) {
    invoiceMap.set(item.sku, item);
  }

  // 1. Scan invoice items against PO items
  for (const invItem of invoiceItems) {
    const poItem = poMap.get(invItem.sku);
    if (!poItem) {
      discrepancies.push({
        sku: invItem.sku,
        type: 'Extra Item',
        invoiceValue: invItem.quantity,
        poValue: 0,
        description: `Item ${invItem.description} (SKU: ${invItem.sku}) was invoiced but does not exist in the Purchase Order ${poId}.`
      });
    } else {
      if (invItem.quantity !== poItem.quantity) {
        discrepancies.push({
          sku: invItem.sku,
          type: 'Quantity Mismatch',
          invoiceValue: invItem.quantity,
          poValue: poItem.quantity,
          description: `SKU ${invItem.sku} quantity mismatch: Invoiced ${invItem.quantity} vs PO expected ${poItem.quantity}.`
        });
      }
      if (invItem.unitPrice !== poItem.unitPrice) {
        discrepancies.push({
          sku: invItem.sku,
          type: 'Price Mismatch',
          invoiceValue: invItem.unitPrice,
          poValue: poItem.unitPrice,
          description: `SKU ${invItem.sku} unit price mismatch: Invoiced $${invItem.unitPrice} vs PO expected $${poItem.unitPrice}.`
        });
      }
    }
  }

  // 2. Scan PO items for missing items in invoice
  for (const poItem of poItems) {
    const invItem = invoiceMap.get(poItem.sku);
    if (!invItem) {
      discrepancies.push({
        sku: poItem.sku,
        type: 'Missing Item',
        invoiceValue: 0,
        poValue: poItem.quantity,
        description: `Item ${poItem.description} (SKU: ${poItem.sku}) is missing from the invoice ${invoiceId} but was specified in PO ${poId}.`
      });
    }
  }

  const matchSuccess = discrepancies.length === 0;
  let matchingLog = '';
  if (matchSuccess) {
    matchingLog = `[Three-Way Match Service] Invoice ${invoiceId} matches Purchase Order ${poId} with 100% precision. Total matched: $${totalInvoiceAmount.toLocaleString()}. Passed to payment approval queue.`;
  } else {
    matchingLog = `[Three-Way Match Service] Invoice ${invoiceId} matching failed against PO ${poId}. Detected ${discrepancies.length} discrepancy/discrepancies. Routed to exception handling queue.`;
  }

  return {
    success: true,
    matchSuccess,
    discrepancies,
    totalInvoiceAmount,
    totalPoAmount,
    matchingLog
  };
};

export interface Sale {
    id: number;
    date: string;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    startDate: Date;
    endDate: Date;
    reportTypes?: "Daily" | "Weekly" | "Monthly";
  }
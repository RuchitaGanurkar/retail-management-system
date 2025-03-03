import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from '../models/user.model';
import { Supplier } from '../models/supplier.model';
import { Product } from '../models/product.model';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const users: User[] = [
      { id: 1, username: 'manager', password: 'manager123', role: 'manager', supplierId: 0 },
      { id: 2, username: 'supplier', password: 'supplier123', role: 'supplier', supplierId: 1 },
    ];

    const suppliers: Supplier[] = [
      {
        id: 1,
        name: 'Tech Supplies Inc.',
        contactPerson: 'John Doe',
        email: 'john@techsupplies.com',
        phone: '555-123-4567',
        address: '123 Tech St, Silicon Valley, CA'
      },
      {
        id: 2,
        name: 'Gadget World',
        contactPerson: 'Jane Smith',
        email: 'jane@gadgetworld.com',
        phone: '555-987-6543',
        address: '456 Gadget Ave, New York, NY'
      },
      {
        id: 3,
        name: 'PharmaDirect Ltd.',
        contactPerson: 'Nancy Brown',
        email: 'nancy@pharmadirect.com',
        phone: '555-890-5678',
        address: '505 Med Lane, Boston, MA'
      },
      {
        id: 4,
        name: 'Auto Parts Express',
        contactPerson: 'James Wilson',
        email: 'james@autopartsexpress.com',
        phone: '555-901-3456',
        address: '606 Auto Blvd, Dallas, TX'
      },
      {
        id: 5,
        name: 'Home Appliances Co.',
        contactPerson: 'Olivia Martinez',
        email: 'olivia@homeappliancesco.com',
        phone: '555-234-6789',
        address: '707 Kitchen Way, Seattle, WA'
      }
    ];

    const products: Product[] = [
      {
        id: 1,
        name: 'Laptop',
        description: 'High-performance laptop for professionals',
        category: 'Electronics',
        supplierId: 1,
        stockLevel: 15,
        price: 1299.99
      },
      {
        id: 2,
        name: 'Smartphone',
        description: 'Latest model with advanced features',
        category: 'Electronics',
        supplierId: 1,
        stockLevel: 25,
        price: 899.99
      },
      {
        id: 3,
        name: 'Wireless Headphones',
        description: 'Noise-cancelling with long battery life',
        category: 'Audio',
        supplierId: 2,
        stockLevel: 40,
        price: 199.99
      },
      {
        id: 4,
        name: 'Designer Sunglasses',
        description: 'UV protection stylish sunglasses',
        category: 'Fashion',
        supplierId: 3,
        stockLevel: 50,
        price: 129.99
      },
      {
        id: 5,
        name: 'Vitamin C Serum',
        description: 'Anti-aging skincare serum with Vitamin C',
        category: 'Health & Beauty',
        supplierId: 4,
        stockLevel: 60,
        price: 39.99
      },
      {
        id: 6,
        name: 'Car Battery',
        description: 'Long-lasting and maintenance-free car battery',
        category: 'Automotive',
        supplierId: 2,
        stockLevel: 22,
        price: 179.99
      },
      {
        id: 7,
        name: 'Microwave Oven',
        description: '1000W microwave oven with multiple presets',
        category: 'Appliances',
        supplierId: 5,
        stockLevel: 12,
        price: 249.99
      }
    ];

    const sales: Sale[] = [
      {
        id: 1,
        date: '2025-02-20',
        productId: 1,
        productName: 'Laptop',
        quantity: 2,
        unitPrice: 1299.99,
        totalPrice: 2599.98,
        currency: 'USD',
        startDate: new Date('2025-02-20'),
        endDate: new Date('2025-02-20'),
        reportTypes: 'Daily'
      },
      {
        id: 2,
        date: '2025-02-21',
        productId: 2,
        productName: 'Smartphone',
        quantity: 3,
        unitPrice: 899.99,
        totalPrice: 2699.97,
        currency: 'USD',
        startDate: new Date('2025-02-21'),
        endDate: new Date('2025-02-21'),
        reportTypes: 'Daily'
      },
      {
        id: 3,
        date: '2025-02-22',
        productId: 3,
        productName: 'Wireless Headphones',
        quantity: 5,
        unitPrice: 199.99,
        totalPrice: 999.95,
        currency: 'USD',
        startDate: new Date('2025-02-22'),
        endDate: new Date('2025-02-22'),
        reportTypes: 'Weekly'

      },
      {
        id: 4,
        date: '2025-02-24',
        productId: 1,
        productName: 'Laptop',
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99,
        currency: 'USD',
        startDate: new Date('2025-02-24'),
        endDate: new Date('2025-02-24'),
        reportTypes: 'Monthly'
      }
    ];

    return { users, suppliers, products, sales };
  }

  genId<T extends { id: number }>(collection: T[]): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
  }
}

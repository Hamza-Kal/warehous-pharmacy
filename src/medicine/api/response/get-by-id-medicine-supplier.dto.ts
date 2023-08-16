import { SupplierMedicine } from 'src/medicine/entities/medicine-role.entities';

export class GetByIdMedicineSupplier {
  name: string;
  category: string;
  id: number;
  price: number;
  quantity: number;
  description: string;
  imageUrl: string | null;
  batches: {
    id: number;
    expireDate: Date;
    quantity: number;
  }[];
  medicineSupplier: string;
  medicineCategory: string;
  constructor({ supplierMedicine }: { supplierMedicine: SupplierMedicine }) {
    this.id = supplierMedicine.id;
    this.name = supplierMedicine.medicine.name;
    this.category = supplierMedicine.medicine.category.category;
    this.price = supplierMedicine.price;
    this.quantity = supplierMedicine.quantity;
    this.imageUrl = supplierMedicine.medicine?.image?.url;
    this.description = supplierMedicine.medicine.description;
    const batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[] = [];
    for (const {
      id,
      medicineDetails,
      quantity,
    } of supplierMedicine.medicineDetails) {
      batches.push({
        id,
        quantity,
        expireDate: medicineDetails.endDate,
      });
    }
    this.batches = batches;
    this.medicineCategory = supplierMedicine.medicine.category.category;
    this.medicineSupplier = supplierMedicine.medicine.supplier.name;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    description: string;

    batches: {
      id: number;
      expireDate: Date;
      quantity: number;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      quantity: this.quantity,
      imageUrl: this.imageUrl,
      batches: this.batches,
      description: this.description,
    };
  }
}

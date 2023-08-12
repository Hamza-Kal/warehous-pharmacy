import { InventoryMedicine } from 'src/medicine/entities/medicine-role.entities';
export class GetByIdInventoryMedicines {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batch: {
    expireDate: Date;
    quantity: number;
    id: number;
  }[];
  imageUrl: string | null;
  constructor({ medicine }: { medicine: InventoryMedicine }) {
    this.id = medicine.id;
    this.name = medicine.medicine.name;
    this.category = medicine.medicine.category.category;
    this.quantity = medicine.quantity;
    this.price = medicine.medicine.warehouseMedicine.price;
    this.imageUrl = medicine.medicine?.image?.url;
    const batch: {
      expireDate: Date;
      quantity: number;
      id: number;
    }[] = [];

    for (const medicineDetail of medicine.medicineDetails) {
      batch.push({
        expireDate: medicineDetail.medicineDetails.endDate,
        id: medicineDetail.id,
        quantity: medicineDetail.quantity,
      });
    }
    this.batch = batch;
  }

  toObject(): {
    id: number;
    name: string;
    category: string;
    quantity: number;
    price: number;
    imageUrl: string | null;
    batch: {
      expireDate: Date;
      quantity: number;
      id: number;
    }[];
  } {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      batch: this.batch,
      imageUrl: this.imageUrl,
    };
  }
}

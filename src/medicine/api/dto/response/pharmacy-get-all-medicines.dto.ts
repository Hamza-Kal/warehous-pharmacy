import { PharmacyMedicine } from 'src/medicine/entities/medicine-role.entities';
import { Medicine } from 'src/medicine/entities/medicine.entities';

export class PharmacyGetByCriteriaAllMedicine {
  id: number;
  name: string;

  imageUrl: string | null;

  constructor({ medicine }: { medicine: Medicine }) {
    this.id = medicine.id;
    this.name = medicine.name;
    this.imageUrl = medicine.image?.url || null;
  }

  toObject(): {
    id: number;
    name: string;

    imageUrl: string | null;
  } {
    return {
      id: this.id,
      name: this.name,
      imageUrl: this.imageUrl,
    };
  }
}

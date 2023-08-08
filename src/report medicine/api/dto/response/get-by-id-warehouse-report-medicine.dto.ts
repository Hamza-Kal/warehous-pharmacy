// import {
//   ReportMedicineStatus,
//   SupplierReportMedicine,
// } from 'src/return order/entities/reportMedicine.entities';

// export class GetByIdSupplierReportMedicine {
//   //     "details": [
//   //         {
//   //             "quantity": 99,
//   //             "price": 247500,
//   //             "medicine": {
//   //                 "name": "vitamen c"
//   //             }
//   //         }
//   //     ]
//   id: number;
//   reportMedicineDate: Date;
//   supplier: {
//     name: string;
//     phoneNumber: string;
//     location: string;
//     email: string;
//   };
//   status: ReportMedicineStatus;
//   medicines: {
//     name: string;
//     price: number;
//     quantity: number;
//   }[];
//   constructor({ reportMedicine }: { reportMedicine: SupplierReportMedicine }) {
//     this.id = reportMedicine.id;
//     this.reportMedicineDate = reportMedicine.created_at;
//     this.supplier = {
//       name: reportMedicine.supplier.name,
//       email: reportMedicine.supplier.user.email,
//       phoneNumber: reportMedicine.supplier.phoneNumber,
//       location: reportMedicine.supplier.location,
//     };
//   }

//   toObject(): {
//     id: number;
//     supplier: {
//       name: string;
//       phoneNumber: string;
//       location: string;
//       email: string;
//     };
//     medicines: {
//       name: string;
//       price: number;
//       quantity: number;
//     }[];
//   } {
//     return {
//       id: this.id,
//       supplier: this.supplier,
//       medicines: this.medicines,
//     };
//   }
// }

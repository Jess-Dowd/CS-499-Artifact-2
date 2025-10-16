// export interface Trip {
//   code: string;
//   name: string;
//   image?: string;

  
//   desc1?: string;
//   desc2?: string;


//   resort?: string;
//   length?: string;
//   perPerson?: number;
//   description?: string;
// }

export interface Trip {
  _id: string;       // MongoDB _id
  code: string;
  name: string;
  length: string;
  resort: string;
  perPerson: number;
  image: string;
  description: string;
}

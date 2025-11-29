export interface Trip {
  _id: string;       // MongoDB document ID

  code: string;      // Trip code (unique identifier)
  name: string;      // Trip name/title
  length: string;    // Duration of the trip
  resort: string;    // Resort/company name
  perPerson: number; // Cost per person
  image: string;     // Image filename in assets
  description: string; // Trip details/HTML description
  start: string;       // Start date of the trip
}

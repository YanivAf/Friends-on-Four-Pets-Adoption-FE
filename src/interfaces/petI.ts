export default interface PetI {
  _id?: string;
  type: string;
  petName: string;
  bio: string;
  adoptionStatus: string;
  loves?: number;
  petPicture?: string;
  breed?: string;
  height?: string;
  weight?: string;
  color?: string;
  hypoallergenic?: string;
  dietaryRestrictions?: string;
  publisher?: string;
  adopter?: string | null;
  foster?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

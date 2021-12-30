import RequestI from "./requestI";

export default interface FullUserInfoI {
  _id: string;
  admin?: boolean;
  email: string;
  password?: string;
  passwordConfirm?: string;
  fullName: string;
  phone: string;
  area?: string;
  bio?: string;
  banned?: boolean;
  recentlyApproved?: number;
  publishedPets?: string[];
  savedPets?: string[];
  lovedPets?: string[];
  adoptedPets?: string[];
  fosteredPets?: string[];
  adoptedPending?: string[];
  fosteredPending?: string[];
  incomingRequests?: RequestI[];
}

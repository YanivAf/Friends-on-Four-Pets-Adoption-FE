import FullUserInfoI from "./fullUserInfoI";
import PetI from "./petI";

export default interface ViewedUserInfoI {
  user: FullUserInfoI;
  userPets: PetI[];
}

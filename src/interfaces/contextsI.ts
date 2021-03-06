import PetI from "./petI";
import FullUserInfoI from "./fullUserInfoI";
import SearchInput from "./searchInputI";
import ViewedUserInfoI from "./viewedUserInfoI";
import ContactInfoI from "./contactInfoI";

export interface FofContextI {
  domain: string;
  currentPath: string;
  headers: { currentUser: string };
  getPets: any;
  pets: PetI[];
  setPets: any;
  petsLimit: number;
  setPetsLimit: any;
  getUsers: any;
  users: FullUserInfoI[];
  setUsers: any;
  usersLimit: number;
  setUsersLimit: any;
  whichPets: string;
  setWhichPets: any;
  advSearchOn: boolean;
  toggleAdvSearch: any;
  searchInputs: SearchInput[];
  setSearchInputs: any;
  searchedTypeString: string;
  setSearchedTypeString: any;
  searchedUserString: string;
  setSearchedUserString: any;
  byWhat: string;
  setByWhat: any;
  loading: boolean;
  badRequest: boolean;
  authProcessing: boolean;
  userInfo: FullUserInfoI;
  userInfoDispatch: any;
  viewedUserInfo: ViewedUserInfoI;
  setViewedUserInfo: any;
  modalIsOpen: boolean;
  userContactInfo: ContactInfoI;
  modalPetIndex: number | undefined;
  signup: any;
  login: any;
  logout: any;
  updateProfile: any;
  handleNewPet: any;
  handleUpdate: any;
  handleRequest: any;
  handleResponse: any;
  handleReturn: any;
  confirmDelete: (id: string) => void;
  openModal: (id?: string) => void;
  closeModal: any;
}

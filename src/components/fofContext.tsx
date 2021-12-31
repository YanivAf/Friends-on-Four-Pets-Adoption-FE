import { createContext } from "react";
import { FofContextI } from "../interfaces/contextsI";

const FofContext = createContext<FofContextI>({
  domain: "http://localhost:5000",
  currentPath: "/",
  headers: { currentUser: "" },
  getPets: null,
  pets: [],
  setPets: null,
  petsLimit: 20,
  setPetsLimit: null,
  getUsers: null,
  users: [],
  setUsers: null,
  usersLimit: 20,
  setUsersLimit: null,
  whichPets: "General",
  setWhichPets: null,
  advSearchOn: false,
  toggleAdvSearch: null,
  searchedTypeString: "",
  searchInputs: [{ by: "adoptionStatus", searchedValue: ["Available"] }],
  setSearchInputs: null,
  setSearchedTypeString: null,
  searchedUserString: "",
  setSearchedUserString: null,
  byWhat: "byPet",
  setByWhat: null,
  loading: false,
  badRequest: false,
  authProcessing: false,
  userInfo: { _id: "", email: "", fullName: "", phone: "" },
  userInfoDispatch: null,
  viewedUserInfo: {
    user: { _id: "", email: "", fullName: "", phone: "" },
    userPets: [],
  },
  setViewedUserInfo: null,
  modalIsOpen: false,
  userContactInfo: { _id: "", fullName: "", email: "", phone: "" },
  modalPetIndex: undefined,
  signup: null,
  login: null,
  logout: null,
  updateProfile: null,
  handleNewPet: null,
  handleUpdate: null,
  handleRequest: null,
  handleResponse: null,
  handleReturn: null,
  confirmDelete: (id: string) => {},
  openModal: () => {},
  closeModal: null,
});

export default FofContext;
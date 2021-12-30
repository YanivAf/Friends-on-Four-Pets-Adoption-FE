import "./fof.scss";
import { DOMAIN } from "./utils/connection"
import { useState, useEffect, useReducer, useCallback } from "react";

import axios from "axios";
import swal from "sweetalert";
import Cookies from "universal-cookie";

import FofContext from "./components/fofContext";
import PetI from "./interfaces/petI";
import FullUserInfoI from "./interfaces/fullUserInfoI";
import RequestI from "./interfaces/requestI";
import ViewedUserInfoI from "./interfaces/viewedUserInfoI";
import ContactInfoI from "./interfaces/contactInfoI";

const userInfoReducer = (userInfo: FullUserInfoI, updates: any) => {
  switch (updates) {
    case undefined:
      return new Error();
    default:
      return updates;
  }
};

const cookies = new Cookies();

const ContextWrapper: React.FC = ({ children }): JSX.Element => {
  const currentPath = window.location.pathname;
  const domain = DOMAIN || 'http://localhost:5000';
  const [pets, setPets] = useState<PetI[]>([]);
  const [petsLimit, setPetsLimit] = useState<number>(20);
  const [users, setUsers] = useState<FullUserInfoI[]>([]);
  const [usersLimit, setUsersLimit] = useState<number>(20);
  const [whichPets, setWhichPets] = useState<string>(
    cookies.get("whichPets")
      ? cookies.get("whichPets")
      : currentPath.indexOf("profile-view") !== -1
      ? ""
      : "General"
  );
  const [advSearchOn, setAdvSearchOn] = useState(false);
  const [searchedTypeString, setSearchedTypeString] = useState<string>("");
  const [searchInputs, setSearchInputs] = useState([
    { by: "adoptionStatus", searchedValue: ["Available"] },
    { by: "petName", searchedValue: "" },
    { by: "height", searchedValue: "0", minMax: "Min" },
    { by: "weight", searchedValue: "0", minMax: "Min" },
  ]);
  const [searchedUserString, setSearchedUserString] = useState<string>("");
  const [byWhat, setByWhat] = useState<string>(
    currentPath === "/users" ? "byUser" : "byPet"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [badRequest, setBadRequest] = useState<boolean>(false);
  const [userInfo, userInfoDispatch] = useReducer(userInfoReducer, {
    _id: "",
    email: "",
    fullName: "",
    phone: "",
  });
  const [viewedUserInfo, setViewedUserInfo] = useState<ViewedUserInfoI>({
    user: { _id: "", email: "", fullName: "", phone: "" },
    userPets: [],
  });
  const [authProcessing, setAuthProcessing] = useState<boolean>(true);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [userContactInfo, setUserContactInfo] = useState<ContactInfoI>({
    _id: userInfo._id,
    fullName: userInfo.fullName,
    email: userInfo.email,
    phone: userInfo.phone,
  });
  const [modalPetIndex, setModalPetIndex] = useState<number | undefined>(
    undefined
  );

  const logout = async () => {
    await axios.get(`${domain}/user/logout`, {
      withCredentials: true,
    });
    userInfoDispatch({ _id: "", email: "", fullName: "", phone: "" });
    setViewedUserInfo({
      user: { _id: "", email: "", fullName: "", phone: "" },
      userPets: [],
    });
    setPets([]);
    setPetsLimit(20);
    setUsers([]);
    setUsersLimit(20);
    setWhichPets("General");
    setAdvSearchOn(false);
    setSearchedTypeString("");
    setSearchInputs([
      { by: "adoptionStatus", searchedValue: ["Available"] },
      { by: "petName", searchedValue: "" },
      { by: "height", searchedValue: "0", minMax: "Min" },
      { by: "weight", searchedValue: "0", minMax: "Min" },
    ]);
    setSearchedUserString("");
    setByWhat("byPet");
  };

  const login = async ({ email, password }: FullUserInfoI) => {
    try {
      setAuthProcessing(true);
      setBadRequest(false);
      const { data } = await axios.post(
        `${domain}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      const token = cookies.get("currentUser");
      if (token) userInfoDispatch(data);
      setAuthProcessing(false);
      getPets(searchInputs, searchedTypeString);
      swal({
        title: `Welcome Back, ${data.fullName}!`,
        icon: "success",
        buttons: [false, "Thanks"],
      });
    } catch (error) {
      setAuthProcessing(false);
      setBadRequest(true);
      console.error("Error logging in: ", error);
    }
  };

  const getCurrentUser = async (token: string) => {
    try {
      if (token) {
        const { data } = await axios.get(`${domain}/user/token/`, {
          withCredentials: true,
        });
        userInfoDispatch(data);
      }
      setAuthProcessing(false);
    } catch (error) {
      setAuthProcessing(false);
      setBadRequest(true);
    }
  };

  const signup = async ({
    email,
    password,
    passwordConfirm,
    fullName,
    phone,
  }: FullUserInfoI) => {
    try {
      setAuthProcessing(true);
      setBadRequest(false);
      const { data } = await axios.post(
        `${domain}/user/signup`,
        { email, password, passwordConfirm, fullName, phone },
        { withCredentials: true }
      );
      const token = cookies.get("currentUser");
      if (token)
        userInfoDispatch({
          _id: data,
          email,
          fullName,
          phone,
          publishedPets: [],
          savedPets: [],
          lovedPets: [],
          adoptedPets: [],
          fosteredPets: [],
          adoptedPending: [],
          fosteredPending: [],
          incomingRequests: [],
        });
      setAuthProcessing(false);
      swal({
        title: `Welcome, ${fullName}!`,
        icon: "success",
        buttons: [false, "Thanks"],
      });
    } catch (error) {
      setAuthProcessing(false);
      setBadRequest(true);
      console.error("Error signing up: ", error);
    }
  };

  const getPets = useCallback(
    async (searchInputs, searchedTypeString) => {
      try {
        if (
          pets.length > 0 &&
          !advSearchOn &&
          (pets.length % 20 || pets.length === petsLimit)
        )
          return;
        setBadRequest(false);
        const userId =
          userInfo._id !== "" ? userInfo._id : cookies.get("userId");
        const { data } =
          whichPets === "General"
            ? await axios.post(
                `${domain}/pet/filtered`,
                {
                  properties: [
                    ...searchInputs,
                    { by: "type", searchedValue: searchedTypeString },
                  ],
                  limit: petsLimit,
                },
                { withCredentials: true }
              )
            : await axios.get(`${domain}/pet/user/${userId}`, {
                withCredentials: true,
              });
        setPets(data);
        setLoading(false);
      } catch (error) {
        setBadRequest(true);
      }
    },
    [petsLimit, userInfo, whichPets]
  );

  const getUsers = useCallback(async () => {
    try {
      if (
        (currentPath.indexOf("profile-view") !== -1 &&
          viewedUserInfo.user._id !== "") ||
        (currentPath === "/users" && users.length > 0)
      )
        return;
      setBadRequest(false);
      const viewedUserId: string | undefined =
        currentPath.indexOf("profile-view") !== -1
          ? currentPath.replace("/profile-view/", "")
          : undefined;
      const { data } = !viewedUserId
        ? await axios.post(
            `${domain}/user/filtered`,
            { searchedUserString, limit: usersLimit },
            { withCredentials: true }
          )
        : await axios.get(`${domain}/user/${viewedUserId}/full`, {
            withCredentials: true,
          });
      viewedUserId ? setViewedUserInfo(data) : setUsers(data);
      setLoading(false);
    } catch (error) {
      setBadRequest(true);
    }
  }, [currentPath, searchedUserString, usersLimit, viewedUserInfo]);

  const handleNewPet = async (newPetToPost: PetI, petInputs: PetI) => {
    try {
      Object.keys(newPetToPost).forEach(
        (key) =>
          newPetToPost[key as keyof typeof newPetToPost] === "" &&
          delete newPetToPost[key as keyof typeof newPetToPost]
      );
      const { data } = await axios.post(
        `${domain}/pet/`,
        newPetToPost,
        { withCredentials: true }
      );
      setPets([{ ...data, ...petInputs }, ...pets]);

      closeModal();
    } catch (error) {
      console.error("Error adding pet: ", error);
    }
  };

  const updateProfile = async (userInfoInputs: FullUserInfoI) => {
    try {
      !userInfoInputs.password && delete userInfoInputs.password;
      !userInfoInputs.passwordConfirm && delete userInfoInputs.passwordConfirm;
      !userInfoInputs.bio && delete userInfoInputs.bio;
      const { data } = await axios.put(
        `${domain}/user/${userInfo._id}`,
        userInfoInputs,
        { withCredentials: true }
      );
      userInfoDispatch(data);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const handleUpdate = async (updatedPet: PetI, petPicFile: any) => {
    try {
      if (modalPetIndex === undefined) return;
      const updatedPetFd: FormData = new FormData();
      updatedPetFd.append("type", updatedPet.type);
      updatedPetFd.append("petName", updatedPet.petName);
      updatedPetFd.append("bio", updatedPet.bio);
      petPicFile &&
        updatedPetFd.append("petPicture", petPicFile, `${petPicFile.name}`);
      updatedPet.breed && updatedPetFd.append("breed", updatedPet.breed);
      updatedPet.height && updatedPetFd.append("height", updatedPet.height);
      updatedPet.weight && updatedPetFd.append("weight", updatedPet.weight);
      updatedPet.color && updatedPetFd.append("color", updatedPet.color);
      updatedPet.hypoallergenic &&
        updatedPetFd.append("hypoallergenic", updatedPet.hypoallergenic);
      updatedPet.dietaryRestrictions &&
        updatedPetFd.append(
          "dietaryRestrictions",
          updatedPet.dietaryRestrictions
        );

      const { data } = await axios.put(
        `${domain}/pet/${updatedPet._id}`,
        updatedPetFd,
        { withCredentials: true }
      );
      const updatedPets = [...pets];
      updatedPets.splice(modalPetIndex, 1, data);
      setPets(updatedPets);

      closeModal();
    } catch (error) {}
  };

  const handleRequest = async (type: string) => {
    try {
      if (modalPetIndex === undefined) return;
      const petRequest = { type };
      const existingPet = pets[modalPetIndex];
      const { data } = await axios.post(
        `${domain}/pet/${existingPet._id}/request`,
        petRequest,
        { withCredentials: true }
      );
      userInfoDispatch(data);
      swal({
        title: `${type} Request for ${existingPet.petName} Sent`,
        text: 'You can track it via the "Saved" section.\nIf approved - you will be alerted!',
        icon: "success",
        buttons: [false, "Great"],
      }).then(closeModal);
    } catch (error) {
      console.error("Error adding pet: ", error);
    }
  };

  const handleResponse = async (response: string, request: RequestI) => {
    if (userInfo.incomingRequests === undefined) return;
    const updatedIncomingRequsests: any[] = userInfo.incomingRequests.filter(
      (incomingRequest: RequestI) => incomingRequest._id !== request._id
    );
    userInfoDispatch({
      ...userInfo,
      incomingRequests: updatedIncomingRequsests,
    });
    await axios.post(
      `${domain}/pet/${request.pet}/respond`,
      { response, requestId: request._id },
      { withCredentials: true }
    );
  };

  const handleReturn = async () => {
    try {
      if (modalPetIndex === undefined) return;
      const existingPet = pets[modalPetIndex];
      const { data } = await axios.post(
        `${domain}/pet/${existingPet._id}/return`,
        {},
        { withCredentials: true }
      );
      userInfoDispatch(data);
      swal({
        title: `${existingPet.petName}'s Return Done`,
        icon: "success",
        buttons: [false, "Great"],
      }).then(closeModal);
    } catch (error) {
      console.error("Error adding pet: ", error);
    }
  };

  const confirmDelete = (petId: string) => {
    swal({
      title: "Delete Pet?",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then(async (willDelete: boolean) => {
      if (willDelete) {
        await axios.delete(`${domain}/pet/${petId}`, {
          withCredentials: true,
        });
        const petIndex = pets.findIndex((pet) => pet._id === petId);
        const updatedPets = [...pets];
        updatedPets.splice(petIndex, 1);
        setPets(updatedPets);
      } else swal(`Deletion cancelled`);
    });
  };

  const openModal = async (petId?: string) => {
    try {
      if (petId === undefined) {
        setModalPetIndex(undefined);
        setUserContactInfo({
          _id: userInfo._id,
          fullName: userInfo.fullName,
          email: userInfo.email,
          phone: userInfo.phone,
        });
        setIsOpen(true);
        return;
      }
      const petIndex: number = pets.findIndex((pet) => pet._id === petId);
      setModalPetIndex(petIndex);
      const pet: PetI = pets[petIndex];
      let ownerId: string | undefined;
      if (userInfo._id === pet.publisher) {
        if (pet.adoptionStatus === "Available") {
          setUserContactInfo({
            _id: userInfo._id,
            fullName: userInfo.fullName,
            email: userInfo.email,
            phone: userInfo.phone,
          });
          setIsOpen(true);
          return;
        } else {
          ownerId = pet.adopter ? pet.adopter : pet.foster;
        }
      } else {
        if (pet.adoptionStatus !== "Available") {
          if (pet.adopter !== userInfo._id && pet.foster !== userInfo._id)
            ownerId = pet.adopter ? pet.adopter : pet.foster;
        }
      }
      const userId = ownerId ? ownerId : pet.publisher;
      const { data } = await axios.get(
        `${domain}/user/${userId}/contact`,
        { withCredentials: true }
      );
      setUserContactInfo(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error getting contact info: ", error);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleAdvSearch =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      )
        return;
      setAdvSearchOn(open);
    };

  useEffect(() => {
    (currentPath === "/" ||
      (userInfo._id !== "" &&
        (currentPath === "/login" || currentPath === "/signup"))) &&
      getPets(searchInputs, searchedTypeString);
    userInfo.admin === true &&
      (currentPath === "/users" ||
        currentPath.indexOf("profile-view") !== -1) &&
      getUsers();
    currentPath === "/profile" && setLoading(false);
  }, [getPets, petsLimit, usersLimit, whichPets, userInfo]);

  useEffect(() => {
    console.log('hi')
    if (userInfo._id !== "") return;
    const token = cookies.get("currentUser");
    getCurrentUser(token);
  }, []);

  return (
    <FofContext.Provider
      value={{
        domain,
        currentPath,
        getPets,
        pets,
        setPets,
        petsLimit,
        setPetsLimit,
        getUsers,
        users,
        setUsers,
        usersLimit,
        setUsersLimit,
        whichPets,
        setWhichPets,
        advSearchOn,
        toggleAdvSearch,
        searchInputs,
        setSearchInputs,
        searchedTypeString,
        setSearchedTypeString,
        searchedUserString,
        setSearchedUserString,
        byWhat,
        setByWhat,
        loading,
        badRequest,
        authProcessing,
        userInfo,
        userInfoDispatch,
        viewedUserInfo,
        setViewedUserInfo,
        modalIsOpen,
        userContactInfo,
        modalPetIndex,
        signup,
        login,
        logout,
        updateProfile,
        handleNewPet,
        handleUpdate,
        handleRequest,
        handleReturn,
        handleResponse,
        confirmDelete,
        openModal,
        closeModal,
      }}
    >
      {children}
    </FofContext.Provider>
  );
};

export default ContextWrapper;

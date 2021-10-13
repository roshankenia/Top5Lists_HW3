import { createContext, useState } from "react";
import jsTPS from "../common/jsTPS";
import api from "../api";
import MoveItem_Transaction from "../transactions/MoveItem_Transaction";
import ChangeItem_Transaction from "../transactions/ChangeItem_Transaction";
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
  MARK_DELETION_LIST: "MARK_DELETION_LIST",
  HIDE_DELETE_MODAL: "HIDE_DELETE_MODAL",
  DELETE_LIST: "DELETE_LIST",
  SET_TOOLBAR_ICONS: "SET_TOOLBAR_ICONS",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: 0,
    listNameActive: false,
    itemActive: false,
    listMarkedForDeletion: null,
    hasUndo: false,
    hasRedo: false,
  });

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: false,
          hasRedo: false,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: true,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }

      case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: true,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }

      case GlobalStoreActionType.MARK_DELETION_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: payload,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }

      case GlobalStoreActionType.DELETE_LIST: {
        return setStore({
          idNamePairs: payload,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: false,
          hasRedo: false,
        });
      }

      case GlobalStoreActionType.HIDE_DELETE_MODAL: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }

      case GlobalStoreActionType.SET_TOOLBAR_ICONS: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload.currentList,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: payload.undo,
          hasRedo: payload.redo,
        });
      }

      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.top5List,
          newListCounter: payload.newListCounter,
          isListNameEditActive: false,
          isItemEditActive: false,
          listMarkedForDeletion: null,
          hasUndo: store.hasUndo,
          hasRedo: store.hasRedo,
        });
      }
      default:
        return store;
    }
  };
  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getTop5ListById(id);
      if (response.data.success) {
        let top5List = response.data.top5List;
        top5List.name = newName;
        async function updateList(top5List) {
          response = await api.updateTop5ListById(top5List._id, top5List);
          if (response.data.success) {
            async function getListPairs(top5List) {
              response = await api.getTop5ListPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    top5List: top5List,
                  },
                });
              }
            }
            getListPairs(top5List);
          }
        }
        updateList(top5List);
      }
    }
    asyncChangeListName(id);
  };

  store.markForDeletion = function (idNamePair) {
    storeReducer({
      type: GlobalStoreActionType.MARK_DELETION_LIST,
      payload: idNamePair,
    });

    let modal = document.getElementById("delete-modal");
    modal.classList.add("is-visible");
  };

  store.hideDeleteListModal = function () {
    storeReducer({
      type: GlobalStoreActionType.HIDE_DELETE_MODAL,
      payload: null,
    });

    let modal = document.getElementById("delete-modal");
    modal.classList.remove("is-visible");
  };

  store.deleteMarkedList = function () {
    let id = store.listMarkedForDeletion._id;

    async function asyncDeleteMarkedList() {
      const response1 = await api.deleteTop5ListById(id);
      return response1;
    }

    async function asyncUpdatePairs(response1) {
      if (response1.data.success) {
        const response2 = await api.getTop5ListPairs();
        if (response2.data.success) {
          let pairsArray = response2.data.idNamePairs;

          storeReducer({
            type: GlobalStoreActionType.DELETE_LIST,
            payload: pairsArray,
          });
        } else {
          console.log("ERROR While Retrieving Pairs");
        }
      } else {
        console.log("ERROR While Deleting");
      }
    }

    asyncDeleteMarkedList().then((response1) => asyncUpdatePairs(response1));
    tps.clearAllTransactions();
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });

    tps.clearAllTransactions();
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    async function asyncLoadIdNamePairs() {
      const response = await api.getTop5ListPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await api.getTop5ListById(id);
      if (response.data.success) {
        let top5List = response.data.top5List;

        response = await api.updateTop5ListById(top5List._id, top5List);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: top5List,
          });
          store.history.push("/top5list/" + top5List._id);
        }
      }
    }
    asyncSetCurrentList(id);
  };
  store.addChangeItemTransaction = function (oldText, newText, index) {
    let transaction = new ChangeItem_Transaction(
      store,
      oldText,
      newText,
      index
    );
    tps.addTransaction(transaction);
  };

  store.changeItem = function (index, text) {
    store.currentList.items[index] = text;

    store.updateCurrentList();
  };

  store.updateToolbar = function () {
    let toolbarStatus = [];

    if (tps.hasTransactionToUndo()) {
      toolbarStatus.push(true);
    } else {
      toolbarStatus.push(false);
    }

    if (tps.hasTransactionToRedo()) {
      toolbarStatus.push(true);
    } else {
      toolbarStatus.push(false);
    }

    let currentList = store.currentList;

    storeReducer({
      type: GlobalStoreActionType.SET_TOOLBAR_ICONS,
      payload: {
        undo: toolbarStatus[0],
        redo: toolbarStatus[1],
        currentList: currentList,
      },
    });
  };

  store.addMoveItemTransaction = function (start, end) {
    let transaction = new MoveItem_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };
  store.moveItem = function (start, end) {
    start -= 1;
    end -= 1;
    if (start < end) {
      let temp = store.currentList.items[start];
      for (let i = start; i < end; i++) {
        store.currentList.items[i] = store.currentList.items[i + 1];
      }
      store.currentList.items[end] = temp;
    } else if (start > end) {
      let temp = store.currentList.items[start];
      for (let i = start; i > end; i--) {
        store.currentList.items[i] = store.currentList.items[i - 1];
      }
      store.currentList.items[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await api.updateTop5ListById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList().then((_) => {
      store.updateToolbar();
    });
  };
  store.createNewList = function () {
    async function asyncCreateNewList() {
      let counter = store.newListCounter + 1;
      let newList = {
        name: "Untitled" + counter,
        items: ["?", "?", "?", "?", "?"],
      };
      const response1 = await api.createTop5List(newList);
      if (response1.data.success) {
        let id = response1.data.top5List._id;
        const response2 = await api.getTop5ListPairs();
        if (response2.data.success) {
          let pairsArray = response2.data.idNamePairs;

          let response3 = await api.getTop5ListById(id);
          if (response3.data.success) {
            let top5List = response3.data.top5List;

            let response4 = await api.updateTop5ListById(
              top5List._id,
              top5List
            );
            if (response4.data.success) {
              storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                  top5List: top5List,
                  idNamePairs: pairsArray,
                  newListCounter: counter,
                },
              });
              store.history.push("/top5list/" + top5List._id);
            } else {
              console.log("API FAILED TO UPDATE TOP 5 LIST BY ID");
            }
          } else {
            console.log("API FAILED TO GET LIST BY ID");
          }
        } else {
          console.log("API FAILED TO GET THE LIST PAIRS");
        }
      } else {
        console.log("API FAILED TO MAKE NEW LIST");
      }
    }

    asyncCreateNewList();
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  store.setIsItemEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
      payload: null,
    });
  };

  // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
  return { store, storeReducer };
};

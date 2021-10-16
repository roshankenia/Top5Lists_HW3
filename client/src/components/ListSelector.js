import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ListCard from "./ListCard.js";
import { GlobalStoreContext } from "../store";
import DeleteModal from "./DeleteModal";
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  function handleNewList() {
    store.createNewList();
  }

  function dummy() {}

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  let listCard = "";

  let addClass = "top5-button";
  let addFunction = handleNewList;

  if (store.isListNameEditActive) {
    addClass = "top5-button-disabled";
    addFunction = dummy;
  }
  if (store) {
    listCard = store.idNamePairs.map((pair) => (
      <ListCard key={pair._id} idNamePair={pair} selected={false} />
    ));
  }
  return (
    <div id="top5-list-selector">
      <div id="list-selector-heading">
        <input
          type="button"
          onClick={addFunction}
          id="add-list-button"
          className={addClass}
          value="+"
        />
        Your Lists
      </div>
      <div id="list-selector-list">
        {listCard}
        <DeleteModal />
      </div>
    </div>
  );
};

export default ListSelector;

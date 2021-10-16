import { React, useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [draggedTo, setDraggedTo] = useState(0);
  const [text, setText] = useState("");

  function handleDragStart(event) {
    event.dataTransfer.setData("item", event.target.id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    setText(props.name);
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsItemEditActive();
    }
    setEditActive(newActive);
  }

  function handleDrop(event) {
    event.preventDefault();
    let target = event.target;
    let targetId = target.id;
    targetId = targetId.substring(target.id.indexOf("-") + 1);
    let sourceId = event.dataTransfer.getData("item");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
    setDraggedTo(false);

    // UPDATE THE LIST
    if (sourceId !== targetId) {
      store.addMoveItemTransaction(sourceId, targetId);
    }
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      store.addChangeItemTransaction(name, text, index);
      toggleEdit();
    }
  }

  function handleUpdateText(event) {
    setText(event.target.value);
  }

  function dummy() {}

  let { index, name } = props;
  let itemClass = "top5-item";
  if (draggedTo) {
    itemClass = "top5-item-dragged-to";
  }
  if (editActive) {
    return (
      <input
        id={"item-edit-" + (index + 1)}
        className={itemClass}
        type="text"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={name}
        autoFocus
      />
    );
  } else {
    let editFunction = handleToggleEdit;
    let dragStartFunction = handleDragStart;
    let dragOverFunction = handleDragOver;
    let dragEnterFunction = handleDragEnter;
    let dragLeaveFunction = handleDragLeave;
    let dropFunction = handleDrop;
    let editClass = "list-card-button";
    if (store.isItemEditActive) {
      editFunction = dummy;
      dragStartFunction = dummy;
      dragOverFunction = dummy;
      dragEnterFunction = dummy;
      dragLeaveFunction = dummy;
      dropFunction = dummy;
      editClass = "list-card-button-disabled";
    }
    return (
      <div
        id={"item-" + (index + 1)}
        className={itemClass}
        onDragStart={dragStartFunction}
        onDragOver={dragOverFunction}
        onDragEnter={dragEnterFunction}
        onDragLeave={dragLeaveFunction}
        onDrop={dropFunction}
        draggable="true"
      >
        <input
          type="button"
          id={"edit-item-" + index + 1}
          className={editClass}
          onClick={editFunction}
          value={"\u270E"}
        />
        {props.name}
      </div>
    );
  }
}

export default Top5Item;

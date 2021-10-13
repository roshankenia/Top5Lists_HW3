import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();

  let enabledButtonClass = "top5-button";
  let disabledButtonClass = "top5-button-disabled";
  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }
  function handleClose() {
    history.push("/");
    store.closeCurrentList();
  }
  let editStatus = false;
  if (store.isListNameEditActive) {
    editStatus = true;
  }

  let undoClass = disabledButtonClass;
  let redoClass = disabledButtonClass;
  let closeClass = disabledButtonClass;

  if (store.hasUndo) {
    undoClass = enabledButtonClass;
  }
  if (store.hasRedo) {
    redoClass = enabledButtonClass;
  }
  if (store.currentList) {
    closeClass = enabledButtonClass;
  }
  if (store.isItemEditActive) {
    undoClass = disabledButtonClass;
    redoClass = disabledButtonClass;
    closeClass = disabledButtonClass;
  }
  return (
    <div id="edit-toolbar">
      <div
        disabled={editStatus}
        id="undo-button"
        onClick={handleUndo}
        className={undoClass}
      >
        &#x21B6;
      </div>
      <div
        disabled={editStatus}
        id="redo-button"
        onClick={handleRedo}
        className={redoClass}
      >
        &#x21B7;
      </div>
      <div
        disabled={editStatus}
        id="close-button"
        onClick={handleClose}
        className={closeClass}
      >
        &#x24E7;
      </div>
    </div>
  );
}

export default EditToolbar;

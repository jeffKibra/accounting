import { Component } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

import { CREATE_ITEM } from "../../../store/actions/itemsActions";
import { reset } from "../../../store/slices/itemsSlice";

import ItemForm from "../../../components/forms/Items/ItemForm";

class NewItem extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.isModified && !prevProps.isModified) {
      // console.log("reseting");
      this.props.resetItems();
    }
  }

  render() {
    const { isModified, loading, createItem } = this.props;

    return isModified ? (
      <Navigate to="/items" />
    ) : (
      <ItemForm loading={loading} handleFormSubmit={createItem} />
    );
  }
}

function mapStateToProps(state) {
  const { loading, error, isModified } = state.itemsReducer;

  return { loading, error, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createItem: (data) => dispatch({ type: CREATE_ITEM, data }),
    resetItems: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem);

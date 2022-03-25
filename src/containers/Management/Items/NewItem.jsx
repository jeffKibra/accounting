import { Component } from "react";

import ItemForm from "../../../components/forms/ItemForms/ItemForm";

class NewItem extends Component {
  render() {
    console.log({ context: this.context });
    return (
      <div>
        <ItemForm createItem={this.context.createNewItem} />
        <p>{this.context.state.loading && "loading..."}</p>
      </div>
    );
  }
}

export default NewItem;

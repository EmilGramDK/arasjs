import { showSearchDialog } from "../utils/dialog";

export const itemPropertyPolyfill = (): void => {
  window.ItemProperty.prototype.request = function () {
    const { label, itemType, maxItemsCount } = this.state;
    const req = `<Item type="${itemType}" action="get" maxRecords="${maxItemsCount}"><keyed_name condition="like">${label}*</keyed_name></Item>`;
    return ArasModules.soap(req, { async: true }).catch(() => {
      this.setState({ abortRequest: undefined, requestTimeoutID: undefined, list: [] });
    });
  };

  window.ItemProperty.prototype.showDialogHandler = async function () {
    const { itemType } = this.state;

    const item = await showSearchDialog({
      title: "Select an item",
      itemtypeName: itemType,
    });
    if (!item) return;

    this.setState({
      label: item.keyed_name,
      list: [
        {
          label: item.keyed_name,
          value: item.keyed_name,
          itemId: item.itemID,
        },
      ],
    });

    this.state.refs.input.dispatchEvent(new CustomEvent("change", { bubbles: true }));
  };
};

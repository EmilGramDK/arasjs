export interface ItemType {
  id: string;
  name: string;
  label: string;
  label_plural: string;
  large_icon: string;
  open_icon: string;
  implementation_type: string;
  instance_data: string;
  is_dependent: string;
  is_relationship: string;
  is_versionable: string;
  manual_versioning: string;
  maxrecords: number | null;
  relationships_tabbar_xml: string;
  show_parameters_tab: string;
  structure_view: string;
  use_src_access: string;
  xItemTypeAllowedProperty: Array<unknown>;
  DiscussionTemplate: Array<unknown>;
  ITPresentationConfiguration: Array<unknown>;
  ItemType_xPropertyDefinition: Array<unknown>;
  Morphae: Array<unknown>;
  Property: Array<Property>;
  RelationshipType: Array<unknown>;
  View: Array<unknown>;
  allow_private_permission: string;
  auto_search: string;
  class_structure: string;
  default_page_size: number;
  "Can Add": Array<unknown>;
  "Client Event": Array<unknown>;
  "Item Action": Array<unknown>;
  "Item Report": Array<unknown>;
  history_template: {
    id: string;
    "History Template Action": Array<unknown>;
  };
}

export interface Property {
  id: string;
  name: string;
  label: string;
  data_type: string;
  class_path: string;
  order_by: string;
  column_alignment: string;
  column_width: number;
  stored_length: number;
  sort_order: number;
  pattern: string;
  help_text: string;
  help_tooltip: string;
  default_value: string;
  default_search: string;
  keyed_name_order: string;
  source_id: string;
  readonly: "1" | "0";
  is_hidden: "1" | "0";
  is_hidden2: "1" | "0";
  is_indexed: "1" | "0";
  is_required: "1" | "0";
  is_federated: "1" | "0";
  is_keyed: "1" | "0";
  is_multi_valued: "1" | "0";
  range_inclusive: "1" | "0";
}

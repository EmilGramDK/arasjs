export type BaseItem = {
  id: string;
  config_id: string;
  permission_id: BaseItem;
  keyed_name: string;
  owned_by_id: Identity;
  managed_by_id: Identity;
  created_by_id: User;
  modified_by_id: User;
  locked_by_id: User;
  is_current: "1" | "0";
  not_lockable: "1" | "0";
  classification: string;
  state: string;
  team_id: Team;
  created_on: string;
  css: string;
  generation: number;
  modified_on: string;
  minor_rev: string;
  major_rev: string;
};

export type Identity = {
  name: string;
  description: string;
} & BaseItem;

export type User = {
  login_name: string;
  user_no: string;
  first_name: string;
  last_name: string;
  email: string;
  logon_enabled: "1" | "0";
  working_directory: string;
  default_vault: BaseItem;
} & BaseItem;

export type Team = { name: string; description: string } & BaseItem;

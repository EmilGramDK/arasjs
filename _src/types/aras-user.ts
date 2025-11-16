export interface ArasObjectUser {
  type: string;
  loginName: string;
  setStorageProperty: (propertyName: string, propertyValue: string) => void;
  userInfo: {
    authenticationType: string;
    database: string;
    defaultVault: string;
    firstName: string;
    lastName: string;
    id: string;
    identityId: string;
    keyedName: string;
    loginName: string;
    picture: string;
    startingPage: string;
    type: string;
  };
}

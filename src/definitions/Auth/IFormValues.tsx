export interface IFormValues {
  name: string;
  email: string;
  tel: string;
  password: string;
  reCheckPassword: string;
  loginEmail: string;
  loginPassword: string;
  address: string;
}

export interface IPwdFinderFormValues {
  email: string;
  tel: string;
}

export interface IIdFinderFormValues {
  tel: string;
}


export interface IPwdResetterFormValues {
  password: string;
  reCheckPassword: string;
}

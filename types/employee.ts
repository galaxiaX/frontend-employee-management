export type IEmployeeDetails = {
  _id: string;
  first_name: string;
  last_name: string;
  gender: number;
  birth_date: Date | null;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  id_card_exp_date: Date | null;
};

export type IEmployeeTableFilters = {
  keyword: string;
  birthMonth: string;
  idCardExpireDate: string;
};

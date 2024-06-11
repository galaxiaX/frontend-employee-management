export const BASE_API = process.env.NEXT_PUBLIC_SERVER_URL;

export const endpoints = {
  list: "/employees",
  employee: "/employee",
  create: "/create",
  update: "/update",
  delete: "/delete",
};

export const externalEndpoints = {
  province:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province.json",
  district:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_amphure.json",
  subdistrict:
    "https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_tambon.json",
};

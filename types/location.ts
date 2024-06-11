export type ProvinceType = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
};

export type DistrictType = {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
};

export type SubDistrictType = {
  id: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  zip_code: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
};

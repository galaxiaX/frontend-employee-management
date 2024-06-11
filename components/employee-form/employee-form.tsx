"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Divider, MenuItem, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import toast from "react-hot-toast";

import FormProvider from "../hook-form/form-provider";
import RHFTextField from "../hook-form/rhf-text-field";
import { RHFSelect } from "../hook-form/rhf-select";
import RHFDatePicker from "../hook-form/rhf-date-picker";
import RHFAutocomplete from "../hook-form/rhf-autocomplete";

import { externalEndpoints } from "@/api/url";
import { createEmployee, updateEmployee } from "@/api/employee";
import { IEmployeeDetails } from "@/types/employee";
import { DistrictType, ProvinceType, SubDistrictType } from "@/types/location";
import { genderList } from "@/assets/data/gender";

type Props = {
  employee?: IEmployeeDetails | null;
};

const cache = {
  provinceList: null as ProvinceType[] | null,
  districtList: null as DistrictType[] | null,
  subdistrictList: null as SubDistrictType[] | null,
};

const EmployeeForm = ({ employee }: Props) => {
  const router = useRouter();

  const [provinceList, setProvinceList] = useState<ProvinceType[]>([]);
  const [districtList, setDistrictList] = useState<DistrictType[]>([]);
  const [subdistrictList, setSubdistrictList] = useState<SubDistrictType[]>([]);

  const yupShape = {
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    gender: Yup.number().required(),
    birth_date: Yup.date().required().nullable(),
    id_card_exp_date: Yup.date().required().nullable(),
    address: Yup.string().required("Address is required"),
    province: Yup.string().required("Province is required"),
    district: Yup.string().required("District is required"),
    subdistrict: Yup.string().required("Subdistrict is required"),
  };

  const EmployeeSchema = Yup.object().shape(yupShape);

  const defaultValues: Omit<IEmployeeDetails, "_id"> = useMemo(
    () => ({
      first_name: employee?.first_name || "",
      last_name: employee?.last_name || "",
      gender: employee?.gender || 0,
      birth_date: employee?.birth_date || null,
      id_card_exp_date: employee?.id_card_exp_date || null,
      address: employee?.address || "",
      province: employee?.province || "",
      district: employee?.district || "",
      subdistrict: employee?.subdistrict || "",
    }),
    [employee]
  );

  const methods = useForm({
    resolver: yupResolver(EmployeeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (employee) {
        await updateEmployee({ _id: employee._id, ...data });
        toast.success("Employee updated successfully");
      } else {
        await createEmployee(data);
        toast.success("Employee created successfully");
      }

      setTimeout(() => {
        reset();
        router.push("/");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  });

  const fetchAutoCompleteData = async () => {
    if (cache.provinceList && cache.districtList && cache.subdistrictList) {
      setProvinceList(cache.provinceList);
      setDistrictList(cache.districtList);
      setSubdistrictList(cache.subdistrictList);
      return;
    }

    try {
      const [provinceRes, districtRes, subdistrictRes] = await Promise.all([
        axios.get(externalEndpoints.province),
        axios.get(externalEndpoints.district),
        axios.get(externalEndpoints.subdistrict),
      ]);

      if (!provinceRes.data || !districtRes.data || !subdistrictRes.data) {
        throw new Error("Cannot get data from server");
      }

      setProvinceList(provinceRes.data);
      setDistrictList(districtRes.data);
      setSubdistrictList(subdistrictRes.data);

      cache.provinceList = provinceRes.data;
      cache.districtList = districtRes.data;
      cache.subdistrictList = subdistrictRes.data;
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAutoCompleteData();
  }, []);

  const selectedProvinceId = provinceList.find(
    (province) => province.name_en === values.province
  )?.id;
  const selectedProvinceData = districtList.filter(
    (district) => district.province_id === selectedProvinceId
  );
  const selectedDistrictId = selectedProvinceData.find(
    (district) => district.name_en === values.district
  )?.id;
  const selectedDistrictData = subdistrictList.filter(
    (subdistrict) => subdistrict.amphure_id === selectedDistrictId
  );

  return (
    <div className="w-full">
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card sx={{ p: 3, width: "100%" }} className="w-full">
          <div className="flex flex-col gap-8">
            <Section title="Employee Information">
              <div className="grid grid-cols-2 gap-4 w-full">
                <RHFTextField name="first_name" label="First Name" />
                <RHFTextField name="last_name" label="Last Name" />

                <RHFSelect name="gender" label="Gender">
                  <MenuItem value={0}>None</MenuItem>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  {genderList.map((gender) => (
                    <MenuItem key={gender.id} value={gender.id}>
                      {gender.label}
                    </MenuItem>
                  ))}
                </RHFSelect>

                <RHFDatePicker
                  name="birth_date"
                  label="Birth date"
                  format="DD/MM/YYYY"
                />

                <RHFDatePicker
                  name="id_card_exp_date"
                  label="ID card exp date"
                  format="DD/MM/YYYY"
                />
              </div>
            </Section>

            <Section title="Address Information">
              <div className="grid grid-cols-2 gap-4 w-full">
                <RHFTextField name="address" label="Address" />

                <RHFAutocomplete
                  name="province"
                  label="Province"
                  options={provinceList}
                  onChange={(option, value) => {
                    if ((value as ProvinceType).name_en !== values.province) {
                      setValue("district", "");
                      setValue("subdistrict", "");
                    }
                    setValue("province", (value as ProvinceType).name_en);
                  }}
                  filterOptions={(options: ProvinceType[], params: any) => {
                    const filtered = options.filter(
                      (option) =>
                        option.name_en
                          .toLowerCase()
                          .indexOf(params.inputValue.toLowerCase()) !== -1
                    );

                    return filtered;
                  }}
                  getOptionLabel={(option) => (option as string) || ""}
                  isOptionEqualToValue={(option, value) =>
                    (option as ProvinceType).name_en === value?.name_en
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option?.id}>
                      {option.name_en || ""}
                    </li>
                  )}
                />
                <RHFAutocomplete
                  name="district"
                  label="District"
                  disabled={!values.province}
                  options={selectedProvinceData}
                  onChange={(option, value) => {
                    if ((value as DistrictType).name_en !== values.province) {
                      setValue("subdistrict", "");
                    }
                    setValue("district", (value as DistrictType).name_en);
                  }}
                  filterOptions={(options: DistrictType[], params: any) => {
                    const filtered = options.filter(
                      (option) =>
                        option.name_en
                          .toLowerCase()
                          .indexOf(params.inputValue.toLowerCase()) !== -1
                    );

                    return filtered;
                  }}
                  getOptionLabel={(option) => (option as string) || ""}
                  isOptionEqualToValue={(option, value) =>
                    (option as DistrictType).name_en === value?.name_en
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option?.id}>
                      {option?.name_en || ""}
                    </li>
                  )}
                />
                <RHFAutocomplete
                  name="subdistrict"
                  label="Subdistrict"
                  disabled={!values.district}
                  options={selectedDistrictData}
                  onChange={(option, value) =>
                    setValue("subdistrict", (value as SubDistrictType).name_en)
                  }
                  filterOptions={(options: SubDistrictType[], params: any) => {
                    const filtered = options.filter(
                      (option) =>
                        option.name_en
                          .toLowerCase()
                          .indexOf(params.inputValue.toLowerCase()) !== -1
                    );

                    return filtered;
                  }}
                  getOptionLabel={(option) => (option as string) || ""}
                  isOptionEqualToValue={(option, value) =>
                    (option as SubDistrictType).name_en === value?.name_en
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option?.id}>
                      {option?.name_en || ""}
                    </li>
                  )}
                />
              </div>
            </Section>
          </div>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              className="font-medium"
            >
              {employee?._id ? "Update Employee" : "Create Employee"}
            </LoadingButton>
          </Stack>
        </Card>
      </FormProvider>
    </div>
  );
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => (
  <div className="flex flex-col gap-4">
    <h3>{title}</h3>
    {children}
  </div>
);

export default EmployeeForm;

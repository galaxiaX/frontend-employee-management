import { BASE_API, endpoints } from "./url";
import { IEmployeeDetails } from "@/types/employee";
import axiosInstance from "./axiosInstance";

export async function getEmployees() {
  const URL = BASE_API + endpoints.list;
  const res = await axiosInstance.get(URL);
  if (res.status === 200) {
    return res.data;
  } else {
    return res;
  }
}

export async function getEmployee(id: string) {
  const URL = BASE_API + endpoints.employee + "/" + id;
  const res = await axiosInstance.get(URL);
  if (res.status === 200) {
    return res.data;
  } else {
    return res;
  }
}

export async function createEmployee(data: Omit<IEmployeeDetails, "_id">) {
  const URL = BASE_API + endpoints.create;
  const res = await axiosInstance.post(URL, data);
  if (res.status === 201) {
    return res.data;
  } else {
    return res;
  }
}

export async function updateEmployee(data: IEmployeeDetails) {
  const URL = BASE_API + endpoints.update + "/" + data._id;
  const res = await axiosInstance.put(URL, data);
  if (res.status === 200) {
    return res.data;
  } else {
    return res;
  }
}

export async function deleteEmployee(id: string) {
  const URL = BASE_API + endpoints.delete + "/" + id;
  const res = await axiosInstance.delete(URL);
  if (res.status === 200) {
    return res.data;
  } else {
    return res;
  }
}

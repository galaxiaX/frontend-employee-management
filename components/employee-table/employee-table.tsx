"use client";

import { deleteEmployee } from "@/api/employee";
import { genderList } from "@/assets/data/gender";
import { IEmployeeDetails, IEmployeeTableFilters } from "@/types/employee";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import EmployeeTableToolbar from "./employee-table-toolbar";
import { filterIdCardExpireDate } from "@/assets/data/table";

type Props = {
  rows: IEmployeeDetails[];
};

const defaultFilters: IEmployeeTableFilters = {
  keyword: "",
  birthMonth: "",
  idCardExpireDate: "",
};

const EmployeeTable = ({ rows }: Props) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IEmployeeDetails>();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: rows,
    filters,
  });

  const handleFilters = useCallback((name: string, value: string) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleShowDeleteDialog = (target: IEmployeeDetails) => {
    setDeleteTarget(target);
    setShowDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setDeleteTarget(undefined);
    }, 500);
  };

  const handleDeleteEmployees = async () => {
    try {
      if (deleteTarget) {
        setShowDialog(false);
        await toast.promise(
          deleteEmployee(deleteTarget._id),
          {
            loading: "Deleting...",
            success: "Employee deleted",
            error: "Failed to delete employee",
          },
          {
            style: {
              minWidth: "250px",
            },
          }
        );

        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const tableHeadData = [
    { id: "first_name", label: "First name" },
    { id: "last_name", label: "Last name" },
    { id: "gender", label: "Gender" },
    { id: "birth_date", label: "Birth date" },
    { id: "address", label: "Address" },
    { id: "subdistrict", label: "Subdistrict" },
    { id: "district", label: "District" },
    { id: "province", label: "Province" },
    { id: "id_card_exp_date", label: "ID card exp date" },
    { id: "action", label: "Action" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <EmployeeTableToolbar
        filters={filters}
        onFilters={handleFilters}
        dataFiltered={dataFiltered}
      />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead className="bg-gray-300">
            <TableRow>
              {tableHeadData.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dataFiltered.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.first_name}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.last_name}
                </TableCell>
                <TableCell>
                  {genderList?.at(row.gender - 1)?.label || ""}
                </TableCell>
                <TableCell>
                  {dayjs(row.birth_date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.address}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.subdistrict}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.district}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {row.province}
                </TableCell>
                <TableCell>
                  {dayjs(row.id_card_exp_date).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <button>
                      <Link href={`/update/${row._id}`}>✏️</Link>
                    </button>

                    <button onClick={() => handleShowDeleteDialog(row)}>
                      ❌
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Employee {deleteTarget?.first_name}?</DialogTitle>
          <DialogContent>
            <DialogContentText>This action cannot be undone.</DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteEmployees} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </div>
  );
};

const applyFilter = ({
  inputData,
  filters,
}: {
  inputData: IEmployeeDetails[];
  filters: IEmployeeTableFilters;
}) => {
  const { keyword, birthMonth, idCardExpireDate } = filters;

  const stabilizedThis =
    inputData?.map((el, index) => [el, index] as const) || [];

  inputData = stabilizedThis.map((el) => el[0]);

  if (keyword) {
    inputData = inputData.filter(
      (employee) =>
        employee?.first_name?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1 ||
        employee?.last_name?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1 ||
        employee?.province?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1 ||
        employee?.district?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1 ||
        employee?.subdistrict?.toLowerCase().indexOf(keyword.toLowerCase()) !==
          -1 ||
        employee?.address?.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    );
  }

  if (birthMonth) {
    inputData = inputData.filter(
      (user) => dayjs(user.birth_date).month() === parseInt(birthMonth)
    );
  }

  if (idCardExpireDate) {
    switch (idCardExpireDate) {
      case filterIdCardExpireDate[0].value:
        inputData = inputData.filter(
          (user) => dayjs(user.id_card_exp_date).diff(dayjs(), "day") >= 0
        );
        break;
      case filterIdCardExpireDate[1].value:
        inputData = inputData.filter(
          (user) =>
            dayjs(user.id_card_exp_date).diff(dayjs(), "day") >= 0 &&
            dayjs(user.id_card_exp_date).diff(dayjs(), "day") <= 90
        );
        break;
      case filterIdCardExpireDate[2].value:
        inputData = inputData.filter(
          (user) => dayjs(user.id_card_exp_date).diff(dayjs(), "day") < 0
        );
        break;
      default:
        break;
    }
  }

  return inputData;
};

export default EmployeeTable;

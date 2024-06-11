import { genderList } from "@/assets/data/gender";
import { filterIdCardExpireDate } from "@/assets/data/table";
import { IEmployeeDetails, IEmployeeTableFilters } from "@/types/employee";
import {
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useCallback } from "react";
import { saveAs } from "file-saver";
import Papa from "papaparse";

type Props = {
  filters: IEmployeeTableFilters;
  onFilters: (name: string, value: string) => void;
  dataFiltered: IEmployeeDetails[];
};

const EmployeeTableToolbar = ({ filters, onFilters, dataFiltered }: Props) => {
  const handleFilterKeyword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters("keyword", event.target.value);
    },
    [onFilters]
  );

  const handleFilterBirthDate = useCallback(
    (event: SelectChangeEvent) => {
      console.log("event.target.value : ", event.target.value);
      onFilters("birthMonth", event.target.value);
    },
    [onFilters]
  );
  const handleFilterIDCardExpireDate = useCallback(
    (event: SelectChangeEvent) => {
      onFilters("idCardExpireDate", event.target.value);
    },
    [onFilters]
  );

  const handleExportCSV = () => {
    const csvData = dataFiltered.map((row) => ({
      "First Name": row.first_name,
      "Last Name": row.last_name,
      Gender: genderList?.at(row.gender - 1)?.label || "",
      "Birth Date": dayjs(row.birth_date).format("DD/MM/YYYY"),
      Address: row.address,
      Subdistrict: row.subdistrict,
      District: row.district,
      Province: row.province,
      "ID Card Exp Date": dayjs(row.id_card_exp_date).format("DD/MM/YYYY"),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "employees.csv");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="grow flex flex-col md:flex-row items-center gap-4 w-full">
        <TextField
          fullWidth
          value={filters.keyword}
          onChange={handleFilterKeyword}
          sx={{ backgroundColor: "white" }}
          placeholder="Search name/address"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
        />

        <div className="flex items-center gap-4 w-full">
          <FormControl sx={{ minWidth: 180, backgroundColor: "white" }}>
            <InputLabel>ID card expire date</InputLabel>
            <Select
              value={filters.idCardExpireDate}
              label="All"
              onChange={handleFilterIDCardExpireDate}
            >
              <MenuItem value={""}>All</MenuItem>

              <Divider sx={{ borderStyle: "dashed" }} />
              {filterIdCardExpireDate.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="medium"
            sx={{ minWidth: 130, backgroundColor: "white" }}
          >
            <InputLabel>Birth month</InputLabel>
            <Select
              value={filters.birthMonth}
              label="Birth month"
              onChange={handleFilterBirthDate}
            >
              <MenuItem value={""}>All</MenuItem>

              <Divider sx={{ borderStyle: "dashed" }} />

              {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                <MenuItem key={month} value={month.toString()}>
                  {dayjs().month(month).format("MMMM")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <button
        disabled={!Boolean(dataFiltered.length)}
        onClick={handleExportCSV}
        className="bg-blue-500 px-4 py-2 rounded-lg text-white w-fit shrink-0 text-sm whitespace-nowrap self-end sm:self-center"
      >
        Export CSV
      </button>
    </div>
  );
};

export default EmployeeTableToolbar;

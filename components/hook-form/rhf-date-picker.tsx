import { Controller, useFormContext } from "react-hook-form";

import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { FormHelperText } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// ----------------------------------------------------------------------

type Props = DatePickerProps<Dayjs> & {
  name: string;
  helperText?: React.ReactNode;
};

export default function RHFDatePicker({ name, helperText, ...other }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <div>
            <DatePicker
              sx={{ width: "100%" }}
              value={dayjs(field.value)}
              onChange={(value) => {
                value && field.onChange(value);
              }}
              {...other}
            />

            {(!!error || helperText) && (
              <FormHelperText error={!!error}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

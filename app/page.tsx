import { getEmployees } from "@/api/employee";
import EmployeeTable from "@/components/employee-table/employee-table";
import { IEmployeeDetails } from "@/types/employee";

import Link from "next/link";

export default async function Home() {
  let employeeList: IEmployeeDetails[] = [];

  try {
    const res: IEmployeeDetails[] = await getEmployees();
    if (res?.length > 0) {
      employeeList = res;
    }
  } catch (error) {
    console.error("Failed to get employees:", error);
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center gap-12 p-8 sm:p-12 md:p-16 bg-gray-200">
      <h1 className="text-2xl md:text-4xl font-bold text-center">
        Employee Management System
      </h1>

      <section className="flex flex-col gap-6 w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h2 className="font-bold text-xl">
            Employee List ({employeeList.length} employee
            {employeeList.length > 1 ? "s" : ""})
          </h2>

          <Link
            href="/create"
            className="bg-blue-500 px-4 py-2 rounded-lg text-white w-fit text-sm sm:self-end whitespace-nowrap"
          >
            Create new employee
          </Link>
        </div>

        <EmployeeTable rows={employeeList} />
      </section>
    </main>
  );
}

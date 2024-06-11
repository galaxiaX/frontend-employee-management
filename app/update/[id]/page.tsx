import { getEmployee } from "@/api/employee";
import EmployeeForm from "@/components/employee-form/employee-form";
import { IEmployeeDetails } from "@/types/employee";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

export const metadata = {
  title: "Update Employee",
};

const EmployeeUpdatePage = async ({ params }: Props) => {
  const { id } = params;

  let employee: IEmployeeDetails | null = null;

  try {
    const res = await getEmployee(id);
    if (res.data) {
      employee = res.data;
    }
  } catch (error) {
    console.error("Failed to fetch employee data:", error);
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center gap-12 p-8 sm:p-12 md:p-24 bg-gray-200">
      <Link href={"/"} className="text-2xl md:text-4xl font-bold self-start">
        {"<-"} Back
      </Link>
      <section className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">
            Update Employee : {employee?.first_name}
          </h2>
        </div>
      </section>
      {employee && <EmployeeForm employee={employee} />}
    </main>
  );
};

export default EmployeeUpdatePage;

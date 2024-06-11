import EmployeeForm from "@/components/employee-form/employee-form";
import Link from "next/link";

export const metadata = {
  title: "Create a new Employee",
};

const EmployeeCreatePage = () => {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center gap-12 p-8 sm:p-12 md:p-24 bg-gray-200">
      <Link href={"/"} className="text-2xl md:text-4xl font-bold self-start">
        {"<-"} Back
      </Link>
      <section className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Create new Employee</h2>
        </div>
      </section>

      <EmployeeForm />
    </main>
  );
};

export default EmployeeCreatePage;

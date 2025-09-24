import PageMeta from "../../../components/common/PageMeta";
import StudentAvailabilityController from "../../../components/(admin)/StudentAvailabilityController/StudentAvailabilityController";

export default function StudentAvailability() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="col-span-12 xl:col-span-7">
        <StudentAvailabilityController />
      </div>
    </>
  );
}

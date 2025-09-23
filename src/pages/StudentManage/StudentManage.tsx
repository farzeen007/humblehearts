import PageMeta from "../../components/common/PageMeta";
import StudentManageController from "../../components/StudentManageController/StudentManageController";

export default function StudentManage() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="col-span-12 xl:col-span-7">
        <StudentManageController />
      </div>
    </>
  );
}

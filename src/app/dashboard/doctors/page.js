import DoctorList from "../components/DoctorList";

export default function DoctorsPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold">Available Doctors</h1>
      <DoctorList />
    </div>
  );
}

import ChangePasswordForm from "@/components/ChangePasswordForm";

export const metadata = {
  title: "Settings | Admin Portal",
};

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold text-primary-950 tracking-tight">Settings</h1>
        <p className="text-primary-700/60 mt-1 font-medium">จัดการการตั้งค่าบัญชีและความปลอดภัย</p>
      </div>

      <div className="space-y-6">
        <section>
          <ChangePasswordForm />
        </section>
      </div>
    </div>
  );
}

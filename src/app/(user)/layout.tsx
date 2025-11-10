import UserNavbar from "@/src/app/components/user/Navbar";
import Footer from "@/src/app/components/user/Footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserNavbar />
      {children}
      <Footer />
    </>
  );
}

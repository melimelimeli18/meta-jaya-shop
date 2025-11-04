import UserNavbar from '@/app/components/user/Navbar';
import Footer from '@/app/components/user/Footer';

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
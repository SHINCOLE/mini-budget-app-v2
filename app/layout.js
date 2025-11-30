import "./globals.css";
import Toast from "../components/Toast";

export const metadata = {
  title: "Mini Budget App",
  description: "Track your spending easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
        <Toast />
      </body>
    </html>
  );
}
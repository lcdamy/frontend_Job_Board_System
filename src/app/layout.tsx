import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import ReduxProvider from "@/store/ReduxProvider";
import NotificationList from "@/store/NotificationList";



export const metadata: Metadata = {
  title: "Isco Job",
  description: "A job board system for the Isco challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <NotificationList />
            <div>
              {children}
            </div>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

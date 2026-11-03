import AppProviders from "../components/providers/AppProviders";
import ApplicationLayout from "../components/layout/ApplicationLayout";
import "../styles/globals.css";

export const metadata = {
  title: "FoundersKit",
  description: "A considered toolkit for founders.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <ApplicationLayout>{children}</ApplicationLayout>
        </AppProviders>
      </body>
    </html>
  );
}

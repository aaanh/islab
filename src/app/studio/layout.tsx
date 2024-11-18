export const metadata = {
  title: "ISLAB | Studio",
  description: "Inertial Sensing Lab Content Editing Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

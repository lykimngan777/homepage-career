import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["vietnamese", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Keyreer | Unlock Your Career Path",
  description: "Khám phá hành trình tìm kiếm sự nghiệp và mục đích sống của bạn thông qua các mô hình khoa học RIASEC, Big Five và Schwartz.",
  keywords: "career path, định hướng nghề nghiệp, RIASEC, Big Five, Schwartz",
  openGraph: {
    title: "Keyreer - Hành Trình Tìm Kiếm Sứ Mệnh",
    description: "Hai ngày quan trọng nhất đời người là ngày bạn sinh ra và ngày bạn tìm ra lý do tại sao mình tồn tại.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${montserrat.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

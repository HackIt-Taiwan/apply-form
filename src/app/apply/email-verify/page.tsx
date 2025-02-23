import { verifyToken, TokenPayload } from "@/lib/jwt";
import { defaultIgnoreEncryption } from "@/models/common";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ auth: string }>;
}) {
  const jwt = (await searchParams)?.auth || "";

  // verify JWT and get user ID
  const payload: TokenPayload | null = verifyToken(jwt);
  if (!payload) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="logo-container mb-4 items-center justify-center">
            <p className="text-red-500 text-xl font-bold mt-8 mb-1">連結已過期或無效！</p>
          </div>
        </div>
      </div>
    );
  }

  switch (payload.role) {
    case "leader":
    case "member": {
      const memberData = {
        "_id": payload.userID,
        "email_verified": true,
        "ignore_encryption": defaultIgnoreEncryption
      }

      const databaseResponse = await fetch(`${process.env.DATABASE_API}/etc/edit/member`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DATABASE_AUTH_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (!databaseResponse.ok) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <div className="logo-container mb-4 items-center justify-center">
                <p className="text-red-500 text-xl font-bold mt-8 mb-1">驗證錯誤，請稍後在試。</p>
              </div>
            </div>
          </div>
        );
      }

      break;
    }

    case "teacher": {
      const teacherData = {
        "_id": payload.userID,
        "email_verified": true,
        "ignore_encryption": defaultIgnoreEncryption
      }

      const databaseResponse = await fetch(`${process.env.DATABASE_API}/etc/edit/teacher`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.DATABASE_AUTH_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      if (!databaseResponse.ok) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
              <div className="logo-container mb-4 items-center justify-center">
                <p className="text-red-500 text-xl font-bold mt-8 mb-1">驗證錯誤，請稍後在試。</p>
              </div>
            </div>
          </div>
        );
      }

      break;
    }

    default:
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="logo-container mb-4 items-center justify-center">
              <p className="text-red-500 text-xl font-bold mt-8 mb-1">連結已過期或無效！</p>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="logo-container mb-4 items-center justify-center">
          <h2 className="text-green-500 text-xl font-bold mt-8 mb-1">驗證成功!</h2>
          <p>你的電子郵件已成功驗證だよ～</p>
        </div>
      </div>
    </div>
  );
}

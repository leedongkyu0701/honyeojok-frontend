import MyPage from "@/features/auth/components/MyPage";
import AuthGuard from "@/features/auth/components/AuthGuard";
export default function AuthPage() {

  return(
    <AuthGuard>
      <MyPage />
    </AuthGuard>
  );
}
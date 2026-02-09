import LegalLayout from "@/components/auth/LegalLayout";
import LegalSection from "@/components/auth/LegalSection";

export const metadata = {
  title: "개인정보처리방침 | 혼여",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="개인정보처리방침" updatedAt="2026-01-29">
      <LegalSection title="1. 개인정보의 처리 목적">
        혼여는 다음 목적을 위해 개인정보를 처리합니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>회원 식별 및 로그인 처리(소셜 로그인 포함)</li>
          <li>커뮤니티 글/댓글 작성, 북마크 등 서비스 기능 제공</li>
          <li>서비스 운영/개선, 부정 이용 방지 및 보안 대응</li>
          <li>문의 응대 및 공지 전달</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. 처리하는 개인정보의 항목">
        서비스는 최소한의 개인정보만 수집합니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            필수: 소셜 로그인 식별자(provider, providerId), (동의 시) 이메일
          </li>
          <li>
            서비스 이용 과정에서 자동 생성될 수 있는 정보: 접속 로그, 쿠키(리프레시 토큰
            등 인증을 위한 쿠키), 기기/브라우저 정보(보안 목적)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. 개인정보의 처리 및 보유 기간">
        원칙적으로 회원 탈퇴 시 지체 없이 파기합니다. 단, 관계 법령에 따라 보관이 필요한
        경우 해당 기간 동안 보관할 수 있습니다. 또한 부정 이용 방지 및 분쟁 대응을 위해
        최소 기간 동안 일부 기록을 보관할 수 있습니다.
      </LegalSection>

      <LegalSection title="4. 개인정보의 제3자 제공">
        혼여족은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만
        법령에 근거가 있는 경우 또는 이용자의 별도 동의가 있는 경우 제공할 수 있습니다.
      </LegalSection>

      <LegalSection title="5. 개인정보 처리의 위탁">
        서비스 운영을 위해 아래와 같이 개인정보 처리를 위탁할 수 있습니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>소셜 로그인 제공자: 카카오, 구글, 네이버 (인증 목적)</li>
          <li>인프라/호스팅:Render, Vercel, Cloudflare</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. 이용자의 권리와 행사 방법">
        이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제, 처리정지 및 회원 탈퇴를
        요청할 수 있습니다. 요청은 서비스 내 기능 또는 아래 문의처를 통해 가능합니다.
      </LegalSection>

      <LegalSection title="7. 개인정보의 파기">
        개인정보 보유기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
        지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제합니다.
      </LegalSection>

      <LegalSection title="8. 쿠키의 사용">
        서비스는 로그인 유지 및 보안을 위해 쿠키(예: httpOnly 인증 쿠키)를 사용할 수 있습니다.
        이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부
        기능 이용에 제한이 있을 수 있습니다.
      </LegalSection>

      <LegalSection title="9. 개인정보 보호 책임자 및 문의">
        개인정보 처리 관련 문의는 아래 연락처로 가능합니다.
        <div className="mt-2 rounded-xl bg-neutral-50 p-4 text-sm">
          이메일: <span className="font-medium">honyeo259@gmail.com</span>
        </div>
      </LegalSection>

      <LegalSection title="10. 시행일">
        본 방침은 <span className="font-medium">2026-01-29</span>부터 적용됩니다.
      </LegalSection>
    </LegalLayout>
  );
}

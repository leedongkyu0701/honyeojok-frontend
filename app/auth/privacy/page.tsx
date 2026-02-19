import LegalLayout from "@/components/auth/LegalLayout";
import LegalSection from "@/components/auth/LegalSection";

export const metadata = {
  title: "개인정보처리방침 | 혼여",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="개인정보처리방침" updatedAt="2026-01-29">
      <LegalSection title="1. 개인정보의 처리 목적">
        혼여(이하 “서비스”)는 다음 목적을 위해 개인정보를 처리합니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>회원 식별 및 로그인 처리(소셜 로그인 포함)</li>
          <li>커뮤니티 글/댓글 작성, 북마크 등 서비스 기능 제공</li>
          <li>서비스 운영/개선, 부정 이용 방지 및 보안 대응</li>
          <li>문의 응대 및 공지 전달</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. 처리하는 개인정보의 항목">
        서비스는 원칙적으로 최소한의 개인정보만 수집·이용합니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            <span className="font-medium">필수</span>: 소셜 로그인
            식별정보(provider, providerId), 서비스 내 표시 닉네임
          </li>
          <li>
            <span className="font-medium">선택</span>: 이메일(소셜 제공자 동의
            및 제공 범위에 따라 수집될 수 있음)
          </li>
          <li>
            <span className="font-medium">자동 생성 정보</span>: 접속 로그, IP,
            쿠키/토큰 식별정보(로그인 유지 및 보안 목적), 기기/브라우저
            정보(부정 이용 탐지/보안)
          </li>
          <li>
            <span className="font-medium">이용자가 업로드하는 정보</span>:
            커뮤니티 글/댓글/이미지 등 콘텐츠(이용자가 게시하는 범위)
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. 개인정보의 처리 및 보유 기간">
        서비스는 원칙적으로{" "}
        <span className="font-medium">회원 탈퇴 시 지체 없이 파기</span>합니다.
        다만 다음의 경우는 예외로 보관할 수 있습니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>부정 이용 방지 및 분쟁 대응: 최소 범위에서 일정 기간 보관</li>
          <li>관계 법령에 따라 보관이 필요한 경우: 해당 법령에서 정한 기간</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. 개인정보의 제3자 제공">
        서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
        다만 법령에 근거가 있는 경우 또는 이용자의 별도 동의가 있는 경우 제공할
        수 있습니다.
        <div className="mt-2 text-sm text-neutral-600">
          ※ ‘제3자 제공’은 수탁(처리위탁)과 구별됩니다.
        </div>
      </LegalSection>

      <LegalSection title="5. 개인정보 처리의 위탁">
        서비스는 원활한 제공을 위해 다음과 같이 개인정보 처리를 위탁할 수
        있습니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>소셜 로그인 제공자(인증): 카카오, 구글, 네이버, 애플</li>
          <li>인프라/호스팅/배포(서비스 운영): Render, Vercel</li>
          <li>이미지/정적 파일 저장 및 전송(서비스 운영): Cloudflare</li>
        </ul>
        <div className="mt-2 text-sm text-neutral-600">
          서비스는 수탁자와 위탁업무 내용, 기술적·관리적 보호조치 등을 포함한
          계약을 체결하고 관리·감독합니다.
        </div>
      </LegalSection>

      <LegalSection title="6. 국외 이전">
        서비스는 클라우드 인프라/호스팅/저장소 제공 과정에서 개인정보가
        국외(또는 국외 서버를 경유)하여 처리·저장될 수 있습니다. 국외 이전이
        발생하는 경우, 이전되는 개인정보 항목, 이전 국가/이전받는 자(수탁자),
        이전 목적·방법 및 보유기간을 본 방침 또는 별도 고지를 통해 안내하고 관련
        법령에 따른 필요한 조치를 이행합니다.
      </LegalSection>

      <LegalSection title="7. 이용자의 권리와 행사 방법">
        이용자는 개인정보 열람, 정정, 삭제, 처리정지, 동의철회 및 회원탈퇴를
        요청할 수 있습니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>
            서비스 내 기능(회원탈퇴/닉네임 변경 등) 또는 문의처를 통해 요청
          </li>
          <li>요청 시 본인 확인 후 처리할 수 있습니다</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. 개인정보의 파기">
        보유기간 경과 또는 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
        지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제합니다.
      </LegalSection>

      <LegalSection title="9. 쿠키의 사용">
        서비스는 로그인 유지 및 보안을 위해 쿠키(예: httpOnly 인증 쿠키/리프레시
        토큰)를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을
        거부할 수 있으나, 이 경우 로그인 등 일부 기능 이용에 제한이 있을 수
        있습니다.
      </LegalSection>

      <LegalSection title="10. 안전성 확보 조치">
        서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취합니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>접근 통제 및 권한 관리</li>
          <li>전송구간 암호화(HTTPS 적용)</li>
          <li>보안 로그 모니터링 및 이상 징후 탐지</li>
          <li>취약점 점검 및 업데이트</li>
        </ul>
      </LegalSection>

      <LegalSection title="11. 아동(만 14세 미만) 개인정보">
        서비스는 원칙적으로 만 14세 미만 아동을 대상으로 하지 않습니다. 만 14세
        미만 아동의 개인정보를 수집한 사실을 인지하는 경우 지체 없이 파기 또는
        필요한 조치를 취합니다.
      </LegalSection>

      <LegalSection title="12. 개인정보 보호 책임자 및 문의">
        개인정보 처리 관련 문의는 아래 연락처로 가능합니다.
        <div className="mt-2 rounded-xl bg-neutral-50 p-4 text-sm">
          이메일: <span className="font-medium">honyeo259@gmail.com</span>
        </div>
      </LegalSection>

      <LegalSection title="13. 시행일 및 변경">
        본 방침은 <span className="font-medium">2026-01-29</span>부터
        적용됩니다. 내용 추가/삭제/수정이 있는 경우 서비스 내 공지 또는 본
        페이지를 통해 고지합니다.
      </LegalSection>
    </LegalLayout>
  );
}

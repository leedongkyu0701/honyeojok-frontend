import LegalLayout from "@/components/auth/LegalLayout";
import LegalSection from "@/components/auth/LegalSection";


export const metadata = {
  title: "이용약관 | 혼여",
};

export default function TermsPage() {
  return (
    <LegalLayout title="이용약관" updatedAt="2026-01-29">
      <LegalSection title="제1조 (목적)">
        본 약관은 혼여(이하 “서비스”)가 제공하는 기능(콘텐츠 열람, 커뮤니티 작성,
        북마크 등)의 이용과 관련하여 서비스와 이용자 간의 권리·의무 및 책임사항,
        기타 필요한 사항을 규정함을 목적으로 합니다.
      </LegalSection>

      <LegalSection title="제2조 (정의)">
        <ul className="list-disc pl-5 space-y-1">
          <li>“이용자”란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
          <li>“회원”이란 소셜 로그인 등을 통해 계정을 생성하고 서비스를 이용하는 자를 말합니다.</li>
          <li>“콘텐츠”란 이용자가 서비스에 게시하는 글/댓글/이미지 등 및 서비스가 제공하는 정보 일체를 말합니다.</li>
        </ul>
      </LegalSection>

      <LegalSection title="제3조 (약관의 게시 및 변경)">
        서비스는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 내에 게시합니다.
        서비스는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시
        적용일자 및 변경사유를 명시하여 공지합니다.
      </LegalSection>

      <LegalSection title="제4조 (회원가입 및 계정)">
        회원가입은 이용자가 소셜 로그인(카카오/구글/네이버 등)을 통해 인증을 완료하고
        서비스가 이를 승인함으로써 성립합니다. 이용자는 타인의 정보를 도용하거나
        부정한 방법으로 계정을 생성·이용할 수 없습니다.
      </LegalSection>

      <LegalSection title="제5조 (서비스 이용)">
        서비스는 연중무휴 제공을 원칙으로 하나, 시스템 점검/장애/천재지변 등 불가피한
        사유가 있는 경우 일시 중단될 수 있습니다.
      </LegalSection>

      <LegalSection title="제6조 (이용자의 의무)">
        이용자는 다음 행위를 하여서는 안 됩니다.
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>타인의 권리(저작권, 초상권 등) 침해</li>
          <li>불법/음란/혐오/차별/괴롭힘/스팸/광고성 게시물 등록</li>
          <li>서비스 운영을 방해하거나 비정상적인 접근을 시도하는 행위</li>
          <li>기타 관련 법령 또는 공서양속에 반하는 행위</li>
        </ul>
      </LegalSection>

      <LegalSection title="제7조 (게시물의 관리)">
        이용자가 작성한 게시물의 권리와 책임은 작성자에게 있습니다. 서비스는 관련 법령
        또는 본 약관을 위반하거나 타인의 권리를 침해하는 게시물에 대해 사전 통지 없이
        게시 중단, 삭제, 접근 제한 등의 조치를 할 수 있습니다.
      </LegalSection>

      <LegalSection title="제8조 (계약 해지 및 이용 제한)">
        이용자는 언제든지 서비스 내 기능을 통해 회원 탈퇴를 요청할 수 있습니다.
        서비스는 이용자가 본 약관을 위반하는 경우 서비스 이용을 제한하거나 계정을
        정지/해지할 수 있습니다.
      </LegalSection>

      <LegalSection title="제9조 (면책)">
        서비스는 이용자가 게시한 정보/콘텐츠의 정확성, 신뢰성에 대해 보증하지 않으며,
        이용자가 이를 신뢰하여 발생한 손해에 대해 책임을 지지 않습니다. 또한 불가항력
        또는 이용자 귀책 사유로 인한 서비스 장애에 대해서도 책임을 지지 않습니다.
      </LegalSection>

      <LegalSection title="제10조 (문의)">
        약관 및 서비스 이용 관련 문의는 아래 연락처로 가능합니다.
        <div className="mt-2 rounded-xl bg-neutral-50 p-4 text-sm">
          이메일: <span className="font-medium">honyeo259@gmail.com</span>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}

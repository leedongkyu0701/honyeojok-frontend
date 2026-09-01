# 혼여족 Frontend

혼자 여행하는 사용자를 위한 지역 기반 여행 정보·커뮤니티 플랫폼의 프론트엔드 프로젝트입니다.

## 서비스 링크

- 배포 사이트: `https://www.honyeojok.com`

> 학습용 프로젝트로, 백엔드 서버의 Cold Start로 인해 첫 요청 시 응답에 시간이 걸릴 수 있습니다.

## 프로젝트 소개

혼자 떠나는 여행에 필요한 여행지, 스팟, 추천 여행 루트 정보를 탐색하고 커뮤니티에 여행 경험을 공유할 수 있는 Next.js 웹 애플리케이션입니다.

## 주요 기능

- 지역·정렬 조건으로 여행지 탐색 및 지역 상세 정보 조회
- 카테고리별 핫스팟과 스팟 상세 정보 조회
- 추천 여행 루트 조회, Kakao Map 기반 일정·주변 스팟 표시, 북마크
- 후기·질문·일반 게시글 검색과 필터링, 이미지 포함 게시글 작성
- 게시글 좋아요, 댓글·답글 작성 및 삭제
- 카카오·구글·네이버 소셜 로그인, 닉네임 변경, 내 게시글·북마크 조회

## 기술 스택

- Framework: Next.js `16.1.1`, React `19.2.3`, TypeScript `5`
- Data fetching: TanStack Query `5.90.16`, Fetch API
- Client state: Zustand `5.0.10`
- Forms and validation: React Hook Form `7.71.2`, Zod `4.3.6`
- UI: Tailwind CSS `4`, Sonner, Lucide React
- Monitoring: Sentry `10.42.0`


## 주요 기술적 구현

### 인증 세션 복구

Access Token은 Zustand의 메모리 상태에만 보관합니다. 앱 시작 시 `AuthProvider`가 HttpOnly Refresh Token 쿠키를 이용해 세션을 복구하고, 확인이 끝나기 전에는 보호 라우트를 로딩 상태로 유지합니다.

### Fetch Client

`shared/api/fetchClient`가 API base URL, `Authorization` 헤더, `credentials`, FormData의 `Content-Type` 처리를 담당합니다. 공개 API는 공통 옵션으로 쿠키와 인증 헤더를 보내지 않으며, 도메인별 endpoint 함수는 각 feature의 `api` 폴더에 둡니다.

### Refresh 요청 중복 방지

초기 세션 복구와 만료된 Access Token의 재발급은 하나의 Promise를 공유합니다. 만료·유효하지 않은 토큰 코드에만 재발급을 시도하고, 성공하면 원래 요청을 한 번만 재시도합니다. 재발급에 실패하거나 재발급 대상이 아닌 인증 오류라면 클라이언트 인증 상태를 비웁니다.

### TanStack Query 전역 정책

QueryClient는 한 번만 생성합니다. 기본 조회 캐시는 5분 동안 fresh, 30분 동안 유지하며 창 포커스 재요청을 끕니다. 4xx 응답은 재시도하지 않고 네트워크·5xx 오류만 한 번 제한적으로 재시도합니다. Mutation은 자동 재시도하지 않으며, 페이지가 직접 처리하는 오류는 `meta.silent`로 전역 toast를 끌 수 있습니다.

### 오류 처리 및 Sentry

공통 API 오류를 `ApiError`로 변환하고, 인증·rate limit·일반 4xx 응답은 Sentry 보고 대상에서 제외합니다. Query는 화면의 오류 상태를 우선하며, 인증·rate limit toast만 제한적으로 중복 방지합니다. Mutation은 사용자 액션 실패를 toast로 알리고, 운영 확인이 필요한 오류를 Sentry에 보냅니다.

### 기능 중심 폴더 구조

라우팅과 전역 Provider는 `app`, 도메인별 UI·API·스키마·상태는 `features`, 여러 도메인에서 재사용하는 API 클라이언트·UI·유틸리티는 `shared`에 둡니다.

## 프로젝트 구조

```text
app/
├── (site)/             # 공개·인증·보호 라우트와 공통 레이아웃
├── _providers/         # 인증, TanStack Query Provider
└── layout.tsx          # Metadata, Toaster, 전역 스타일 연결
features/
├── auth/               # 소셜 로그인, 마이페이지, 인증 상태
├── community/          # 게시글, 댓글, 폼 스키마, 쿼리 키
├── destination/        # 여행지 목록·상세 API와 UI
├── home/               # 홈 화면 섹션
├── region/             # 지역 상세 화면 구성
├── spot/               # 스팟 목록·상세
└── trip-route/         # 여행 루트·북마크·지도
shared/
├── api/                # Fetch Client, 오류 파싱, refresh 처리
├── hooks/              # 공통 Hook
├── layout/             # Navbar, Footer
├── ui/                 # 재사용 UI 컴포넌트
└── lib/                # 도메인 비종속 유틸리티
```

## 실행 방법

### 요구 환경

- Node.js `20` 이상
- 실행 가능한 백엔드 API 서버

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | Production build 생성 |
| `npm run start` | Production 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run type-check` | TypeScript 검사 |

## 기술적 고민

- Access Token을 영속 저장소에 두지 않고, 새로고침 시 Refresh Token 쿠키로 세션을 복구하도록 구성했습니다.
- 여러 요청이 동시에 401을 받는 경우에도 refresh 요청은 한 번만 수행하고, 원래 요청은 한 번만 재시도하도록 했습니다.
- 화면별 오류 상태와 전역 알림이 충돌하지 않도록 Query와 Mutation의 오류 정책을 분리했습니다.
- 커뮤니티 입력값은 Zod 스키마를 기준으로 검증하고, 서버 응답 검증이 필요한 커뮤니티 API에는 런타임 스키마를 적용했습니다.

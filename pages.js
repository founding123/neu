/* ============================================================
   사이트 설정 — 강의 정보의 단일 출처

   ▣ 구조 요약 (정보는 한 곳에만 적는다)
       TOC_ENC        번호 → [강의 제목, 교수 이름]   ← 강의 목록의 전부
       PROF_NOTE_ENC  교수 이름 → 한 줄 평
       SITE_ENC       사이트 문구 (제목·강조어·라벨·태그라인·과목명)

     예전의 PAGE_NUMBERS 배열은 없어졌다. 페이지 번호 목록은
     TOC_ENC의 키에서 자동으로 나온다. PROF_ENC도 필요 없다 —
     교수 이름이 TOC_ENC 안에 함께 있기 때문이다.

   ▣ 새 페이지 추가하는 법 (이제 두 단계뿐)
     1) 파일을 neuroNNNN.html 이름으로 올린다.
        예) neuro0100.html, neuro3050.html
     2) 아래 TOC_ENC에 한 줄을 추가한다.
        예) "3050": ["새 강의 제목", "홍길동"],
     끝. 목차·이전/다음 페이저·문항 페이지 h1·교수별 묶기가
     전부 이 한 줄을 읽는다.

   ▣ TOC_ENC 항목 형식
       "번호": ["강의 제목", "교수 이름"]

     · 교수 칸("")을 비워 두면: 예전 방식대로 그 페이지의
       pageMetaPayload subtitle("22: 이름;")을 내려받아 읽는다.
       (기존에 배포한 파일들은 그대로 동작한다는 뜻)
     · 교수 칸을 채우면: 파일을 하나도 내려받지 않고 즉시
       교수별 묶기가 된다. 채우는 쪽을 권장.
     · 옛 형식 "번호": "강의 제목" (문자열만)도 계속 읽힌다.
     · 교수 이름 뒤에 부가 정보를 붙이려면 구분자를 하나 둔다.
       구분자부터 뒤는 이름에서 잘려 나간다.
         쓸 수 있는 구분자 :  (   [   ·   ,   /   |   그리고 전각 형태
         "홍길동 (신규 강의)"  → 홍길동
       ('-'와 '.'은 구분자가 아니다. 'Kim Sung-ho', 'Prof. Kim'이 잘리므로.)

   ▣ 암호화하는 법 (모든 *_ENC 공통)
     평문 JSON을 파일로 저장한 뒤 동일한 비밀번호로 암호화해
     아래 해당 자리에 붙여 넣는다.
          python tools/encrypt_fragment.py toc.json --password <비밀번호>
     아직 암호화하지 않은 평문 JSON도 그대로 읽히므로(개발용),
     로컬에서 먼저 확인하고 배포 전에 암호화하면 된다.
   ============================================================ */

/* ▣ 사이트 문구
     title/highlight/eyebrow/tagline : 목차(index) 화면의 문구
     subject : 문항 페이지 상단의 작은 라벨(eyebrow) 기본값.
               예전엔 모든 neuro 파일마다 "근골격학"을 반복해 적었지만,
               이제 여기 한 곳만 적으면 된다.
               (특정 페이지만 다르게 하려면 그 페이지 pageMetaPayload에
                "eyebrow"를 적으면 그 값이 우선한다) */

window.SITE_ENC =
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "eKmBQWUN0UTDgYOJeW9z5A==",
  "iv": "qeFidIKYUUquy/Fk",
  "data": "J7wHc42hhtG/ZJ/XDB/Pn0GKymA52pGNOpA1fwdCvGfNVXj0uM3euwy9lXlTPdXZZapGvcquaHhcJdsEoJDPzrMGbb/mrpHR0na3CPw6KcaPaTWfTo5ZEtzC6AY4mLrIsAH/gndZEeYJIL3vtselzKXzpIsfSZP77qMYMt8w7pqrSX664YieDcOMUgT5/mvO1299UEUfi/QtxUqVLIDR6lysyePQ9919BAp4eE8ehgFdSZAC/0OpS2dLB2uVDD3Rq3eM6+HHRg=="
}
;

/* ▣ 강의 목록 — 번호 → [제목, 교수]  (단일 출처)
     교수 칸은 지금 비워 두었다. 채워 넣는 즉시 '교수별' 묶기가
     파일 스캔 없이 바로 동작한다. */

window.TOC_ENC =
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "eKmBQWUN0UTDgYOJeW9z5A==",
  "iv": "rk8yGOP5RbuJSyM/",
  "data": "uJ1RCa7WKaToIw1OuEjaTj4xKtL0Ux0Lyge+Es0TSYNB/qNoDR8AhYqArLQLsmuGUHrBY68w3dQrFlBUW1GRhg=="
}
;

/* ▣ 교수 한 줄 평 — 교수 이름 → 한 줄
     목차를 교수별로 묶으면 머리글에 이름과 함께 이 한 줄이 뜬다.

     · 한 줄 평은 '강의'가 아니라 '교수'에 붙는다. 강의가 5개여도 한 번만.
     · 키 = TOC_ENC에 적은 교수 이름(또는 subtitle에서 뽑힌 이름).
       '홍길동.'처럼 마침표가 붙어도 같은 규칙으로 맞춰 준다.
     · 안 적은 교수는 이름만 뜬다. 통째로 지워도 동작한다. */

window.PROF_NOTE_ENC =
{
  "kdf": "PBKDF2",
  "hash": "SHA-256",
  "iterations": 600000,
  "cipher": "AES-GCM",
  "salt": "eKmBQWUN0UTDgYOJeW9z5A==",
  "iv": "xwUnlHyqnxqE4ut/",
  "data": "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"
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.

window.FILE_PREFIX = 'neuro';

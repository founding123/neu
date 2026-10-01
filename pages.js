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
     1) 파일을 neuNNNN.html 이름으로 올린다.
        예) neu0100.html, neu3050.html
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
               예전엔 모든 neu 파일마다 "근골격학"을 반복해 적었지만,
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
  "iv": "xvvX30F2sDFBEw3i",
  "data": "U4Qi6XzY8n9ZfdbcZGABcADWutskeQjIuOz3GEoiWhrCH0TmU4s7GbKWUGEiZzDnLiTUSyzlbU4g5gL1z8zVdBwKNYGQZVbSi2DQKl3HtLSHWyoIvmplKwhS5DIldRAmls3KKEMlGuLSo7mmrz2bLDNyfTqav8xqBLWL9YiHcklDI3TAWC153uJ+rf7lxhEdIeCopz49/jFiEUN/d/KaqFmg0q43oZGPK2awWfWxJIk9w4/jiJynd37KNqDdVRnFgHt6SiiFrcv7k3wMiw0V7RbXsnJ0X4OEg9NTnZTnwvPQBR3MKN1hJw+Fr6U4mcpSeAxx0L+gy0FD1KDN4LmeKN4GWV3CXi15z1F7bC1c1XqeCwY1+7+jI4hTcBa90JGuUmXo4iDWkTO2iXJciOv2hDKV3qwdm7LKDVWl2KW64Nv6TneaxB2ujIj/AWBdq+8XxxGs19ji8Gzrm6qZ84r3XT6DnhYz4vTJVv5rWuKoASpTADq54hvM+tm8qDU93fSMmMsQuwm0FN6skSzveKenoKbrG+Mh8eqO3SkdF7nZeHCybce0kddqtH5da/WSE5w8BVFkKVjs3wJV8jX6DY6e08iyMkPzkwGPspBCw39OtnI9SomaZPh3RAn44bsSb4VNdOeAsnujx36B7W9bvcFaOszeujGtQA9X+4wyjl+9zZs5OExmWRFqiUdwLYlyf0tPVoItGNdhLqxAqL2diSMgqr1EjfczL/Err7Q4z/r8taXrbD+6YC72p0+o6Pse/OOsjf7ANWDTtFdBk3WYhJ1kIoldFdvQwtDTlI6fbWPDxf65yENea1sBoAk/G8ZG4EBvKG+zRuBEXFXAOUJPd/tbDC5p7qXwpDXhqNzO4ioJlTTTCTrM4JKqzqJ0pX6+/BVUpwGtxWrDNDFdhzZx40j9iGLs5n14fpw9PA=="
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
  "iv": "LdHDjiLgZ9GLgmYW",
  "data": "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"
}
;

// 파일명 접두어 — index.html과 assets/question_set.js가 이 값을 읽는다.
// 파일명 규칙이 바뀌면 여기 한 곳만 고친다.

window.FILE_PREFIX = 'neu';

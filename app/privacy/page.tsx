import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리방침 | 1MINSTOCK',
  description: '1MINSTOCK 개인정보 처리방침',
};

export default function PrivacyPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-[18px] p-5 mb-3.5 text-white">
        <h1 className="text-[22px] font-bold tracking-tight mb-1.5">개인정보 처리방침</h1>
        <p className="text-xs opacity-90">최종 업데이트: 2026년 4월 27일</p>
      </div>
      
      <div className="bg-white rounded-2xl p-5 mb-3.5 border border-emerald-700/10">
        <p className="text-[13px] text-text-secondary leading-relaxed mb-5.5 p-3.5 bg-bg-page rounded-[10px]">
          1MINSTOCK(이하 "사이트")은 개인정보보호법 제30조에 따라 이용자의 개인정보를 보호하고 권익을 존중하기 위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        </p>
        
        <Section title="제1조 (수집하는 개인정보 항목)">
          사이트는 회원가입 없이 이용 가능한 서비스이며, 다음 정보만 자동 수집합니다:
          <Box>
            <strong className="text-text-primary font-semibold">자동 수집 항목</strong><br/>
            · IP 주소<br/>
            · 쿠키 (사용자 환경 설정)<br/>
            · 접속 일시 및 접속 페이지<br/>
            · 브라우저 종류 및 OS<br/>
            · 검색 종목 기록 (브라우저 쿠키)
          </Box>
        </Section>
        
        <Section title="제2조 (개인정보의 이용 목적)">
          수집된 정보는 다음 목적으로만 이용됩니다:
          <List>
            <li>① 서비스 이용 통계 분석</li>
            <li>② 사이트 품질 개선</li>
            <li>③ 부정 이용 방지</li>
            <li>④ 광고 제공 (Kakao AdFit, Google AdSense)</li>
          </List>
        </Section>
        
        <Section title="제3조 (개인정보의 보유 및 이용 기간)">
          ① IP 주소 및 접속 기록: 통신비밀보호법에 따라 3개월 보관 후 파기<br/>
          ② 쿠키: 이용자가 브라우저에서 직접 삭제 가능<br/>
          ③ 검색 기록: 브라우저 쿠키에 저장되며 사용자가 삭제 가능
        </Section>
        
        <Section title="제4조 (쿠키 사용)">
          ① 사이트는 이용자 편의를 위해 쿠키(Cookie)를 사용합니다.<br/>
          ② 광고 제공을 위해 제3자(Kakao, Google)의 쿠키가 사용될 수 있습니다.<br/>
          ③ 이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으며, 이 경우 일부 서비스 이용이 제한될 수 있습니다.
        </Section>
        
        <Section title="제5조 (개인정보의 제3자 제공)">
          사이트는 이용자의 개인정보를 외부에 제공하지 않습니다. 단, 다음의 경우 예외로 합니다:
          <List>
            <li>① 이용자가 사전에 동의한 경우</li>
            <li>② 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </List>
        </Section>
        
        <Section title="제6조 (광고 파트너)">
          사이트는 다음 광고 파트너와 협력하며, 각 파트너의 쿠키 정책을 따릅니다:
          <Box>
            · <strong className="text-text-primary font-semibold">Kakao AdFit</strong>: 카카오 광고 정책<br/>
            · <strong className="text-text-primary font-semibold">Google AdSense</strong>: 구글 광고 정책
          </Box>
          이용자는 각 파트너 사이트에서 광고 맞춤화 설정을 변경할 수 있습니다.
        </Section>
        
        <Section title="제7조 (이용자의 권리)">
          이용자는 언제든지 다음 권리를 행사할 수 있습니다:
          <List>
            <li>① 개인정보 처리 현황 통지 요구</li>
            <li>② 개인정보 열람·정정·삭제 요구</li>
            <li>③ 개인정보 처리 정지 요구</li>
          </List>
          행사 방법: <a href="mailto:77rrr11@gmail.com" className="text-emerald-700 hover:underline">77rrr11@gmail.com</a>
        </Section>
        
        <Section title="제8조 (개인정보 보호책임자)">
          <Box>
            <strong className="text-text-primary font-semibold">개인정보 보호책임자</strong><br/>
            · 운영: 벨롱스<br/>
            · 이메일: <a href="mailto:77rrr11@gmail.com" className="text-emerald-700 hover:underline">77rrr11@gmail.com</a><br/>
            · 신고/문의: <a href="mailto:77rrr11@gmail.com" className="text-emerald-700 hover:underline">77rrr11@gmail.com</a>
          </Box>
        </Section>
        
        <Section title="제9조 (권익침해 구제방법)">
          개인정보 침해 시 다음 기관에 도움을 요청할 수 있습니다:
          <List>
            <li>· 개인정보분쟁조정위원회 (1833-6972)</li>
            <li>· 개인정보침해신고센터 (privacy.kisa.or.kr / 118)</li>
            <li>· 대검찰청 사이버수사과 (1301)</li>
            <li>· 경찰청 사이버수사국 (cyberbureau.police.go.kr / 182)</li>
          </List>
        </Section>
        
        <Section title="제10조 (방침 변경)" last>
          본 처리방침은 법령 변경, 운영 정책 변경 시 개정될 수 있으며, 변경 시 사이트 공지사항을 통해 안내합니다.
        </Section>
      </div>
      
      <div className="text-center py-3.5 px-3">
        <div className="text-xs text-text-muted">
          개인정보 관련 문의: <a href="mailto:77rrr11@gmail.com" className="hover:text-emerald-700">77rrr11@gmail.com</a><br/>
          © 2026 1MINSTOCK
        </div>
      </div>
    </>
  );
}

function Section({ title, children, last = false }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <>
      <h2 className="text-base font-bold text-text-primary tracking-tight mb-3 mt-1">
        {title}
      </h2>
      <div className={`text-[13px] text-text-secondary leading-relaxed ${last ? '' : 'mb-5.5'}`}>
        {children}
      </div>
    </>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-3.5 mt-1.5">
      {children}
    </div>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-bg-page rounded-[10px] mt-2">
      {children}
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 1MINSTOCK',
  description: '1MINSTOCK 서비스 이용약관',
};

export default function TermsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-600 rounded-[18px] p-5 mb-3.5 text-white">
        <h1 className="text-[22px] font-bold tracking-tight mb-1.5">이용약관</h1>
        <p className="text-xs opacity-90">최종 업데이트: 2026년 4월 27일</p>
      </div>
      
      <div className="bg-white rounded-2xl p-5 mb-3.5 border border-emerald-700/10">
        <Section title="제1조 (목적)">
          본 약관은 1MINSTOCK(이하 "사이트")이 제공하는 주식 정보 조회 서비스의 이용에 관한 사항을 규정합니다.
        </Section>
        
        <Section title="제2조 (서비스의 내용)">
          사이트는 다음의 정보를 제공합니다:
          <List>
            <li>① 한국거래소 상장 종목의 시세 및 거래 정보</li>
            <li>② 종목별 재무 정보 및 가치 평가 지표</li>
            <li>③ 외국인·기관 투자자 매매 동향</li>
            <li>④ 한국거래소 지정 관리종목·환기종목·거래정지 정보</li>
            <li>⑤ 기타 공시 및 일정 정보</li>
          </List>
        </Section>
        
        <Section title="제3조 (서비스의 성격)">
          ① 사이트는 자본시장과 금융투자업에 관한 법률에 따른 투자자문업체가 아닙니다.<br/>
          ② 사이트가 제공하는 모든 정보는 단순 정보 제공 목적이며, 특정 종목의 매수·매도를 권유하지 않습니다.<br/>
          ③ 사이트는 종목에 대한 평가나 추천을 제공하지 않습니다.
        </Section>
        
        <Section title="제4조 (이용자의 책임)">
          ① 이용자는 사이트의 정보를 참고용으로만 사용해야 합니다.<br/>
          ② 모든 투자 판단과 그에 따른 결과는 이용자 본인의 책임입니다.<br/>
          ③ 이용자는 투자 결정 전 반드시 공식 출처(DART, 한국거래소 등)에서 직접 확인해야 합니다.
        </Section>
        
        <Section title="제5조 (면책조항)">
          ① 사이트는 제공 정보의 정확성·완전성·적시성을 보증하지 않습니다.<br/>
          ② 데이터는 외부 출처(네이버 금융, DART, KIND 등)에서 자동 수집되어 표시되며, 실제와 차이가 있을 수 있습니다.<br/>
          ③ 사이트 정보를 근거로 한 투자 결정으로 인한 손실에 대해 사이트 운영자는 책임지지 않습니다.<br/>
          ④ 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임지지 않습니다.
        </Section>
        
        <Section title="제6조 (저작권 및 데이터 출처)">
          ① 사이트에 표시되는 데이터의 원 출처는 다음과 같습니다:
          <List>
            <li>· 시세 정보: 네이버 금융</li>
            <li>· 공시 정보: 금융감독원 DART</li>
            <li>· 거래소 정보: 한국거래소 KIND</li>
          </List>
          ② 사이트의 디자인, 로고, 콘텐츠 구성은 1MINSTOCK의 저작물입니다.
        </Section>
        
        <Section title="제7조 (광고)">
          사이트는 운영을 위해 광고를 게재하며, 광고는 "AD" 또는 "광고" 표시를 통해 명확히 구분됩니다.
        </Section>
        
        <Section title="제8조 (이용 제한)">
          다음 행위 시 사이트 이용이 제한될 수 있습니다:
          <List>
            <li>① 자동화된 도구로 데이터를 무단 수집하는 행위</li>
            <li>② 사이트 시스템에 부담을 주는 행위</li>
            <li>③ 타인의 권리를 침해하는 행위</li>
          </List>
        </Section>
        
        <Section title="제9조 (약관의 변경)">
          본 약관은 관련 법령 변경 또는 서비스 정책 변경 시 개정될 수 있으며, 변경 시 사이트에 공지합니다.
        </Section>
        
        <Section title="제10조 (분쟁 해결)" last>
          본 약관과 관련된 분쟁은 대한민국 법령에 따르며, 관할 법원은 운영자의 주소지 관할 법원으로 합니다.
        </Section>
      </div>
      
      <div className="bg-amber-100 rounded-xl p-3.5 px-4 mb-3.5 border-l-[3px] border-amber-500">
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">⚠️ 필독</strong><br/>
          본 사이트는 단순 정보 제공 서비스이며, 투자자문업·투자일임업·투자중개업체가 아닙니다. 모든 투자 판단과 그 결과는 이용자 본인의 책임이며, 투자로 인한 손실에 대해 운영자는 어떠한 책임도 지지 않습니다.
        </div>
      </div>
      
      <div className="text-center py-3.5 px-3">
        <div className="text-xs text-text-muted">
          운영: 벨롱스 · 문의: <a href="mailto:77rrr11@gmail.com" className="hover:text-emerald-700">77rrr11@gmail.com</a><br/>
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

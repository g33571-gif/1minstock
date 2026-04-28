// DART API - 전체 종목 자동 매핑
// CORPCODE.xml을 다운로드해서 메모리에 캐싱

import axios from 'axios';
import * as zlib from 'zlib';
import { promisify } from 'util';

const inflateRaw = promisify(zlib.inflateRaw);

interface DartCompanyInfo {
  ceo: string;
  headquarters: string;
  ipoDate: string;
  homepage: string;
  industry: string;
}

const DART_API_KEY = process.env.DART_API_KEY || '';
const DART_BASE_URL = 'https://opendart.fss.or.kr/api';

// 메모리 캐시 (서버 재시작 전까지 유지)
let corpCodeCache: Record<string, string> | null = null;
let corpCodeCacheTime: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24시간

/**
 * CORPCODE.xml을 다운로드해서 종목코드 → 회사 고유번호 매핑 생성
 */
async function loadCorpCodeMap(): Promise<Record<string, string>> {
  const now = Date.now();
  
  // 캐시가 있고 24시간 이내면 사용
  if (corpCodeCache && (now - corpCodeCacheTime) < CACHE_TTL) {
    return corpCodeCache;
  }
  
  if (!DART_API_KEY) {
    console.warn('[DART] API key not set');
    return {};
  }
  
  try {
    // DART CORPCODE.xml 다운로드 (zip 형태)
    const response = await axios.get(
      `${DART_BASE_URL}/corpCode.xml?crtfc_key=${DART_API_KEY}`,
      {
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );
    
    const zipBuffer = Buffer.from(response.data);
    
    // ZIP 파일 파싱 (간단한 ZIP 구조)
    // ZIP 내부 파일: CORPCODE.xml
    
    // ZIP 헤더 시그니처: PK\x03\x04
    let xmlContent = '';
    
    // 간단한 ZIP 파서
    let offset = 0;
    while (offset < zipBuffer.length - 4) {
      const sig = zipBuffer.readUInt32LE(offset);
      if (sig === 0x04034b50) { // Local file header
        const compressedSize = zipBuffer.readUInt32LE(offset + 18);
        const uncompressedSize = zipBuffer.readUInt32LE(offset + 22);
        const fileNameLen = zipBuffer.readUInt16LE(offset + 26);
        const extraLen = zipBuffer.readUInt16LE(offset + 28);
        const compressionMethod = zipBuffer.readUInt16LE(offset + 8);
        
        const dataStart = offset + 30 + fileNameLen + extraLen;
        const compressedData = zipBuffer.slice(dataStart, dataStart + compressedSize);
        
        if (compressionMethod === 8) {
          // Deflate
          const decompressed = await inflateRaw(compressedData);
          xmlContent = decompressed.toString('utf-8');
        } else if (compressionMethod === 0) {
          // No compression
          xmlContent = compressedData.toString('utf-8');
        }
        
        break;
      }
      offset++;
    }
    
    if (!xmlContent) {
      console.warn('[DART] CORPCODE.xml decompression failed');
      return {};
    }
    
    // XML 파싱 (간단한 정규식)
    const map: Record<string, string> = {};
    
    // <list>...<corp_code>...</corp_code>...<stock_code>...</stock_code>...</list>
    const listRegex = /<list>([\s\S]*?)<\/list>/g;
    let match;
    
    while ((match = listRegex.exec(xmlContent)) !== null) {
      const listContent = match[1];
      const corpCodeMatch = listContent.match(/<corp_code>([^<]+)<\/corp_code>/);
      const stockCodeMatch = listContent.match(/<stock_code>([^<]+)<\/stock_code>/);
      
      if (corpCodeMatch && stockCodeMatch) {
        const corpCode = corpCodeMatch[1].trim();
        const stockCode = stockCodeMatch[1].trim();
        
        // 6자리 종목코드만 사용
        if (/^\d{6}$/.test(stockCode)) {
          map[stockCode] = corpCode;
        }
      }
    }
    
    corpCodeCache = map;
    corpCodeCacheTime = now;
    
    console.log(`[DART] Loaded ${Object.keys(map).length} corp codes`);
    
    return map;
  } catch (error) {
    console.error('[DART] Failed to load CORPCODE.xml:', error);
    return corpCodeCache || {};
  }
}

/**
 * DART에서 회사 기본 정보 가져오기
 */
export async function fetchDartCompany(stockCode: string): Promise<DartCompanyInfo | null> {
  if (!DART_API_KEY) {
    return null;
  }

  try {
    // 종목 코드 → 회사 고유번호
    const corpCodeMap = await loadCorpCodeMap();
    const corpCode = corpCodeMap[stockCode];
    
    if (!corpCode) {
      return null;
    }

    // 회사 정보 조회
    const response = await axios.get(
      `${DART_BASE_URL}/company.json?crtfc_key=${DART_API_KEY}&corp_code=${corpCode}`,
      { timeout: 10000 }
    );

    if (response.status !== 200) return null;

    const data = response.data;
    if (data.status !== '000') return null;

    return {
      ceo: data.ceo_nm || '-',
      headquarters: data.adres ? data.adres.split(' ').slice(0, 2).join(' ') : '-',
      ipoDate: formatDate(data.est_dt),
      homepage: data.hm_url || '',
      industry: data.induty_code || '',
    };
  } catch (error) {
    console.error(`[DART Company] Error for ${stockCode}:`, error);
    return null;
  }
}

/**
 * 날짜 포맷팅 (YYYYMMDD → YYYY.MM)
 */
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length < 6) return '-';
  return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}`;
}

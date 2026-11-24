import { api } from '@/api/axios';
import { OCR_STTS_GROUP } from './processingLabels';

/**
 * [관리자 처리 현황 API]
 * - 영수증 OCR: 실제 API. 계약은 백엔드 `docs/api/receipt.md` `/admin/processing/receipts` 두 행
 * - 캐릭터 생성: 실제 API. 계약은 백엔드 `docs/api/pet.md` `/admin/processing/character-jobs` 행
 * - 검사결과지 분석: 실제 API. 계약은 백엔드 `docs/api/global.md` `/admin/processing/pdf-analyses` 행
 * - 결과 내용(OCR 응답·건강기록·이미지 결과)은 받지 않음
 */

/** 영수증 처리 상태 목록: [{ comCd, comCdNm, sortSeq }] */
export const getOcrStatuses = () =>
  api.get('/common-codes', { params: { prntComCd: OCR_STTS_GROUP } });

/** 영수증 원본 이미지 주소(비공개, useFileImage용) */
export const getReceiptImageUrl = (recptSn) =>
  `/admin/processing/receipts/${recptSn}/image`;

/** 값이 없는 칸(undefined·null·빈 문자열)은 보내지 않는다 */
const compactParams = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

/**
 * 영수증 OCR 현황: { summary: { totCnt, scsCnt, failCnt, prcsCnt, errCnt }, content, page, size, totalElements, totalPages, hasNext }
 * - params: page(1부터)·size·fromYmd·toYmd(YYYY-MM-DD)·ocrDmndSrcCd·ocrPrcsSttsCd, 값이 없는 칸은 보내지 않는다
 * - summary는 현재 상태 기준(기간·출처만 걸고 상태 필터와 무관), 목록은 상태까지 건 것(최신순)
 * - 행: recptSn, mbrSn, mbrNcnm, ocrDmndSrcCd, ocrPrcsSttsCd, regDt
 * - 오류: 400 INVALID_INPUT_VALUE(fromYmd > toYmd, 모르는 출처·상태 코드)
 */
export const getAdminReceipts = (params = {}) =>
  api.get('/admin/processing/receipts', {
    params: compactParams(params),
  });

/**
 * 캐릭터 생성 현황: { sttsCnts: [{ crtJobSttsCd, cnt }], content: [{ charCrtJobSn, mbrSn, mbrNcnm, crtJobSttsCd, failRsn, otoInqrySn, regDt }], page, size, totalElements, totalPages, hasNext }
 * - sttsCnts는 CHRG01 네 상태를 순서대로, 상태 필터와 무관. 목록만 상태 필터를 건다
 * - 결과 이미지·원본 사진은 받지 않음. 모르는 상태 코드는 400 INVALID_INPUT_VALUE
 */
export const getAdminCharacterJobs = (params = {}) =>
  api.get('/admin/processing/character-jobs', {
    params: compactParams(params),
  });

/**
 * 검사결과지 분석 현황: { summary: { totCnt, scsCnt, tmotCnt, errCnt }, content: [{ extlApiCallLogSn, callRsltCd, failRsn, callDt }], page, size, totalElements, totalPages, hasNext }
 * - params: page(1부터)·size·fromYmd·toYmd(YYYY-MM-DD, 호출일 양끝 포함), 모두 선택
 * - summary는 기간 안 전체 건수, 목록은 실패·시간초과만(최신순). 검사결과지가 아닌 파일은 서버가 성공으로 센다
 * - 분석 결과 내용은 받지 않음. 오류: 400 INVALID_INPUT_VALUE(fromYmd > toYmd)
 */
export const getAdminPdfAnalyses = ({ page = 1, size = 20, ...rest } = {}) =>
  api.get('/admin/processing/pdf-analyses', {
    params: compactParams({ page, size, ...rest }),
  });

import { RentalItem, ItemStatus } from './types';

export const DEFAULT_RENTAL_DAYS = 3;

export const INITIAL_ITEMS: RentalItem[] = [
  {
    id: '1',
    name: 'DSLR 카메라 키트',
    category: '전자기기',
    description: 'Canon EOS 5D Mark IV 및 24-70mm 렌즈 포함. 사진 촬영 실습에 적합합니다.',
    status: ItemStatus.AVAILABLE,
  },
  {
    id: '2',
    name: '캠핑 텐트 (4인용)',
    category: '아웃도어',
    description: '방수 기능이 있는 돔형 텐트입니다. 설치가 간편하며 레인플라이가 포함되어 있습니다.',
    status: ItemStatus.AVAILABLE,
  },
  {
    id: '3',
    name: '무선 프로젝터',
    category: '전자기기',
    description: 'HDMI 및 블루투스를 지원하는 고화질 휴대용 프로젝터입니다.',
    status: ItemStatus.RENTED,
    renter: {
      name: '홍길동',
      contact: '01012345678',
      rentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      expectedReturnDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // in 4 days
    }
  },
  {
    id: '4',
    name: '전동 드릴 세트',
    category: '공구',
    description: '무선 전동 드릴과 배터리 2개, 비트 세트가 포함되어 있습니다.',
    status: ItemStatus.AVAILABLE,
  },
  {
    id: '5',
    name: '접이식 자전거',
    category: '스포츠',
    description: '경량 알루미늄 프레임, 7단 기어 시스템이 장착되어 있습니다.',
    status: ItemStatus.AVAILABLE,
  },
  {
    id: '6',
    name: '블루투스 스피커',
    category: '전자기기',
    description: '방수 기능이 있으며 최대 20시간 배터리가 지속되는 휴대용 스피커입니다.',
    status: ItemStatus.RENTED,
    renter: {
      name: '김철수',
      contact: '01098765432',
      rentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (overdue)
      expectedReturnDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // yesterday
    }
  }
];
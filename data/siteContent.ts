interface Project {
  id: string;
  title: string;
  period: string;
  overview: string;
  description: string;
  image: string;
  category: string;
}

interface SiteContent {
  hero: {
    title: string;
    titleHighlight: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  about: {
    title: string;
    vision: {
      title: string;
      content: string[];
    };
    values: {
      title: string;
      items: string[];
    };
  };
  services: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  contact: {
    title: string;
    form: {
      name: {
        label: string;
        placeholder: string;
      };
      email: {
        label: string;
        placeholder: string;
      };
      message: {
        label: string;
        placeholder: string;
      };
      submit: string;
    };
  };
  projects: {
    title: string;
    items: Project[];
  };
}

export const siteContent: SiteContent = {
  hero: {
    title: '혁신적인 기술로\n더 나은 미래를 만듭니다',
    titleHighlight: '혁신적인 기술',
    description: '최신 기술과 창의적인 솔루션으로\n비즈니스의 성장을 지원합니다',
    primaryButton: '서비스 살펴보기',
    secondaryButton: '문의하기'
  },
  about: {
    title: '회사 소개',
    vision: {
      title: '비전',
      content: [
        '혁신적인 기술로 더 나은 미래를 만듭니다.',
        '고객의 성공을 위해 최선을 다합니다.'
      ]
    },
    values: {
      title: '핵심 가치',
      items: [
        '혁신',
        '신뢰',
        '협력',
        '성장'
      ]
    }
  },
  services: {
    title: '서비스',
    items: [
      {
        title: '웹 개발',
        description: '최신 기술을 활용한 웹사이트 개발'
      },
      {
        title: '모바일 앱',
        description: 'iOS와 Android 앱 개발'
      },
      {
        title: '클라우드',
        description: '클라우드 인프라 구축 및 마이그레이션'
      }
    ]
  },
  contact: {
    title: '문의하기',
    form: {
      name: {
        label: '이름',
        placeholder: '이름을 입력하세요'
      },
      email: {
        label: '이메일',
        placeholder: '이메일을 입력하세요'
      },
      message: {
        label: '메시지',
        placeholder: '메시지를 입력하세요'
      },
      submit: '보내기'
    }
  },
  projects: {
    title: '주요 실적',
    items: []
  }
} 
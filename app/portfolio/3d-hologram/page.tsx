import Link from 'next/link'
import Image from 'next/image'

export default function ProjectDetailPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 rounded-xl py-16" style={{ background: '#393E46' }}>
          <div className="max-w-6xl mx-auto">
            <Link href="/portfolio" className="text-white/80 hover:text-white mb-8 inline-block">
              ← 실적 목록으로 돌아가기
            </Link>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#DFD0B8' }}>3D 홀로그램 시스템</h1>
            <p className="text-xl" style={{ color: '#DFD0B8' }}>
              혁신적인 3D 홀로그램 기술을 활용한 전시 시스템 구축 프로젝트
            </p>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Left Column - Main Image */}
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450"
                    alt="3D 홀로그램 시스템 메인 이미지"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Right Column - Project Details */}
              <div>
                {/* Project Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6">프로젝트 개요</h2>
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      국립과학관의 혁신적인 전시 시스템 구축을 위해 3D 홀로그램 기술을 도입했습니다.
                      이 프로젝트는 방문객들에게 더욱 몰입감 있는 전시 경험을 제공하고,
                      과학 교육의 효과를 높이는 것을 목표로 진행되었습니다.
                    </p>
                    <h3 className="text-xl font-semibold mt-8 mb-4">주요 작업 내용</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>3D 홀로그램 디스플레이 시스템 설계 및 구축</li>
                      <li>실시간 3D 콘텐츠 렌더링 시스템 개발</li>
                      <li>관람객 인터랙션 시스템 구현</li>
                      <li>시스템 안정성 및 성능 최적화</li>
                    </ul>
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">클라이언트</h3>
                    <p className="text-gray-600">국립과학관</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">기간</h3>
                    <p className="text-gray-600">2023년 1월 - 2023년 6월</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">담당 업무</h3>
                    <p className="text-gray-600">시스템 설계, 개발, 구축, 운영</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <h2 className="text-2xl font-bold mb-6">갤러리</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=1"
                    alt="갤러리 이미지 1"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=2"
                    alt="갤러리 이미지 2"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=3"
                    alt="갤러리 이미지 3"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=4"
                    alt="갤러리 이미지 4"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=5"
                    alt="갤러리 이미지 5"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://picsum.photos/800/450?random=6"
                    alt="갤러리 이미지 6"
                    width={800}
                    height={450}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 
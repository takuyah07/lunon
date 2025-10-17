/**
 * /legal/terms - 利用規約ページ
 * 完全静的生成（超高速）
 */

// 完全静的生成を強制
export const dynamic = 'force-static';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">利用規約</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第1条（適用）</h2>
              <p className="text-gray-700">
                本規約は、本サービスの利用に関する条件を、本サービスを利用するすべてのユーザーと当社との間で定めるものです。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第2条（定義）</h2>
              <p className="text-gray-700">
                本規約において使用する用語の定義は、次のとおりとします。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>「本サービス」とは、当社が提供するギフト送信サービスをいいます。</li>
                <li>「ユーザー」とは、本サービスを利用する者をいいます。</li>
                <li>「推し」とは、本サービスに登録されているギフト受取対象者をいいます。</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第3条（利用登録）</h2>
              <p className="text-gray-700">
                本サービスは、登録なしでご利用いただけます。ギフト送信時には、決済サービスプロバイダー（Square）の利用規約に同意いただく必要があります。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第4条（禁止事項）</h2>
              <p className="text-gray-700">
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセス行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第5条（免責事項）</h2>
              <p className="text-gray-700">
                当社は、本サービスに関して、その完全性、正確性、有用性等について、いかなる保証も行いません。
                本サービスの利用により生じた損害について、当社は一切の責任を負いません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第6条（規約の変更）</h2>
              <p className="text-gray-700">
                当社は、必要と判断した場合には、ユーザーに通知することなく本規約を変更することができます。
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">第7条（準拠法・管轄裁判所）</h2>
              <p className="text-gray-700">
                本規約の解釈にあたっては、日本法を準拠法とします。
                本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
            </section>

            <div className="mt-12 text-right text-sm text-gray-500">
              制定日: 2025年1月1日
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * /legal/privacy - プライバシーポリシーページ
 */

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">プライバシーポリシー</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第1条（個人情報の定義）</h2>
              <p className="text-gray-700">
                本プライバシーポリシーにおいて、個人情報とは、個人情報保護法第2条第1項により定義された個人情報、
                すなわち、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により
                特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む）を指します。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第2条（個人情報の収集）</h2>
              <p className="text-gray-700">
                当社は、本サービスの提供にあたり、以下の個人情報を収集する場合があります。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>決済時に決済サービスプロバイダー（Square）を通じて収集される決済情報</li>
                <li>アクセスログ、IPアドレス、ブラウザ情報等の技術情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第3条（個人情報の利用目的）</h2>
              <p className="text-gray-700">
                当社は、収集した個人情報を以下の目的で利用します。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>本サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに対応するため</li>
                <li>本サービスの改善・開発のため</li>
                <li>不正利用の防止のため</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第4条（個人情報の第三者提供）</h2>
              <p className="text-gray-700">
                当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、
                第三者に個人情報を提供することはありません。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
                <li>決済サービスプロバイダー（Square）への提供（決済処理に必要な範囲内）</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第5条（個人情報の開示）</h2>
              <p className="text-gray-700">
                当社は、ユーザーから個人情報の開示を求められたときは、遅滞なく開示いたします。
                ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあります。
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                <li>ユーザーまたは第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
                <li>当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
                <li>法令に違反することとなる場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第6条（個人情報の訂正および削除）</h2>
              <p className="text-gray-700">
                ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、
                当社が定める手続きにより、当社に対して個人情報の訂正または削除を請求することができます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第7条（個人情報の安全管理）</h2>
              <p className="text-gray-700">
                当社は、個人情報の紛失、破壊、改ざんおよび漏洩などのリスクに対して、
                合理的な安全対策を講じます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-gray-900">第8条（Cookie等の使用）</h2>
              <p className="text-gray-700">
                本サービスは、サービスの利便性向上のため、Cookieを使用することがあります。
                ユーザーは、ブラウザの設定によりCookieの使用を拒否することができますが、
                その場合、本サービスの一部機能が利用できなくなる可能性があります。
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">第9条（プライバシーポリシーの変更）</h2>
              <p className="text-gray-700">
                当社は、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、本サイトに掲載したときから効力を生じるものとします。
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

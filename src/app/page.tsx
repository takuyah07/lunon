export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-24 sm:py-32">
        <div className="flex flex-col gap-6 text-center sm:text-left">
          <p className="text-sm font-semibold text-blue-600">Lunon MVP</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            推しにギフトを贈って、店舗内ランキングを盛り上げよう
          </h1>
          <p className="text-base text-slate-600 sm:max-w-xl">
            Lunonは、認証なしで推しへSquare決済のギフトを届けるミニマルなMVPです。
            店舗ページから推しを選び、プリセットギフトを送るだけで当月ランキングに反映されます。
          </p>
        </div>

        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              MVPで実装すること
            </h2>
            <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <li className="rounded-lg bg-slate-50 px-4 py-3">
                店舗ページで推し一覧と今月のランキングを表示
              </li>
              <li className="rounded-lg bg-slate-50 px-4 py-3">
                推し詳細からSquare Hosted Checkoutでギフト購入
              </li>
              <li className="rounded-lg bg-slate-50 px-4 py-3">
                5分毎の同期APIでSquare決済を取り込みランキング更新
              </li>
              <li className="rounded-lg bg-slate-50 px-4 py-3">
                法務ページと1:1写真レイアウトを用意
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 sm:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              Next.js 15 + Tailwind 4
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
              Prisma / Supabase
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
              Square Hosted Checkout
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

# かまくらランタンフェス 南会津 2027 — LP

静的HTML版。GitHub Pagesのリポジトリ直下に `index.html` と `assets/` を配置してください。ビルドは不要です。

## 構成
- `index.html`: 全セクション、日英テキスト、予約案内。
- `assets/site.css`: PC・タブレット・スマホ対応のデザイン／アニメーション。
- `assets/site.js`: JP/EN切替、メニュー、ロゴ演出、画像スライド、スクロール演出。
- `assets/mark.svg`: オリジナルかまくら・ランタンロゴ。
- `assets/video/winter-story-15s.mp4`: 15秒の無音背景動画（自動再生、ループ）。
- `assets/images/`: 新規制作画像をWebP最適化。
- `.nojekyll`, `robots.txt`: GitHub Pages向け。サンプルのため検索エンジンから除外。

## 動作確認
`python -m http.server 8000` でこのフォルダから簡易サーバーを起動し、`http://localhost:8000` で閲覧できます。ファイルURLでも概ね動作しますが、動画や言語記憶の都合上ローカルサーバーを推奨します。

## 予約リンク
- かまくら：SELECTTYPE `https://select-type.com/rsv/?id=CG_8JwzhbU8&c_id=462012#rsvSltArea_idx`。**現在「まもなく公開」表示でボタン無効**。公開時は `index.html` の `data-booking-url` をhrefとして有効化し、ボタン文言と注意書きを変更してください。予約確定後のキャンセルは不可。
- コテージ：AirHost `https://aizu-sanson.airhost.co/ja/houses/869998`。予約ボタン有効。

## 運用上の注意
- 日程：2027年1月23日～2月23日（予定）／時間：各75分×4枠／各時間帯5棟・1棟最大6名。
- 鍋プラン料金は以前の案内を引き継いだ暫定値。公開前に最終確認してください。
- コテージ定員は目安6〜7名。実際の空室・宿泊条件はAirHostをご確認ください。
- 動画と写真は**演出用のイメージ**を含み、現地で撮影した記録ではありません。コテージの窓外も冬景色に加工しています。
- 竹ランタン点灯時間は未定。昼の鍋利用時の点灯を保証しません。
- 宿泊予約と体験予約は別です。既存の予約システム／決済は実装していません。
- 動きが苦手な端末（prefers-reduced-motion）では背景を静止画にしています。

## WordPress
`wordpress-theme` の別ZIPを WordPress管理画面→外観→テーマ→新規追加→テーマをアップロード で導入できます（静的版とは別のファイル）。既存のWordPressテーマと差し替えるため、テスト環境で確認後に有効化してください。

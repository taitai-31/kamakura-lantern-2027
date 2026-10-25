/* 編集箇所を集約しています。詳細は ../README.md を参照してください。 */
window.FESTIVAL_CONFIG = {
  // coming-soon / open / suspended / ended
  bookingStatus: 'coming-soon',
  // イベント専用の外部予約URL。空のままでは販売リンクを有効にしません。
  bookingUrl: '',
  // 先方ドメインへの公開URL。例 https://example.jp/kamakura/ （末尾 /）
  siteUrl: '',
  // 公開内容の最終確認後に true。false では検索登録を抑止します。
  indexable: false,
  // 空なら上記ステータスに対応する標準案内を表示します。
  announcement: '',
  privacyPolicyUrl: '',
  cancellationPolicyUrl: '',
  sellerInformationUrl: '',
  // 必要な場合だけ接続。予約ボタンのクリックで、予約完了は計測しません。
  analyticsEnabled: false,
  onBookingClick: null,
  contactPhone: '0241662108'
};

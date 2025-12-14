// カードの要素（HTMLのdiv）を取得する
const card = document.querySelector('.card');
const body = document.body;

// カードがクリックされたら実行する
card.addEventListener('click', function() {
    // ページ全体（body）に "dark-mode" というクラスをつけたり外したりする
    body.classList.toggle('dark-mode');

    // ログを出して確認（F12のコンソールで見えます）
    console.log("クリックされました！モード切り替え！");
});
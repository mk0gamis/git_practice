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

/* --- ここから下を追加 --- */

/* タイピング風アニメーション */
const textElement = document.getElementById('typing-text');
const textContent = "エンジニアを目指して学習中のチャレンジャー。"; // 表示したい文字
let charIndex = 0;

function typeWriter() {
    if (charIndex < textContent.length) {
        textElement.textContent += textContent.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100); // 100ミリ秒ごとに次の文字を打つ
    }
}

// ページが読み込まれたらタイピング開始
window.onload = function() {
    setTimeout(typeWriter, 1500); // カードが出てきた後に打ち始める（1.5秒後）
};
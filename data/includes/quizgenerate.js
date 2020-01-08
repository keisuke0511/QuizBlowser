// quiz generate pageの設定
(function($){

  // URL_E = 'https://trezia.db.ics.keio.ac.jp/quiz_generate' //サーバー用URL
  // URL_J = 'https://trezia.db.ics.keio.ac.jp/quiz_generate_ja' //サーバー用URL
  URL_WIX_J = 'http://wixdev.db.ics.keio.ac.jp/keisuke_WIXServer_0.5.3/quizattach'; // WIXアタッチ用URL
  URL_WIX_E = 'http://wixdev.db.ics.keio.ac.jp/keisuke_WIXServer_0.5.3.2/quizattach'; // WIXアタッチ用URL(英語)
  URL_E = 'http://0.0.0.0:50000/quiz_generate';
  URL_J = 'http://0.0.0.0:50000/quiz_generate_ja';

  // クイズ生成ボタンの作成
  function questionButtonSet() {

    // クイズボタンの生成(ENG)
    var generateButton = document.createElement('button');
    generateButton.id = 'quiz-generate-button';
    generateButton.className = 'button-slide';
    generateButton.type = 'button';
    generateButton.innerText = 'Quiz\n(Eng)';
    // クイズボタンの生成(JPN)
    var generateButtonJPN = document.createElement('button');
    generateButtonJPN.id = 'quiz-generate-button-jpn';
    generateButtonJPN.type = 'button';
    generateButtonJPN.innerText = 'Quiz\n(Jpn)';
    // ユーザー情報の閲覧ボタン
    var userHistoryButton = document.createElement('button')
    userHistoryButton.id = 'user-history-button';
    userHistoryButton.type = 'button';
    userHistoryButton.innerText = 'User\nHistory';
    // スライドエリアの作成
    var slideArea = document.createElement('div');
    slideArea.id = 'slide-area';
    var menuArea = document.createElement('div');
    menuArea.id = 'menu-area';
    var slideButton = document.createElement('div');
    slideButton.id = 'slide-button';
    slideButton.innerHTML = '<span>Open Menu</span>';
    // ローダーの作成
    var loader = document.createElement('div');
    loader.id = 'loader';
    var loaderImg = document.createElement('img');
    loaderImg.src = 'https://www.db.ics.keio.ac.jp/lab/keisuke/loading.gif';
    loaderImg.width = '300';
    loaderImg.height = '300';
    loaderImg.alt = "Now Loading...";

    // 要素の追加
    $(menuArea).append(userHistoryButton);
    $(menuArea).append(generateButtonJPN);
    $(menuArea).append(generateButton);
    $(slideArea).append(menuArea);
    $(slideArea).append(slideButton);
    $('body').append(slideArea);

    $(loader).append(loaderImg);
    $('body').append(loader);
  }

  // レスポンスページを開く
  function windowOpen(response) {
    var t,w;
    //ウィンドウを開く
    w = window.open();
    //ウィンドウ移動
    w.focus();
    //ドキュメントを開く
    w.document.open();
    //ドキュメントクリア
    w.document.clear();
    //ドキュメントに文字列を出力
    t = response;
    w.document.write(t);
    //ドキュメントを閉じる
    w.document.close();
  }

  // ローダーの表示
  function loaderDisplay(){
    $("#loader").delay(500).fadeIn(500);
  }

  // ローダーの非表示
  function loaderUndisplay() {
    $("#loader").delay(500).fadeOut(500);
  }

  // 日本語クイズ生成のリクエスト
  function quizGenerateRequest(url, pagecontents){

    // クイズ生成をリクエスト
    $.ajax({
      url: url,
      type: 'POST',
      data: {
        "contents" : pagecontents,
        "view_url" : location.href,
        "title" : document.title,
        "httpconn" : "https"
      }
    })
    // ajax通信成功時
    .done(function(response){
      loaderUndisplay();
      windowOpen(response);
    })
    .fail(function(){
      loaderUndisplay();
      console.log("ajax failed");
    })
  }

  // クイズボタンが押された時のプログラム実行
  function questionButtonEventSet() {
    // ユーザー解答状況ボタンの設定
    $("#user-history-button").click(function(){
      // 解答状況ページに飛ぶ
      window.open('http://user.keio.ac.jp/~ua213440/quiz_generate/user_history.html', '_blank');
    });

    $("#quiz-generate-button").click(function(){
      var pagecontents = $("html").html();
      // ローダーの表示
      loaderDisplay();

      // ドキュメントのアタッチ化
      $.ajax({
        url: URL_WIX_E,
        type: 'POST',
        data: {
          "body" : pagecontents,
          "wid" : 2
        }
      })
      .done(function(response){
        console.log(response);
        pagecontents = response;
        quizGenerateRequest(URL_E, pagecontents);
      })
      .fail(function(){
        loaderUndisplay();
        alert("英語版クイズ生成　少々お待ちください")
        console.log("ajax failed in attach");
      })

    });

    // 日本語問題ボタンのクリックイベント
    $("#quiz-generate-button-jpn").click(function(){
      var pagecontents = $("html").html();

      // ローダーの表示
      loaderDisplay();

      // ドキュメントのアタッチ化
      $.ajax({
        url: URL_WIX_J,
        type: 'POST',
        data: {
          "body" : pagecontents,
          "wid" : 1
        }
      })
      .done(function(response){
        pagecontents = response;
        quizGenerateRequest(URL_J, pagecontents);
      })
      .fail(function(){
        loaderUndisplay();
        console.log("ajax failed in attach");
      })

    });

    $("#slide-button").click(function(){
      $('#slide-button').toggleClass('open');
      if($('#slide-button').hasClass('open')){
          // open クラスが body についていたらメニューをスライドインする
          $('#slide-area').animate({'left' : 0 }, 300);
          $('#slide-button').html("<span>Close Menu</span>");
      } else {
          // open クラスが body についていなかったらスライドアウトする
          $('#slide-area').animate({'left' : -100 }, 300);
          $('#slide-button').html("<span>Open Menu</span>");
      }
    });
  }

  // プログラムの実行
  window.onload = function(){
    window.setTimeout(questionButtonSet, 1500);
    window.setTimeout(questionButtonEventSet, 2000);
  }

})(window.jQuery190)

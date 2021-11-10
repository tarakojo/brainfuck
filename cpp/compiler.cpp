//コンパイラの実装


#include <array>
#include <stack>
#include <string>
#include <vector>

#include "global.hpp"


//定数=============================================================================================

//命令トークンの種類数
const int OPERATION_TOKEN_NUM = 8;


//型===============================================================================================

//各トークンを表す文字列を格納する配列型。割り当て先はtoken_indexのものとする
using token_strings = std::array<std::string, OPERATION_TOKEN_NUM>;

//トークンの番号
enum class token_index : int {
  pointer_inclement = 0,
  pointer_declement = 1,
  memory_inclement = 2,
  memory_declement = 3,
  get = 4,
  put = 5,
  if0_jump = 6,
  ifnot0_jump = 7,
  comment = 8,
  error = 9
};

//compileのエラーコード
enum class compile_error_code : int {
  no_error = 0,
  multiple_match = 1,  //複数トークンにマッチ
  no_lbracket = 2,     // jumpのjump先が存在しない
  no_rbracket = 3      // if0_jumpのjump先が存在しない
};


//変数===============================================================================================

//各トークンを表す文字列の配列
static token_strings ts = {">", "<", "+", "-", ".", ",", "[", "]"};


//関数===============================================================================================

//各トークンに文字列を割り当てる。_tsの要素は空であってはならない
void set_token_string(const token_strings& _ts) { ts = _ts; }


//srcのposの位置から1token読む
//posがsrcの範囲外または複数トークンにマッチする場合エラー
//成功の場合、{token_index, 次の読み込み位置}
//エラーの場合{token_index::error, -1}を返す
std::array<int, 2> get_token(const std::string& src, int pos) {
  //posが範囲外ならエラー
  if (pos < 0 || src.size() <= pos) return {(int)token_index::error, -1};

  //各トークンにマッチするかチェック
  token_index matched = token_index::comment;
  for (int i = 0; i < OPERATION_TOKEN_NUM; ++i) {
    if (pos + ts[i].size() >= src.size()) continue;
    bool failed = false;
    for (int j = 0; j < ts[i].size(); ++j) {
      if (ts[i][j] != src[pos + j]) {
        failed = true;
        break;
      }
    }
    if (failed) continue;
    if (matched == token_index::comment)
      matched = (token_index)(i);
    else  //すでにマッチしている場合エラー
      return {(int)token_index::error, -1};
  }
  int next_pos = pos + (matched == token_index::comment ? 1 : ts[(int)matched].size());
  return {(int)matched, next_pos};
}


//パースし、命令をprogramに格納。
//{parse_error_code, pos}を返す
//ただしposは、成功ならsrcの長さ、失敗ならエラーが発生した位置
std::array<int, 2> compile(const std::string& src) {
  //対応がとれていないif0_jumpの{programのindex, srcのpos}
  std::stack<std::pair<int, int>> lbracket;
  int pos = 0;

  program.clear();
  while (pos < src.size()) {
    //トークン読み出し
    auto t = get_token(src, pos);

    switch ((token_index)t[0]) {
      case token_index::pointer_inclement:
        program.emplace_back(operation_code::pointer_add, 1);
        break;

      case token_index::pointer_declement:
        program.emplace_back(operation_code::pointer_add, -1);
        break;

      case token_index::memory_inclement:
        program.emplace_back(operation_code::memory_add, 1);
        break;

      case token_index::memory_declement:
        program.emplace_back(operation_code::memory_add, -1);
        break;

      case token_index::get:
        program.emplace_back(operation_code::get, 1);
        break;

      case token_index::put:
        program.emplace_back(operation_code::put, 1);
        break;

      case token_index::if0_jump:
        program.emplace_back(operation_code::if0_jump, -1);
        lbracket.push({program.size() - 1, pos});
        break;

      case token_index::ifnot0_jump:
        //対応するif0_jumpが存在しないとき
        if (lbracket.empty()) return {(int)compile_error_code::no_lbracket, pos};

        program.emplace_back(operation_code::ifnot0_jump, lbracket.top().first + 1);
        program[lbracket.top().first].operand = program.size();
        lbracket.pop();
        break;

      case token_index::comment:
        continue;

      //複数トークンにマッチしたとき
      case token_index::error: {
        return {(int)compile_error_code::multiple_match, pos};
      }
    }
    //次のトークン読み込み位置を設定
    pos = t[1];
  }
  //対応するjumpが存在しないとき
  if (!lbracket.empty()) return {(int)compile_error_code::no_rbracket, lbracket.top().second};

  return {(int)compile_error_code::no_error, pos};
}

//インタプリタの実装


#include <chrono>
#include <vector>

#include "global.hpp"


//エイリアス==============================================================================================

using std::chrono::milliseconds;
using std::chrono::system_clock;


//グローバル変数==========================================================================================

//コンパイルされたプログラムを格納
std::vector<operation> program;


//変数===================================================================================================

//メモリ
static std::vector<unsigned char> memory = std::vector<unsigned char>(1, 0);

//メモリ参照の位置
static unsigned int mp;

//プログラムカウンタ
static unsigned int pc;

//マスク
static unsigned int mask;


//プロトタイプ宣言=======================================================================================

int get_byte();
int put_byte(unsigned char b);
void init_console();


//関数==================================================================================================

//インタプリタとコンソールの実行準備
void init(unsigned int memsize_log2) {
  memory.assign(1 << memsize_log2, 0);
  mask = (1 << memsize_log2) - 1;
  mp = pc = 0;
  init_console();
}

//1ステップ実行する
//戻り値は停止:1 停止しない:0 タイムアウト:-1
int run_step(const system_clock::time_point& limit) {
  switch (program[pc].opcode) {
    case operation_code::pointer_add:
      mp += program[pc].operand;
      mp &= mask;
      ++pc;
      break;

    case operation_code::memory_add:
      memory[mp] += program[pc].operand;
      ++pc;
      break;

    case operation_code::get: {
      //limitまでのミリ秒を計算
      auto timeout = static_cast<long long>(std::chrono::duration_cast<milliseconds>(limit - system_clock::now()).count());
      if (timeout <= 0) return -1;

      int b = get_byte(timeout);
      if (b < 0) return -1;

      memory[mp] = b;
      ++pc;
      break;
    }

    case operation_code::put:
      put_byte(memory[mp]);
      ++pc;
      break;

    //if0_jumpとifnot0_jumpは同じ処理
    case operation_code::if0_jump:
    case operation_code::ifnot0_jump:
      pc = program[pc].operand;
      break;
  }
  return pc == program.size() ? 1 : 0;
}


//stepステップ実行する。timeoutはミリ秒で指定する
//戻り値は停止:1 停止しない:0 タイムアウト:-1
int run(unsigned long long step, unsigned long long timeout) {
  //時間計測の間隔ステップ数
  const unsigned long long epoch = 1 << 16;

  auto start = system_clock::now();
  auto limit = start + milliseconds(timeout);

  while (true) {
    auto times = (step < epoch ? step : epoch);

    for (int i = 0; i < times; ++i) {
      int result = run_step(limit);
      //停止もしくはrun_step中にタイムアウトのとき
      if (result != 0) return result;
    }

    step -= times;
    //指定ステップ数完了したとき
    if (step == 0) return 0;

    //タイムアウトのとき
    if (limit <= system_clock::now()) return -1;
  }
  return 0;
}

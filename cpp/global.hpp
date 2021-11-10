//プログラム全域で使うもの


#include <vector>


//型===============================================================================================

//命令の種類
enum class operation_code : int {
  pointer_add = 0,
  memory_add = 1,
  get = 2,
  put = 3,
  if0_jump = 4,
  ifnot0_jump = 5
};


//命令
struct operation {
  operation_code opcode;
  int operand;  // 引数
};


//グローバル変数==========================================================================================

//コンパイルされたプログラムを格納するグローバル変数。実体はinterpreter.cppで定義されている
extern std::vector<operation> program;
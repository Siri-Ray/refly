import type { Digest } from '@refly-packages/ai-workspace-common/types';

export interface Feed extends Digest {
  // 增加一些指标
  readCount: number; // 阅读次数
  askFollow: number; // 追问次数
  userId?: string;
}

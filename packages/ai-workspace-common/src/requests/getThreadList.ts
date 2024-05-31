import { appConfig } from '@refly-packages/ai-workspace-common/utils/config';
import { request } from '@refly-packages/ai-workspace-common/utils/request';

import type { HandlerRequest, HandlerResponse } from '@refly-packages/ai-workspace-common/types/request';
import { Thread, ListPageProps } from '@refly-packages/ai-workspace-common/types';

const handler = async (req: HandlerRequest<ListPageProps>): Promise<HandlerResponse<Thread[]>> => {
  console.log(req.body);

  try {
    const [err, conversationRes] = await request<Thread[]>(appConfig.url.getConversationList, {
      method: 'GET',
      body: req.body,
    });
    if (err) {
      return {
        success: false,
        errMsg: err,
      };
    } else {
      return {
        success: true,
        data: conversationRes,
      };
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err,
    };
  }
};

export default handler;

import {
  LANGUAGE,
  LOCALE,
  TASK_TYPE,
  type QUICK_ACTION_TASK_PAYLOAD,
  type SEARCH_ENHANCE,
  type Task,
  type GEN_TITLE,
  type CHAT,
} from '@refly-packages/ai-workspace-common/types';

import { genUniqueId } from './index';
import { OutputLocale } from './i18n';

export const buildTask = (payload: Task): Task => {
  const { taskType, language = LANGUAGE.AUTO, locale, data = {}, createConvParam = {} } = payload;

  console.log('now task locale', locale);

  const task: Task = {
    taskType,
    language,
    locale,
    data: data,
    convId: payload?.convId,
    createConvParam,
  };

  return task;
};

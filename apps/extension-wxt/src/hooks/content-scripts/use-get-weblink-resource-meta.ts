import { useEffect, useRef } from 'react';
import { useMatch } from '@refly-packages/ai-workspace-common/utils/router';
import { useExtensionMessage } from '../use-extension-message';
import { getRuntime } from '@refly-packages/ai-workspace-common/utils/env';
import { onMessage, sendMessage } from '@refly-packages/ai-workspace-common/utils/extension/messaging';

// utils
import { saveMockedResource } from '@/utils/save-mocked-resource';
import { BackgroundMessage } from '@refly/common-types';

/**
 * 只在 Content Script UI 中调用
 */
export const useSyncWeblinkResourceMeta = () => {
  const messageListenerEventRef = useRef<any>();

  const makeTempResourceAndSave = async () => {
    await saveMockedResource();
  };

  const onMessageHandler = (event: MessageEvent<any>) => {
    const data = event as any as BackgroundMessage;
    const { name } = data || {};

    if (name === 'reflyStatusCheck' && data?.type === 'others' && getRuntime() === 'extension-csui') {
      makeTempResourceAndSave();
    }
  };

  const initMessageListener = () => {
    onMessage(onMessageHandler, getRuntime()).then((clearEvent) => {
      messageListenerEventRef.current = clearEvent;
    });

    return () => {
      messageListenerEventRef.current?.();
    };
  };

  useEffect(() => {
    makeTempResourceAndSave();
  }, []);

  return {
    initMessageListener,
  };
};

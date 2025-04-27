import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import { memo, useRef, useMemo, useState, useCallback, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { RefTextAreaType } from '@arco-design/web-react/es/Input/textarea';
import { useSearchStoreShallow } from '@refly-packages/ai-workspace-common/stores/search';
import type { Skill } from '@refly/openapi-schema';
import { useSkillStoreShallow } from '@refly-packages/ai-workspace-common/stores/skill';
import { cn } from '@refly/utils/cn';
import { useListSkills } from '@refly-packages/ai-workspace-common/hooks/use-find-skill';
import { getSkillIcon } from '@refly-packages/ai-workspace-common/components/common/icon';
import { useCanvasContext } from '@refly-packages/ai-workspace-common/context/canvas';

const TextArea = Input.TextArea;

interface ChatInputProps {
  query: string;
  setQuery: (text: string) => void;
  selectedSkillName: string | null;
  inputClassName?: string;
  maxRows?: number;
  autoCompletionPlacement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';
  handleSendMessage: () => void;
  handleSelectSkill?: (skill: Skill) => void;
  onUploadImage?: (file: File) => Promise<void>;
  onFocus?: () => void;
}

const ChatInputComponent = forwardRef<HTMLDivElement, ChatInputProps>(
  (
    {
      query,
      setQuery,
      selectedSkillName,
      inputClassName,
      autoCompletionPlacement,
      maxRows,
      handleSendMessage,
      handleSelectSkill,
      onUploadImage,
      onFocus,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { readonly } = useCanvasContext();
    const [isDragging, setIsDragging] = useState(false);

    const inputRef = useRef<RefTextAreaType>(null);
    const hasMatchedOptions = useRef(false);

    const searchStore = useSearchStoreShallow((state) => ({
      setIsSearchOpen: state.setIsSearchOpen,
    }));
    const { setSelectedSkill } = useSkillStoreShallow((state) => ({
      setSelectedSkill: state.setSelectedSkill,
    }));
    const [showSkillSelector, setShowSkillSelector] = useState(false);

    const handlePaste = useCallback(
      async (e: React.ClipboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
        if (readonly || !onUploadImage) {
          return;
        }

        const items = e.clipboardData?.items;

        if (!items?.length) {
          return;
        }

        for (const item of items) {
          if (item.type.startsWith('image/')) {
            e.preventDefault();
            const file = item.getAsFile();
            if (file) {
              await onUploadImage(file);
            }
            break;
          }
        }
      },
      [onUploadImage, readonly],
    );

    const skills = useListSkills();

    const skillOptions = useMemo(() => {
      return skills.map((skill) => ({
        value: skill.name,
        label: (
          <div className="flex items-center gap-2 h-6">
            {getSkillIcon(skill.name)}
            <span className="text-sm font-medium">{t(`${skill.name}.name`, { ns: 'skill' })}</span>
            <span className="text-sm text-gray-500">
              {t(`${skill.name}.description`, { ns: 'skill' })}
            </span>
          </div>
        ),
        textLabel: t(`${skill.name}.name`, { ns: 'skill' }),
      }));
    }, [t, skills]);

    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (readonly) {
          e.preventDefault();
          return;
        }

        // When the user presses Ctrl+/ key, open the skill selector
        if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          setQuery(`${query}/`);
          setShowSkillSelector(true);
          setOptions(skillOptions);
          hasMatchedOptions.current = true;
          return;
        }

        // Handle Ctrl+K or Cmd+K to open search
        if (e.keyCode === 75 && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          searchStore.setIsSearchOpen(true);
        }

        // Only intercept ArrowUp and ArrowDown when skill selector is active and has options
        if (
          (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
          showSkillSelector &&
          hasMatchedOptions.current &&
          options.length > 0
        ) {
          // Allow the default behavior for AutoComplete navigation
          return;
        }

        // Handle the Enter key
        if (e.keyCode === 13) {
          // Shift + Enter creates a new line (let default behavior handle it)
          if (e.shiftKey) {
            return;
          }

          // Ctrl/Meta + Enter should always send the message regardless of skill selector
          if ((e.ctrlKey || e.metaKey) && query?.trim()) {
            e.preventDefault();
            handleSendMessage();
            return;
          }

          // For regular Enter key
          if (!e.shiftKey) {
            // enter should not be used to select when the skill selector is active and has options
            if (showSkillSelector && hasMatchedOptions.current && options.length > 0) {
              e.preventDefault();
              return;
            }

            // enter should send message when the query contains '//'
            if (query?.includes('//')) {
              e.preventDefault();
              if (query?.trim()) {
                handleSendMessage();
              }
              return;
            }

            // Otherwise send message on Enter
            e.preventDefault();
            if (query?.trim()) {
              handleSendMessage();
            }
          }
        }

        // Update the skill selector state - exclude navigation keys to allow proper navigation
        const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
        if (
          !navigationKeys.includes(e.key) &&
          !(e.key === '/' && (e.ctrlKey || e.metaKey)) &&
          showSkillSelector
        ) {
          setShowSkillSelector(false);
        }
      },
      [query, readonly, showSkillSelector, options, handleSendMessage, searchStore, skillOptions],
    );

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setQuery(value);
      },
      [setQuery],
    );

    const handleSearchListConfirm = useCallback(
      (value: string) => {
        setOptions([]);
        setShowSkillSelector(false);
        const skill = skills.find((skill) => skill.name === value);
        if (!skill) {
          return;
        }
        if (handleSelectSkill) {
          handleSelectSkill(skill);
        } else {
          setQuery('');
          setSelectedSkill(skill);
        }
      },
      [skills, setSelectedSkill, handleSelectSkill, setQuery],
    );

    const filterOption = useCallback(
      (inputValue: string, option: any) => {
        // Ctrl+/ was just pressed, show all options
        if (showSkillSelector && inputValue === query) {
          return true;
        }

        const searchVal = inputValue.toLowerCase();
        const isMatch =
          !searchVal ||
          option.value.toString().toLowerCase().includes(searchVal) ||
          option.textLabel.toLowerCase().includes(searchVal);

        if (isMatch) {
          hasMatchedOptions.current = true;
        }
        return isMatch;
      },
      [showSkillSelector, query],
    );

    const onSelect = useCallback(
      (value: string) => {
        if (!readonly) handleSearchListConfirm(value);
      },
      [readonly, handleSearchListConfirm],
    );

    // Handle focus event and propagate it upward, then move cursor to end
    const handleFocus = useCallback(() => {
      if (onFocus && !readonly) {
        onFocus();
      }
      // Ensure cursor is placed at end of text
      setTimeout(() => {
        const el =
          (inputRef.current as any)?.resizableTextArea?.textArea ||
          (inputRef.current as any)?.textarea;
        if (el) {
          const length = el.value.length;
          el.setSelectionRange(length, length);
        }
      }, 0);
    }, [onFocus, readonly]);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full h-full flex flex-col flex-grow overflow-y-auto relative',
          isDragging && 'ring-2 ring-green-500 ring-opacity-50 rounded-lg',
          readonly && 'opacity-70 cursor-not-allowed',
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!readonly) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!readonly) setIsDragging(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (readonly) return;

          setIsDragging(false);

          if (!onUploadImage) return;

          const files = Array.from(e.dataTransfer.files);
          const imageFile = files.find((file) => file.type.startsWith('image/'));

          if (imageFile) {
            try {
              await onUploadImage(imageFile);
            } catch (error) {
              console.error('Failed to upload image:', error);
            }
          }
        }}
      >
        {isDragging && !readonly && (
          <div className="absolute inset-0 bg-green-50/50 flex items-center justify-center pointer-events-none z-10 rounded-lg border-2 border-green-500/30">
            <div className="text-green-600 text-sm font-medium">{t('common.dropImageHere')}</div>
          </div>
        )}
        {showSkillSelector && !readonly ? (
          <AutoComplete
            className="h-full"
            autoFocus={!readonly}
            open={true}
            options={options}
            popupMatchSelectWidth={false}
            placement={autoCompletionPlacement}
            value={query}
            disabled={readonly}
            filterOption={filterOption}
            onSelect={onSelect}
          >
            <TextArea
              style={{ paddingLeft: 0, paddingRight: 0, height: '100%' }}
              ref={inputRef}
              autoFocus={!readonly}
              disabled={readonly}
              onFocus={handleFocus}
              onBlur={() => {
                setTimeout(() => {
                  setShowSkillSelector(false);
                }, 100);
              }}
              value={query ?? ''}
              onChange={handleInputChange}
              onKeyDownCapture={handleKeyDown}
              onPaste={handlePaste}
              className={cn(
                '!m-0 bg-transparent outline-none box-border border-none resize-none focus:outline-none focus:shadow-none focus:border-none',
                inputClassName,
                readonly && 'cursor-not-allowed !text-black !bg-transparent',
              )}
              placeholder={
                selectedSkillName
                  ? t(`${selectedSkillName}.placeholder`, {
                      ns: 'skill',
                      defaultValue: t('commonQnA.placeholder', { ns: 'skill' }),
                    })
                  : t('commonQnA.placeholder', { ns: 'skill' })
              }
              autoSize={{
                minRows: 1,
                maxRows: maxRows ?? 6,
              }}
              data-cy="chat-input"
            />
          </AutoComplete>
        ) : (
          <TextArea
            style={{ paddingLeft: 0, paddingRight: 0, height: '100%' }}
            ref={inputRef}
            autoFocus={!readonly}
            disabled={readonly}
            onFocus={handleFocus}
            onBlur={() => {
              setTimeout(() => {
                setShowSkillSelector(false);
              }, 100);
            }}
            value={query ?? ''}
            onChange={handleInputChange}
            onKeyDownCapture={handleKeyDown}
            onPaste={handlePaste}
            className={cn(
              '!m-0 bg-transparent outline-none box-border border-none resize-none focus:outline-none focus:shadow-none focus:border-none',
              inputClassName,
              readonly && 'cursor-not-allowed !text-black !bg-transparent',
            )}
            placeholder={
              selectedSkillName
                ? t(`${selectedSkillName}.placeholder`, {
                    ns: 'skill',
                    defaultValue: t('commonQnA.placeholder', { ns: 'skill' }),
                  })
                : t('commonQnA.placeholder', { ns: 'skill' })
            }
            autoSize={{
              minRows: 1,
              maxRows: maxRows ?? 6,
            }}
            data-cy="chat-input"
          />
        )}
      </div>
    );
  },
);

ChatInputComponent.displayName = 'ChatInputComponent';

export const ChatInput = memo(ChatInputComponent, (prevProps, nextProps) => {
  return (
    prevProps.query === nextProps.query &&
    prevProps.selectedSkillName === nextProps.selectedSkillName &&
    prevProps.handleSelectSkill === nextProps.handleSelectSkill &&
    prevProps.onUploadImage === nextProps.onUploadImage &&
    prevProps.onFocus === nextProps.onFocus
  );
}) as typeof ChatInputComponent;

ChatInput.displayName = 'ChatInput';

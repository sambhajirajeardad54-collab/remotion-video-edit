import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { fmt, getMessages, type Messages } from '../i18n/messages';
import { pick } from '../logic/format';
import { createInitialState, parseStoredState, serializeState, STORAGE_KEY, studentReducer, type StudentAction } from '../logic/state';
import type { Locale, Localized, StudentState } from '../types';

/** Minimal async key-value storage: wraps localStorage on web, AsyncStorage on Android. */
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

interface StudentContextValue {
  state: StudentState;
  dispatch: (action: StudentAction) => void;
  /** True once persisted state has been loaded. */
  ready: boolean;
  locale: Locale;
  m: Messages;
  /** Pick the current-language string from bilingual content. */
  L: (value: Localized) => string;
  /** Format a UI template with variables. */
  f: (template: string, vars: Record<string, string | number>) => string;
}

const StudentContext = createContext<StudentContextValue | null>(null);

export interface StudentProviderProps {
  storage: KeyValueStorage;
  children: ReactNode;
  /** Locale to use before storage loads (e.g. from a cookie on the web). */
  initialLocale?: Locale;
  /** Called whenever the locale changes, e.g. to set a cookie or <html lang>. */
  onLocaleChange?: (locale: Locale) => void;
}

export function StudentProvider({ storage, children, initialLocale, onLocaleChange }: StudentProviderProps) {
  const [state, dispatch] = useReducer(studentReducer, undefined, () => {
    const s = createInitialState();
    return initialLocale ? { ...s, locale: initialLocale } : s;
  });
  const [ready, setReady] = useState(false);
  const storageRef = useRef(storage);

  useEffect(() => {
    let cancelled = false;
    storageRef.current
      .getItem(STORAGE_KEY)
      .catch(() => null)
      .then((raw) => {
        if (cancelled) return;
        const loaded = parseStoredState(raw);
        dispatch({ type: 'hydrate', state: raw ? loaded : initialLocale ? { ...loaded, locale: initialLocale } : loaded });
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    storageRef.current.setItem(STORAGE_KEY, serializeState(state)).catch(() => undefined);
  }, [state, ready]);

  const onLocaleChangeRef = useRef(onLocaleChange);
  useEffect(() => {
    onLocaleChangeRef.current = onLocaleChange;
  }, [onLocaleChange]);
  useEffect(() => {
    onLocaleChangeRef.current?.(state.locale);
  }, [state.locale]);

  const locale = state.locale;
  const L = useCallback((value: Localized) => pick(value, locale), [locale]);
  const value = useMemo<StudentContextValue>(
    () => ({ state, dispatch, ready, locale, m: getMessages(locale), L, f: fmt }),
    [state, ready, locale, L],
  );

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent(): StudentContextValue {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>');
  return ctx;
}

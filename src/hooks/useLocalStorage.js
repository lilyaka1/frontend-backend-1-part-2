import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';

// Действия для reducer
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR'
};

// Reducer для управления localStorage состоянием
function localStorageReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_VALUE:
      return { ...state, value: action.payload, loading: false, error: null };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Продвинутый кастомный хук useLocalStorage с useReducer
export function useLocalStorage(key, initialValue = null) {
  const [state, dispatch] = useReducer(localStorageReducer, {
    value: initialValue,
    loading: true,
    error: null
  });

  // Загрузка данных из localStorage
  useEffect(() => {
    const loadValue = () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const item = localStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          dispatch({ type: ACTIONS.SET_VALUE, payload: parsedValue });
        } else {
          dispatch({ type: ACTIONS.SET_VALUE, payload: initialValue });
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    loadValue();
  }, [key, initialValue]);

  // Функция для установки значения
  const setValue = useCallback((value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(state.value) : value;
      localStorage.setItem(key, JSON.stringify(valueToStore));
      dispatch({ type: ACTIONS.SET_VALUE, payload: valueToStore });
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [key, state.value]);

  // Функция для удаления значения
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      dispatch({ type: ACTIONS.SET_VALUE, payload: initialValue });
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [key, initialValue]);

  return {
    value: state.value,
    loading: state.loading,
    error: state.error,
    setValue,
    removeValue
  };
}

// Кастомный хук для debounce операций
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useReducer(
    (state, action) => action,
    value
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Кастомный хук для управления формой
export function useForm(initialValues = {}) {
  const [values, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_FIELD':
          return { ...state, [action.field]: action.value };
        case 'SET_VALUES':
          return { ...state, ...action.values };
        case 'RESET':
          return initialValues;
        default:
          return state;
      }
    },
    initialValues
  );

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const setValues = useCallback((newValues) => {
    dispatch({ type: 'SET_VALUES', values: newValues });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setField(name, type === 'checkbox' ? checked : value);
  }, [setField]);

  return {
    values,
    setField,
    setValues,
    reset,
    handleChange
  };
}

// Кастомный хук для асинхронных операций
export function useAsync(asyncFunction, immediate = false) {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'LOADING':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { ...state, loading: false, data: action.payload, error: null };
        case 'ERROR':
          return { ...state, loading: false, error: action.payload };
        default:
          return state;
      }
    },
    {
      loading: false,
      data: null,
      error: null
    }
  );

  const execute = useCallback(async (...args) => {
    try {
      dispatch({ type: 'LOADING' });
      const data = await asyncFunction(...args);
      dispatch({ type: 'SUCCESS', payload: data });
      return data;
    } catch (error) {
      dispatch({ type: 'ERROR', payload: error });
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute
  };
}

export { useLocalStorage as useLocalStorageLegacy };

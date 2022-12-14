export interface ShowProps<T> {
  when: T | undefined | null | false;
  fallback?: JSX.Element;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
}

export default function Show<T>(props: ShowProps<T>) {
  return (
    Boolean(props.when)
    ? (typeof(props.children) === "function" ? props.children(props.when as NonNullable<T>) : props.children)
    : (props.fallback || null)
  );
}


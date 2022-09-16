import { Fragment, ReactNode } from 'react';

export interface ForProps<T> {
  each: T[];
  children: ReactNode | ((item: T, index: number) => ReactNode);
}

export default function For<T>(props: ForProps<T>) {
  return (
    <Fragment>
    {
      props.each.map((value, index) => typeof props.children === "function" ? props.children(value, index) : props.children)
    }
    </Fragment>
  );
}

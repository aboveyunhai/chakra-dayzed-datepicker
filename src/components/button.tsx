import React, { forwardRef, useMemo } from 'react';
import {
  HTMLChakraProps,
  Loader,
  RecipeProps,
  UnstyledProp,
  chakra,
  createRecipeContext,
  mergeProps,
} from '@chakra-ui/react';

function cx(...classNames: any[]) {
  return classNames
    .filter(Boolean)
    .map((r) => r.trim())
    .join(' ');
}

const { useRecipeResult, PropsProvider, usePropsContext } = createRecipeContext(
  { key: 'button' }
);

export interface ButtonLoadingProps {
  /**
   * If `true`, the button will show a loading spinner.
   * @default false
   */
  loading?: boolean;
  /**
   * The text to show while loading.
   */
  loadingText?: React.ReactNode;
  /**
   * The spinner to show while loading.
   */
  spinner?: React.ReactNode;
  /**
   * The placement of the spinner
   * @default "start"
   */
  spinnerPlacement?: 'start' | 'end';
}

export interface ButtonBaseProps
  extends RecipeProps<'button'>,
    UnstyledProp,
    ButtonLoadingProps {}

export interface ButtonProps
  extends HTMLChakraProps<'button', ButtonBaseProps> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ onClick, onMouseEnter, ...inProps }, ref) {
    const propsContext = usePropsContext();
    const props = useMemo(() => {
      return mergeProps(propsContext, inProps);
    }, [propsContext, inProps]);
    // console.time("SD")
    const result = useRecipeResult(props);
    // console.timeEnd("SD")
    const {
      children,
      loading,
      loadingText,
      spinner,
      spinnerPlacement,
      ...rest
    } = result.props;
    // console.time("SD")
    const className = useMemo(
      () => cx(result.className, props.className),
      [props.className, result.className]
    );
    // console.timeEnd("SD")
    const css = useMemo(
      () => [result.styles, props.css],
      [props.css, result.styles]
    );

    return (
      <chakra.button
        type="button"
        ref={ref}
        {...inProps}
        {...rest}
        disabled={loading || rest.disabled}
        className={className}
        css={css}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {!props.asChild && loading ? (
          <Loader
            spinner={spinner}
            text={loadingText}
            spinnerPlacement={spinnerPlacement}
          >
            {children}
          </Loader>
        ) : (
          children
        )}
      </chakra.button>
    );
  }
);

export const ButtonPropsProvider =
  PropsProvider as React.Provider<ButtonBaseProps>;

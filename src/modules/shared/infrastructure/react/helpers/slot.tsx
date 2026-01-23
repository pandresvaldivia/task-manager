import * as React from 'react';

type SlotProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

type AnyProps = Record<string, any>;

const SLOTTABLE_ID = Symbol('slottable');

/**
 *  Combines multiple refs into a single function ref.
 * @param refs - refs to combine
 * @returns a function ref that assigns the node to all provided refs
 */
function composeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        ref.current = node;
      }
    });
  };
}

/**
 * Creates a Slot component and allows slottable children
 * to pass props to the Slot.
 * @param ownerName - name of the owner component for debugging purposes
 * @returns a Slot component
 */
function createSlot(ownerName: string) {
  const SlotClone = createSlotClone(ownerName);

  const Slot = ({ children, ...slotProps }: SlotProps) => {
    const childrenArray = React.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);

    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          return React.isValidElement(newElement)
            ? (newElement.props as { children: React.ReactNode }).children
            : null;
        }
        return child;
      });

      return (
        <SlotClone {...slotProps}>
          {React.isValidElement(newElement)
            ? React.cloneElement(newElement, undefined, newChildren)
            : null}
        </SlotClone>
      );
    }

    return <SlotClone {...slotProps}>{children}</SlotClone>;
  };

  Slot.displayName = `${ownerName}.Slot`;
  return Slot;
}

/**
 *  Gets the ref from a React element.
 * @param element - React element to get the ref from
 * @returns the ref of the element
 */
function getElementRef(
  element: React.ReactElement,
): React.Ref<unknown> | undefined {
  return (element.props as { ref?: React.Ref<unknown> }).ref;
}

/**
 * Creates a component that clones its child and merges props.
 * @param ownerName - name of the owner component for debugging purposes
 * @returns a SlotClone component
 */
function createSlotClone(ownerName: string) {
  const SlotClone = ({ children, ref, ...slotProps }: SlotProps) => {
    if (React.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const mergedProps = mergeProps(slotProps, children.props as any);

      if (children.type !== React.Fragment) {
        mergedProps.ref = ref ? composeRefs(ref, childrenRef) : childrenRef;
      }

      return React.cloneElement(children, mergedProps);
    }

    return React.Children.count(children) > 1
      ? React.Children.only(null)
      : null;
  };

  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}

/**
 *  Creates a Slottable component that marks its children as slottable.
 * This component is used for identifying slottable children that pass
 * their props to the Slot component.
 * @param ownerName - name of the owner component for debugging purposes
 * @returns a Slottable component
 */
export function createSlottable(ownerName: string) {
  const Slottable = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  Slottable.displayName = `${ownerName}.Slottable`;
  (Slottable as any).__id = SLOTTABLE_ID;
  return Slottable;
}

/**
 * Checks if a child is a Slottable component.
 * @param child - React child to check
 * @returns true if the child is a Slottable component
 */
function isSlottable(
  child: any,
): child is React.ReactElement<SlotProps, typeof Slottable> {
  return (
    React.isValidElement(child) &&
    typeof child.type === 'function' &&
    '__id' in child.type &&
    (child.type as any).__id === SLOTTABLE_ID
  );
}

/**
 * Merges props from slotProps and childProps.
 * Event handlers are composed, styles are merged,
 * and classNames are concatenated.
 * @param slotProps - props from the Slot component
 * @param childProps - props from the child component
 * @returns an object containing the merged props
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotValue = slotProps[propName];
    const childValue = childProps[propName];

    const isEventHandler = /^on[A-Z]/.test(propName);

    if (isEventHandler && slotValue && childValue) {
      overrideProps[propName] = (...args: unknown[]) => {
        childValue(...args);
        slotValue(...args);
      };
      continue;
    }

    if (propName === 'style') {
      overrideProps[propName] = { ...slotValue, ...childValue };
      continue;
    }

    if (propName === 'className') {
      overrideProps[propName] = [slotValue, childValue]
        .filter(Boolean)
        .join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
}

export const Slot = createSlot('Slot');
export const Slottable = createSlottable('Slottable');
